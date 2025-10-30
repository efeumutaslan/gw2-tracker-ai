import { createClient } from '@/lib/supabase/server';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalDaysActive: number;
}

export async function getStreakData(userId: string): Promise<StreakData> {
  const supabase = await createClient();

  // Get user's streak data
  const { data: userData, error } = await supabase
    .from('users')
    .select('currentStreak, longestStreak, lastActivityDate, totalDaysActive')
    .eq('id', userId)
    .single();

  if (error || !userData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      totalDaysActive: 0,
    };
  }

  // Check if streak should be reset
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (userData.lastActivityDate) {
    const lastActivity = new Date(userData.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor(
      (today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
    );

    // If more than 1 day passed, reset streak
    if (daysDiff > 1) {
      await supabase
        .from('users')
        .update({ currentStreak: 0 })
        .eq('id', userId);

      return {
        currentStreak: 0,
        longestStreak: userData.longestStreak || 0,
        lastActivityDate: userData.lastActivityDate,
        totalDaysActive: userData.totalDaysActive || 0,
      };
    }
  }

  return {
    currentStreak: userData.currentStreak || 0,
    longestStreak: userData.longestStreak || 0,
    lastActivityDate: userData.lastActivityDate,
    totalDaysActive: userData.totalDaysActive || 0,
  };
}

export async function updateStreak(userId: string): Promise<StreakData> {
  const supabase = await createClient();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  // Get current streak data
  const streakData = await getStreakData(userId);

  // Check if already updated today
  if (streakData.lastActivityDate) {
    const lastActivity = new Date(streakData.lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    if (lastActivity.getTime() === today.getTime()) {
      // Already updated today, return current data
      return streakData;
    }
  }

  // Increment streak
  const newStreak = streakData.currentStreak + 1;
  const newLongestStreak = Math.max(newStreak, streakData.longestStreak);
  const newTotalDays = streakData.totalDaysActive + 1;

  // Update database
  const { error } = await supabase
    .from('users')
    .update({
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActivityDate: todayISO,
      totalDaysActive: newTotalDays,
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update streak:', error);
    return streakData;
  }

  return {
    currentStreak: newStreak,
    longestStreak: newLongestStreak,
    lastActivityDate: todayISO,
    totalDaysActive: newTotalDays,
  };
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return 'Start your streak today!';
  if (streak === 1) return 'Great start! Keep it up!';
  if (streak < 3) return 'Building momentum!';
  if (streak < 7) return 'Impressive dedication!';
  if (streak < 14) return 'You\'re on fire!';
  if (streak < 30) return 'Unstoppable force!';
  if (streak < 50) return 'Legendary dedication!';
  if (streak < 100) return 'Master of persistence!';
  return 'ABSOLUTE LEGEND!';
}

export function getStreakEmoji(streak: number): string {
  if (streak === 0) return '🎯';
  if (streak < 3) return '🔥';
  if (streak < 7) return '🔥🔥';
  if (streak < 14) return '🔥🔥🔥';
  if (streak < 30) return '💎';
  if (streak < 50) return '⚡';
  if (streak < 100) return '🏆';
  return '👑';
}
