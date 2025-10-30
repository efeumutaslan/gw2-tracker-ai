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
