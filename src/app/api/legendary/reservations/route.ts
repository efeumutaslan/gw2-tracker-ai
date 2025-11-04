import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUserExists } from '@/lib/db/queries';

// GET - Get reservations for a legendary or all reservations
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

    if (legendaryId) {
      // Get reservations for specific legendary
      const { data, error } = await supabase
        .from('material_reservations')
        .select('*')
        .eq('user_id', user.id)
        .eq('legendary_id', legendaryId);

      if (error) {
        console.error('Get reservations error:', error);
        return NextResponse.json(
          { error: 'Failed to get reservations' },
          { status: 500 }
        );
      }

      // Convert to map for easy lookup
      const reservationsMap: Record<number, number> = {};
      data?.forEach((r) => {
        reservationsMap[r.item_id] = r.quantity;
      });

      return NextResponse.json({
        reservations: reservationsMap,
      });
    } else {
      // Get all reservations grouped by item
      const { data, error } = await supabase
        .from('material_reservations')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Get all reservations error:', error);
        return NextResponse.json(
          { error: 'Failed to get reservations' },
          { status: 500 }
        );
      }

      // Calculate total reserved per item across all legendaries
      const totalReserved: Record<number, number> = {};
      data?.forEach((r) => {
        totalReserved[r.item_id] = (totalReserved[r.item_id] || 0) + r.quantity;
      });

      return NextResponse.json({
        totalReserved,
        allReservations: data,
      });
    }
  } catch (error) {
    console.error('Get reservations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Reserve materials for a legendary
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
    const { legendaryId, itemId, quantity } = body;

    if (!legendaryId || !itemId || quantity === undefined) {
      return NextResponse.json(
        { error: 'legendaryId, itemId, and quantity are required' },
        { status: 400 }
      );
    }

    if (quantity < 0) {
      return NextResponse.json(
        { error: 'Quantity cannot be negative' },
        { status: 400 }
      );
    }

    // Upsert reservation
    const { data, error } = await supabase
      .from('material_reservations')
      .upsert({
        user_id: user.id,
        legendary_id: legendaryId,
        item_id: itemId,
        quantity: quantity,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,legendary_id,item_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Reserve materials error:', error);
      return NextResponse.json(
        { error: 'Failed to reserve materials' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Materials reserved successfully',
      reservation: data,
    });
  } catch (error) {
    console.error('Reserve materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove reservation
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
    const { legendaryId, itemId } = body;

    if (!legendaryId || !itemId) {
      return NextResponse.json(
        { error: 'legendaryId and itemId are required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('material_reservations')
      .delete()
      .eq('user_id', user.id)
      .eq('legendary_id', legendaryId)
      .eq('item_id', itemId);

    if (error) {
      console.error('Delete reservation error:', error);
      return NextResponse.json(
        { error: 'Failed to delete reservation' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    console.error('Delete reservation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
