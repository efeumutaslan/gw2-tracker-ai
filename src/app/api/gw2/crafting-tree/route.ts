import { NextRequest, NextResponse } from 'next/server';
import { buildCraftingTree, enrichCraftingTree, calculateCraftingSteps } from '@/lib/services/craftingTreeService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gw2/crafting-tree
 * Build a complete crafting tree for an item
 *
 * Query params:
 * - itemId: The item ID to craft
 * - quantity: How many to craft (default: 1)
 * - maxDepth: Maximum recursion depth (default: 10)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemIdParam = searchParams.get('itemId');
    const quantityParam = searchParams.get('quantity');
    const maxDepthParam = searchParams.get('maxDepth');

    if (!itemIdParam) {
      return NextResponse.json(
        { error: 'Missing required parameter: itemId' },
        { status: 400 }
      );
    }

    const itemId = parseInt(itemIdParam);
    if (isNaN(itemId)) {
      return NextResponse.json(
        { error: 'Invalid itemId parameter' },
        { status: 400 }
      );
    }

    const quantity = quantityParam ? parseInt(quantityParam) : 1;
    const maxDepth = maxDepthParam ? parseInt(maxDepthParam) : 10;

    // Build crafting tree
    const tree = await buildCraftingTree(itemId, quantity, maxDepth);

    if (!tree) {
      return NextResponse.json(
        { error: 'Failed to build crafting tree. Item may not be craftable.' },
        { status: 404 }
      );
    }

    // Enrich with item names
    const enrichedTree = await enrichCraftingTree(tree);

    // Calculate crafting steps
    const steps = calculateCraftingSteps(enrichedTree);
    const craftingSteps = Array.from(steps.entries()).map(([depth, materials]) => ({
      depth,
      materials,
    }));

    return NextResponse.json({
      success: true,
      tree: enrichedTree,
      craftingSteps,
      summary: {
        totalMaterials: enrichedTree.totalMaterials.length,
        baseMaterials: enrichedTree.baseMaterials.length,
        craftableIntermediates: enrichedTree.craftableIntermediates.length,
        totalBaseMaterialCost: enrichedTree.baseMaterials.reduce(
          (sum, m) => sum + m.quantity,
          0
        ),
      },
    });
  } catch (error) {
    console.error('Crafting tree API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
