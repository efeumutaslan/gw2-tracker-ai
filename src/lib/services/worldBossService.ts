export interface WorldBoss {
  id: string;
  name: string;
  map: string;
  waypoint: string;
  waypointCode: string;
  spawnTimes: number[]; // Hours in UTC (0-23)
  duration: number; // Minutes the event lasts
  rewards: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface UpcomingBoss {
  boss: WorldBoss;
  nextSpawn: Date;
  timeUntil: string;
  isActive: boolean;
}

// GW2 World Boss Schedule (UTC times, spawns every 2 hours)
export const WORLD_BOSSES: WorldBoss[] = [
  {
    id: 'admiral_taidha',
    name: 'Admiral Taidha Covington',
    map: 'Bloodtide Coast',
    waypoint: 'Laughing Gull Island',
    waypointCode: '[&BH8BAAA=]',
    spawnTimes: [0, 3, 6, 9, 12, 15, 18, 21],
    duration: 20,
    rewards: ['1 Gold', 'Exotic Chance', 'Rare Gear'],
    difficulty: 'easy',
  },
  {
    id: 'svanir_shaman',
    name: 'Svanir Shaman Chief',
    map: 'Wayfarer Foothills',
    waypoint: 'Crossroads Haven',
    waypointCode: '[&BNYAAAA=]',
    spawnTimes: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    duration: 15,
    rewards: ['1 Gold', 'Rare Gear'],
    difficulty: 'easy',
  },
  {
    id: 'fire_elemental',
    name: 'Fire Elemental',
    map: 'Metrica Province',
    waypoint: 'Thaumanova Reactor',
    waypointCode: '[&BM0CAAA=]',
    spawnTimes: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22],
    duration: 15,
    rewards: ['1 Gold', 'Rare Gear'],
    difficulty: 'easy',
  },
  {
    id: 'great_jungle_wurm',
    name: 'Great Jungle Wurm',
    map: 'Caledon Forest',
    waypoint: 'Wychmire Swamp',
    waypointCode: '[&BEIAAAA=]',
    spawnTimes: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    duration: 15,
    rewards: ['1 Gold', 'Rare Gear'],
    difficulty: 'easy',
  },
  {
    id: 'shadow_behemoth',
    name: 'Shadow Behemoth',
    map: 'Queensdale',
    waypoint: 'Godslost Swamp',
    waypointCode: '[&BH4AAAA=]',
    spawnTimes: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    duration: 15,
    rewards: ['1 Gold', 'Rare Gear'],
    difficulty: 'easy',
  },
  {
    id: 'modniir_ulgoth',
    name: 'Modniir Ulgoth',
    map: 'Harathi Hinterlands',
    waypoint: 'Modniir Gorge',
    waypointCode: '[&BLMBAAA=]',
    spawnTimes: [1, 4, 7, 10, 13, 16, 19, 22],
    duration: 15,
    rewards: ['1-2 Gold', 'Rare Gear'],
    difficulty: 'medium',
  },
  {
    id: 'megadestroyer',
    name: 'Megadestroyer',
    map: 'Mount Maelstrom',
    waypoint: 'Burial Cavern',
    waypointCode: '[&BKYBAAA=]',
    spawnTimes: [2, 5, 8, 11, 14, 17, 20, 23],
    duration: 20,
    rewards: ['1-2 Gold', 'Exotic Chance', 'Rare Gear'],
    difficulty: 'medium',
  },
  {
    id: 'tequatl',
    name: 'Tequatl the Sunless',
    map: 'Sparkfly Fen',
    waypoint: 'Splintered Coast',
    waypointCode: '[&BNABAAA=]',
    spawnTimes: [0, 3, 7, 11, 16, 19],
    duration: 30,
    rewards: ['2-5 Gold', 'Ascended Weapon Box', 'Tequatl Hoard'],
    difficulty: 'hard',
  },
  {
    id: 'karka_queen',
    name: 'Karka Queen',
    map: 'Southsun Cove',
    waypoint: 'Pearl Islet',
    waypointCode: '[&BN8EAAA=]',
    spawnTimes: [2, 10, 18],
    duration: 30,
    rewards: ['2-3 Gold', 'Exotic Gear', 'Karka Shell'],
    difficulty: 'hard',
  },
];

export function getNextSpawn(boss: WorldBoss): Date {
  const now = new Date();
  const currentUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes()
    )
  );

  const currentHour = currentUTC.getUTCHours();
  const currentMinute = currentUTC.getUTCMinutes();

  // Find next spawn time
  for (const spawnHour of boss.spawnTimes) {
    if (
      spawnHour > currentHour ||
      (spawnHour === currentHour && currentMinute < 0)
    ) {
      const nextSpawn = new Date(currentUTC);
      nextSpawn.setUTCHours(spawnHour, 0, 0, 0);
      return nextSpawn;
    }
  }

  // If no spawn today, get first spawn tomorrow
  const nextSpawn = new Date(currentUTC);
  nextSpawn.setUTCDate(nextSpawn.getUTCDate() + 1);
  nextSpawn.setUTCHours(boss.spawnTimes[0], 0, 0, 0);
  return nextSpawn;
}

export function isActive(boss: WorldBoss): boolean {
  const now = new Date();
  const currentUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours(),
      now.getUTCMinutes()
    )
  );

  const currentHour = currentUTC.getUTCHours();
  const currentMinute = currentUTC.getUTCMinutes();

  for (const spawnHour of boss.spawnTimes) {
    if (
      currentHour === spawnHour &&
      currentMinute < boss.duration
    ) {
      return true;
    }
  }

  return false;
}

export function getTimeUntil(targetDate: Date): string {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff < 0) return 'Now!';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

export function getUpcomingBosses(limit: number = 5): UpcomingBoss[] {
  const upcoming = WORLD_BOSSES.map((boss) => ({
    boss,
    nextSpawn: getNextSpawn(boss),
    timeUntil: getTimeUntil(getNextSpawn(boss)),
    isActive: isActive(boss),
  }))
    .sort((a, b) => a.nextSpawn.getTime() - b.nextSpawn.getTime())
    .slice(0, limit);

  return upcoming;
}

export function getDifficultyColor(difficulty: WorldBoss['difficulty']): string {
  const colors = {
    easy: 'text-green-400',
    medium: 'text-yellow-400',
    hard: 'text-red-400',
  };
  return colors[difficulty];
}

export function getDifficultyBadge(difficulty: WorldBoss['difficulty']): string {
  const badges = {
    easy: 'bg-green-500/20 text-green-400 border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return badges[difficulty];
}
