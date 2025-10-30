export interface DailyStats {
  date: string;
  questsCompleted: number;
  goldEarned: number;
  timeSpent: number; // in minutes
}

export interface WeeklyAnalytics {
  totalQuests: number;
  totalGold: number;
  totalTime: number;
  averageQuestsPerDay: number;
  averageGoldPerDay: number;
  averageTimePerDay: number;
  mostProductiveDay: string;
  dailyStats: DailyStats[];
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
  goldEarned: number;
}

export function calculateDailyStats(quests: any[]): DailyStats[] {
  const statsMap = new Map<string, DailyStats>();

  // Get last 7 days
  const dates: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
    statsMap.set(dateStr, {
      date: dateStr,
      questsCompleted: 0,
      goldEarned: 0,
      timeSpent: 0,
    });
  }

  // Aggregate quest data
  quests.forEach((quest) => {
    if (!quest.isCompleted || !quest.completedAt) return;

    const completedDate = new Date(quest.completedAt);
    completedDate.setHours(0, 0, 0, 0);
    const dateStr = completedDate.toISOString().split('T')[0];

    const stats = statsMap.get(dateStr);
    if (stats) {
      stats.questsCompleted++;

      // Parse gold earned
      if (quest.goldEarned) {
        const goldMatch = quest.goldEarned.match(/(\d+)/);
        if (goldMatch) {
          stats.goldEarned += parseInt(goldMatch[1]);
        }
      }

      // Add time spent
      if (quest.timeSpent) {
        stats.timeSpent += quest.timeSpent;
      }
    }
  });

  return Array.from(statsMap.values());
}

export function calculateWeeklyAnalytics(quests: any[]): WeeklyAnalytics {
  const dailyStats = calculateDailyStats(quests);

  const totalQuests = dailyStats.reduce((sum, day) => sum + day.questsCompleted, 0);
  const totalGold = dailyStats.reduce((sum, day) => sum + day.goldEarned, 0);
  const totalTime = dailyStats.reduce((sum, day) => sum + day.timeSpent, 0);

  const activeDays = dailyStats.filter((day) => day.questsCompleted > 0).length;

  const mostProductiveDay =
    dailyStats.reduce((max, day) =>
      day.questsCompleted > max.questsCompleted ? day : max
    ).date;

  return {
    totalQuests,
    totalGold,
    totalTime,
    averageQuestsPerDay: activeDays > 0 ? totalQuests / activeDays : 0,
    averageGoldPerDay: activeDays > 0 ? totalGold / activeDays : 0,
    averageTimePerDay: activeDays > 0 ? totalTime / activeDays : 0,
    mostProductiveDay,
    dailyStats,
  };
}

export function calculateCategoryBreakdown(quests: any[]): CategoryBreakdown[] {
  const categoryMap = new Map<string, { count: number; gold: number }>();
  const completedQuests = quests.filter((q) => q.isCompleted);

  completedQuests.forEach((quest) => {
    const category = quest.category || 'Uncategorized';
    const current = categoryMap.get(category) || { count: 0, gold: 0 };

    current.count++;

    if (quest.goldEarned) {
      const goldMatch = quest.goldEarned.match(/(\d+)/);
      if (goldMatch) {
        current.gold += parseInt(goldMatch[1]);
      }
    }

    categoryMap.set(category, current);
  });

  const total = completedQuests.length;

  return Array.from(categoryMap.entries())
    .map(([category, data]) => ({
      category,
      count: data.count,
      percentage: (data.count / total) * 100,
      goldEarned: data.gold,
    }))
    .sort((a, b) => b.count - a.count);
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
}

export function formatGold(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}k`;
  }
  return amount.toString();
}
