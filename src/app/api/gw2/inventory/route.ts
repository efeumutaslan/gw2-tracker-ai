import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey, ensureUserExists } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAllInventoryData } from '@/lib/gw2/account';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gw2/inventory
 * Returns all inventory data: materials + bank + shared inventory
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Ensure user exists in database
    await ensureUserExists(user.id, user.email!);

    // Get user's API key
    const apiKeyData = await getUserApiKey(user.id);

    if (!apiKeyData) {
      return NextResponse.json(
        { error: 'No API key found. Please configure your GW2 API key in settings.' },
        { status: 404 }
      );
    }

    // Check permissions
    if (!apiKeyData.permissions.includes('account') || !apiKeyData.permissions.includes('inventories')) {
      return NextResponse.json(
        { error: 'API key missing required permissions: account, inventories' },
        { status: 403 }
      );
    }

    // Decrypt API key
    const apiKey = decrypt({
      encrypted: apiKeyData.apiKeyEncrypted,
      iv: apiKeyData.apiKeyIv,
      authTag: apiKeyData.apiKeyAuthTag,
    });

    // Fetch all inventory data
    const data = await getAllInventoryData(apiKey);

    // Check for errors
    const hasErrors = Object.values(data.errors).some(e => e !== undefined);

    return NextResponse.json({
      success: !hasErrors,
      materials: data.materials,
      bank: data.bank,
      sharedInventory: data.inventory,
      stats: {
        materialsCount: data.materials.length,
        bankItemsCount: data.bank.length,
        sharedInventoryCount: data.inventory.length,
      },
      errors: hasErrors ? data.errors : undefined,
    });
  } catch (error) {
    console.error('Inventory API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
