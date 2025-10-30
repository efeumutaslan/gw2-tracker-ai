'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { WaypointButton } from './WaypointButton';
import { formatDuration } from '@/lib/utils/formatting';
import {
  Clock,
  CheckCircle2,
  Circle,
  Gift,
  Flame,
  Trash2,
  Edit3,
  Timer,
  Star,
  Flag,
} from 'lucide-react';

interface QuestCardProps {
  quest: {
    id: string;
    name: string;
    description?: string;
    category: string;
    frequency: string;
    isCompleted: boolean;
    notes?: string;
    estimatedDurationMinutes?: number;
    waypointCode?: string;
    nextResetAt: Date;
    isFavorite?: boolean;
    priority?: 'low' | 'medium' | 'high';
  };
  onToggleComplete: (questId: string, timeSpent?: number, goldEarned?: string) => void;
  onEdit?: (questId: string) => void;
  onDelete?: (questId: string) => void;
  onToggleFavorite?: (questId: string, isFavorite: boolean) => void;
  onPriorityChange?: (questId: string, priority: 'low' | 'medium' | 'high') => void;
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  hover: {
    y: -4,
    transition: { duration: 0.2 }
  }
};

const flameVariants = {
  normal: { scale: 1, opacity: 1 },
  urgent: {
    scale: [1, 1.03, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};

const timerVariants = {
  normal: { scale: 1 },
  urgent: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.5,
      repeat: Infinity
    }
  }
};

export function QuestCard({ quest, onToggleComplete, onEdit, onDelete, onToggleFavorite, onPriorityChange }: QuestCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  // Safe defaults
  const frequency = quest.frequency || 'daily';

  // Extract reward from notes
  const reward = quest.notes?.match(/^Reward: (.+?)(?:\n\n|$)/)?.[1];
  const actualNotes = quest.notes?.replace(/^Reward: .+?\n\n/, '');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const reset = new Date(quest.nextResetAt);
      const diff = reset.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Ready to reset');
        setIsUrgent(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      // Urgent if less than 2 hours remaining
      setIsUrgent(hours < 2 && !quest.isCompleted);

      if (hours < 24) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}d ${hours % 24}h`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [quest.nextResetAt, quest.isCompleted]);

  const handleToggle = () => {
    if (quest.isCompleted) {
      onToggleComplete(quest.id);
    } else {
      onToggleComplete(quest.id, quest.estimatedDurationMinutes);
    }
  };

  const handleFavoriteToggle = () => {
    if (onToggleFavorite) {
      onToggleFavorite(quest.id, !quest.isFavorite);
    }
  };

  const handlePriorityChange = (priority: 'low' | 'medium' | 'high') => {
    if (onPriorityChange) {
      onPriorityChange(quest.id, priority);
      setShowPriorityMenu(false);
    }
  };

  const priorityColors = {
    high: 'text-red-400 border-red-500/50',
    medium: 'text-yellow-400 border-yellow-500/50',
    low: 'text-gray-400 border-gray-500/50',
  };

  const priorityLabels = {
    high: 'High Priority',
    medium: 'Medium Priority',
    low: 'Low Priority',
  };

  const frequencyColors: Record<string, string> = {
    daily: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    weekly: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    custom: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    once: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  const cardClasses = [
    'glass card-base relative',
    quest.isCompleted && 'opacity-60',
    isUrgent && 'flame-effect-base',
  ].filter(Boolean).join(' ');

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? (isUrgent ? 'urgent' : 'visible') : 'hidden'}
      whileHover="hover"
      whileTap={{ scale: 0.98 }}
      style={{ minHeight: '150px' }} // Prevent layout shift
    >
      <motion.div
        variants={flameVariants}
        animate={isUrgent ? 'urgent' : 'normal'}
      >
        <Card className={cardClasses}>
      <CardBody>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start gap-3">
              <motion.button
                onClick={handleToggle}
                className="mt-1"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                {quest.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6 text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.6)]" />
                ) : (
                  <Circle className="w-6 h-6 text-gray-500 hover:text-primary-400" />
                )}
              </motion.button>

              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold mb-2 leading-tight ${quest.isCompleted ? 'line-through text-gray-400' : 'text-white'}`}>
                  {quest.name || 'Untitled Quest'}
                </h3>

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${frequencyColors[frequency] || frequencyColors.daily}`}>
                    {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                  </span>

                  {quest.isFavorite && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-2 py-1 rounded text-xs font-medium bg-primary-500/20 text-primary-300 border border-primary-500/30 flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-current" />
                      Favorite
                    </motion.span>
                  )}

                  {quest.priority && quest.priority !== 'medium' && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`px-2 py-1 rounded text-xs font-medium border flex items-center gap-1 ${priorityColors[quest.priority]}`}
                    >
                      <Flag className="w-3 h-3" />
                      {quest.priority === 'high' ? 'High' : 'Low'}
                    </motion.span>
                  )}

                  {quest.isCompleted && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Complete
                    </Badge>
                  )}

                  <AnimatePresence>
                    {isUrgent && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="px-2 py-1 rounded text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        >
                          <Flame className="w-3 h-3" />
                        </motion.div>
                        Urgent
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Description */}
            {quest.description && (
              <p className="text-sm text-gray-400 pl-9">
                {quest.description}
              </p>
            )}

            {/* Quest Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm pl-9">
              {reward && (
                <div className="flex items-center gap-2 text-primary-400">
                  <Gift className="w-4 h-4" />
                  <span>{reward}</span>
                </div>
              )}

              {quest.estimatedDurationMinutes && quest.estimatedDurationMinutes > 0 && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(quest.estimatedDurationMinutes)}</span>
                </div>
              )}

              {!quest.isCompleted && (
                <motion.div
                  className={`flex items-center gap-2 ${isUrgent ? 'text-red-400 timer-urgent' : 'text-gray-400'}`}
                  variants={timerVariants}
                  animate={isUrgent ? 'urgent' : 'normal'}
                >
                  <Timer className="w-4 h-4" />
                  <span className="font-mono">{timeLeft}</span>
                </motion.div>
              )}
            </div>

            {/* Notes */}
            {actualNotes && actualNotes.trim() && (
              <p className="text-xs text-gray-500 italic pl-9 pt-2 border-t border-gray-800">
                {actualNotes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 shrink-0">
            {/* Main Action Button */}
            <Button
              size="sm"
              variant={quest.isCompleted ? 'secondary' : 'primary'}
              onClick={handleToggle}
              className="btn-glow w-full min-w-[100px]"
            >
              {quest.isCompleted ? 'Undo' : 'Complete'}
            </Button>

            {quest.waypointCode && (
              <WaypointButton waypointCode={quest.waypointCode} />
            )}

            {/* Icon Actions Row */}
            <div className="flex items-center justify-center gap-1 pt-1">
              {/* Favorite Button */}
              {onToggleFavorite && (
                <motion.button
                  onClick={handleFavoriteToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-md transition-colors ${
                    quest.isFavorite
                      ? 'text-primary-400 hover:text-primary-300 bg-primary-500/10'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                  title={quest.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-4 h-4 ${quest.isFavorite ? 'fill-current' : ''}`} />
                </motion.button>
              )}

              {/* Priority Button with Dropdown */}
              {onPriorityChange && (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowPriorityMenu(!showPriorityMenu)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-2 rounded-md transition-colors ${
                      quest.priority === 'high'
                        ? 'text-red-400 hover:text-red-300 bg-red-500/10'
                        : quest.priority === 'low'
                        ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
                        : 'text-yellow-400 hover:text-yellow-300 bg-yellow-500/10'
                    }`}
                    title="Set priority"
                  >
                    <Flag className="w-4 h-4" />
                  </motion.button>

                  <AnimatePresence>
                    {showPriorityMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowPriorityMenu(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 bg-dark-700/95 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-600/30 z-50 overflow-hidden"
                        >
                          <button
                            onClick={() => handlePriorityChange('high')}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-500/20 transition-colors flex items-center gap-2 text-red-400 border-b border-gray-700/50"
                          >
                            <Flag className="w-4 h-4" />
                            High Priority
                          </button>
                          <button
                            onClick={() => handlePriorityChange('medium')}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-yellow-500/20 transition-colors flex items-center gap-2 text-yellow-400 border-b border-gray-700/50"
                          >
                            <Flag className="w-4 h-4" />
                            Medium
                          </button>
                          <button
                            onClick={() => handlePriorityChange('low')}
                            className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-500/20 transition-colors flex items-center gap-2 text-gray-400"
                          >
                            <Flag className="w-4 h-4" />
                            Low Priority
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {onEdit && (
                <motion.button
                  onClick={() => onEdit(quest.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 transition-colors"
                  title="Edit quest"
                >
                  <Edit3 className="w-4 h-4" />
                </motion.button>
              )}

              {onDelete && (
                <motion.button
                  onClick={() => onDelete(quest.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-md text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  title="Delete quest"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
      </motion.div>
    </motion.div>
  );
}
