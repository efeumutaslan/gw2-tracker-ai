import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { getUserApiKey, ensureUserExists } from '@/lib/db/queries';
import { decrypt } from '@/lib/crypto/encryption';
import { getAllInventoryData, countItemAcrossInventories } from '@/lib/gw2/account';

export const dynamic = 'force-dynamic';

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

    // Ensure user exists in database
    await ensureUserExists(user.id, user.email!);

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

    // Get user's encrypted API key
    const apiKeyData = await getUserApiKey(user.id);

    let inventoryData: { [itemId: number]: number } = {};

    // If user has API key, fetch inventory from GW2 API
    if (apiKeyData) {
      try {
        // Decrypt API key
        const apiKey = decrypt({
          encrypted: apiKeyData.apiKeyEncrypted,
          iv: apiKeyData.apiKeyIv,
          authTag: apiKeyData.apiKeyAuthTag,
        });

        // Fetch all inventory data at once
        const { materials, bank, inventory } = await getAllInventoryData(apiKey);

        // Aggregate counts across all inventories
        const itemIds = new Set<number>();

        // Collect all item IDs
        materials.forEach(mat => itemIds.add(mat.id));
        bank.forEach(item => itemIds.add(item.id));
        inventory.forEach(item => itemIds.add(item.id));

        // Count each item across all inventories
        itemIds.forEach(itemId => {
          inventoryData[itemId] = countItemAcrossInventories(
            itemId,
            materials,
            bank,
            inventory
          );
        });
      } catch (error) {
        console.error('Error fetching GW2 inventory:', error);
      }
    }

    return NextResponse.json({
      goalId,
      legendaryName: goal.legendary_name,
      inventoryData,
      hasApiKey: !!apiKeyData,
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
