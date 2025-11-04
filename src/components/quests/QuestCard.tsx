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
  Coins,
  Package,
  Sparkles,
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
    questTemplateId?: string;
  };
  onToggleComplete: (questId: string, timeSpent?: number, goldEarned?: string) => void;
  onEdit?: (questId: string) => void;
  onDelete?: (questId: string) => void;
  onToggleFavorite?: (questId: string, isFavorite: boolean) => void;
  onPriorityChange?: (questId: string, priority: 'low' | 'medium' | 'high') => void;
  onCompleteAllCharacters?: (questTemplateId: string, timeSpent?: number, goldEarned?: string) => void;
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

export function QuestCard({ quest, onToggleComplete, onEdit, onDelete, onToggleFavorite, onPriorityChange, onCompleteAllCharacters }: QuestCardProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  // Handle questTemplate relation from API
  const questData = (quest as any).questTemplate || quest;
  const questName = questData.name || quest.name || 'Untitled Quest';
  const questDescription = questData.description || quest.description;
  const questNotes = questData.notes || quest.notes;
  const questFrequency = questData.frequency || quest.frequency || 'daily';
  const isCharacterBound = questData.isCharacterBound || false;
  const questTemplateId = (quest as any).questTemplateId || quest.questTemplateId;

  // Safe defaults
  const frequency = questFrequency;

  // Extract reward from notes
  const reward = questNotes?.match(/^Reward: (.+?)(?:\n\n|$)/)?.[1];
  const actualNotes = questNotes?.replace(/^Reward: .+?\n\n/, '');

  // Parse rewards into structured data
  const parseRewards = (rewardText: string | undefined) => {
    if (!rewardText) return null;

    const rewards = {
      gold: null as string | null,
      items: [] as string[],
      other: [] as string[],
    };

    // Match gold amounts (e.g., "2g", "50g 25s", "1g 50s 25c")
    const goldMatch = rewardText.match(/(\d+g\s*(?:\d+s\s*)?(?:\d+c)?|\d+\s*gold?)/i);
    if (goldMatch) {
      rewards.gold = goldMatch[0];
    }

    // Split by commas or 'and' to find individual items
    const parts = rewardText.split(/,|\sand\s/i).map(p => p.trim());
    parts.forEach(part => {
      if (!goldMatch || !part.includes(goldMatch[0])) {
        // Check if it's an item (contains words like 'chest', 'box', 'key', etc.)
        if (/chest|box|key|bag|container|item|material|ore|wood|leather/i.test(part)) {
          rewards.items.push(part);
        } else if (!goldMatch || part !== goldMatch[0]) {
          rewards.other.push(part);
        }
      }
    });

    return rewards;
  };

  const parsedRewards = parseRewards(reward);

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

  const handleCompleteAllCharacters = () => {
    if (onCompleteAllCharacters && questTemplateId) {
      onCompleteAllCharacters(questTemplateId, quest.estimatedDurationMinutes);
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
      style={{ minHeight: '150px', overflow: 'visible' }}
      className="overflow-visible"
    >
      <motion.div
        variants={flameVariants}
        animate={isUrgent ? 'urgent' : 'normal'}
        className="overflow-visible"
        style={{ overflow: 'visible' }}
      >
        <Card className={`${cardClasses} !overflow-visible`}>
      <CardBody className="relative overflow-visible">
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
                  {questName}
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
                      <Star className="w-3 h-3" fill="currentColor" />
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
            {questDescription && (
              <p className="text-sm text-gray-400 pl-9">
                {questDescription}
              </p>
            )}

            {/* Reward Box - Styled prominently */}
            {parsedRewards && (parsedRewards.gold || parsedRewards.items.length > 0 || parsedRewards.other.length > 0) && (
              <div className="pl-9 mt-3">
                <div className="glass rounded-lg border border-primary-500/30 bg-gradient-to-br from-primary-500/10 via-transparent to-purple-500/10 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                    <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Rewards</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedRewards.gold && (
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-500/20 border border-yellow-500/30"
                      >
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-300">{parsedRewards.gold}</span>
                      </motion.div>
                    )}
                    {parsedRewards.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-500/20 border border-blue-500/30"
                      >
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-sm text-blue-300">{item}</span>
                      </motion.div>
                    ))}
                    {parsedRewards.other.map((other, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: (parsedRewards.items.length + idx) * 0.05 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-purple-500/20 border border-purple-500/30"
                      >
                        <Gift className="w-4 h-4 text-purple-400" />
                        <span className="text-sm text-purple-300">{other}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quest Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm pl-9 mt-3">
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

            {/* Complete All Characters Button - Only show for character-bound, incomplete quests */}
            {isCharacterBound && !quest.isCompleted && onCompleteAllCharacters && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCompleteAllCharacters}
                className="w-full min-w-[100px] text-xs"
                title="Complete this quest for all your characters"
              >
                All Characters
              </Button>
            )}

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
                  className={`p-2 rounded-md transition-all duration-200 ${
                    quest.isFavorite
                      ? 'text-primary-400 hover:text-primary-300 bg-primary-500/20'
                      : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'
                  }`}
                  title={quest.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {quest.isFavorite ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <Star className="w-4 h-4" strokeWidth={2} />
                  )}
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
                          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-44 bg-dark-700 backdrop-blur-sm rounded-lg shadow-2xl border border-gray-600/50 overflow-hidden"
                          style={{ zIndex: 9999 }}
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
