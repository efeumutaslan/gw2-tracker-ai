import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - Fetch material progress for a specific legendary goal with inventory comparison
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const goalId = params.id;

    // Verify goal belongs to user
    const { data: goal, error: goalError } = await supabase
      .from('user_legendary_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single();

    if (goalError || !goal) {
      return NextResponse.json(
        { error: 'Legendary goal not found' },
        { status: 404 }
      );
    }

    // Get user's API key
    const { data: apiKeyData } = await supabase
      .from('user_api_keys')
      .select('api_key')
      .eq('user_id', user.id)
      .single();

    let inventoryData: { [itemId: number]: number } = {};

    // If user has API key, fetch inventory from GW2 API
    if (apiKeyData?.api_key) {
      try {
        // Fetch account materials
        const materialsResponse = await fetch(
          'https://api.guildwars2.com/v2/account/materials',
          {
            headers: { Authorization: `Bearer ${apiKeyData.api_key}` },
          }
        );

        if (materialsResponse.ok) {
          const materials = await materialsResponse.json();
          materials.forEach((mat: { id: number; count: number }) => {
            inventoryData[mat.id] = mat.count;
          });
        }

        // Fetch account bank
        const bankResponse = await fetch(
          'https://api.guildwars2.com/v2/account/bank',
          {
            headers: { Authorization: `Bearer ${apiKeyData.api_key}` },
          }
        );

        if (bankResponse.ok) {
          const bank = await bankResponse.json();
          bank.forEach((slot: any) => {
            if (slot && slot.id) {
              inventoryData[slot.id] = (inventoryData[slot.id] || 0) + slot.count;
            }
          });
        }

        // Fetch shared inventory
        const sharedResponse = await fetch(
          'https://api.guildwars2.com/v2/account/inventory',
          {
            headers: { Authorization: `Bearer ${apiKeyData.api_key}` },
          }
        );

        if (sharedResponse.ok) {
          const shared = await sharedResponse.json();
          shared.forEach((slot: any) => {
            if (slot && slot.id) {
              inventoryData[slot.id] = (inventoryData[slot.id] || 0) + slot.count;
            }
          });
        }
      } catch (error) {
        console.error('Error fetching GW2 inventory:', error);
      }
    }

    return NextResponse.json({
      goalId,
      legendaryName: goal.legendary_name,
      inventoryData,
      hasApiKey: !!apiKeyData?.api_key,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Update material progress manually
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const goalId = params.id;
    const body = await request.json();
    const { materialId, materialName, requiredQuantity, currentQuantity } = body;

    // Verify goal belongs to user
    const { data: goal } = await supabase
      .from('user_legendary_goals')
      .select('id')
      .eq('id', goalId)
      .eq('user_id', user.id)
      .single();

    if (!goal) {
      return NextResponse.json(
        { error: 'Legendary goal not found' },
        { status: 404 }
      );
    }

    // Check if material progress already exists
    const { data: existing } = await supabase
      .from('legendary_material_progress')
      .select('id')
      .eq('goal_id', goalId)
      .eq('material_id', materialId)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('legendary_material_progress')
        .update({
          current_quantity: currentQuantity,
          is_completed: currentQuantity >= requiredQuantity,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json(data);
    } else {
      // Create new
      const { data, error } = await supabase
        .from('legendary_material_progress')
        .insert({
          goal_id: goalId,
          material_id: materialId,
          material_name: materialName,
          required_quantity: requiredQuantity,
          current_quantity: currentQuantity,
          is_completed: currentQuantity >= requiredQuantity,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return NextResponse.json(data, { status: 201 });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
