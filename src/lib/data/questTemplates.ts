export interface QuestTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly';
  goldReward?: string;
  estimatedDurationMinutes?: number;
  waypointCode?: string;
  icon: string;
  tags: string[];
}

export const QUEST_TEMPLATES: QuestTemplate[] = [
  // Daily Activities
  {
    id: 'daily-fractals',
    name: 'Daily Fractals',
    description: 'Complete 3 daily recommended fractals',
    category: 'Fractals',
    frequency: 'daily',
    goldReward: '2-4',
    estimatedDurationMinutes: 45,
    icon: '🏔️',
    tags: ['PvE', 'Group', 'Gold'],
  },
  {
    id: 'daily-strikes',
    name: 'Daily Strike Missions',
    description: 'Complete daily strike missions',
    category: 'Strikes',
    frequency: 'daily',
    goldReward: '1-2',
    estimatedDurationMinutes: 30,
    icon: '⚔️',
    tags: ['PvE', 'Group', 'Easy'],
  },
  {
    id: 'daily-crafting',
    name: 'Daily Crafting',
    description: 'Craft time-gated materials (Deldrimor Steel, Spiritwood Plank, etc.)',
    category: 'Crafting',
    frequency: 'daily',
    goldReward: '5-10',
    estimatedDurationMinutes: 5,
    icon: '🔨',
    tags: ['Crafting', 'Gold', 'Quick'],
  },
  {
    id: 'daily-gathering',
    name: 'Home Instance Gathering',
    description: 'Gather all nodes in home instance',
    category: 'Gathering',
    frequency: 'daily',
    goldReward: '1-3',
    estimatedDurationMinutes: 10,
    icon: '🌿',
    tags: ['Solo', 'Gold', 'Quick'],
  },
  {
    id: 'daily-pvp',
    name: 'Daily PvP',
    description: 'Complete PvP daily achievements',
    category: 'PvP',
    frequency: 'daily',
    goldReward: '0.5-1',
    estimatedDurationMinutes: 20,
    icon: '🗡️',
    tags: ['PvP', 'Competitive'],
  },
  {
    id: 'daily-wvw',
    name: 'Daily WvW',
    description: 'Complete WvW daily achievements',
    category: 'WvW',
    frequency: 'daily',
    goldReward: '0.5-1',
    estimatedDurationMinutes: 30,
    icon: '🏰',
    tags: ['WvW', 'PvP'],
  },
  {
    id: 'daily-ley-line',
    name: 'Ley-Line Anomaly',
    description: 'Defeat the Ley-Line Anomaly in Timberline Falls',
    category: 'Events',
    frequency: 'daily',
    waypointCode: '[&BEcBAAA=]',
    estimatedDurationMinutes: 10,
    icon: '⚡',
    tags: ['World Event', 'Quick'],
  },
  {
    id: 'daily-mystic-coins',
    name: 'Mystic Coins Login',
    description: 'Collect mystic coins from login rewards',
    category: 'Login',
    frequency: 'daily',
    estimatedDurationMinutes: 1,
    icon: '🪙',
    tags: ['Login', 'Quick', 'Gold'],
  },

  // Weekly Activities
  {
    id: 'weekly-raids',
    name: 'Weekly Raid Clear',
    description: 'Complete all 7 raid wings',
    category: 'Raids',
    frequency: 'weekly',
    goldReward: '15-25',
    estimatedDurationMinutes: 180,
    icon: '👑',
    tags: ['PvE', 'Group', 'Challenging', 'Gold'],
  },
  {
    id: 'weekly-strikes',
    name: 'Weekly Strike Missions',
    description: 'Complete all weekly strike missions',
    category: 'Strikes',
    frequency: 'weekly',
    goldReward: '10-15',
    estimatedDurationMinutes: 120,
    icon: '⚔️',
    tags: ['PvE', 'Group', 'Gold'],
  },
  {
    id: 'weekly-dungeons',
    name: 'Dungeon Paths',
    description: 'Run profitable dungeon paths (AC, CoF, etc.)',
    category: 'Dungeons',
    frequency: 'weekly',
    goldReward: '5-10',
    estimatedDurationMinutes: 90,
    icon: '🏛️',
    tags: ['PvE', 'Group', 'Gold'],
  },
  {
    id: 'weekly-wvw-skirmish',
    name: 'WvW Skirmish Rewards',
    description: 'Complete WvW participation for weekly skirmish chest',
    category: 'WvW',
    frequency: 'weekly',
    goldReward: '5-15',
    estimatedDurationMinutes: 300,
    icon: '🏰',
    tags: ['WvW', 'PvP', 'Gold'],
  },
  {
    id: 'weekly-pvp-pips',
    name: 'PvP Reward Track',
    description: 'Progress PvP reward track for weekly chest',
    category: 'PvP',
    frequency: 'weekly',
    goldReward: '3-8',
    estimatedDurationMinutes: 180,
    icon: '🗡️',
    tags: ['PvP', 'Competitive'],
  },
  {
    id: 'weekly-guild-missions',
    name: 'Guild Missions',
    description: 'Complete weekly guild missions',
    category: 'Guild',
    frequency: 'weekly',
    goldReward: '2-5',
    estimatedDurationMinutes: 60,
    icon: '🛡️',
    tags: ['Guild', 'Group'],
  },
  {
    id: 'weekly-triple-trouble',
    name: 'Triple Trouble Wurm',
    description: 'Defeat the Triple Trouble wurm',
    category: 'World Bosses',
    frequency: 'weekly',
    waypointCode: '[&BEEFAAA=]',
    goldReward: '2-4',
    estimatedDurationMinutes: 45,
    icon: '🐉',
    tags: ['World Event', 'Group', 'Challenging'],
  },
  {
    id: 'weekly-drizzlewood',
    name: 'Drizzlewood Coast Meta',
    description: 'Complete Drizzlewood Coast meta event chain',
    category: 'Meta Events',
    frequency: 'weekly',
    waypointCode: '[&BAkMAAA=]',
    goldReward: '10-20',
    estimatedDurationMinutes: 120,
    icon: '⚙️',
    tags: ['Meta Event', 'Gold', 'Group'],
  },
  {
    id: 'weekly-dragonfall',
    name: 'Dragonfall Meta',
    description: 'Complete Dragonfall meta event',
    category: 'Meta Events',
    frequency: 'weekly',
    waypointCode: '[&BPULAAA=]',
    goldReward: '8-15',
    estimatedDurationMinutes: 90,
    icon: '🔥',
    tags: ['Meta Event', 'Gold', 'Group'],
  },
  {
    id: 'weekly-map-completion',
    name: 'Map Completion',
    description: 'Complete a map for rewards and achievement progress',
    category: 'Exploration',
    frequency: 'weekly',
    goldReward: '1-3',
    estimatedDurationMinutes: 180,
    icon: '🗺️',
    tags: ['Solo', 'Exploration'],
  },
];

export function getTemplatesByFrequency(frequency: 'daily' | 'weekly'): QuestTemplate[] {
  return QUEST_TEMPLATES.filter((template) => template.frequency === frequency);
}

export function getTemplatesByCategory(category: string): QuestTemplate[] {
  return QUEST_TEMPLATES.filter((template) => template.category === category);
}

export function getTemplatesByTag(tag: string): QuestTemplate[] {
  return QUEST_TEMPLATES.filter((template) => template.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  QUEST_TEMPLATES.forEach((template) => {
    template.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
