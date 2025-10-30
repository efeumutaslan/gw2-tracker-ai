'use client';

import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, X, Star, Flag } from 'lucide-react';
import { QuestFilters, SortOption, FilterStatus, FilterPriority, FilterFavorite } from '@/lib/utils/questFilters';

interface FilterBarProps {
  filters: QuestFilters;
  categories: string[];
  questCounts: {
    total: number;
    active: number;
    completed: number;
  };
  onFiltersChange: (filters: QuestFilters) => void;
}

export function FilterBar({ filters, categories, questCounts, onFiltersChange }: FilterBarProps) {
  const handleSearchChange = (query: string) => {
    onFiltersChange({ ...filters, searchQuery: query });
  };

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleStatusChange = (status: FilterStatus) => {
    onFiltersChange({ ...filters, status });
  };

  const handlePriorityChange = (priority: FilterPriority) => {
    onFiltersChange({ ...filters, priority });
  };

  const handleFavoriteChange = (favorite: FilterFavorite) => {
    onFiltersChange({ ...filters, favorite });
  };

  const handleSortChange = (sortBy: SortOption) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      searchQuery: '',
      category: 'all',
      status: 'all',
      priority: 'all',
      favorite: 'all',
      sortBy: 'dateAdded',
    });
  };

  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.favorite !== 'all' ||
    filters.sortBy !== 'dateAdded';

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search quests by name, description, or category..."
          value={filters.searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg
                   text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2
                   focus:ring-primary-500/50 focus:border-primary-500 transition-all"
        />
      </div>

      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Row 1: Status, Category, Priority, Favorite */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary-400" />
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value as FilterStatus)}
              className="px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg
                       text-gray-200 text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500/50 focus:border-primary-500 transition-all
                       cursor-pointer hover:bg-dark-600/50"
            >
              <option value="all">All ({questCounts.total})</option>
              <option value="active">Active ({questCounts.active})</option>
              <option value="completed">Done ({questCounts.completed})</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg
                     text-gray-200 text-sm focus:outline-none focus:ring-2
                     focus:ring-primary-500/50 focus:border-primary-500 transition-all
                     cursor-pointer hover:bg-dark-600/50"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-primary-400" />
            <select
              value={filters.priority}
              onChange={(e) => handlePriorityChange(e.target.value as FilterPriority)}
              className="px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg
                       text-gray-200 text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500/50 focus:border-primary-500 transition-all
                       cursor-pointer hover:bg-dark-600/50"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Favorite Filter */}
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-primary-400" />
            <select
              value={filters.favorite}
              onChange={(e) => handleFavoriteChange(e.target.value as FilterFavorite)}
              className="px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg
                       text-gray-200 text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500/50 focus:border-primary-500 transition-all
                       cursor-pointer hover:bg-dark-600/50"
            >
              <option value="all">All</option>
              <option value="favorites">⭐ Favorites</option>
              <option value="non-favorites">Regular</option>
            </select>
          </div>
        </div>

        {/* Row 2: Sort & Clear */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-primary-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="px-4 py-2 bg-dark-700/50 border border-dark-600 rounded-lg
                       text-gray-200 text-sm focus:outline-none focus:ring-2
                       focus:ring-primary-500/50 focus:border-primary-500 transition-all
                       cursor-pointer hover:bg-dark-600/50"
            >
              <option value="dateAdded">Date Added</option>
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="dateCompleted">Date Completed</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-dark-700/50 border border-dark-600
                       rounded-lg text-gray-400 text-sm hover:bg-dark-600/50 hover:text-gray-200
                       transition-all group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Clear
            </motion.button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 text-sm"
        >
          {filters.searchQuery && (
            <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-300">
              Search: &quot;{filters.searchQuery}&quot;
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="px-3 py-1 bg-exotic/20 border border-exotic/30 rounded-full text-exotic">
              Category: {filters.category}
            </span>
          )}
          {filters.status !== 'all' && (
            <span className="px-3 py-1 bg-ascended/20 border border-ascended/30 rounded-full text-ascended">
              Status: {filters.status}
            </span>
          )}
          {filters.priority !== 'all' && (
            <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300">
              Priority: {filters.priority}
            </span>
          )}
          {filters.favorite !== 'all' && (
            <span className="px-3 py-1 bg-primary-500/20 border border-primary-500/30 rounded-full text-primary-300">
              {filters.favorite === 'favorites' ? 'Favorites Only' : 'Non-Favorites'}
            </span>
          )}
          {filters.sortBy !== 'dateAdded' && (
            <span className="px-3 py-1 bg-rare/20 border border-rare/30 rounded-full text-rare">
              Sort: {filters.sortBy === 'name' ? 'Name' : filters.sortBy === 'category' ? 'Category' : filters.sortBy === 'dateCompleted' ? 'Date Completed' : 'Priority'}
            </span>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
