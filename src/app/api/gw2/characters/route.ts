import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey, ensureUserExists } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAllCharacterDetails } from '@/lib/gw2/api';

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

    const apiKeyData = await getUserApiKey(user.id);

    if (!apiKeyData) {
      console.log('No API key found for user:', user.id);
      return NextResponse.json(
        { error: 'No API key found. Please add your GW2 API key in Settings first.' },
        { status: 404 }
      );
    }

    const apiKey = decrypt({
      encrypted: apiKeyData.apiKeyEncrypted,
      iv: apiKeyData.apiKeyIv,
      authTag: apiKeyData.apiKeyAuthTag,
    });

    const { data, error } = await getAllCharacterDetails(apiKey);

    if (error || !data) {
      return NextResponse.json(
        { error: error || 'Failed to fetch characters from GW2 API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      characters: data,
    });
  } catch (error) {
    console.error('Get GW2 characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
