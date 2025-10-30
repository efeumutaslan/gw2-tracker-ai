import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    // Fetch user's achievements
    const { data: achievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (achievementsError) {
      console.error('Error fetching achievements:', achievementsError);
      return NextResponse.json(
        { error: 'Failed to fetch achievements' },
        { status: 500 }
      );
    }

    // Transform database fields to camelCase
    const transformedAchievements = (achievements || []).map((achievement) => ({
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      category: achievement.category,
      tier: achievement.tier,
      isCompleted: achievement.is_completed,
      currentProgress: achievement.current_progress,
      totalRequired: achievement.total_required,
      rewardPoints: achievement.reward_points,
      rewardTitle: achievement.reward_title,
      isDaily: achievement.is_daily,
      isRepeatable: achievement.is_repeatable,
      completedAt: achievement.completed_at,
      createdAt: achievement.created_at,
      updatedAt: achievement.updated_at,
    }));

    return NextResponse.json({
      success: true,
      achievements: transformedAchievements,
    });
  } catch (error) {
    console.error('Error in achievements route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const {
      name,
      description,
      category,
      tier = 'bronze',
      totalRequired = 1,
      rewardPoints = 0,
      rewardTitle,
      isDaily = false,
      isRepeatable = false,
      icon,
    } = body;

    // Validate required fields
    if (!name || !category) {
      return NextResponse.json(
        { error: 'Name and category are required' },
        { status: 400 }
      );
    }

    // Create achievement
    const { data: achievement, error: createError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: user.id,
        name,
        description,
        category,
        tier,
        total_required: totalRequired,
        reward_points: rewardPoints,
        reward_title: rewardTitle,
        is_daily: isDaily,
        is_repeatable: isRepeatable,
        current_progress: 0,
        is_completed: false,
      })
      .select()
      .single();

    if (createError) {
      console.error('Error creating achievement:', createError);
      return NextResponse.json(
        { error: 'Failed to create achievement' },
        { status: 500 }
      );
    }

    // Transform response
    const transformedAchievement = {
      id: achievement.id,
      name: achievement.name,
      description: achievement.description,
      category: achievement.category,
      tier: achievement.tier,
      isCompleted: achievement.is_completed,
      currentProgress: achievement.current_progress,
      totalRequired: achievement.total_required,
      rewardPoints: achievement.reward_points,
      rewardTitle: achievement.reward_title,
      isDaily: achievement.is_daily,
      isRepeatable: achievement.is_repeatable,
      completedAt: achievement.completed_at,
      createdAt: achievement.created_at,
      updatedAt: achievement.updated_at,
    };

    return NextResponse.json({
      success: true,
      achievement: transformedAchievement,
    });
  } catch (error) {
    console.error('Error in achievement creation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
