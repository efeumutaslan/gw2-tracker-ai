export type SortOption = 'name' | 'dateAdded' | 'category' | 'dateCompleted' | 'priority' | 'reward';
export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterPriority = 'all' | 'high' | 'medium' | 'low';
export type FilterFavorite = 'all' | 'favorites' | 'non-favorites';
export type FilterReward = 'all' | 'gold' | 'items' | 'high-value' | 'no-reward';

export interface QuestFilters {
  searchQuery: string;
  category: string;
  status: FilterStatus;
  priority: FilterPriority;
  favorite: FilterFavorite;
  rewardType: FilterReward;
  sortBy: SortOption;
}

// Helper function to extract reward info from quest
function getRewardInfo(quest: any) {
  const notes = quest.notes || (quest as any).questTemplate?.notes || '';
  const rewardMatch = notes.match(/^Reward: (.+?)(?:\n\n|$)/)?.[1];

  if (!rewardMatch) return { hasReward: false, hasGold: false, hasItems: false, goldValue: 0 };

  const hasGold = /\d+g|\d+\s*gold/i.test(rewardMatch);
  const hasItems = /chest|box|key|bag|container|item|material|ore|wood|leather/i.test(rewardMatch);

  // Extract gold value for high-value filtering
  let goldValue = 0;
  const goldMatch = rewardMatch.match(/(\d+)g/i);
  if (goldMatch) {
    goldValue = parseInt(goldMatch[1]);
  }

  return { hasReward: true, hasGold, hasItems, goldValue };
}

export function filterAndSortQuests(quests: any[], filters: QuestFilters): any[] {
  let filtered = [...quests];

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (quest) =>
        quest.name.toLowerCase().includes(query) ||
        quest.description?.toLowerCase().includes(query) ||
        quest.category?.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(
      (quest) => quest.category === filters.category || (!quest.category && filters.category === 'Uncategorized')
    );
  }

  // Apply status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter((quest) =>
      filters.status === 'completed' ? quest.isCompleted : !quest.isCompleted
    );
  }

  // Apply priority filter
  if (filters.priority !== 'all') {
    filtered = filtered.filter((quest) => quest.priority === filters.priority);
  }

  // Apply favorite filter
  if (filters.favorite !== 'all') {
    filtered = filtered.filter((quest) =>
      filters.favorite === 'favorites' ? quest.isFavorite : !quest.isFavorite
    );
  }

  // Apply reward filter
  if (filters.rewardType !== 'all') {
    filtered = filtered.filter((quest) => {
      const rewardInfo = getRewardInfo(quest);

      switch (filters.rewardType) {
        case 'gold':
          return rewardInfo.hasGold;
        case 'items':
          return rewardInfo.hasItems;
        case 'high-value':
          return rewardInfo.goldValue >= 2; // 2g or more
        case 'no-reward':
          return !rewardInfo.hasReward;
        default:
          return true;
      }
    });
  }

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);

      case 'reward':
        const rewardA = getRewardInfo(a);
        const rewardB = getRewardInfo(b);
        // Sort by gold value descending
        return rewardB.goldValue - rewardA.goldValue;

      case 'dateAdded':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      case 'category':
        const catA = a.category || 'Uncategorized';
        const catB = b.category || 'Uncategorized';
        return catA.localeCompare(catB);

      case 'dateCompleted':
        if (!a.completedAt && !b.completedAt) return 0;
        if (!a.completedAt) return 1;
        if (!b.completedAt) return -1;
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();

      case 'priority':
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        const priorityA = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 1;
        const priorityB = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 1;
        return priorityA - priorityB;

      default:
        return 0;
    }
  });

  return filtered;
}

export function getUniqueCategories(quests: any[]): string[] {
  const categories = new Set<string>();

  quests.forEach((quest) => {
    if (quest.category) {
      categories.add(quest.category);
    } else {
      categories.add('Uncategorized');
    }
  });

  return Array.from(categories).sort();
}

export function getQuestCounts(quests: any[]): {
  total: number;
  active: number;
  completed: number;
} {
  return {
    total: quests.length,
    active: quests.filter((q) => !q.isCompleted).length,
    completed: quests.filter((q) => q.isCompleted).length,
  };
}
