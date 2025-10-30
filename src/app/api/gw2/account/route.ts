import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAccount } from '@/lib/gw2/api';

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

    const apiKeyData = await getUserApiKey(user.id);

    if (!apiKeyData) {
      return NextResponse.json(
        { error: 'No API key found' },
        { status: 404 }
      );
    }

    const apiKey = decrypt({
      encrypted: apiKeyData.apiKeyEncrypted,
      iv: apiKeyData.apiKeyIv,
      authTag: apiKeyData.apiKeyAuthTag,
    });

    const { data, error } = await getAccount(apiKey);

    if (error || !data) {
      return NextResponse.json(
        { error: error || 'Failed to fetch account info' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      account: data,
    });
  } catch (error) {
    console.error('Get account info error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
