import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserExists } from '@/lib/db/queries';

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
    const { legendaryId } = body;

    if (!legendaryId) {
      return NextResponse.json(
        { error: 'legendaryId is required' },
        { status: 400 }
      );
    }

    // Check if already tracking
    const { data: existing } = await supabase
      .from('tracked_legendaries')
      .select('id')
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId)
      .single();

    if (existing) {
      return NextResponse.json({
        message: 'Already tracking this legendary',
        isTracking: true,
      });
    }

    // Track the legendary
    const { error: insertError } = await supabase
      .from('tracked_legendaries')
      .insert({
        user_id: user.id,
        legendary_id: legendaryId,
      });

    if (insertError) {
      console.error('Track legendary error:', insertError);
      return NextResponse.json(
        { error: 'Failed to track legendary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Legendary tracked successfully',
      isTracking: true,
    });
  } catch (error) {
    console.error('Track legendary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const { legendaryId } = body;

    if (!legendaryId) {
      return NextResponse.json(
        { error: 'legendaryId is required' },
        { status: 400 }
      );
    }

    // Untrack the legendary
    const { error: deleteError } = await supabase
      .from('tracked_legendaries')
      .delete()
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId);

    if (deleteError) {
      console.error('Untrack legendary error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to untrack legendary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Legendary untracked successfully',
      isTracking: false,
    });
  } catch (error) {
    console.error('Untrack legendary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const url = new URL(req.url);
    const legendaryId = url.searchParams.get('legendaryId');

    if (!legendaryId) {
      // Get all tracked legendaries
      const { data, error } = await supabase
        .from('tracked_legendaries')
        .select('legendary_id')
        .eq('user_id', user.id);

      if (error) {
        console.error('Get tracked legendaries error:', error);
        return NextResponse.json(
          { error: 'Failed to get tracked legendaries' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        trackedLegendaries: data?.map(t => t.legendary_id) || [],
      });
    }

    // Check if specific legendary is tracked
    const { data, error } = await supabase
      .from('tracked_legendaries')
      .select('id')
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Check tracking status error:', error);
      return NextResponse.json(
        { error: 'Failed to check tracking status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      isTracking: !!data,
    });
  } catch (error) {
    console.error('Get tracking status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
