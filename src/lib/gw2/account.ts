/**
 * GW2 Account API Service
 * Documentation: https://wiki.guildwars2.com/wiki/API:2/account
 */

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export interface GW2Material {
  id: number;
  category: number;
  binding?: 'Account';
  count: number;
}

export interface GW2BankItem {
  id: number;
  count: number;
  charges?: number;
  skin?: number;
  dyes?: number[];
  upgrades?: number[];
  upgrade_slot_indices?: number[];
  infusions?: number[];
  binding?: 'Account' | 'Character';
  bound_to?: string;
  stats?: {
    id: number;
    attributes?: Record<string, number>;
  };
}

export interface GW2InventoryItem {
  id: number;
  count: number;
  charges?: number;
  skin?: number;
  binding?: 'Account' | 'Character';
  bound_to?: string;
}

export interface MaterialsResponse {
  materials: GW2Material[];
  error?: string;
}

export interface BankResponse {
  items: (GW2BankItem | null)[];
  error?: string;
}

export interface InventoryResponse {
  items: (GW2InventoryItem | null)[];
  error?: string;
}

/**
 * Fetch account materials from material storage
 * Requires: account + inventories scopes
 */
export async function getAccountMaterials(apiKey: string): Promise<MaterialsResponse> {
  try {
    const response = await fetch(`${GW2_API_BASE}/account/materials`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GW2 API error (materials):`, response.status, errorText);
      return {
        materials: [],
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();

    return {
      materials: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    console.error('Error fetching account materials:', error);
    return {
      materials: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch account bank items
 * Requires: account + inventories scopes
 */
export async function getAccountBank(apiKey: string): Promise<BankResponse> {
  try {
    const response = await fetch(`${GW2_API_BASE}/account/bank`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GW2 API error (bank):`, response.status, errorText);
      return {
        items: [],
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();

    return {
      items: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    console.error('Error fetching account bank:', error);
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch shared inventory slots
 * Requires: account + inventories scopes
 */
export async function getAccountInventory(apiKey: string): Promise<InventoryResponse> {
  try {
    const response = await fetch(`${GW2_API_BASE}/account/inventory`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      next: {
        revalidate: 300, // Cache for 5 minutes
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GW2 API error (inventory):`, response.status, errorText);
      return {
        items: [],
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();

    return {
      items: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    console.error('Error fetching account inventory:', error);
    return {
      items: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fetch all inventory data at once (materials + bank + shared inventory)
 * This is more efficient than making 3 separate calls
 */
export async function getAllInventoryData(apiKey: string) {
  const [materials, bank, inventory] = await Promise.all([
    getAccountMaterials(apiKey),
    getAccountBank(apiKey),
    getAccountInventory(apiKey),
  ]);

  return {
    materials: materials.materials,
    bank: bank.items.filter((item): item is GW2BankItem => item !== null),
    inventory: inventory.items.filter((item): item is GW2InventoryItem => item !== null),
    errors: {
      materials: materials.error,
      bank: bank.error,
      inventory: inventory.error,
    },
  };
}

/**
 * Count total quantity of a specific item across all inventories
 */
export function countItemAcrossInventories(
  itemId: number,
  materials: GW2Material[],
  bank: GW2BankItem[],
  inventory: GW2InventoryItem[]
): number {
  let total = 0;

  // Check materials storage
  const material = materials.find(m => m.id === itemId);
  if (material) {
    total += material.count;
  }

  // Check bank
  bank.forEach(item => {
    if (item.id === itemId) {
      total += item.count;
    }
  });

  // Check shared inventory
  inventory.forEach(item => {
    if (item.id === itemId) {
      total += item.count;
    }
  });

  return total;
}
