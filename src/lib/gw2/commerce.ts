/**
 * GW2 Commerce API Service
 * Documentation: https://wiki.guildwars2.com/wiki/API:2/commerce/listings
 */

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export interface CommerceListing {
  listings: number;  // Number of individual listings
  unit_price: number;  // Price in copper
  quantity: number;  // Total quantity available
}

export interface CommerceListingData {
  id: number;
  buys: CommerceListing[];
  sells: CommerceListing[];
}

export interface CommerceResponse {
  listings: CommerceListingData[];
  error?: string;
}

export interface PriceInfo {
  itemId: number;
  bestBuyPrice: number;  // Highest buy order (copper)
  bestSellPrice: number;  // Lowest sell offer (copper)
  buyQuantity: number;  // Quantity at best buy price
  sellQuantity: number;  // Quantity at best sell price
  totalBuyOrders: number;
  totalSellListings: number;
}

/**
 * Fetch trading post listings for items
 */
export async function fetchCommerceListings(itemIds: number[]): Promise<CommerceResponse> {
  if (itemIds.length === 0) {
    return { listings: [] };
  }

  try {
    const BATCH_SIZE = 200;
    const batches: number[][] = [];

    for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
      batches.push(itemIds.slice(i, i + BATCH_SIZE));
    }

    const allListings: CommerceListingData[] = [];

    for (const batch of batches) {
      const idsParam = batch.join(',');
      const url = `${GW2_API_BASE}/commerce/listings?ids=${idsParam}`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 300, // Cache for 5 minutes (prices change frequently)
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GW2 API error (commerce/listings):`, response.status, errorText);
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        allListings.push(...data);
      }
    }

    return { listings: allListings };
  } catch (error) {
    console.error('Error fetching commerce listings:', error);
    return {
      listings: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch a single item's trading post listings
 */
export async function fetchCommerceListing(itemId: number): Promise<CommerceListingData | null> {
  try {
    const url = `${GW2_API_BASE}/commerce/listings/${itemId}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      console.error(`GW2 API error for listing ${itemId}:`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching listing for item ${itemId}:`, error);
    return null;
  }
}

/**
 * Extract price info from commerce listing
 */
export function extractPriceInfo(listing: CommerceListingData): PriceInfo {
  const bestBuy = listing.buys[0];  // Highest buy order (descending order)
  const bestSell = listing.sells[0];  // Lowest sell offer (ascending order)

  return {
    itemId: listing.id,
    bestBuyPrice: bestBuy?.unit_price || 0,
    bestSellPrice: bestSell?.unit_price || 0,
    buyQuantity: bestBuy?.quantity || 0,
    sellQuantity: bestSell?.quantity || 0,
    totalBuyOrders: listing.buys.reduce((sum, order) => sum + order.quantity, 0),
    totalSellListings: listing.sells.reduce((sum, order) => sum + order.quantity, 0),
  };
}

/**
 * Calculate trading post fees (15% total: 5% listing + 10% exchange)
 */
export function calculateTPFees(sellPrice: number): {
  listingFee: number;
  exchangeFee: number;
  totalFee: number;
  profit: number;
} {
  const listingFee = Math.floor(sellPrice * 0.05);  // 5% listing fee
  const exchangeFee = Math.floor(sellPrice * 0.10);  // 10% exchange fee
  const totalFee = listingFee + exchangeFee;
  const profit = sellPrice - totalFee;

  return {
    listingFee,
    exchangeFee,
    totalFee,
    profit,
  };
}

/**
 * Calculate instant buy/sell prices with fees
 */
export function calculateInstantPrices(listing: CommerceListingData): {
  instantBuy: number;  // Buy from lowest sell offer
  instantSell: number;  // Sell to highest buy order (after fees)
  instantBuyAfterFees: number;  // What you pay
  instantSellProfit: number;  // What you get after fees
} {
  const bestSellPrice = listing.sells[0]?.unit_price || 0;
  const bestBuyPrice = listing.buys[0]?.unit_price || 0;

  const sellFees = calculateTPFees(bestBuyPrice);

  return {
    instantBuy: bestSellPrice,
    instantSell: bestBuyPrice,
    instantBuyAfterFees: bestSellPrice,
    instantSellProfit: sellFees.profit,
  };
}

/**
 * Get bulk price for buying/selling a quantity
 * Walks through order book to calculate total cost
 */
export function calculateBulkPrice(
  listings: CommerceListing[],
  quantity: number
): {
  totalCost: number;
  averagePrice: number;
  fulfilled: boolean;
  remaining: number;
} {
  let remaining = quantity;
  let totalCost = 0;

  for (const listing of listings) {
    if (remaining <= 0) break;

    const take = Math.min(remaining, listing.quantity);
    totalCost += take * listing.unit_price;
    remaining -= take;
  }

  return {
    totalCost,
    averagePrice: quantity > 0 ? Math.floor(totalCost / (quantity - remaining)) : 0,
    fulfilled: remaining === 0,
    remaining,
  };
}
