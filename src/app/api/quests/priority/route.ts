import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const VALID_PRIORITIES = ['low', 'medium', 'high'] as const;
type Priority = typeof VALID_PRIORITIES[number];

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
    const { questId, priority } = body;

    if (!questId || !priority) {
      return NextResponse.json(
        { error: 'Quest ID and priority are required' },
        { status: 400 }
      );
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return NextResponse.json(
        { error: 'Invalid priority. Must be: low, medium, or high' },
        { status: 400 }
      );
    }

    // Update the quest's priority
    const { data: quest, error: updateError } = await supabase
      .from('user_quests')
      .update({ priority })
      .eq('id', questId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating priority:', updateError);
      return NextResponse.json(
        { error: 'Failed to update priority' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quest,
    });
  } catch (error) {
    console.error('Error in priority route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
