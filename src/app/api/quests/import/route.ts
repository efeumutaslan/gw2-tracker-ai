import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { quests } = body;

    if (!quests || !Array.isArray(quests)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Insert quests
    const questsToInsert = quests.map((quest) => ({
      userId: user.id,
      name: quest.name,
      description: quest.description,
      category: quest.category,
      frequency: quest.frequency,
      estimatedDurationMinutes: quest.estimatedDurationMinutes,
      waypointCode: quest.waypointCode,
      notes: quest.notes,
      isCompleted: false, // Reset completion status on import
      nextResetAt: new Date(), // Will be recalculated
    }));

    const { data, error } = await supabase
      .from('quests')
      .insert(questsToInsert)
      .select();

    if (error) {
      console.error('Failed to import quests:', error);
      return NextResponse.json(
        { error: 'Failed to import quests' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imported: data?.length || 0,
      message: `Successfully imported ${data?.length || 0} quests`,
    });
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Failed to process import' },
      { status: 500 }
    );
  }
}
