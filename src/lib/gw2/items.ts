/**
 * GW2 Items API Service
 * Documentation: https://wiki.guildwars2.com/wiki/API:2/items
 */

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export interface GW2Item {
  id: number;
  chat_link: string;
  name: string;
  icon?: string;
  description?: string;
  type: string;
  rarity: 'Junk' | 'Basic' | 'Fine' | 'Masterwork' | 'Rare' | 'Exotic' | 'Ascended' | 'Legendary';
  level: number;
  vendor_value: number;
  default_skin?: number;
  flags: string[];
  game_types: string[];
  restrictions: string[];
}

export interface ItemsResponse {
  items: GW2Item[];
  errors?: Array<{ id: number; error: string }>;
}

/**
 * Fetch multiple items by IDs from GW2 API
 * Rate limit: 600 requests/minute
 */
export async function fetchItems(itemIds: number[]): Promise<ItemsResponse> {
  if (itemIds.length === 0) {
    return { items: [] };
  }

  // GW2 API supports up to 200 IDs per request
  const BATCH_SIZE = 200;
  const batches: number[][] = [];

  for (let i = 0; i < itemIds.length; i += BATCH_SIZE) {
    batches.push(itemIds.slice(i, i + BATCH_SIZE));
  }

  const allItems: GW2Item[] = [];
  const errors: Array<{ id: number; error: string }> = [];

  for (const batch of batches) {
    try {
      const idsParam = batch.join(',');
      const url = `${GW2_API_BASE}/items?ids=${idsParam}`;

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
        console.error(`GW2 API error for batch ${batch}:`, response.status, errorText);

        // Add errors for all items in failed batch
        batch.forEach(id => {
          errors.push({ id, error: `HTTP ${response.status}` });
        });
        continue;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        allItems.push(...data);
      } else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error(`Error fetching batch ${batch}:`, error);
      batch.forEach(id => {
        errors.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });
    }
  }

  return { items: allItems, errors: errors.length > 0 ? errors : undefined };
}

/**
 * Fetch a single item by ID
 */
export async function fetchItem(itemId: number): Promise<GW2Item | null> {
  try {
    const response = await fetch(`${GW2_API_BASE}/items/${itemId}`, {
      headers: {
        'Accept': 'application/json',
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    });

    if (!response.ok) {
      console.error(`GW2 API error for item ${itemId}:`, response.status);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    return null;
  }
}

/**
 * Extract icon URL from item data
 */
export function getItemIconUrl(item: GW2Item): string | null {
  return item.icon || null;
}

/**
 * Batch fetch with retry logic
 */
export async function fetchItemsWithRetry(
  itemIds: number[],
  maxRetries = 3
): Promise<ItemsResponse> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await fetchItems(itemIds);

      // If we got some items, return them even if there were partial errors
      if (result.items.length > 0) {
        return result;
      }

      // If no items and we have errors, retry
      if (result.errors && result.errors.length > 0) {
        lastError = new Error(`Failed to fetch items: ${result.errors[0].error}`);

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
        continue;
      }

      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      if (attempt < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  throw lastError || new Error('Failed to fetch items after retries');
}
