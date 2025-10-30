export interface QuestStats {
  totalQuests: number;
  completedQuests: number;
  activeQuests: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: number;
  completedThisWeek: number;
  completedThisMonth: number;
  categoryBreakdown: CategoryStats[];
  recentCompletions: QuestCompletion[];
  favoriteCount: number;
  highPriorityCount: number;
}

export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
  completionRate: number;
}

export interface QuestCompletion {
  id: string;
  name: string;
  category: string;
  completedAt: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface Quest {
  id: string;
  name: string;
  category: string;
  isCompleted: boolean;
  isFavorite?: boolean;
  priority?: 'low' | 'medium' | 'high';
  completedAt?: string | Date | null;
  createdAt?: string | Date;
}

export function calculateQuestStats(quests: Quest[]): QuestStats {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const completedQuests = quests.filter((q) => q.isCompleted);
  const activeQuests = quests.filter((q) => !q.isCompleted);

  // Calculate completion counts by time period
  const completedToday = completedQuests.filter((q) => {
    if (!q.completedAt) return false;
    const completedDate = new Date(q.completedAt);
    return completedDate >= startOfToday;
  }).length;

  const completedThisWeek = completedQuests.filter((q) => {
    if (!q.completedAt) return false;
    const completedDate = new Date(q.completedAt);
    return completedDate >= startOfWeek;
  }).length;

  const completedThisMonth = completedQuests.filter((q) => {
    if (!q.completedAt) return false;
    const completedDate = new Date(q.completedAt);
    return completedDate >= startOfMonth;
  }).length;

  // Calculate streaks
  const { currentStreak, longestStreak } = calculateStreaks(completedQuests);

  // Calculate category breakdown
  const categoryMap = new Map<string, { total: number; completed: number }>();

  quests.forEach((quest) => {
    const category = quest.category || 'Uncategorized';
    const stats = categoryMap.get(category) || { total: 0, completed: 0 };
    stats.total += 1;
    if (quest.isCompleted) {
      stats.completed += 1;
    }
    categoryMap.set(category, stats);
  });

  const categoryBreakdown: CategoryStats[] = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }))
    .sort((a, b) => b.completed - a.completed);

  // Get recent completions (last 10)
  const recentCompletions: QuestCompletion[] = completedQuests
    .filter((q) => q.completedAt)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt!).getTime();
      const dateB = new Date(b.completedAt!).getTime();
      return dateB - dateA;
    })
    .slice(0, 10)
    .map((q) => ({
      id: q.id,
      name: q.name,
      category: q.category || 'Uncategorized',
      completedAt: new Date(q.completedAt!),
      priority: q.priority,
    }));

  // Count favorites and high priority
  const favoriteCount = quests.filter((q) => q.isFavorite).length;
  const highPriorityCount = quests.filter((q) => q.priority === 'high').length;

  return {
    totalQuests: quests.length,
    completedQuests: completedQuests.length,
    activeQuests: activeQuests.length,
    completionRate: quests.length > 0 ? (completedQuests.length / quests.length) * 100 : 0,
    currentStreak,
    longestStreak,
    completedToday,
    completedThisWeek,
    completedThisMonth,
    categoryBreakdown,
    recentCompletions,
    favoriteCount,
    highPriorityCount,
  };
}

function calculateStreaks(completedQuests: Quest[]): {
  currentStreak: number;
  longestStreak: number;
} {
  if (completedQuests.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Get all completion dates sorted
  const completionDates = completedQuests
    .filter((q) => q.completedAt)
    .map((q) => {
      const date = new Date(q.completedAt!);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    })
    .sort((a, b) => a.getTime() - b.getTime());

  if (completionDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Remove duplicates (same day completions)
  const uniqueDates = Array.from(
    new Set(completionDates.map((d) => d.getTime()))
  ).map((t) => new Date(t));

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if most recent completion was today or yesterday
  const mostRecent = uniqueDates[uniqueDates.length - 1];
  if (
    mostRecent.getTime() === today.getTime() ||
    mostRecent.getTime() === yesterday.getTime()
  ) {
    currentStreak = 1;

    // Count backwards from most recent
    for (let i = uniqueDates.length - 2; i >= 0; i--) {
      const diff = Math.floor(
        (uniqueDates[i + 1].getTime() - uniqueDates[i].getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = Math.floor(
      (uniqueDates[i].getTime() - uniqueDates[i - 1].getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  longestStreak = Math.max(longestStreak, tempStreak);

  return { currentStreak, longestStreak };
}

export function getTopCategories(stats: QuestStats, limit: number = 5): CategoryStats[] {
  return stats.categoryBreakdown.slice(0, limit);
}

export function getCompletionTrend(
  quests: Quest[],
  days: number = 7
): { date: string; count: number }[] {
  const now = new Date();
  const trend: { date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = quests.filter((q) => {
      if (!q.isCompleted || !q.completedAt) return false;
      const completedDate = new Date(q.completedAt);
      return completedDate >= date && completedDate < nextDate;
    }).length;

    trend.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count,
    });
  }

  return trend;
}
