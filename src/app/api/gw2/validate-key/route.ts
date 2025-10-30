import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateApiKey } from '@/lib/gw2/api';
import { encrypt } from '@/lib/crypto/encryption';
import { saveUserApiKey, getUserById, createUser } from '@/lib/db/queries';
import { apiKeySchema } from '@/lib/utils/validation';

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

    // Ensure user exists in database
    try {
      const existingUser = await getUserById(user.id);
      if (!existingUser) {
        console.log('Creating user record for:', user.id);
        await createUser({
          id: user.id,
          email: user.email!,
          timezone: 'UTC',
        });
      }
    } catch (err) {
      console.error('Error ensuring user exists:', err);
      // Continue anyway - saveUserApiKey will fail if user doesn't exist
    }

    const body = await req.json();

    const validation = apiKeySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid API key format', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { apiKey } = validation.data;

    const { valid, tokenInfo, error } = await validateApiKey(apiKey);

    if (!valid || !tokenInfo) {
      return NextResponse.json(
        { error: error || 'Invalid API key' },
        { status: 400 }
      );
    }

    const encrypted = encrypt(apiKey);

    await saveUserApiKey({
      userId: user.id,
      apiKeyEncrypted: encrypted.encrypted,
      apiKeyIv: encrypted.iv,
      apiKeyAuthTag: encrypted.authTag,
      permissions: tokenInfo.permissions,
      accountName: tokenInfo.name,
      lastValidatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      accountName: tokenInfo.name,
      permissions: tokenInfo.permissions,
    });
  } catch (error) {
    console.error('API key validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
