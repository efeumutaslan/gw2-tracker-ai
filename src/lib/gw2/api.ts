import { GW2_API_BASE_URL } from '@/lib/constants';
import type { GW2Account, GW2Character, GW2TokenInfo, GW2ApiError } from '@/types/gw2';

async function gw2ApiRequest<T>(
  endpoint: string,
  apiKey: string
): Promise<{ data?: T; error?: string }> {
  try {
    const url = `${GW2_API_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}access_token=${apiKey}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { error: 'Rate limit exceeded. Please try again later.' };
      }

      if (response.status === 401 || response.status === 403) {
        return { error: 'Invalid API key or insufficient permissions.' };
      }

      const errorData = await response.json() as GW2ApiError;
      return { error: errorData.text || 'GW2 API request failed' };
    }

    const data = await response.json() as T;
    return { data };
  } catch (error) {
    console.error('GW2 API request error:', error);
    return { error: 'Failed to connect to GW2 API' };
  }
}

export async function validateApiKey(apiKey: string): Promise<{
  valid: boolean;
  tokenInfo?: GW2TokenInfo;
  error?: string;
}> {
  const { data, error } = await gw2ApiRequest<GW2TokenInfo>('/tokeninfo', apiKey);

  if (error || !data) {
    return { valid: false, error: error || 'Invalid API key' };
  }

  const requiredPermissions = ['account', 'characters'];
  const hasRequired = requiredPermissions.every(perm => data.permissions.includes(perm));

  if (!hasRequired) {
    return {
      valid: false,
      error: `API key missing required permissions: ${requiredPermissions.join(', ')}`,
    };
  }

  return { valid: true, tokenInfo: data };
}

export async function getAccount(apiKey: string): Promise<{
  data?: GW2Account;
  error?: string;
}> {
  return gw2ApiRequest<GW2Account>('/account', apiKey);
}

export async function getCharacters(apiKey: string): Promise<{
  data?: string[];
  error?: string;
}> {
  return gw2ApiRequest<string[]>('/characters', apiKey);
}

export async function getCharacterDetails(apiKey: string, characterName: string): Promise<{
  data?: GW2Character;
  error?: string;
}> {
  const encodedName = encodeURIComponent(characterName);
  return gw2ApiRequest<GW2Character>(`/characters/${encodedName}`, apiKey);
}

export async function getAllCharacterDetails(apiKey: string): Promise<{
  data?: GW2Character[];
  error?: string;
}> {
  const { data: characterNames, error: listError } = await getCharacters(apiKey);

  if (listError || !characterNames) {
    return { error: listError || 'Failed to fetch character list' };
  }

  const characterPromises = characterNames.map(name => getCharacterDetails(apiKey, name));
  const results = await Promise.all(characterPromises);

  const characters = results
    .filter(result => result.data)
    .map(result => result.data!);

  if (characters.length === 0) {
    return { error: 'Failed to fetch character details' };
  }

  return { data: characters };
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get account materials (material storage)
 */
export async function getAccountMaterials(apiKey: string): Promise<{
  data?: Array<{ id: number; category: number; count: number; binding?: string }>;
  error?: string;
}> {
  return gw2ApiRequest('/account/materials', apiKey);
}

/**
 * Get account bank contents
 */
export async function getAccountBank(apiKey: string): Promise<{
  data?: Array<{ id: number; count: number; skin?: number; upgrades?: number[]; infusions?: number[]; binding?: string } | null>;
  error?: string;
}> {
  return gw2ApiRequest('/account/bank', apiKey);
}

/**
 * Get account inventory (shared inventory slots)
 */
export async function getAccountInventory(apiKey: string): Promise<{
  data?: Array<{ id: number; count: number; binding?: string } | null>;
  error?: string;
}> {
  return gw2ApiRequest('/account/inventory', apiKey);
}

/**
 * Get all character inventories
 */
export async function getAllCharacterInventories(apiKey: string): Promise<{
  data?: Record<string, any>;
  error?: string;
}> {
  const { data: characterNames, error: listError } = await getCharacters(apiKey);

  if (listError || !characterNames) {
    return { error: listError || 'Failed to fetch character list' };
  }

  const inventoryPromises = characterNames.map(async (name) => {
    const encodedName = encodeURIComponent(name);
    const { data, error } = await gw2ApiRequest(`/characters/${encodedName}/inventory`, apiKey);
    return { name, inventory: data, error };
  });

  const results = await Promise.all(inventoryPromises);
  const inventories: Record<string, any> = {};

  results.forEach((result) => {
    if (result.inventory) {
      inventories[result.name] = result.inventory;
    }
  });

  return { data: inventories };
}

/**
 * Aggregate all materials across account
 * Returns a map of itemId -> total count
 */
export async function getAggregatedMaterials(apiKey: string): Promise<{
  data?: Record<number, number>;
  error?: string;
}> {
  const materialsMap: Record<number, number> = {};

  // Get material storage
  const { data: materials, error: materialsError } = await getAccountMaterials(apiKey);
  if (materialsError) {
    return { error: materialsError };
  }

  if (materials) {
    materials.forEach((item) => {
      materialsMap[item.id] = (materialsMap[item.id] || 0) + item.count;
    });
  }

  // Get bank
  const { data: bank, error: bankError } = await getAccountBank(apiKey);
  if (!bankError && bank) {
    bank.forEach((slot) => {
      if (slot && slot.id) {
        materialsMap[slot.id] = (materialsMap[slot.id] || 0) + slot.count;
      }
    });
  }

  // Get shared inventory
  const { data: sharedInv, error: sharedError } = await getAccountInventory(apiKey);
  if (!sharedError && sharedInv) {
    sharedInv.forEach((slot) => {
      if (slot && slot.id) {
        materialsMap[slot.id] = (materialsMap[slot.id] || 0) + slot.count;
      }
    });
  }

  // Get character inventories
  const { data: charInventories, error: charError } = await getAllCharacterInventories(apiKey);
  if (!charError && charInventories) {
    Object.values(charInventories).forEach((charInv: any) => {
      if (charInv && charInv.bags) {
        charInv.bags.forEach((bag: any) => {
          if (bag && bag.inventory) {
            bag.inventory.forEach((slot: any) => {
              if (slot && slot.id) {
                materialsMap[slot.id] = (materialsMap[slot.id] || 0) + slot.count;
              }
            });
          }
        });
      }
    });
  }

  return { data: materialsMap };
}

/**
 * Get item details from GW2 API (no auth required)
 * Returns item information including name, description, icon
 */
export async function getItemDetails(itemIds: number[]): Promise<{
  data?: Array<{
    id: number;
    name: string;
    description?: string;
    icon?: string;
    type?: string;
    rarity?: string;
    level?: number;
    vendor_value?: number;
  }>;
  error?: string;
}> {
  try {
    if (itemIds.length === 0) {
      return { data: [] };
    }

    const idsParam = itemIds.join(',');
    const url = `${GW2_API_BASE_URL}/items?ids=${idsParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { error: 'Rate limit exceeded. Please try again later.' };
      }
      return { error: 'Failed to fetch item details' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Get item details error:', error);
    return { error: 'Failed to fetch item details' };
  }
}

/**
 * Get trading post prices for items (no auth required)
 */
export async function getItemPrices(itemIds: number[]): Promise<{
  data?: Array<{
    id: number;
    buys: { quantity: number; unit_price: number };
    sells: { quantity: number; unit_price: number };
  }>;
  error?: string;
}> {
  try {
    if (itemIds.length === 0) {
      return { data: [] };
    }

    const idsParam = itemIds.join(',');
    const url = `${GW2_API_BASE_URL}/commerce/prices?ids=${idsParam}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      if (response.status === 429) {
        return { error: 'Rate limit exceeded. Please try again later.' };
      }
      return { error: 'Failed to fetch item prices' };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('Get item prices error:', error);
    return { error: 'Failed to fetch item prices' };
  }
}
