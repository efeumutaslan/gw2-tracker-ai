'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X } from 'lucide-react';
import { Achievement, getRarityColor, getRarityGlow } from '@/lib/services/achievementService';

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: 300, opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="fixed top-20 right-4 z-50 w-96"
      >
        <div className={`glass rounded-lg border-2 ${
          achievement.rarity === 'legendary' ? 'border-legendary' :
          achievement.rarity === 'ascended' ? 'border-ascended' :
          achievement.rarity === 'exotic' ? 'border-exotic' :
          achievement.rarity === 'rare' ? 'border-blue-500' :
          'border-primary-500'
        } p-4 shadow-2xl overflow-hidden relative`}>
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/20 to-primary-500/0"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <motion.div
                className="flex-shrink-0"
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 2,
                }}
              >
                <div className={`text-5xl ${getRarityGlow(achievement.rarity)}`}>
                  {achievement.icon}
                </div>
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className={`w-4 h-4 ${getRarityColor(achievement.rarity)}`} />
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    Achievement Unlocked
                  </span>
                </div>

                <h3 className={`text-lg font-bold mb-1 ${getRarityColor(achievement.rarity)}`}>
                  {achievement.title}
                </h3>

                <p className="text-sm text-gray-400">
                  {achievement.description}
                </p>

                {achievement.reward && (
                  <div className="mt-2 text-xs text-primary-400">
                    🎁 {achievement.reward}
                  </div>
                )}
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-gray-500 hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
