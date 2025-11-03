import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getCharactersByUserId, deleteCharacter, ensureUserExists } from '@/lib/db/queries';

export async function GET() {
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

    // Fetch characters from database using Drizzle
    const characters = await getCharactersByUserId(user.id);

    // Transform to camelCase for frontend
    const transformedCharacters = (characters || []).map((char: any) => ({
      id: char.id,
      characterName: char.gw2CharacterName,
      race: 'Unknown', // We don't store race in new schema
      profession: char.profession || 'Unknown',
      level: char.level || 0,
      guild: null,
      age: 0,
      deaths: 0,
      crafting: [],
      lastSynced: char.lastSyncedAt,
      createdAt: char.createdAt,
    }));

    return NextResponse.json({ characters: transformedCharacters });
  } catch (error) {
    console.error('Get characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get('id');

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID required' },
        { status: 400 }
      );
    }

    // Delete character using Drizzle
    await deleteCharacter(characterId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
