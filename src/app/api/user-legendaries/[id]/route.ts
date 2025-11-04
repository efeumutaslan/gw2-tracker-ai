import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getUserLegendaryById,
  updateUserLegendary,
  deleteUserLegendary,
  getMaterialReservesByLegendaryId,
  getMaterialProgressByLegendaryId,
  deleteMaterialReservesByLegendaryId,
  deleteMaterialProgressByLegendaryId,
  ensureUserExists,
} from '@/lib/db/queries';

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

    await ensureUserExists(user.id, user.email || '');

    const legendary = await getUserLegendaryById(params.id);

    if (!legendary) {
      return NextResponse.json(
        { error: 'Legendary not found' },
        { status: 404 }
      );
    }

    if (legendary.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Get related data
    const reserves = await getMaterialReservesByLegendaryId(params.id);
    const progress = await getMaterialProgressByLegendaryId(params.id);

    return NextResponse.json({
      legendary,
      reserves,
      progress,
    });
  } catch (error) {
    console.error('Get user legendary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    await ensureUserExists(user.id, user.email || '');

    const legendary = await getUserLegendaryById(params.id);

    if (!legendary) {
      return NextResponse.json(
        { error: 'Legendary not found' },
        { status: 404 }
      );
    }

    if (legendary.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { isTracking, progress, notes, completedAt } = body;

    const updatedLegendary = await updateUserLegendary(params.id, {
      isTracking,
      progress,
      notes,
      completedAt: completedAt ? new Date(completedAt) : undefined,
    });

    return NextResponse.json({ legendary: updatedLegendary });
  } catch (error) {
    console.error('Update user legendary error:', error);
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

    await ensureUserExists(user.id, user.email || '');

    const legendary = await getUserLegendaryById(params.id);

    if (!legendary) {
      return NextResponse.json(
        { error: 'Legendary not found' },
        { status: 404 }
      );
    }

    if (legendary.userId !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Delete related data
    await deleteMaterialReservesByLegendaryId(params.id);
    await deleteMaterialProgressByLegendaryId(params.id);

    // Delete legendary
    await deleteUserLegendary(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user legendary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
