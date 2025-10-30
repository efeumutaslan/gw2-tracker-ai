import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getQuestTemplatesByUserId } from '@/lib/db/queries';

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

    const templates = await getQuestTemplatesByUserId(user.id);

    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      quests: templates.map((template: any) => ({
        name: template.name,
        description: template.description,
        category: template.category,
        frequency: template.frequency,
        resetTime: template.resetTime,
        isAccountBound: template.isAccountBound,
        isCharacterBound: template.isCharacterBound,
        waypointCode: template.waypointCode,
        goldReward: template.goldReward,
        estimatedDurationMinutes: template.estimatedDurationMinutes,
        notes: template.notes,
      })),
    };

    return NextResponse.json(exportData);
  } catch (error) {
    console.error('Export quests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
