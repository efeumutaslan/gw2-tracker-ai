import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserApiKey, ensureUserExists, createCharacter } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAllCharacterDetails } from '@/lib/gw2/api';

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
    await ensureUserExists(user.id, user.email!);

    // Get API key from database
    const apiKeyData = await getUserApiKey(user.id);

    if (!apiKeyData) {
      console.log('No API key found for user during sync:', user.id);
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

    // Fetch characters from GW2 API
    const { data: characters, error: gw2Error } = await getAllCharacterDetails(apiKey);

    if (gw2Error || !characters) {
      return NextResponse.json(
        { error: gw2Error || 'Failed to fetch characters from GW2 API' },
        { status: 500 }
      );
    }

    // Save characters to database
    const savedCharacters = await Promise.all(
      characters.map(async (char: any) => {
        try {
          const character = await createCharacter({
            userId: user.id,
            gw2CharacterName: char.name,
            profession: char.profession,
            level: char.level,
            lastSyncedAt: new Date(),
          });
          return character;
        } catch (error) {
          console.error(`Failed to sync character ${char.name}:`, error);
          return null;
        }
      })
    );

    const successCount = savedCharacters.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${successCount} character(s)`,
      characters: savedCharacters.filter(Boolean),
    });
  } catch (error) {
    console.error('Sync characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
