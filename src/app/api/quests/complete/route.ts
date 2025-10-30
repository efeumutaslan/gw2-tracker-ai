import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { completeUserQuest, uncompleteUserQuest, getUserQuestById } from '@/lib/db/queries';
import { questCompletionSchema } from '@/lib/utils/validation';
import { updateStreak, getStreakData } from '@/lib/services/streakService';
import { checkAchievements, getNewlyUnlocked } from '@/lib/services/achievementService';

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

    const body = await req.json();

    const validation = questCompletionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { questId, timeSpent, goldEarned } = validation.data;

    const quest = await getUserQuestById(questId);

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json(
        { error: 'Quest not found' },
        { status: 404 }
      );
    }

    let updated;
    let streakData;
    let newAchievements: any[] = [];

    if (quest.isCompleted) {
      // Uncomplete quest
      updated = await uncompleteUserQuest(questId);
    } else {
      // Complete quest
      updated = await completeUserQuest(questId, timeSpent, goldEarned);

      // Update streak (only on completion)
      try {
        const oldStreakData = await getStreakData(user.id);
        streakData = await updateStreak(user.id);

        // Check for new achievements
        // Get all user quests to calculate stats
        const { data: allQuests } = await supabase
          .from('quests')
          .select('*')
          .eq('userId', user.id);

        if (allQuests) {
          const completedQuests = allQuests.filter((q: any) => q.isCompleted);
          const totalGold = completedQuests.reduce((sum: number, q: any) => {
            const goldMatch = q.goldEarned?.match(/(\d+)/);
            return sum + (goldMatch ? parseInt(goldMatch[1]) : 0);
          }, 0);

          const oldStats = {
            totalQuestsCompleted: completedQuests.length - 1,
            currentStreak: oldStreakData.currentStreak,
            longestStreak: oldStreakData.longestStreak,
            totalGoldEarned: totalGold - (goldEarned || 0),
            totalDaysActive: oldStreakData.totalDaysActive,
            completedInOneDay: 0,
          };

          const newStats = {
            totalQuestsCompleted: completedQuests.length,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            totalGoldEarned: totalGold,
            totalDaysActive: streakData.totalDaysActive,
            completedInOneDay: 0,
          };

          newAchievements = getNewlyUnlocked(oldStats, newStats);
        }
      } catch (error) {
        console.error('Failed to update streak:', error);
        // Don't fail the request if streak update fails
      }
    }

    return NextResponse.json({
      success: true,
      quest: updated,
      streak: streakData,
      newAchievements,
    });
  } catch (error) {
    console.error('Toggle quest completion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
