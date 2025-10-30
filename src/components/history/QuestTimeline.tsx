'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Flag, Star, MapPin, Coins } from 'lucide-react';
import { Card } from '@/components/ui/Card';

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

interface GroupedQuests {
  date: string;
  displayDate: string;
  quests: Quest[];
  totalGold: number;
  totalTime: number;
}

interface QuestTimelineProps {
  quests: Quest[];
}

export function QuestTimeline({ quests }: QuestTimelineProps) {
  const groupedQuests = groupQuestsByDate(quests);

  if (groupedQuests.length === 0) {
    return (
      <Card className="glass p-12 text-center">
        <div className="flex flex-col items-center gap-4">
          <Clock className="w-16 h-16 text-gray-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-300 mb-2">No Quest History Yet</h3>
            <p className="text-gray-500">
              Complete some quests to see them appear in your history timeline
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {groupedQuests.map((group, groupIndex) => (
        <motion.div
          key={group.date}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
          className="relative"
        >
          {/* Date Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="bg-primary-500/20 border-2 border-primary-500 rounded-full p-3">
                <Clock className="w-5 h-5 text-primary-400" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-100">{group.displayDate}</h2>
              <p className="text-sm text-gray-400">
                {group.quests.length} quest{group.quests.length !== 1 ? 's' : ''} completed
                {group.totalGold > 0 && ` • ${group.totalGold}g earned`}
                {group.totalTime > 0 && ` • ${group.totalTime} min`}
              </p>
            </div>
          </div>

          {/* Timeline Line */}
          {groupIndex < groupedQuests.length - 1 && (
            <div className="absolute left-7 top-16 bottom-0 w-0.5 bg-gradient-to-b from-primary-500/50 to-transparent" />
          )}

          {/* Quests Grid */}
          <div className="ml-16 grid gap-3">
            {group.quests.map((quest, questIndex) => (
              <QuestTimelineItem
                key={quest.id}
                quest={quest}
                delay={groupIndex * 0.1 + questIndex * 0.05}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

interface QuestTimelineItemProps {
  quest: Quest;
  delay: number;
}

function QuestTimelineItem({ quest, delay }: QuestTimelineItemProps) {
  const priorityColors = {
    high: 'border-red-500/50 bg-red-500/5',
    medium: 'border-yellow-500/50 bg-yellow-500/5',
    low: 'border-gray-500/50 bg-gray-500/5',
  };

  const priorityIconColors = {
    high: 'text-red-400',
    medium: 'text-yellow-400',
    low: 'text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
    >
      <Card
        className={`glass p-4 hover:border-primary-500/50 transition-all ${
          quest.priority ? priorityColors[quest.priority] : ''
        }`}
      >
        <div className="flex items-start gap-4">
          {/* Check Icon */}
          <div className="flex-shrink-0 mt-1">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>

          {/* Quest Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-100 truncate">{quest.name}</h3>
                  {quest.isFavorite && <Star className="w-4 h-4 text-primary-400 flex-shrink-0" />}
                  {quest.priority && (
                    <Flag
                      className={`w-4 h-4 flex-shrink-0 ${
                        priorityIconColors[quest.priority]
                      }`}
                    />
                  )}
                </div>
                {quest.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">{quest.description}</p>
                )}
              </div>

              {/* Time */}
              {quest.completedAt && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {new Date(quest.completedAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              )}
            </div>

            {/* Quest Details */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Category */}
              <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded border border-primary-500/30">
                {quest.category || 'Uncategorized'}
              </span>

              {/* Gold Reward */}
              {quest.goldReward && (
                <div className="flex items-center gap-1 text-legendary">
                  <Coins className="w-3 h-3" />
                  <span>{quest.goldReward}g</span>
                </div>
              )}

              {/* Duration */}
              {quest.estimatedDurationMinutes && (
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{quest.estimatedDurationMinutes} min</span>
                </div>
              )}

              {/* Waypoint */}
              {quest.waypointCode && (
                <div className="flex items-center gap-1 text-blue-400">
                  <MapPin className="w-3 h-3" />
                  <span className="font-mono text-xs">{quest.waypointCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function groupQuestsByDate(quests: Quest[]): GroupedQuests[] {
  const groups = new Map<string, GroupedQuests>();

  quests
    .filter((q) => q.isCompleted && q.completedAt)
    .sort((a, b) => {
      const dateA = new Date(a.completedAt!).getTime();
      const dateB = new Date(b.completedAt!).getTime();
      return dateB - dateA; // Most recent first
    })
    .forEach((quest) => {
      const date = new Date(quest.completedAt!);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

      if (!groups.has(dateKey)) {
        const displayDate = formatDisplayDate(date);
        groups.set(dateKey, {
          date: dateKey,
          displayDate,
          quests: [],
          totalGold: 0,
          totalTime: 0,
        });
      }

      const group = groups.get(dateKey)!;
      group.quests.push(quest);

      // Calculate totals
      if (quest.goldReward) {
        const goldMatch = quest.goldReward.match(/(\d+)/);
        if (goldMatch) {
          group.totalGold += parseInt(goldMatch[1]);
        }
      }
      if (quest.estimatedDurationMinutes) {
        group.totalTime += quest.estimatedDurationMinutes;
      }
    });

  return Array.from(groups.values());
}

function formatDisplayDate(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const questDate = new Date(date);
  questDate.setHours(0, 0, 0, 0);

  if (questDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (questDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
