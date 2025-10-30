'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Plus, Filter, Award, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { ACHIEVEMENT_TEMPLATES, ACHIEVEMENT_CATEGORIES } from '@/lib/data/achievementTemplates';
import { useToast } from '@/components/ui/Toast';

interface Achievement {
  id: string;
  name: string;
  description: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  isCompleted: boolean;
  currentProgress: number;
  totalRequired: number;
  rewardPoints: number;
  rewardTitle?: string;
  isDaily?: boolean;
  isRepeatable?: boolean;
  completedAt?: string | Date | null;
  icon?: string;
}

type FilterStatus = 'all' | 'completed' | 'in-progress';

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [showTemplates, setShowTemplates] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements');
      const data = await response.json();

      if (data.achievements) {
        setAchievements(data.achievements);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      showToast('error', 'Failed to load achievements');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (id: string, progress: number) => {
    try {
      const response = await fetch('/api/achievements/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievementId: id, progress }),
      });

      const data = await response.json();

      if (data.success) {
        setAchievements((prev) =>
          prev.map((a) => (a.id === id ? data.achievement : a))
        );

        if (data.achievement.isCompleted) {
          showToast('success', `Achievement completed: ${data.achievement.name}!`);
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
      showToast('error', 'Failed to update progress');
    }
  };

  const handleAddFromTemplate = async (template: typeof ACHIEVEMENT_TEMPLATES[0]) => {
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      const data = await response.json();

      if (data.success) {
        setAchievements((prev) => [{ ...data.achievement, icon: template.icon }, ...prev]);
        showToast('success', 'Achievement added!');
        setShowTemplates(false);
      }
    } catch (error) {
      console.error('Failed to add achievement:', error);
      showToast('error', 'Failed to add achievement');
    }
  };

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    const categoryMatch =
      selectedCategory === 'All' || achievement.category === selectedCategory;

    const statusMatch =
      filterStatus === 'all' ||
      (filterStatus === 'completed' && achievement.isCompleted) ||
      (filterStatus === 'in-progress' && !achievement.isCompleted);

    return categoryMatch && statusMatch;
  });

  // Calculate stats
  const totalAchievements = achievements.length;
  const completedAchievements = achievements.filter((a) => a.isCompleted).length;
  const totalPoints = achievements.reduce(
    (sum, a) => sum + (a.isCompleted ? a.rewardPoints : 0),
    0
  );
  const completionRate =
    totalAchievements > 0 ? (completedAchievements / totalAchievements) * 100 : 0;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            Achievements
          </h1>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Trophy}
          label="Total Achievements"
          value={totalAchievements}
          color="text-primary-400"
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={completedAchievements}
          subtitle={`${completionRate.toFixed(0)}% completion`}
          color="text-green-400"
          delay={0.1}
        />
        <StatCard
          icon={Award}
          label="Achievement Points"
          value={totalPoints}
          color="text-legendary"
          delay={0.2}
        />
        <StatCard
          icon={Filter}
          label="Categories"
          value={new Set(achievements.map((a) => a.category)).size}
          color="text-blue-400"
          delay={0.3}
        />
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-100">Achievement Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
              {ACHIEVEMENT_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleAddFromTemplate(template)}
                  className="text-left p-4 bg-dark-700/50 hover:bg-dark-600 border border-dark-600 hover:border-primary-500/50 rounded-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{template.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-100 truncate">{template.name}</h3>
                      <span className="text-xs text-gray-400">{template.category}</span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        template.tier === 'platinum'
                          ? 'bg-purple-500/20 text-purple-300'
                          : template.tier === 'gold'
                          ? 'bg-legendary/20 text-legendary'
                          : template.tier === 'silver'
                          ? 'bg-gray-400/20 text-gray-300'
                          : 'bg-amber-700/20 text-amber-600'
                      }`}
                    >
                      {template.tier}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{template.description}</p>
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="glass p-4">
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium text-gray-300">Category:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {ACHIEVEMENT_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600 hover:text-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-gray-300">Status:</span>
              <div className="flex gap-2">
                {(['all', 'completed', 'in-progress'] as FilterStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      filterStatus === status
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600 hover:text-gray-200'
                    }`}
                  >
                    {status === 'all'
                      ? 'All'
                      : status === 'completed'
                      ? 'Completed'
                      : 'In Progress'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <Card className="glass p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Achievements Found</h3>
          <p className="text-gray-500 mb-4">
            {totalAchievements === 0
              ? 'Start tracking your achievements by adding one from templates'
              : 'No achievements match your current filters'}
          </p>
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Browse Templates
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAchievements.map((achievement, index) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onProgressUpdate={handleProgressUpdate}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
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
      <Card className="glass p-6 hover:border-primary-500/50 transition-all">
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
