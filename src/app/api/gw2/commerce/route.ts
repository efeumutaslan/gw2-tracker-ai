import { NextRequest, NextResponse } from 'next/server';
import { fetchCommerceListings, extractPriceInfo } from '@/lib/gw2/commerce';
import { calculateFlipProfit } from '@/lib/services/buyVsCraftService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gw2/commerce
 * Fetch trading post listings for items
 *
 * Query params:
 * - ids: Comma-separated item IDs
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');

    if (!idsParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: ids' },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'No valid item IDs provided' },
        { status: 400 }
      );
    }

    const { listings, error } = await fetchCommerceListings(ids);

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch commerce listings: ${error}` },
        { status: 500 }
      );
    }

    // Extract price info for easier frontend consumption
    const priceInfo = listings.map(listing => ({
      ...extractPriceInfo(listing),
      flipProfit: calculateFlipProfit(listing),
    }));

    return NextResponse.json({
      success: true,
      listings,
      priceInfo,
      count: listings.length,
    });
  } catch (error) {
    console.error('Commerce API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
