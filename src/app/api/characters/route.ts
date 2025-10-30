import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const { data: characters, error } = await supabase
      .from('user_characters')
      .select('*')
      .eq('user_id', user.id)
      .order('level', { ascending: false });

    if (error) {
      console.error('Get characters error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch characters' },
        { status: 500 }
      );
    }

    // Transform to camelCase for frontend
    const transformedCharacters = (characters || []).map((char) => ({
      id: char.id,
      characterName: char.character_name,
      race: char.race,
      profession: char.profession,
      level: char.level,
      guild: char.guild,
      age: char.age,
      deaths: char.deaths,
      crafting: char.crafting,
      lastSynced: char.last_synced,
      createdAt: char.created_at,
    }));

    return NextResponse.json({ characters: transformedCharacters });
  } catch (error) {
    console.error('Get characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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

    const { error } = await supabase
      .from('user_characters')
      .delete()
      .eq('id', characterId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Delete character error:', error);
      return NextResponse.json(
        { error: 'Failed to delete character' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete character error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
