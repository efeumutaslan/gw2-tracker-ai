export type SortOption = 'name' | 'dateAdded' | 'category' | 'dateCompleted' | 'priority';
export type FilterStatus = 'all' | 'active' | 'completed';
export type FilterPriority = 'all' | 'high' | 'medium' | 'low';
export type FilterFavorite = 'all' | 'favorites' | 'non-favorites';

export interface QuestFilters {
  searchQuery: string;
  category: string;
  status: FilterStatus;
  priority: FilterPriority;
  favorite: FilterFavorite;
  sortBy: SortOption;
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

  // Apply sorting
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);

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
