'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Target, TrendingUp, Trophy, Coins } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { LegendaryGoalCard } from '@/components/legendary/LegendaryGoalCard';
import { LegendarySelector } from '@/components/legendary/LegendarySelector';
import { NotificationSettings } from '@/components/legendary/NotificationSettings';
import { LegendaryComparisonView } from '@/components/legendary/LegendaryComparisonView';
import { notificationService } from '@/lib/services/notificationService';

interface LegendaryGoal {
  id: string;
  legendaryId: number;
  legendaryName: string;
  legendaryType: string;
  legendaryTier: string;
  targetQuantity: number;
  isCompleted: boolean;
  notes?: string;
  startedAt: string;
  completedAt?: string;
}

export default function LegendaryPage() {
  const [goals, setGoals] = useState<LegendaryGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('/api/legendary-goals');
      if (!response.ok) throw new Error('Failed to fetch goals');

      const data = await response.json();
      setGoals(data);
    } catch (error) {
      showToast('error', 'Failed to load legendary goals');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGoal = async (legendaryId: number, legendaryName: string, legendaryType: string, legendaryTier: string) => {
    try {
      const response = await fetch('/api/legendary-goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          legendaryId,
          legendaryName,
          legendaryType,
          legendaryTier,
          targetQuantity: 1,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create goal');
      }

      showToast('success', `Added ${legendaryName} to your legendary goals!`);
      await fetchGoals();
      setShowSelector(false);
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to add goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`/api/legendary-goals?id=${goalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');

      showToast('success', 'Legendary goal removed');
      await fetchGoals();
    } catch (error) {
      showToast('error', 'Failed to remove goal');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      // Find the goal to get the name
      const goal = goals.find(g => g.id === goalId);

      const response = await fetch('/api/legendary-goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goalId,
          isCompleted: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to complete goal');

      showToast('success', 'Congratulations! Legendary completed!');

      // Send notification
      if (goal) {
        await notificationService.notifyLegendaryComplete(goal.legendaryName);
      }

      await fetchGoals();
    } catch (error) {
      showToast('error', 'Failed to update goal');
    }
  };

  // Calculate stats
  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);
  const totalGoals = goals.length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals.length / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-8 rounded-lg border border-legendary/30">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-legendary/20 rounded-lg border border-legendary/30">
            <Sparkles className="w-8 h-8 text-legendary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-100 tracking-tight">
              Legendary Tracker
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Trophy className="w-4 h-4 text-legendary" />
              <p className="text-gray-400">Track your legendary weapon and armor crafting progress</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Goals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Goals</p>
                  <p className="text-3xl font-bold text-primary-400">{activeGoals.length}</p>
                </div>
                <div className="p-3 bg-primary-500/20 rounded-lg">
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Completed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-legendary/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed</p>
                  <p className="text-3xl font-bold text-legendary">{completedGoals.length}</p>
                </div>
                <div className="p-3 bg-legendary/20 rounded-lg">
                  <Trophy className="w-6 h-6 text-legendary" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Completion Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completion Rate</p>
                  <p className="text-3xl font-bold text-gray-200">{completionRate}%</p>
                </div>
                <div className="p-3 bg-primary-500/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Total Investment (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Est. Investment</p>
                  <p className="text-xl font-bold text-yellow-400">Coming Soon</p>
                </div>
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Coins className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Notification Settings */}
      <NotificationSettings />

      {/* Comparison View - Only show if there are 2+ active goals */}
      {activeGoals.length >= 2 && <LegendaryComparisonView goals={activeGoals} />}

      {/* Add New Goal Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-200">Your Legendary Goals</h2>
        <Button
          onClick={() => setShowSelector(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Legendary Goal
        </Button>
      </div>

      {/* Goals List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Loading your legendary goals...</p>
        </div>
      ) : activeGoals.length === 0 && completedGoals.length === 0 ? (
        <Card className="glass border-primary-500/20">
          <CardBody>
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-legendary mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-bold text-gray-200 mb-2">No Legendary Goals Yet</h3>
              <p className="text-gray-400 mb-6">
                Start tracking your legendary crafting journey by adding your first goal!
              </p>
              <Button
                onClick={() => setShowSelector(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add Your First Legendary
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">In Progress</h3>
              <div className="grid gap-4">
                {activeGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LegendaryGoalCard
                      goal={goal}
                      onDelete={() => handleDeleteGoal(goal.id)}
                      onComplete={() => handleCompleteGoal(goal.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Completed</h3>
              <div className="grid gap-4">
                {completedGoals.map((goal, index) => (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <LegendaryGoalCard
                      goal={goal}
                      onDelete={() => handleDeleteGoal(goal.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Legendary Selector Modal */}
      {showSelector && (
        <LegendarySelector
          onSelect={handleAddGoal}
          onClose={() => setShowSelector(false)}
        />
      )}
    </div>
  );
}
