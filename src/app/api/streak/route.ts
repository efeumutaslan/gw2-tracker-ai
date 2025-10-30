import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStreakData, updateStreak } from '@/lib/services/streakService';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const streakData = await getStreakData(user.id);

    return NextResponse.json({
      success: true,
      streak: streakData,
    });
  } catch (error) {
    console.error('Failed to get streak:', error);
    return NextResponse.json(
      { error: 'Failed to get streak data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const streakData = await updateStreak(user.id);

    return NextResponse.json({
      success: true,
      streak: streakData,
      message: 'Streak updated successfully',
    });
  } catch (error) {
    console.error('Failed to update streak:', error);
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}
