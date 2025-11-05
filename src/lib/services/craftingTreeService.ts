/**
 * Crafting Tree Service
 * Builds recursive crafting trees for items and calculates total material requirements
 */

import { fetchRecipe, searchRecipesByOutput, getIngredientItemId, type GW2Recipe, type RecipeIngredient } from '@/lib/gw2/recipes';
import { fetchItems, type GW2Item } from '@/lib/gw2/items';

export interface CraftingNode {
  itemId: number;
  itemName?: string;
  quantity: number;
  recipe?: GW2Recipe;
  children: CraftingNode[];
  canBeCrafted: boolean;
  isCurrency: boolean;
}

export interface MaterialRequirement {
  itemId: number;
  itemName: string;
  quantity: number;
  canBeCrafted: boolean;
  isCurrency: boolean;
}

export interface CraftingTree {
  root: CraftingNode;
  totalMaterials: MaterialRequirement[];
  craftableIntermediates: MaterialRequirement[];
  baseMaterials: MaterialRequirement[];
}

/**
 * Build a complete crafting tree for an item
 * @param itemId - The ID of the item to craft
 * @param quantity - How many of the item to craft
 * @param maxDepth - Maximum recursion depth (default 10)
 */
export async function buildCraftingTree(
  itemId: number,
  quantity: number = 1,
  maxDepth: number = 10
): Promise<CraftingTree | null> {
  try {
    const root = await buildCraftingNode(itemId, quantity, 0, maxDepth, new Set());

    if (!root) {
      return null;
    }

    // Calculate total materials needed
    const materialMap = new Map<number, MaterialRequirement>();
    accumulateMaterials(root, materialMap);

    const totalMaterials = Array.from(materialMap.values());

    // Separate materials into categories
    const craftableIntermediates = totalMaterials.filter(m => m.canBeCrafted);
    const baseMaterials = totalMaterials.filter(m => !m.canBeCrafted);

    return {
      root,
      totalMaterials,
      craftableIntermediates,
      baseMaterials,
    };
  } catch (error) {
    console.error('Error building crafting tree:', error);
    return null;
  }
}

/**
 * Recursively build a crafting node
 */
async function buildCraftingNode(
  itemId: number,
  quantity: number,
  depth: number,
  maxDepth: number,
  visited: Set<number>
): Promise<CraftingNode | null> {
  // Prevent infinite recursion
  if (depth >= maxDepth) {
    return {
      itemId,
      quantity,
      children: [],
      canBeCrafted: false,
      isCurrency: false,
    };
  }

  // Prevent circular dependencies
  if (visited.has(itemId)) {
    return {
      itemId,
      quantity,
      children: [],
      canBeCrafted: false,
      isCurrency: false,
    };
  }

  visited.add(itemId);

  try {
    // Search for recipes that produce this item
    const { recipes } = await searchRecipesByOutput(itemId);

    if (recipes.length === 0) {
      // This is a base material (cannot be crafted)
      return {
        itemId,
        quantity,
        children: [],
        canBeCrafted: false,
        isCurrency: false,
      };
    }

    // Use the first recipe (usually there's only one)
    const recipe = recipes[0];

    // Calculate how many times we need to craft this recipe
    const craftingBatches = Math.ceil(quantity / recipe.output_item_count);

    // Build children for each ingredient
    const children: CraftingNode[] = [];

    for (const ingredient of recipe.ingredients) {
      const ingredientId = getIngredientItemId(ingredient);

      if (!ingredientId) {
        // Currency or guild upgrade
        children.push({
          itemId: ingredient.id || 0,
          quantity: ingredient.count * craftingBatches,
          children: [],
          canBeCrafted: false,
          isCurrency: true,
        });
        continue;
      }

      const requiredQuantity = ingredient.count * craftingBatches;

      // Recursively build child node
      const childNode = await buildCraftingNode(
        ingredientId,
        requiredQuantity,
        depth + 1,
        maxDepth,
        new Set(visited)
      );

      if (childNode) {
        children.push(childNode);
      }
    }

    return {
      itemId,
      quantity,
      recipe,
      children,
      canBeCrafted: true,
      isCurrency: false,
    };
  } finally {
    visited.delete(itemId);
  }
}

/**
 * Accumulate all materials from a crafting tree into a flat map
 */
function accumulateMaterials(
  node: CraftingNode,
  materialMap: Map<number, MaterialRequirement>
): void {
  // If this is a leaf node (base material or currency), add it to the map
  if (node.children.length === 0) {
    const existing = materialMap.get(node.itemId);

    if (existing) {
      existing.quantity += node.quantity;
    } else {
      materialMap.set(node.itemId, {
        itemId: node.itemId,
        itemName: node.itemName || `Item ${node.itemId}`,
        quantity: node.quantity,
        canBeCrafted: node.canBeCrafted,
        isCurrency: node.isCurrency,
      });
    }
  } else {
    // Recursively process children
    for (const child of node.children) {
      accumulateMaterials(child, materialMap);
    }
  }
}

/**
 * Enrich crafting tree with item names and details
 */
export async function enrichCraftingTree(tree: CraftingTree): Promise<CraftingTree> {
  // Collect all unique item IDs
  const itemIds = new Set<number>();

  function collectItemIds(node: CraftingNode) {
    if (!node.isCurrency) {
      itemIds.add(node.itemId);
    }
    node.children.forEach(collectItemIds);
  }

  collectItemIds(tree.root);

  // Fetch item details
  const { items } = await fetchItems(Array.from(itemIds));
  const itemMap = new Map(items.map(item => [item.id, item]));

  // Add item names to nodes
  function enrichNode(node: CraftingNode) {
    const item = itemMap.get(node.itemId);
    if (item) {
      node.itemName = item.name;
    }
    node.children.forEach(enrichNode);
  }

  enrichNode(tree.root);

  // Also enrich material requirements
  tree.totalMaterials.forEach(mat => {
    const item = itemMap.get(mat.itemId);
    if (item) {
      mat.itemName = item.name;
    }
  });

  tree.baseMaterials.forEach(mat => {
    const item = itemMap.get(mat.itemId);
    if (item) {
      mat.itemName = item.name;
    }
  });

  tree.craftableIntermediates.forEach(mat => {
    const item = itemMap.get(mat.itemId);
    if (item) {
      mat.itemName = item.name;
    }
  });

  return tree;
}

/**
 * Calculate crafting steps in optimal order
 * Returns materials grouped by crafting depth (0 = base materials, 1 = first crafts, etc.)
 */
export function calculateCraftingSteps(tree: CraftingTree): Map<number, MaterialRequirement[]> {
  const stepMap = new Map<number, MaterialRequirement[]>();

  function assignSteps(node: CraftingNode, depth: number) {
    if (node.children.length === 0) {
      // Base material - depth 0
      const materials = stepMap.get(0) || [];
      materials.push({
        itemId: node.itemId,
        itemName: node.itemName || `Item ${node.itemId}`,
        quantity: node.quantity,
        canBeCrafted: node.canBeCrafted,
        isCurrency: node.isCurrency,
      });
      stepMap.set(0, materials);
    } else {
      // Process children first
      node.children.forEach(child => assignSteps(child, depth + 1));

      // Then this node
      const materials = stepMap.get(depth) || [];
      materials.push({
        itemId: node.itemId,
        itemName: node.itemName || `Item ${node.itemId}`,
        quantity: node.quantity,
        canBeCrafted: node.canBeCrafted,
        isCurrency: node.isCurrency,
      });
      stepMap.set(depth, materials);
    }
  }

  assignSteps(tree.root, 1);

  return stepMap;
}
