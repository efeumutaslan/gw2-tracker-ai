import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Get API key from settings table
    const { data: apiKeyData, error: keyError } = await supabase
      .from('user_settings')
      .select('gw2_api_key')
      .eq('user_id', user.id)
      .single();

    if (keyError || !apiKeyData?.gw2_api_key) {
      return NextResponse.json(
        { error: 'No API key found. Please add your GW2 API key in Settings first.' },
        { status: 404 }
      );
    }

    const apiKey = apiKeyData.gw2_api_key;

    // Fetch characters from GW2 API
    const charactersResponse = await fetch('https://api.guildwars2.com/v2/characters', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
    });

    if (!charactersResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch characters from GW2 API' },
        { status: 500 }
      );
    }

    const characterNames: string[] = await charactersResponse.json();

    // Fetch detailed info for each character
    const characterDetails = await Promise.all(
      characterNames.map(async (name) => {
        const response = await fetch(
          `https://api.guildwars2.com/v2/characters/${encodeURIComponent(name)}`,
          { headers: { 'Authorization': `Bearer ${apiKey}` } }
        );
        return response.ok ? response.json() : null;
      })
    );

    const validCharacters = characterDetails.filter(Boolean);

    // Upsert characters to database
    const savedCharacters = await Promise.all(
      validCharacters.map(async (char: any) => {
        const crafting = char.crafting?.map((c: any) => ({
          discipline: c.discipline,
          rating: c.rating,
        })) || [];

        const { data, error } = await supabase
          .from('user_characters')
          .upsert({
            user_id: user.id,
            character_name: char.name,
            race: char.race,
            profession: char.profession,
            level: char.level,
            guild: char.guild || null,
            age: char.age || 0,
            deaths: char.deaths || 0,
            crafting: crafting,
            last_synced: new Date().toISOString(),
          }, {
            onConflict: 'user_id,character_name',
          })
          .select()
          .single();

        if (error) {
          console.error(`Failed to sync character ${char.name}:`, error);
          return null;
        }

        return {
          id: data.id,
          characterName: data.character_name,
          race: data.race,
          profession: data.profession,
          level: data.level,
          guild: data.guild,
          age: data.age,
          deaths: data.deaths,
          crafting: data.crafting,
          lastSynced: data.last_synced,
        };
      })
    );

    const successCount = savedCharacters.filter(Boolean).length;

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${successCount} characters`,
      characters: savedCharacters.filter(Boolean),
    });
  } catch (error) {
    console.error('Sync characters error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
