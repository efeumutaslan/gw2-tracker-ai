import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  createQuestTemplate,
  getUserQuestsByUserId,
  createUserQuest,
  getCharactersByUserId
} from '@/lib/db/queries';
import { questTemplateSchema } from '@/lib/utils/validation';
import { calculateNextReset } from '@/lib/utils/timezone';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const characterId = searchParams.get('characterId');

    const quests = await getUserQuestsByUserId(user.id, characterId || undefined);

    return NextResponse.json({ quests });
  } catch (error) {
    console.error('Get quests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const validation = questTemplateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.errors },
        { status: 400 }
      );
    }

    const data = validation.data;

    const template = await createQuestTemplate({
      userId: user.id,
      name: data.name,
      description: data.description,
      category: data.category,
      frequency: data.frequency,
      resetTime: data.resetTime,
      isAccountBound: data.isAccountBound,
      isCharacterBound: data.isCharacterBound,
      waypointCode: data.waypointCode,
      goldReward: String(data.goldReward),
      estimatedDurationMinutes: data.estimatedDurationMinutes,
      notes: data.notes,
    });

    const { data: dbUser } = await supabase
      .from('users')
      .select('timezone')
      .eq('id', user.id)
      .single();

    const timezone = dbUser?.timezone || 'UTC';

    if (data.isCharacterBound) {
      const characters = await getCharactersByUserId(user.id);

      await Promise.all(
        characters.map((char: any) =>
          createUserQuest({
            userId: user.id,
            questTemplateId: template.id,
            characterId: char.id,
            nextResetAt: calculateNextReset(
              data.frequency as any,
              data.resetTime,
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
          data.frequency as any,
          data.resetTime,
          timezone
        ),
      });
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Create quest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
