'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History as HistoryIcon, Calendar, TrendingUp, Award, Filter } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { QuestTimeline } from '@/components/history/QuestTimeline';

interface Quest {
  id: string;
  name: string;
  description?: string;
  category: string;
  isCompleted: boolean;
  isFavorite?: boolean;
  priority?: 'low' | 'medium' | 'high';
  completedAt?: string | Date | null;
  createdAt?: string | Date;
  waypointCode?: string;
  estimatedDurationMinutes?: number;
  goldReward?: string;
}

type TimeFilter = 'all' | 'today' | 'week' | 'month' | 'year';

export default function HistoryPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests');
      const data = await response.json();

      if (data.quests) {
        setQuests(data.quests);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredQuests = filterQuestsByTime(quests, timeFilter);
  const completedQuests = filteredQuests.filter((q) => q.isCompleted && q.completedAt);

  // Calculate stats
  const totalCompleted = completedQuests.length;
  const totalGold = completedQuests.reduce((sum, q) => {
    if (!q.goldReward) return sum;
    const match = q.goldReward.match(/(\d+)/);
    return sum + (match ? parseInt(match[1]) : 0);
  }, 0);
  const totalTime = completedQuests.reduce(
    (sum, q) => sum + (q.estimatedDurationMinutes || 0),
    0
  );
  const uniqueCategories = new Set(completedQuests.map((q) => q.category)).size;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          Quest History
        </h1>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={HistoryIcon}
          label="Total Completed"
          value={totalCompleted}
          color="text-primary-400"
          delay={0}
        />
        <StatCard
          icon={TrendingUp}
          label="Total Gold"
          value={`${totalGold}g`}
          color="text-legendary"
          delay={0.1}
        />
        <StatCard
          icon={Calendar}
          label="Total Time"
          value={formatDuration(totalTime)}
          color="text-blue-400"
          delay={0.2}
        />
        <StatCard
          icon={Award}
          label="Categories"
          value={uniqueCategories}
          color="text-exotic"
          delay={0.3}
        />
      </div>

      {/* Time Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-primary-400" />
              <span className="text-sm font-medium text-gray-300">Time Period:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['all', 'today', 'week', 'month', 'year'] as TimeFilter[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    timeFilter === filter
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600 hover:text-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
            {timeFilter !== 'all' && (
              <button
                onClick={() => setTimeFilter('all')}
                className="ml-auto text-sm text-gray-400 hover:text-primary-400 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <QuestTimeline quests={filteredQuests} />
      </motion.div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass p-6 hover:border-primary-500/50 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </Card>
    </motion.div>
  );
}

function filterQuestsByTime(quests: Quest[], filter: TimeFilter): Quest[] {
  if (filter === 'all') return quests;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let startDate: Date;

  switch (filter) {
    case 'today':
      startDate = startOfToday;
      break;
    case 'week':
      startDate = new Date(startOfToday);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(startOfToday);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'year':
      startDate = new Date(startOfToday);
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      return quests;
  }

  return quests.filter((quest) => {
    if (!quest.completedAt) return false;
    const completedDate = new Date(quest.completedAt);
    return completedDate >= startDate;
  });
}

function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
