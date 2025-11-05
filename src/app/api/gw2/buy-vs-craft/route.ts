import { NextRequest, NextResponse } from 'next/server';
import { compareBuyVsCraft } from '@/lib/services/buyVsCraftService';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAllInventoryData, countItemAcrossInventories } from '@/lib/gw2/account';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gw2/buy-vs-craft
 * Compare buying vs crafting an item
 *
 * Query params:
 * - itemId: Item ID to compare (required)
 * - quantity: How many to buy/craft (default: 1)
 * - includeOwned: Include owned materials in calculation (default: false)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemIdParam = searchParams.get('itemId');
    const quantityParam = searchParams.get('quantity');
    const includeOwnedParam = searchParams.get('includeOwned');

    if (!itemIdParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: itemId' },
        { status: 400 }
      );
    }

    const itemId = parseInt(itemIdParam);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid itemId parameter' },
        { status: 400 }
      );
    }

    const quantity = quantityParam ? parseInt(quantityParam) : 1;
    const includeOwned = includeOwnedParam === 'true';

    // Get owned materials if requested and user is authenticated
    const ownedMaterials = new Map<number, number>();

    if (includeOwned) {
      try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const apiKeyData = await getUserApiKey(user.id);

          if (apiKeyData) {
            const apiKey = decrypt({
              encrypted: apiKeyData.apiKeyEncrypted,
              iv: apiKeyData.apiKeyIv,
              authTag: apiKeyData.apiKeyAuthTag,
            });

            const { materials, bank, inventory } = await getAllInventoryData(apiKey);

            // Build owned materials map
            const allItemIds = new Set<number>();
            materials.forEach(m => allItemIds.add(m.id));
            bank.forEach(item => allItemIds.add(item.id));
            inventory.forEach(item => allItemIds.add(item.id));

            allItemIds.forEach(id => {
              const count = countItemAcrossInventories(id, materials, bank, inventory);
              if (count > 0) {
                ownedMaterials.set(id, count);
              }
            });
          }
        }
      } catch (error) {
        console.log('Could not fetch owned materials:', error);
        // Continue without owned materials
      }
    }

    // Compare buy vs craft
    const comparison = await compareBuyVsCraft(itemId, quantity, ownedMaterials);

    if (!comparison) {
      return NextResponse.json(
        { error: 'Failed to compare buy vs craft. Item may not be available.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      comparison,
      includedOwnedMaterials: ownedMaterials.size > 0,
    });
  } catch (error) {
    console.error('Buy vs Craft API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
