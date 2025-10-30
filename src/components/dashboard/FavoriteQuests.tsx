'use client';

import { motion } from 'framer-motion';
import { Star, Flag, CheckCircle2, Circle, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useState } from 'react';
import { useToast } from '@/components/ui/Toast';

interface Quest {
  id: string;
  name: string;
  category: string;
  isCompleted: boolean;
  priority?: 'low' | 'medium' | 'high';
  estimatedDurationMinutes?: number;
  waypointCode?: string;
  nextResetAt: Date;
}

interface FavoriteQuestsProps {
  quests: Quest[];
  onRefresh: () => void;
}

export function FavoriteQuests({ quests, onRefresh }: FavoriteQuestsProps) {
  const { showToast } = useToast();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const handleQuickComplete = async (questId: string) => {
    setProcessingIds((prev) => new Set(prev).add(questId));

    try {
      const response = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quest');
      }

      if (data.quest?.isCompleted) {
        showToast('success', 'Quest completed! 🎉');
      } else {
        showToast('success', 'Quest marked as incomplete');
      }

      onRefresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update quest');
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questId);
        return newSet;
      });
    }
  };

  const priorityColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-gray-400',
  };

  const activeQuests = quests.filter((q) => !q.isCompleted);
  const completedQuests = quests.filter((q) => q.isCompleted);

  if (quests.length === 0) {
    return (
      <Card className="glass">
        <div className="flex items-center gap-3 mb-4">
          <Star className="w-6 h-6 text-primary-400 fill-current" />
          <h2 className="text-xl font-bold text-gray-100">Favorite Quests</h2>
        </div>
        <div className="text-center py-8">
          <Star className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No favorite quests yet</p>
          <p className="text-sm text-gray-500 mt-1">
            Mark quests as favorites to see them here
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Star className="w-6 h-6 text-primary-400 fill-current" />
          <h2 className="text-xl font-bold text-gray-100">Favorite Quests</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-400">
            {activeQuests.length} active
          </span>
          <span className="text-gray-500">
            {completedQuests.length} done
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {quests.map((quest, index) => (
          <motion.div
            key={quest.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border transition-all ${
              quest.isCompleted
                ? 'bg-dark-700/30 border-dark-600/50 opacity-60'
                : 'bg-dark-700/50 border-dark-600 hover:border-primary-500/50'
            }`}
          >
            <div className="flex items-start gap-3">
              <motion.button
                onClick={() => handleQuickComplete(quest.id)}
                disabled={processingIds.has(quest.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="mt-0.5"
              >
                {quest.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500 hover:text-primary-400" />
                )}
              </motion.button>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    className={`font-medium ${
                      quest.isCompleted
                        ? 'line-through text-gray-500'
                        : 'text-gray-200'
                    }`}
                  >
                    {quest.name}
                  </h3>
                  {quest.priority && quest.priority !== 'medium' && (
                    <Flag
                      className={`w-4 h-4 flex-shrink-0 ${
                        priorityColors[quest.priority]
                      }`}
                    />
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-dark-600/50 rounded text-gray-400">
                    {quest.category}
                  </span>

                  {quest.estimatedDurationMinutes && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {quest.estimatedDurationMinutes}m
                    </div>
                  )}

                  {quest.waypointCode && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      WP
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {activeQuests.length === 0 && completedQuests.length > 0 && (
        <div className="mt-4 text-center p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
          <p className="text-primary-300 text-sm">
            🎉 All favorite quests completed!
          </p>
        </div>
      )}
    </Card>
  );
}
