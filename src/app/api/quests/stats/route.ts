import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { calculateQuestStats, getCompletionTrend } from '@/lib/utils/questStats';

export async function GET(request: NextRequest) {
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

    // Fetch all user quests
    const { data: quests, error: questsError } = await supabase
      .from('user_quests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (questsError) {
      console.error('Error fetching quests:', questsError);
      return NextResponse.json(
        { error: 'Failed to fetch quests' },
        { status: 500 }
      );
    }

    // Transform database fields to camelCase for the utility functions
    const transformedQuests = (quests || []).map((quest) => ({
      id: quest.id,
      name: quest.name,
      description: quest.description,
      category: quest.category,
      isCompleted: quest.is_completed,
      isFavorite: quest.is_favorite,
      priority: quest.priority,
      completedAt: quest.completed_at,
      createdAt: quest.created_at,
      waypointCode: quest.waypoint_code,
      estimatedDurationMinutes: quest.estimated_duration_minutes,
      goldReward: quest.gold_reward,
      notes: quest.notes,
    }));

    // Calculate statistics
    const stats = calculateQuestStats(transformedQuests);
    const completionTrend = getCompletionTrend(transformedQuests, 7);

    return NextResponse.json({
      success: true,
      stats,
      completionTrend,
    });
  } catch (error) {
    console.error('Error in stats route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
