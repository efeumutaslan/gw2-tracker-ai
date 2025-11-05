/**
 * Buy vs Craft Comparison Service
 * Compares the cost of buying an item vs crafting it
 */

import { buildCraftingTree, enrichCraftingTree, type CraftingTree } from './craftingTreeService';
import { fetchCommerceListings, calculateBulkPrice, calculateTPFees, extractPriceInfo, type CommerceListingData } from '@/lib/gw2/commerce';

export interface BuyOption {
  method: 'instant_buy' | 'buy_order';
  totalCost: number;
  averagePrice: number;
  quantity: number;
  fees: number;  // Always 0 for buying
}

export interface CraftOption {
  method: 'craft_from_scratch' | 'craft_with_owned';
  totalCost: number;  // Cost to buy all materials
  materialsCost: number;
  baseMaterialsCount: number;
  ownedMaterialsValue: number;  // Value of materials you already own
  craftingSteps: number;
}

export interface Comparison {
  itemId: number;
  itemName?: string;
  quantity: number;

  buyOptions: {
    instantBuy: BuyOption;
    buyOrder: BuyOption;
  };

  craftOption: CraftOption | null;

  recommendation: 'buy_instant' | 'buy_order' | 'craft' | 'not_available';
  savingsAmount: number;  // How much you save with recommendation
  savingsPercent: number;
}

/**
 * Compare buying vs crafting for an item
 */
export async function compareBuyVsCraft(
  itemId: number,
  quantity: number = 1,
  ownedMaterials: Map<number, number> = new Map()
): Promise<Comparison | null> {
  try {
    // Fetch TP listings
    const { listings } = await fetchCommerceListings([itemId]);
    const listing = listings.find(l => l.id === itemId);

    if (!listing) {
      return null;
    }

    // Calculate buy options
    const buyOptions = calculateBuyOptions(listing, quantity);

    // Try to build crafting tree
    let craftOption: CraftOption | null = null;
    const craftingTree = await buildCraftingTree(itemId, quantity, 10);

    if (craftingTree && craftingTree.root.canBeCrafted) {
      const enrichedTree = await enrichCraftingTree(craftingTree);
      craftOption = await calculateCraftOption(enrichedTree, ownedMaterials);
    }

    // Determine recommendation
    const { recommendation, savingsAmount, savingsPercent } = determineRecommendation(
      buyOptions,
      craftOption
    );

    return {
      itemId,
      itemName: craftingTree?.root.itemName,
      quantity,
      buyOptions,
      craftOption,
      recommendation,
      savingsAmount,
      savingsPercent,
    };
  } catch (error) {
    console.error('Error comparing buy vs craft:', error);
    return null;
  }
}

/**
 * Calculate buy options from TP
 */
function calculateBuyOptions(
  listing: CommerceListingData,
  quantity: number
): {
  instantBuy: BuyOption;
  buyOrder: BuyOption;
} {
  // Instant buy: buy from lowest sell offers
  const instantBuyCalc = calculateBulkPrice(listing.sells, quantity);

  // Buy order: place order at highest buy price (+ 1 copper to be first)
  const highestBuyPrice = listing.buys[0]?.unit_price || 0;
  const buyOrderPrice = highestBuyPrice + 1;
  const buyOrderCost = buyOrderPrice * quantity;

  return {
    instantBuy: {
      method: 'instant_buy',
      totalCost: instantBuyCalc.totalCost,
      averagePrice: instantBuyCalc.averagePrice,
      quantity: quantity - instantBuyCalc.remaining,
      fees: 0,
    },
    buyOrder: {
      method: 'buy_order',
      totalCost: buyOrderCost,
      averagePrice: buyOrderPrice,
      quantity,
      fees: 0,
    },
  };
}

/**
 * Calculate craft option cost
 */
async function calculateCraftOption(
  tree: CraftingTree,
  ownedMaterials: Map<number, number>
): Promise<CraftOption | null> {
  try {
    // Get all base materials needed
    const baseMaterials = tree.baseMaterials;
    const materialIds = baseMaterials.map(m => m.itemId);

    // Fetch TP prices for all base materials
    const { listings } = await fetchCommerceListings(materialIds);

    let totalCost = 0;
    let ownedMaterialsValue = 0;

    for (const material of baseMaterials) {
      const owned = ownedMaterials.get(material.itemId) || 0;
      const needToBuy = Math.max(0, material.quantity - owned);

      const listing = listings.find(l => l.id === material.itemId);

      if (listing && needToBuy > 0) {
        // Calculate cost to buy missing materials (instant buy)
        const bulkPrice = calculateBulkPrice(listing.sells, needToBuy);
        totalCost += bulkPrice.totalCost;
      }

      // Calculate value of owned materials
      if (owned > 0 && listing) {
        const priceInfo = extractPriceInfo(listing);
        ownedMaterialsValue += owned * priceInfo.bestSellPrice;
      }
    }

    return {
      method: 'craft_from_scratch',
      totalCost,
      materialsCost: totalCost,
      baseMaterialsCount: baseMaterials.length,
      ownedMaterialsValue,
      craftingSteps: tree.craftableIntermediates.length + 1,
    };
  } catch (error) {
    console.error('Error calculating craft option:', error);
    return null;
  }
}

/**
 * Determine best option and calculate savings
 */
function determineRecommendation(
  buyOptions: { instantBuy: BuyOption; buyOrder: BuyOption },
  craftOption: CraftOption | null
): {
  recommendation: 'buy_instant' | 'buy_order' | 'craft' | 'not_available';
  savingsAmount: number;
  savingsPercent: number;
} {
  const options: Array<{ type: string; cost: number }> = [];

  if (buyOptions.instantBuy.quantity > 0) {
    options.push({ type: 'buy_instant', cost: buyOptions.instantBuy.totalCost });
  }

  if (buyOptions.buyOrder.totalCost > 0) {
    options.push({ type: 'buy_order', cost: buyOptions.buyOrder.totalCost });
  }

  if (craftOption && craftOption.totalCost > 0) {
    options.push({ type: 'craft', cost: craftOption.totalCost });
  }

  if (options.length === 0) {
    return {
      recommendation: 'not_available',
      savingsAmount: 0,
      savingsPercent: 0,
    };
  }

  // Sort by cost (lowest first)
  options.sort((a, b) => a.cost - b.cost);

  const cheapest = options[0];
  const mostExpensive = options[options.length - 1];

  const savingsAmount = mostExpensive.cost - cheapest.cost;
  const savingsPercent = mostExpensive.cost > 0
    ? Math.round((savingsAmount / mostExpensive.cost) * 100)
    : 0;

  return {
    recommendation: cheapest.type as any,
    savingsAmount,
    savingsPercent,
  };
}

/**
 * Calculate profit margin for flipping (buy from TP and resell)
 */
export function calculateFlipProfit(listing: CommerceListingData): {
  buyPrice: number;
  sellPrice: number;
  fees: {
    listingFee: number;
    exchangeFee: number;
    totalFee: number;
  };
  grossProfit: number;
  netProfit: number;
  profitMargin: number;
  isProfitable: boolean;
} {
  const buyPrice = listing.sells[0]?.unit_price || 0;  // Instant buy
  const sellPrice = listing.buys[0]?.unit_price || 0;  // Instant sell

  const fees = calculateTPFees(sellPrice);
  const grossProfit = sellPrice - buyPrice;
  const netProfit = fees.profit - buyPrice;
  const profitMargin = buyPrice > 0 ? (netProfit / buyPrice) * 100 : 0;

  return {
    buyPrice,
    sellPrice,
    fees,
    grossProfit,
    netProfit,
    profitMargin,
    isProfitable: netProfit > 0,
  };
}
