import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questId, isFavorite } = body;

    if (!questId || typeof isFavorite !== 'boolean') {
      return NextResponse.json(
        { error: 'Quest ID and favorite status are required' },
        { status: 400 }
      );
    }

    // Update the quest's favorite status
    const { data: quest, error: updateError } = await supabase
      .from('user_quests')
      .update({ is_favorite: isFavorite })
      .eq('id', questId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating favorite status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update favorite status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error) {
    console.error('Error in favorite route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
