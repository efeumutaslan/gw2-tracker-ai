'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  CheckCircle2,
  Flame,
  Calendar,
  Trophy,
  Star,
  Flag,
  BarChart3,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { QuestStats as QuestStatsType, CategoryStats } from '@/lib/utils/questStats';

interface QuestStatsProps {
  stats: QuestStatsType;
  completionTrend: { date: string; count: number }[];
}

export function QuestStats({ stats, completionTrend }: QuestStatsProps) {
  const maxTrendCount = Math.max(...completionTrend.map((t) => t.count), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          label="Total Quests"
          value={stats.totalQuests}
          color="text-primary-400"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completedQuests}
          subtitle={`${stats.completionRate.toFixed(0)}% completion`}
          color="text-green-400"
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={stats.currentStreak}
          subtitle={`${stats.longestStreak} longest`}
          color="text-orange-400"
          delay={0.2}
        />
        <StatCard
          icon={Star}
          label="Favorites"
          value={stats.favoriteCount}
          subtitle={`${stats.highPriorityCount} high priority`}
          color="text-primary-400"
          delay={0.3}
        />
      </div>

      {/* Time Period Stats */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-gray-100">Completion Activity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActivityCard
            label="Today"
            value={stats.completedToday}
            icon="📅"
            delay={0}
          />
          <ActivityCard
            label="This Week"
            value={stats.completedThisWeek}
            icon="📊"
            delay={0.1}
          />
          <ActivityCard
            label="This Month"
            value={stats.completedThisMonth}
            icon="📈"
            delay={0.2}
          />
        </div>
      </Card>

      {/* Completion Trend Chart */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-gray-100">7-Day Completion Trend</h2>
        </div>

        <div className="flex items-end justify-between gap-2 h-48 mb-2">
          {completionTrend.map((item, index) => {
            const height = maxTrendCount > 0 ? (item.count / maxTrendCount) * 100 : 0;

            return (
              <motion.div
                key={item.date}
                className="flex-1 flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative w-full flex items-end justify-center h-40">
                  <motion.div
                    className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg relative group cursor-pointer"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(height, 5)}%` }}
                    transition={{ delay: 0.2 + index * 0.05, duration: 0.5 }}
                  >
                    {item.count > 0 && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-bold text-primary-300 bg-dark-800/90 px-2 py-1 rounded whitespace-nowrap">
                          {item.count} quest{item.count !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </motion.div>
                </div>
                <span className="text-xs text-gray-400 text-center">{item.date}</span>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Category Breakdown */}
      <Card className="glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="w-6 h-6 text-primary-400" />
          <h2 className="text-xl font-bold text-gray-100">Top Categories</h2>
        </div>

        <div className="space-y-3">
          {stats.categoryBreakdown.slice(0, 5).map((category, index) => (
            <CategoryProgressBar
              key={category.category}
              category={category}
              delay={index * 0.1}
            />
          ))}

          {stats.categoryBreakdown.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-400">No quest data yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Add some quests to see category breakdown
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Completions */}
      {stats.recentCompletions.length > 0 && (
        <Card className="glass p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-primary-400" />
            <h2 className="text-xl font-bold text-gray-100">Recent Completions</h2>
          </div>

          <div className="space-y-2">
            {stats.recentCompletions.map((quest, index) => (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 bg-dark-700/30 border border-dark-600/50 rounded-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <h3 className="font-medium text-gray-200 truncate">{quest.name}</h3>
                      {quest.priority === 'high' && (
                        <Flag className="w-3 h-3 text-red-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                      <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">
                        {quest.category}
                      </span>
                      <span>
                        {new Date(quest.completedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  subtitle?: string;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, subtitle, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass hover:border-primary-500/50 transition-all p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </Card>
    </motion.div>
  );
}

interface ActivityCardProps {
  label: string;
  value: number;
  icon: string;
  delay: number;
}

function ActivityCard({ label, value, icon, delay }: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className="p-4 bg-dark-700/30 border border-dark-600 rounded-lg text-center hover:border-primary-500/50 transition-all"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{label}</p>
    </motion.div>
  );
}

interface CategoryProgressBarProps {
  category: CategoryStats;
  delay: number;
}

function CategoryProgressBar({ category, delay }: CategoryProgressBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-300 font-medium">{category.category}</span>
        <span className="text-gray-400">
          {category.completed} / {category.total}
          <span className="text-gray-500 ml-2">
            ({category.completionRate.toFixed(0)}%)
          </span>
        </span>
      </div>
      <div className="h-2 bg-dark-700/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${category.completionRate}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}
