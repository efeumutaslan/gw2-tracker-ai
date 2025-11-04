import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserExists, getUserApiKey } from '@/lib/db/queries';
import { getAggregatedMaterials, getItemDetails, getItemPrices } from '@/lib/gw2/api';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await ensureUserExists(user.id, user.email || '');

    const body = await req.json();
    const { itemIds } = body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { error: 'itemIds array is required' },
        { status: 400 }
      );
    }

    // Get user's API key
    const apiKey = await getUserApiKey(user.id);
    if (!apiKey || !apiKey.apiKey) {
      return NextResponse.json(
        { error: 'GW2 API key not configured' },
        { status: 400 }
      );
    }

    // Get aggregated materials from user's account
    const { data: materialsMap, error: materialsError } = await getAggregatedMaterials(apiKey.apiKey);
    if (materialsError) {
      return NextResponse.json(
        { error: materialsError },
        { status: 500 }
      );
    }

    // Get item details for the requested items
    const { data: itemDetails, error: itemsError } = await getItemDetails(itemIds);
    if (itemsError) {
      return NextResponse.json(
        { error: itemsError },
        { status: 500 }
      );
    }

    // Get Trading Post prices for the items
    const { data: itemPrices, error: pricesError } = await getItemPrices(itemIds);
    // Don't fail if prices aren't available, just log it
    if (pricesError) {
      console.warn('Failed to fetch item prices:', pricesError);
    }

    // Get total reserved materials across all legendaries
    const { data: reservations } = await supabase
      .from('material_reservations')
      .select('item_id, quantity')
      .eq('user_id', user.id);

    // Calculate total reserved per item
    const totalReserved: Record<number, number> = {};
    reservations?.forEach((r) => {
      totalReserved[r.item_id] = (totalReserved[r.item_id] || 0) + r.quantity;
    });

    // Combine material counts with item details, prices, and reservations
    const enrichedMaterials = itemIds.map((id: number) => {
      const itemDetail = itemDetails?.find(item => item.id === id);
      const itemPrice = itemPrices?.find(price => price.id === id);
      const ownedCount = materialsMap?.[id] || 0;
      const reservedCount = totalReserved[id] || 0;
      const availableCount = Math.max(0, ownedCount - reservedCount);

      return {
        itemId: id,
        name: itemDetail?.name || `Item ${id}`,
        icon: itemDetail?.icon,
        description: itemDetail?.description,
        rarity: itemDetail?.rarity,
        owned: ownedCount,
        reserved: reservedCount,
        available: availableCount,
        buyPrice: itemPrice?.buys?.unit_price || 0,
        sellPrice: itemPrice?.sells?.unit_price || 0,
      };
    });

    return NextResponse.json({
      materials: enrichedMaterials,
      totalItems: enrichedMaterials.length,
    });
  } catch (error) {
    console.error('Get legendary materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
