import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { completeUserQuest, getUserQuestsByUserId } from '@/lib/db/queries';

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
    const { questTemplateId, timeSpent, goldEarned } = body;

    if (!questTemplateId) {
      return NextResponse.json(
        { error: 'questTemplateId is required' },
        { status: 400 }
      );
    }

    // Get all user quests for this template
    const allQuests = await getUserQuestsByUserId(user.id);
    const questsForTemplate = allQuests.filter(
      (q: any) => q.questTemplateId === questTemplateId && !q.isCompleted
    );

    if (questsForTemplate.length === 0) {
      return NextResponse.json(
        { error: 'No incomplete quests found for this template' },
        { status: 404 }
      );
    }

    // Complete all quests for this template
    const completedQuests = await Promise.all(
      questsForTemplate.map((quest: any) =>
        completeUserQuest(quest.id, timeSpent, goldEarned)
      )
    );

    return NextResponse.json({
      success: true,
      completedCount: completedQuests.length,
      quests: completedQuests,
    });
  } catch (error) {
    console.error('Complete all characters quest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
