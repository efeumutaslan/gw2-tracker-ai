export const GW2_API_BASE_URL = 'https://api.guildwars2.com/v2';

export const GW2_RESET_TIMES = {
  DAILY: '00:00', // UTC
  WEEKLY_DAY: 1, // Monday
  WEEKLY_TIME: '07:30', // UTC
};

export const QUEST_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  CUSTOM: 'custom',
  ONCE: 'once',
} as const;

export const PROFESSIONS = [
  'Guardian',
  'Warrior',
  'Engineer',
  'Ranger',
  'Thief',
  'Elementalist',
  'Mesmer',
  'Necromancer',
  'Revenant',
] as const;

export const PROFESSION_COLORS: Record<string, string> = {
  Guardian: '#72C1D9',
  Warrior: '#FFD166',
  Engineer: '#D09C59',
  Ranger: '#8CDC82',
  Thief: '#C08F95',
  Elementalist: '#F68A87',
  Mesmer: '#B679D5',
  Necromancer: '#52A76F',
  Revenant: '#D16E5A',
};

export const API_KEY_PERMISSIONS = [
  'account',
  'characters',
  'inventories',
  'progression',
  'unlocks',
  'wallet',
] as const;
