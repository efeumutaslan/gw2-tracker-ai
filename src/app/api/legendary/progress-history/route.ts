import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserExists } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

/**
 * GET /api/legendary/progress-history
 * Fetches progress history for a specific legendary
 * Query params: legendaryId (string), limit (number, optional, default 30)
 */
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

    const searchParams = req.nextUrl.searchParams;
    const legendaryId = searchParams.get('legendaryId');
    const limit = parseInt(searchParams.get('limit') || '30');

    if (!legendaryId) {
      return NextResponse.json(
        { error: 'legendaryId is required' },
        { status: 400 }
      );
    }

    // Fetch progress history from database
    const { data: history, error: historyError } = await supabase
      .from('legendary_progress_history')
      .select('*')
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId)
      .order('snapshot_at', { ascending: false })
      .limit(limit);

    if (historyError) {
      console.error('Error fetching progress history:', historyError);
      return NextResponse.json(
        { error: 'Failed to fetch progress history' },
        { status: 500 }
      );
    }

    // Reverse to show chronological order (oldest to newest) for charts
    const chronologicalHistory = history?.reverse() || [];

    return NextResponse.json({
      history: chronologicalHistory,
      count: chronologicalHistory.length,
    });
  } catch (error) {
    console.error('Get progress history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/legendary/progress-history
 * Creates a manual progress snapshot
 * Body: { legendaryId: string, progressPercentage: number, materialsObtained: number, totalMaterials: number, totalValueCopper?: number }
 */
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
    const {
      legendaryId,
      progressPercentage,
      materialsObtained,
      totalMaterials,
      totalValueCopper,
      snapshotType = 'manual'
    } = body;

    if (!legendaryId || progressPercentage === undefined || materialsObtained === undefined || totalMaterials === undefined) {
      return NextResponse.json(
        { error: 'legendaryId, progressPercentage, materialsObtained, and totalMaterials are required' },
        { status: 400 }
      );
    }

    // Create progress snapshot
    const { data: snapshot, error: snapshotError } = await supabase
      .from('legendary_progress_history')
      .insert({
        user_id: user.id,
        legendary_id: legendaryId,
        progress_percentage: progressPercentage,
        materials_obtained: materialsObtained,
        total_materials: totalMaterials,
        total_value_copper: totalValueCopper || 0,
        snapshot_type: snapshotType,
      })
      .select()
      .single();

    if (snapshotError) {
      console.error('Error creating progress snapshot:', snapshotError);
      return NextResponse.json(
        { error: 'Failed to create progress snapshot' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      snapshot,
      message: 'Progress snapshot created successfully',
    });
  } catch (error) {
    console.error('Create progress snapshot error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/legendary/progress-history
 * Deletes all progress history for a specific legendary
 * Query params: legendaryId (string)
 */
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

    await ensureUserExists(user.id, user.email || '');

    const searchParams = req.nextUrl.searchParams;
    const legendaryId = searchParams.get('legendaryId');

    if (!legendaryId) {
      return NextResponse.json(
        { error: 'legendaryId is required' },
        { status: 400 }
      );
    }

    // Delete all progress history for this legendary
    const { error: deleteError } = await supabase
      .from('legendary_progress_history')
      .delete()
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId);

    if (deleteError) {
      console.error('Error deleting progress history:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete progress history' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Progress history deleted successfully',
    });
  } catch (error) {
    console.error('Delete progress history error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
