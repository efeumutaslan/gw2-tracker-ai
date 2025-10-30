import { NextResponse } from 'next/server';

// GET - Fetch Trading Post prices for items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const itemIds = searchParams.get('ids');

    if (!itemIds) {
      return NextResponse.json(
        { error: 'Item IDs are required' },
        { status: 400 }
      );
    }

    // Fetch prices from GW2 API
    const response = await fetch(
      `https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch prices from GW2 API');
    }

    const prices = await response.json();

    // Transform prices to a more usable format
    const priceMap: {
      [itemId: number]: {
        buyPrice: number;
        sellPrice: number;
        buyQuantity: number;
        sellQuantity: number;
      };
    } = {};

    prices.forEach((price: any) => {
      priceMap[price.id] = {
        buyPrice: price.buys.unit_price,
        sellPrice: price.sells.unit_price,
        buyQuantity: price.buys.quantity,
        sellQuantity: price.sells.quantity,
      };
    });

    return NextResponse.json(priceMap);
  } catch (error) {
    console.error('Error fetching TP prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Trading Post prices' },
      { status: 500 }
    );
  }
}
