import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch all legendary goals for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch legendary goals
    const { data: goals, error } = await supabase
      .from('user_legendary_goals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching legendary goals:', error);
      return NextResponse.json(
        { error: 'Failed to fetch legendary goals' },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase
    const transformedGoals = (goals || []).map((goal) => ({
      id: goal.id,
      userId: goal.user_id,
      legendaryId: goal.legendary_id,
      legendaryName: goal.legendary_name,
      legendaryType: goal.legendary_type,
      legendaryTier: goal.legendary_tier,
      targetQuantity: goal.target_quantity,
      isCompleted: goal.is_completed,
      notes: goal.notes,
      startedAt: goal.started_at,
      completedAt: goal.completed_at,
      createdAt: goal.created_at,
      updatedAt: goal.updated_at,
    }));

    return NextResponse.json(transformedGoals);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new legendary goal
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      legendaryId,
      legendaryName,
      legendaryType,
      legendaryTier,
      targetQuantity = 1,
      notes,
    } = body;

    // Validate required fields
    if (!legendaryId || !legendaryName || !legendaryType || !legendaryTier) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if goal already exists
    const { data: existing } = await supabase
      .from('user_legendary_goals')
      .select('id')
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId)
      .eq('is_completed', false)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'You already have an active goal for this legendary' },
        { status: 409 }
      );
    }

    // Create new goal
    const { data: newGoal, error } = await supabase
      .from('user_legendary_goals')
      .insert({
        user_id: user.id,
        legendary_id: legendaryId,
        legendary_name: legendaryName,
        legendary_type: legendaryType,
        legendary_tier: legendaryTier,
        target_quantity: targetQuantity,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating legendary goal:', error);
      return NextResponse.json(
        { error: 'Failed to create legendary goal' },
        { status: 500 }
      );
    }

    // Transform response
    const transformed = {
      id: newGoal.id,
      userId: newGoal.user_id,
      legendaryId: newGoal.legendary_id,
      legendaryName: newGoal.legendary_name,
      legendaryType: newGoal.legendary_type,
      legendaryTier: newGoal.legendary_tier,
      targetQuantity: newGoal.target_quantity,
      isCompleted: newGoal.is_completed,
      notes: newGoal.notes,
      startedAt: newGoal.started_at,
      completedAt: newGoal.completed_at,
      createdAt: newGoal.created_at,
      updatedAt: newGoal.updated_at,
    };

    return NextResponse.json(transformed, { status: 201 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a legendary goal
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('id');

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Delete the goal (this will cascade delete material progress)
    const { error } = await supabase
      .from('user_legendary_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting legendary goal:', error);
      return NextResponse.json(
        { error: 'Failed to delete legendary goal' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update a legendary goal (mark as completed, update notes, etc.)
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { goalId, isCompleted, notes } = body;

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (typeof isCompleted === 'boolean') {
      updateData.is_completed = isCompleted;
      if (isCompleted) {
        updateData.completed_at = new Date().toISOString();
      }
    }
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    // Update the goal
    const { data: updatedGoal, error } = await supabase
      .from('user_legendary_goals')
      .update(updateData)
      .eq('id', goalId)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating legendary goal:', error);
      return NextResponse.json(
        { error: 'Failed to update legendary goal' },
        { status: 500 }
      );
    }

    // Transform response
    const transformed = {
      id: updatedGoal.id,
      userId: updatedGoal.user_id,
      legendaryId: updatedGoal.legendary_id,
      legendaryName: updatedGoal.legendary_name,
      legendaryType: updatedGoal.legendary_type,
      legendaryTier: updatedGoal.legendary_tier,
      targetQuantity: updatedGoal.target_quantity,
      isCompleted: updatedGoal.is_completed,
      notes: updatedGoal.notes,
      startedAt: updatedGoal.started_at,
      completedAt: updatedGoal.completed_at,
      createdAt: updatedGoal.created_at,
      updatedAt: updatedGoal.updated_at,
    };

    return NextResponse.json(transformed);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
