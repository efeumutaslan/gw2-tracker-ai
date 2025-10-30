import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db/client';
import { userQuests, questTemplates, users } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { calculateNextReset } from '@/lib/utils/timezone';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const now = new Date();
    const db = getDb();

    const questsToReset = await db
      .select({
        userQuest: userQuests,
        template: questTemplates,
        user: users,
      })
      .from(userQuests)
      .innerJoin(questTemplates, eq(userQuests.questTemplateId, questTemplates.id))
      .innerJoin(users, eq(userQuests.userId, users.id))
      .where(
        and(
          eq(questTemplates.frequency, 'daily'),
          eq(userQuests.isCompleted, true)
        )
      );

    let resetCount = 0;

    for (const { userQuest, template, user } of questsToReset) {
      if (new Date(userQuest.nextResetAt) <= now) {
        const nextResetAt = calculateNextReset(
          template.frequency as any,
          template.resetTime || undefined,
          user.timezone || undefined
        );

        await db
          .update(userQuests)
          .set({
            isCompleted: false,
            completedAt: null,
            nextResetAt,
            updatedAt: now,
          })
          .where(eq(userQuests.id, userQuest.id));

        resetCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reset ${resetCount} daily quests`,
      resetCount,
    });
  } catch (error) {
    console.error('Daily reset cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
