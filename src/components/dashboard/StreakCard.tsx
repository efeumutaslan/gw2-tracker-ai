'use client';

import { motion } from 'framer-motion';
import { Flame, Trophy, Target } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
}

export function StreakCard({ currentStreak, longestStreak, totalDaysActive }: StreakCardProps) {
  const getStreakColor = (streak: number) => {
    if (streak === 0) return 'text-gray-400';
    if (streak < 3) return 'text-orange-400';
    if (streak < 7) return 'text-orange-500';
    if (streak < 14) return 'text-red-500';
    if (streak < 30) return 'text-purple-500';
    if (streak < 50) return 'text-blue-500';
    if (streak < 100) return 'text-legendary';
    return 'text-legendary text-glow';
  };

  const getStreakMessage = (streak: number) => {
    if (streak === 0) return 'Start your streak today!';
    if (streak === 1) return 'Great start! Keep it up!';
    if (streak < 3) return 'Building momentum!';
    if (streak < 7) return 'Impressive dedication!';
    if (streak < 14) return 'You\'re on fire!';
    if (streak < 30) return 'Unstoppable force!';
    if (streak < 50) return 'Legendary dedication!';
    if (streak < 100) return 'Master of persistence!';
    return 'ABSOLUTE LEGEND!';
  };

  const flameVariants = {
    idle: { scale: 1, rotate: 0 },
    animate: {
      scale: [1, 1.2, 1],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass overflow-hidden relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-purple-500/10 opacity-50" />

        {/* Animated glow effect */}
        {currentStreak > 0 && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/20 to-orange-500/0"
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        <CardBody className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-200">Daily Streak</h3>
            <motion.div
              variants={flameVariants}
              initial="idle"
              animate={currentStreak > 0 ? 'animate' : 'idle'}
            >
              <Flame className={`w-8 h-8 ${getStreakColor(currentStreak)}`} />
            </motion.div>
          </div>

          {/* Current Streak - Big Number */}
          <div className="text-center mb-6">
            <motion.div
              key={currentStreak}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="inline-block"
            >
              <span className={`text-6xl font-bold ${getStreakColor(currentStreak)}`}>
                {currentStreak}
              </span>
              <span className="text-2xl text-gray-400 ml-2">days</span>
            </motion.div>

            <p className="text-sm text-gray-400 mt-2">{getStreakMessage(currentStreak)}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-500/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className="w-4 h-4 text-legendary" />
                <span className="text-2xl font-bold text-legendary">{longestStreak}</span>
              </div>
              <p className="text-xs text-gray-400">Best Streak</p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-primary-400" />
                <span className="text-2xl font-bold text-primary-400">{totalDaysActive}</span>
              </div>
              <p className="text-xs text-gray-400">Total Days</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
