'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Trophy, Star, Award } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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

interface AchievementCardProps {
  achievement: Achievement;
  onProgressUpdate?: (id: string, progress: number) => void;
  delay?: number;
}

export function AchievementCard({ achievement, onProgressUpdate, delay = 0 }: AchievementCardProps) {
  const progressPercentage = (achievement.currentProgress / achievement.totalRequired) * 100;

  const tierColors = {
    bronze: {
      border: 'border-amber-700/50',
      bg: 'bg-amber-900/10',
      text: 'text-amber-600',
      glow: 'shadow-amber-700/20',
    },
    silver: {
      border: 'border-gray-400/50',
      bg: 'bg-gray-400/10',
      text: 'text-gray-300',
      glow: 'shadow-gray-400/20',
    },
    gold: {
      border: 'border-legendary/50',
      bg: 'bg-legendary/10',
      text: 'text-legendary',
      glow: 'shadow-legendary/30',
    },
    platinum: {
      border: 'border-purple-400/50',
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      glow: 'shadow-purple-400/30',
    },
  };

  const colors = tierColors[achievement.tier];

  const handleIncrement = () => {
    if (achievement.currentProgress < achievement.totalRequired && onProgressUpdate) {
      onProgressUpdate(achievement.id, achievement.currentProgress + 1);
    }
  };

  const handleDecrement = () => {
    if (achievement.currentProgress > 0 && onProgressUpdate) {
      onProgressUpdate(achievement.id, achievement.currentProgress - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card
        className={`glass p-5 relative overflow-hidden transition-all duration-300 ${
          achievement.isCompleted
            ? `${colors.border} ${colors.bg} ${colors.glow} shadow-lg`
            : 'hover:border-primary-500/50'
        }`}
      >
        {/* Completion Overlay */}
        {achievement.isCompleted && (
          <div className="absolute top-3 right-3 z-10">
            <div className={`${colors.bg} ${colors.border} border-2 rounded-full p-2`}>
              <CheckCircle2 className={`w-5 h-5 ${colors.text}`} />
            </div>
          </div>
        )}

        {/* Icon and Badge */}
        <div className="flex items-start gap-4 mb-3">
          <div className="text-4xl">{achievement.icon || '🏆'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-100 truncate">{achievement.name}</h3>
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${colors.bg} ${colors.text} ${colors.border} border`}
              >
                {achievement.tier.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-400 line-clamp-2">{achievement.description}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-300 font-medium">
              Progress: {achievement.currentProgress} / {achievement.totalRequired}
            </span>
            <span className={`font-bold ${achievement.isCompleted ? colors.text : 'text-gray-400'}`}>
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 bg-dark-700/50 rounded-full overflow-hidden border border-dark-600">
            <motion.div
              className={`h-full rounded-full ${
                achievement.isCompleted
                  ? `bg-gradient-to-r ${
                      achievement.tier === 'bronze'
                        ? 'from-amber-700 to-amber-600'
                        : achievement.tier === 'silver'
                        ? 'from-gray-400 to-gray-300'
                        : achievement.tier === 'gold'
                        ? 'from-legendary to-yellow-500'
                        : 'from-purple-500 to-purple-400'
                    }`
                  : 'bg-gradient-to-r from-primary-600 to-primary-500'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.8, delay: delay + 0.2 }}
            />
          </div>
        </div>

        {/* Controls and Rewards */}
        <div className="flex items-center justify-between">
          {/* Progress Controls */}
          {!achievement.isCompleted && onProgressUpdate && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={achievement.currentProgress === 0}
                className="px-3 py-1 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                -
              </button>
              <button
                onClick={handleIncrement}
                disabled={achievement.currentProgress >= achievement.totalRequired}
                className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                +
              </button>
            </div>
          )}

          {achievement.isCompleted && achievement.completedAt && (
            <span className="text-xs text-gray-500">
              Completed {new Date(achievement.completedAt).toLocaleDateString()}
            </span>
          )}

          {/* Rewards */}
          <div className="flex items-center gap-3 ml-auto">
            {achievement.rewardPoints > 0 && (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-bold text-primary-300">
                  {achievement.rewardPoints}
                </span>
              </div>
            )}
            {achievement.rewardTitle && (
              <div
                className={`px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text} ${colors.border} border`}
              >
                <Award className="w-3 h-3 inline mr-1" />
                {achievement.rewardTitle}
              </div>
            )}
          </div>
        </div>

        {/* Daily/Repeatable Badges */}
        {(achievement.isDaily || achievement.isRepeatable) && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-dark-600">
            {achievement.isDaily && (
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded text-xs font-medium">
                Daily
              </span>
            )}
            {achievement.isRepeatable && (
              <span className="px-2 py-1 bg-green-500/20 text-green-300 border border-green-500/30 rounded text-xs font-medium">
                Repeatable
              </span>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}
