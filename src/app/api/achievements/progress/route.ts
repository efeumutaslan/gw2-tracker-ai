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
    const { achievementId, progress } = body;

    if (!achievementId || progress === undefined) {
      return NextResponse.json(
        { error: 'Achievement ID and progress are required' },
        { status: 400 }
      );
    }

    // Get achievement to check total required
    const { data: achievement, error: fetchError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('id', achievementId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Check if achievement is completed
    const isCompleted = progress >= achievement.total_required;
    const completedAt = isCompleted ? new Date().toISOString() : null;

    // Update progress
    const { data: updatedAchievement, error: updateError } = await supabase
      .from('user_achievements')
      .update({
        current_progress: progress,
        is_completed: isCompleted,
        completed_at: completedAt,
      })
      .eq('id', achievementId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating achievement progress:', updateError);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Transform response
    const transformedAchievement = {
      id: updatedAchievement.id,
      name: updatedAchievement.name,
      description: updatedAchievement.description,
      category: updatedAchievement.category,
      tier: updatedAchievement.tier,
      isCompleted: updatedAchievement.is_completed,
      currentProgress: updatedAchievement.current_progress,
      totalRequired: updatedAchievement.total_required,
      rewardPoints: updatedAchievement.reward_points,
      rewardTitle: updatedAchievement.reward_title,
      isDaily: updatedAchievement.is_daily,
      isRepeatable: updatedAchievement.is_repeatable,
      completedAt: updatedAchievement.completed_at,
      createdAt: updatedAchievement.created_at,
      updatedAt: updatedAchievement.updated_at,
    };

    return NextResponse.json({
      success: true,
      achievement: transformedAchievement,
    });
  } catch (error) {
    console.error('Error in achievement progress update:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
