'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Coins, Target, BarChart3 } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { WeeklyChart } from '@/components/analytics/WeeklyChart';
import { CategoryChart } from '@/components/analytics/CategoryChart';
import { QuestStats } from '@/components/dashboard/QuestStats';
import {
  calculateWeeklyAnalytics,
  calculateCategoryBreakdown,
  formatDuration,
  formatGold,
  type WeeklyAnalytics,
  type CategoryBreakdown,
} from '@/lib/services/analyticsService';
import { QuestStats as QuestStatsType } from '@/lib/utils/questStats';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<WeeklyAnalytics | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [questStats, setQuestStats] = useState<QuestStatsType | null>(null);
  const [completionTrend, setCompletionTrend] = useState<{ date: string; count: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch quest data for weekly analytics
        const questsResponse = await fetch('/api/quests');
        const questsData = await questsResponse.json();
        const quests = questsData.quests || [];

        const weeklyData = calculateWeeklyAnalytics(quests);
        const categoryData = calculateCategoryBreakdown(quests);

        setAnalytics(weeklyData);
        setCategories(categoryData);

        // Fetch quest statistics
        const statsResponse = await fetch('/api/quests/stats');
        const statsData = await statsResponse.json();

        if (statsData.success) {
          setQuestStats(statsData.stats);
          setCompletionTrend(statsData.completionTrend);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const stats = [
    {
      icon: Target,
      label: 'Total Quests',
      value: analytics.totalQuests,
      color: 'text-primary-400',
      description: `${analytics.averageQuestsPerDay.toFixed(1)} per day`,
    },
    {
      icon: Coins,
      label: 'Total Gold',
      value: `${formatGold(analytics.totalGold)}g`,
      color: 'text-legendary',
      description: `${formatGold(Math.round(analytics.averageGoldPerDay))}g per day`,
    },
    {
      icon: Clock,
      label: 'Time Spent',
      value: formatDuration(analytics.totalTime),
      color: 'text-blue-400',
      description: `${formatDuration(analytics.averageTimePerDay)} per day`,
    },
    {
      icon: TrendingUp,
      label: 'Efficiency',
      value: analytics.totalTime > 0
        ? `${(analytics.totalGold / (analytics.totalTime / 60)).toFixed(0)}g/h`
        : '0g/h',
      color: 'text-exotic',
      description: 'Gold per hour',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          Analytics
        </h1>
      </div>

      {/* Quest Completion Statistics */}
      {questStats && completionTrend && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <QuestStats stats={questStats} completionTrend={completionTrend} />
        </motion.div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 pt-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
        <div className="flex items-center gap-2 px-4">
          <Coins className="w-5 h-5 text-legendary" />
          <span className="text-sm font-medium text-gray-400">Gold & Efficiency Analytics</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Card className="glass-hover">
              <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-background-darker`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400">{stat.label}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <WeeklyChart data={analytics.dailyStats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <CategoryChart data={categories} />
        </motion.div>
      </div>

      {/* Insights Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <Card className="glass">
          <CardBody>
            <h3 className="text-lg font-bold text-gray-200 mb-4">
              📊 Weekly Insights
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg bg-background-darker border border-primary-500/20">
                <p className="text-sm text-gray-400 mb-1">Most Productive Day</p>
                <p className="text-xl font-bold text-primary-400">
                  {new Date(analytics.mostProductiveDay).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-background-darker border border-legendary/20">
                <p className="text-sm text-gray-400 mb-1">Top Category</p>
                <p className="text-xl font-bold text-legendary">
                  {categories[0]?.category || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {categories[0]?.count} quests completed
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
