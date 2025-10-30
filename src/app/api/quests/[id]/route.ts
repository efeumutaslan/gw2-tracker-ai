import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getUserQuestById,
  updateUserQuest,
  deleteUserQuest,
  getQuestTemplateById,
  updateQuestTemplate,
  deleteQuestTemplate,
} from '@/lib/db/queries';
import { questTemplateSchema } from '@/lib/utils/validation';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const quest = await getUserQuestById(params.id);

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json(
        { error: 'Quest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ quest });
  } catch (error) {
    console.error('Get quest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const quest = await getUserQuestById(params.id);

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json(
        { error: 'Quest not found' },
        { status: 404 }
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

    const updatedTemplate = await updateQuestTemplate(quest.questTemplateId, {
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

    return NextResponse.json({
      success: true,
      template: updatedTemplate,
    });
  } catch (error) {
    console.error('Update quest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const quest = await getUserQuestById(params.id);

    if (!quest || quest.userId !== user.id) {
      return NextResponse.json(
        { error: 'Quest not found' },
        { status: 404 }
      );
    }

    await deleteQuestTemplate(quest.questTemplateId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete quest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
