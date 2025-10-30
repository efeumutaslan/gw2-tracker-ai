import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createQuestTemplate,
  createUserQuest,
  getCharactersByUserId,
} from '@/lib/db/queries';
import { questTemplateSchema } from '@/lib/utils/validation';
import { calculateNextReset } from '@/lib/utils/timezone';
import { z } from 'zod';

const importSchema = z.object({
  quests: z.array(questTemplateSchema),
});

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
    const validation = importSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid import data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { quests } = validation.data;

    const { data: dbUser } = await supabase
      .from('users')
      .select('timezone')
      .eq('id', user.id)
      .single();

    const timezone = dbUser?.timezone || 'UTC';
    const characters = await getCharactersByUserId(user.id);

    const imported = await Promise.all(
      quests.map(async (questData) => {
        const template = await createQuestTemplate({
          userId: user.id,
          name: questData.name,
          description: questData.description,
          category: questData.category,
          frequency: questData.frequency,
          resetTime: questData.resetTime,
          isAccountBound: questData.isAccountBound,
          isCharacterBound: questData.isCharacterBound,
          waypointCode: questData.waypointCode,
          goldReward: String(questData.goldReward),
          estimatedDurationMinutes: questData.estimatedDurationMinutes,
          notes: questData.notes,
        });

        if (questData.isCharacterBound) {
          await Promise.all(
            characters.map((char: any) =>
              createUserQuest({
                userId: user.id,
                questTemplateId: template.id,
                characterId: char.id,
                nextResetAt: calculateNextReset(
                  questData.frequency as any,
                  questData.resetTime,
                  timezone
                ),
              })
            )
          );
        } else {
          await createUserQuest({
            userId: user.id,
            questTemplateId: template.id,
            characterId: null,
            nextResetAt: calculateNextReset(
              questData.frequency as any,
              questData.resetTime,
              timezone
            ),
          });
        }

        return template;
      })
    );

    return NextResponse.json({
      success: true,
      message: `Imported ${imported.length} quests`,
      count: imported.length,
    });
  } catch (error) {
    console.error('Import quests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
