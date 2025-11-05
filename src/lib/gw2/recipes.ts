/**
 * GW2 Recipes API Service
 * Documentation: https://wiki.guildwars2.com/wiki/API:2/recipes
 */

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export type RecipeType =
  | 'Axe' | 'Dagger' | 'Focus' | 'Greatsword' | 'Hammer' | 'Harpoon'
  | 'LongBow' | 'Mace' | 'Pistol' | 'Rifle' | 'Scepter' | 'Shield'
  | 'ShortBow' | 'Speargun' | 'Staff' | 'Sword' | 'Torch' | 'Trident' | 'Warhorn'
  | 'Boots' | 'Coat' | 'Gloves' | 'Helm' | 'Leggings' | 'Shoulders'
  | 'Amulet' | 'Earring' | 'Ring'
  | 'Dessert' | 'Feast' | 'IngredientCooking' | 'Meal' | 'Seasoning' | 'Snack' | 'Soup' | 'Food'
  | 'Component' | 'Inscription' | 'Insignia' | 'LegendaryComponent'
  | 'Refinement' | 'RefinementEctoplasm' | 'RefinementObsidian'
  | 'GuildConsumable' | 'GuildDecoration' | 'GuildConsumableWvw'
  | 'Backpack' | 'Bag' | 'Bulk' | 'Consumable' | 'Dye' | 'Potion' | 'UpgradeComponent';

export type Discipline =
  | 'Artificer' | 'Armorsmith' | 'Chef' | 'Homesteader'
  | 'Huntsman' | 'Jeweler' | 'Leatherworker' | 'Tailor'
  | 'Weaponsmith' | 'Scribe';

export type RecipeFlag = 'AutoLearned' | 'LearnedFromItem';

export type IngredientType = 'Item' | 'Currency' | 'GuildUpgrade';

export interface RecipeIngredient {
  type?: IngredientType;
  id?: number;        // New schema (with type)
  item_id?: number;   // Old schema (deprecated)
  count: number;
}

export interface GuildIngredient {
  upgrade_id: number;
  count: number;
}

export interface GW2Recipe {
  id: number;
  type: RecipeType;
  output_item_id: number;
  output_item_count: number;
  time_to_craft_ms: number;
  disciplines: Discipline[];
  min_rating: number;
  flags: RecipeFlag[];
  ingredients: RecipeIngredient[];
  guild_ingredients?: GuildIngredient[];
  output_upgrade_id?: number;
  chat_link: string;
}

export interface RecipesResponse {
  recipes: GW2Recipe[];
  error?: string;
}

/**
 * Fetch recipes by IDs
 * No authentication required
 */
export async function fetchRecipes(recipeIds: number[]): Promise<RecipesResponse> {
  if (recipeIds.length === 0) {
    return { recipes: [] };
  }

  try {
    const BATCH_SIZE = 200;
    const batches: number[][] = [];

    for (let i = 0; i < recipeIds.length; i += BATCH_SIZE) {
      batches.push(recipeIds.slice(i, i + BATCH_SIZE));
    }

    const allRecipes: GW2Recipe[] = [];

    for (const batch of batches) {
      const idsParam = batch.join(',');
      // Use latest schema version with Currency support
      const url = `${GW2_API_BASE}/recipes?ids=${idsParam}&v=2022-03-09T02:00:00.000Z`;

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
        next: {
          revalidate: 86400, // Cache for 24 hours
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GW2 API error (recipes):`, response.status, errorText);
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        allRecipes.push(...data);
      }
    }

    return { recipes: allRecipes };
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return {
      recipes: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch a single recipe by ID
 */
export async function fetchRecipe(recipeId: number): Promise<GW2Recipe | null> {
  try {
    const url = `${GW2_API_BASE}/recipes/${recipeId}?v=2022-03-09T02:00:00.000Z`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!response.ok) {
      console.error(`GW2 API error for recipe ${recipeId}:`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId}:`, error);
    return null;
  }
}

/**
 * Search recipes by output item ID
 * Returns all recipes that produce the given item
 */
export async function searchRecipesByOutput(itemId: number): Promise<RecipesResponse> {
  try {
    const url = `${GW2_API_BASE}/recipes/search?output=${itemId}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!response.ok) {
      console.error(`GW2 API error searching recipes for item ${itemId}:`, response.status);
      return { recipes: [] };
    }

    const recipeIds: number[] = await response.json();

    if (recipeIds.length === 0) {
      return { recipes: [] };
    }

    // Fetch full recipe details
    return await fetchRecipes(recipeIds);
  } catch (error) {
    console.error(`Error searching recipes for item ${itemId}:`, error);
    return {
      recipes: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Search recipes by ingredient item ID
 * Returns all recipes that use the given item as an ingredient
 */
export async function searchRecipesByIngredient(itemId: number): Promise<RecipesResponse> {
  try {
    const url = `${GW2_API_BASE}/recipes/search?input=${itemId}`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!response.ok) {
      console.error(`GW2 API error searching recipes by ingredient ${itemId}:`, response.status);
      return { recipes: [] };
    }

    const recipeIds: number[] = await response.json();

    if (recipeIds.length === 0) {
      return { recipes: [] };
    }

    // Fetch full recipe details
    return await fetchRecipes(recipeIds);
  } catch (error) {
    console.error(`Error searching recipes by ingredient ${itemId}:`, error);
    return {
      recipes: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get ingredient item ID from recipe ingredient
 * Handles both old and new schema formats
 */
export function getIngredientItemId(ingredient: RecipeIngredient): number | null {
  // New schema (with type field)
  if (ingredient.id !== undefined) {
    return ingredient.id;
  }
  // Old schema (deprecated but still supported)
  if (ingredient.item_id !== undefined) {
    return ingredient.item_id;
  }
  return null;
}

/**
 * Check if ingredient is a currency
 */
export function isIngredientCurrency(ingredient: RecipeIngredient): boolean {
  return ingredient.type === 'Currency';
}

/**
 * Check if ingredient is a guild upgrade
 */
export function isIngredientGuildUpgrade(ingredient: RecipeIngredient): boolean {
  return ingredient.type === 'GuildUpgrade';
}
