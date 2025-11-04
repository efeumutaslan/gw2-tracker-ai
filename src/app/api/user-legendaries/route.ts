import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getUserLegendaries,
  createUserLegendary,
  getUserLegendaryByLegendaryId,
  ensureUserExists,
} from '@/lib/db/queries';

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

    await ensureUserExists(user.id, user.email || '');

    const legendaries = await getUserLegendaries(user.id);

    return NextResponse.json({ legendaries });
  } catch (error) {
    console.error('Get user legendaries error:', error);
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

    await ensureUserExists(user.id, user.email || '');

    const body = await req.json();
    const { legendaryId, notes } = body;

    if (!legendaryId) {
      return NextResponse.json(
        { error: 'legendaryId is required' },
        { status: 400 }
      );
    }

    // Check if already tracking this legendary
    const existing = await getUserLegendaryByLegendaryId(user.id, legendaryId);
    if (existing) {
      return NextResponse.json(
        { error: 'Already tracking this legendary' },
        { status: 400 }
      );
    }

    const legendary = await createUserLegendary({
      userId: user.id,
      legendaryId,
      isTracking: true,
      progress: 0,
      notes,
    });

    return NextResponse.json({ legendary });
  } catch (error) {
    console.error('Create user legendary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
