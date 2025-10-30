'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { FavoriteQuests } from '@/components/dashboard/FavoriteQuests';
import { Spinner } from '@/components/ui/Spinner';
import { Scroll, CheckCircle2, TrendingUp, Swords } from 'lucide-react';

interface Stats {
  totalQuests: number;
  completedToday: number;
  completedWeek: number;
  totalCharacters: number;
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  totalDaysActive: number;
}

interface Activity {
  quest: string;
  completedAt: Date;
  goldEarned?: string;
  timeSpent?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [favoriteQuests, setFavoriteQuests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [questsRes, charactersRes, streakRes] = await Promise.all([
          fetch('/api/quests'),
          fetch('/api/characters'),
          fetch('/api/streak'),
        ]);

        const questsData = await questsRes.json();
        const charactersData = await charactersRes.json();
        const streakDataRes = await streakRes.json();

        const quests = questsData.quests || [];
        const characters = charactersData.characters || [];

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const completedToday = quests.filter((q: any) => {
          if (!q.isCompleted || !q.completedAt) return false;
          const completedDate = new Date(q.completedAt);
          return completedDate >= today;
        }).length;

        const completedWeek = quests.filter((q: any) => {
          if (!q.isCompleted || !q.completedAt) return false;
          const completedDate = new Date(q.completedAt);
          return completedDate >= weekAgo;
        }).length;

        setStats({
          totalQuests: quests.length,
          completedToday,
          completedWeek,
          totalCharacters: characters.length,
        });

        // Extract recent activities
        const activities = quests
          .filter((q: any) => q.isCompleted && q.completedAt)
          .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
          .slice(0, 5)
          .map((q: any) => ({
            quest: q.name,
            completedAt: new Date(q.completedAt),
            goldEarned: q.goldEarned,
            timeSpent: q.timeSpent,
          }));

        setRecentActivities(activities);

        // Extract favorite quests
        const favorites = quests
          .filter((q: any) => q.isFavorite)
          .sort((a: any, b: any) => {
            // Sort by: incomplete first, then by priority
            if (a.isCompleted !== b.isCompleted) {
              return a.isCompleted ? 1 : -1;
            }
            const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
            const priorityA = priorityOrder[a.priority || 'medium'];
            const priorityB = priorityOrder[b.priority || 'medium'];
            return priorityA - priorityB;
          })
          .slice(0, 8); // Show max 8 favorites

        setFavoriteQuests(favorites);

        if (streakDataRes.success) {
          setStreakData(streakDataRes.streak);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  // Stagger animation for stats grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <motion.div
        className="flex items-center gap-3"
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: 48 }}
          transition={{ duration: 0.8 }}
        />
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
          Command Center
        </h1>
      </motion.div>

      {/* Streak Card - Full Width */}
      {streakData && (
        <StreakCard
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
          totalDaysActive={streakData.totalDaysActive}
        />
      )}

      {/* Stats Grid */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <StatsCard
          title="Total Quests"
          value={stats?.totalQuests || 0}
          icon={Scroll}
          description="Active quest templates"
          variant="default"
        />
        <StatsCard
          title="Completed Today"
          value={stats?.completedToday || 0}
          icon={CheckCircle2}
          description="Quests done today"
          variant="exotic"
        />
        <StatsCard
          title="Completed This Week"
          value={stats?.completedWeek || 0}
          icon={TrendingUp}
          description="Quests done in 7 days"
          variant="ascended"
        />
        <StatsCard
          title="Characters"
          value={stats?.totalCharacters || 0}
          icon={Swords}
          description="Synced from GW2"
          variant="legendary"
        />
      </motion.div>

      {/* Content Grid - Recent Activity & Favorite Quests */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        {recentActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <RecentActivity activities={recentActivities} />
          </motion.div>
        )}

        {/* Favorite Quests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <FavoriteQuests quests={favoriteQuests} onRefresh={handleRefresh} />
        </motion.div>
      </div>
    </div>
  );
}
