import { NextRequest, NextResponse } from 'next/server';
import { fetchRecipes, searchRecipesByOutput, searchRecipesByIngredient } from '@/lib/gw2/recipes';

export const dynamic = 'force-dynamic';

/**
 * GET /api/gw2/recipes
 * Fetch recipes by IDs or search by output/input item
 *
 * Query params:
 * - ids: Comma-separated recipe IDs
 * - output: Item ID to search recipes that produce it
 * - input: Item ID to search recipes that use it
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idsParam = searchParams.get('ids');
    const outputParam = searchParams.get('output');
    const inputParam = searchParams.get('input');

    // Search by output item
    if (outputParam) {
      const itemId = parseInt(outputParam);
      if (isNaN(itemId)) {
        return NextResponse.json(
          { error: 'Invalid output parameter' },
          { status: 400 }
        );
      }

      const result = await searchRecipesByOutput(itemId);
      return NextResponse.json({
        success: true,
        recipes: result.recipes,
        count: result.recipes.length,
      });
    }

    // Search by input item (ingredient)
    if (inputParam) {
      const itemId = parseInt(inputParam);
      if (isNaN(itemId)) {
        return NextResponse.json(
          { error: 'Invalid input parameter' },
          { status: 400 }
        );
      }

      const result = await searchRecipesByIngredient(itemId);
      return NextResponse.json({
        success: true,
        recipes: result.recipes,
        count: result.recipes.length,
      });
    }

    // Fetch by IDs
    if (idsParam) {
      const ids = idsParam.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

      if (ids.length === 0) {
        return NextResponse.json(
          { error: 'No valid recipe IDs provided' },
          { status: 400 }
        );
      }

      const result = await fetchRecipes(ids);

      return NextResponse.json({
        success: true,
        recipes: result.recipes,
        count: result.recipes.length,
      });
    }

    return NextResponse.json(
      { error: 'Missing query parameter: ids, output, or input required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Recipes API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
