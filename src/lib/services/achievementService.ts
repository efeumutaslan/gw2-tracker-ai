export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'exotic' | 'ascended' | 'legendary';
  condition: (stats: UserStats) => boolean;
  reward?: string;
}

export interface UserStats {
  totalQuestsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  totalGoldEarned: number;
  totalDaysActive: number;
  fastestCompletion?: number; // in minutes
  completedInOneDay: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: 'first_quest',
    title: 'First Steps',
    description: 'Complete your first quest',
    icon: '🎯',
    rarity: 'common',
    condition: (stats) => stats.totalQuestsCompleted >= 1,
  },
  {
    id: 'quest_veteran',
    title: 'Quest Veteran',
    description: 'Complete 10 quests',
    icon: '📜',
    rarity: 'rare',
    condition: (stats) => stats.totalQuestsCompleted >= 10,
  },
  {
    id: 'quest_master',
    title: 'Quest Master',
    description: 'Complete 50 quests',
    icon: '⚔️',
    rarity: 'exotic',
    condition: (stats) => stats.totalQuestsCompleted >= 50,
  },
  {
    id: 'quest_legend',
    title: 'Legendary Quester',
    description: 'Complete 100 quests',
    icon: '👑',
    rarity: 'legendary',
    condition: (stats) => stats.totalQuestsCompleted >= 100,
  },

  // Streak Achievements
  {
    id: 'streak_beginner',
    title: 'On a Roll',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    rarity: 'common',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥🔥',
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'fortnight_force',
    title: 'Fortnight Force',
    description: 'Maintain a 14-day streak',
    icon: '⚡',
    rarity: 'exotic',
    condition: (stats) => stats.currentStreak >= 14,
  },
  {
    id: 'monthly_master',
    title: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '💎',
    rarity: 'ascended',
    condition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable Force',
    description: 'Maintain a 100-day streak',
    icon: '⭐',
    rarity: 'legendary',
    condition: (stats) => stats.currentStreak >= 100,
  },

  // Gold Achievements
  {
    id: 'gold_collector',
    title: 'Gold Collector',
    description: 'Earn 100 gold from quests',
    icon: '💰',
    rarity: 'common',
    condition: (stats) => stats.totalGoldEarned >= 100,
  },
  {
    id: 'gold_rush',
    title: 'Gold Rush',
    description: 'Earn 1000 gold from quests',
    icon: '💸',
    rarity: 'exotic',
    condition: (stats) => stats.totalGoldEarned >= 1000,
  },
  {
    id: 'treasure_hunter',
    title: 'Treasure Hunter',
    description: 'Earn 5000 gold from quests',
    icon: '💎',
    rarity: 'legendary',
    condition: (stats) => stats.totalGoldEarned >= 5000,
  },

  // Special Achievements
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Complete a quest in under 5 minutes',
    icon: '⚡',
    rarity: 'rare',
    condition: (stats) => (stats.fastestCompletion || Infinity) <= 5,
  },
  {
    id: 'completionist',
    title: 'Daily Completionist',
    description: 'Complete all daily quests in one day',
    icon: '✨',
    rarity: 'ascended',
    condition: (stats) => stats.completedInOneDay >= 5, // Assuming 5+ is "all"
  },
  {
    id: 'dedicated',
    title: 'Dedicated Adventurer',
    description: 'Active for 30 days',
    icon: '🎖️',
    rarity: 'exotic',
    condition: (stats) => stats.totalDaysActive >= 30,
  },
  {
    id: 'veteran',
    title: 'Veteran Tracker',
    description: 'Active for 100 days',
    icon: '🏆',
    rarity: 'legendary',
    condition: (stats) => stats.totalDaysActive >= 100,
  },
];

export function checkAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.condition(stats));
}

export function getNewlyUnlocked(
  oldStats: UserStats,
  newStats: UserStats
): Achievement[] {
  const oldUnlocked = new Set(
    checkAchievements(oldStats).map((a) => a.id)
  );
  const newUnlocked = checkAchievements(newStats);

  return newUnlocked.filter((achievement) => !oldUnlocked.has(achievement.id));
}

export function getRarityColor(rarity: Achievement['rarity']): string {
  const colors = {
    common: 'text-gray-400',
    rare: 'text-blue-400',
    exotic: 'text-orange-400',
    ascended: 'text-pink-400',
    legendary: 'text-legendary',
  };
  return colors[rarity];
}

export function getRarityGlow(rarity: Achievement['rarity']): string {
  const glows = {
    common: '',
    rare: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]',
    exotic: 'drop-shadow-[0_0_8px_rgba(251,146,60,0.6)]',
    ascended: 'drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]',
    legendary: 'drop-shadow-[0_0_12px_rgba(212,175,55,0.8)]',
  };
  return glows[rarity];
}
