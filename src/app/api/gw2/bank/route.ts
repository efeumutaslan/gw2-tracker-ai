import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey, ensureUserExists } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAccountBank } from '@/lib/gw2/account';

export const dynamic = 'force-dynamic';

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

    // Fetch bank
    const { items, error } = await getAccountBank(apiKey);

    if (error) {
      return NextResponse.json(
        { error: `Failed to fetch bank: ${error}` },
        { status: 500 }
      );
    }

    // Filter out null slots for easier processing
    const nonNullItems = items.filter(item => item !== null);

    return NextResponse.json({
      success: true,
      items,
      nonNullItems,
      totalSlots: items.length,
      usedSlots: nonNullItems.length,
    });
  } catch (error) {
    console.error('Bank API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
