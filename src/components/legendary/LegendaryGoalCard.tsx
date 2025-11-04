'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Trash2, CheckCircle, Clock, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { getLegendaryById } from '@/lib/services/legendaryService';
import { MaterialProgressList } from './MaterialProgressList';
import { motion, AnimatePresence } from 'framer-motion';

interface LegendaryGoalCardProps {
  goal: {
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
  };
  onDelete: () => void;
  onComplete?: () => void;
}

export function LegendaryGoalCard({ goal, onDelete, onComplete }: LegendaryGoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const legendary = getLegendaryById(goal.legendaryId);
  const startDate = new Date(goal.startedAt);
  const daysTracking = Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gen1':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gen2':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'gen3':
        return 'bg-legendary/20 text-legendary border-legendary/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return '⚔️';
      case 'armor':
        return '🛡️';
      case 'trinket':
        return '💍';
      case 'backpack':
        return '🎒';
      default:
        return '✨';
    }
  };

  return (
    <Card
      className={`glass-hover overflow-hidden ${
        goal.isCompleted
          ? 'border-legendary ring-2 ring-legendary/50'
          : 'border-primary-500/20'
      }`}
    >
      <CardBody>
        <div className="space-y-4">
          {/* Main Content */}
          <div className="flex items-start gap-4">
            {/* Legendary Icon */}
            <div className="flex-shrink-0">
              {legendary?.iconUrl ? (
                <div className="relative">
                  <Image
                    src={legendary.iconUrl}
                    alt={goal.legendaryName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-lg border-2 border-legendary/50"
                    unoptimized
                  />
                  {goal.isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-legendary rounded-full p-1">
                      <CheckCircle className="w-5 h-5 text-dark-800" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg border-2 border-legendary/50 bg-legendary/10 flex items-center justify-center text-3xl">
                  {getTypeIcon(goal.legendaryType)}
                </div>
              )}
            </div>

            {/* Goal Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-gray-100">{goal.legendaryName}</h3>
                    {goal.isCompleted && (
                      <Sparkles className="w-5 h-5 text-legendary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getTierColor(goal.legendaryTier)}>
                      {goal.legendaryTier.toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400 capitalize">{goal.legendaryType}</span>
                  </div>
                </div>
              </div>

              {/* Quick Material Preview */}
              {!goal.isCompleted && legendary && !isExpanded && (
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">
                    {legendary.requiredMaterials.length} materials required
                  </p>
                </div>
              )}

              {/* Notes */}
              {goal.notes && (
                <div className="mb-4 p-3 bg-primary-500/10 rounded-lg border border-primary-500/30">
                  <p className="text-sm text-gray-300">{goal.notes}</p>
                </div>
              )}

              {/* Time Tracking */}
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {goal.isCompleted
                      ? `Completed ${new Date(goal.completedAt!).toLocaleDateString()}`
                      : `Tracking for ${daysTracking} ${daysTracking === 1 ? 'day' : 'days'}`}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-wrap">
                {!goal.isCompleted && legendary && (
                  <Button
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Materials
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" />
                        Show Materials
                      </>
                    )}
                  </Button>
                )}
                {!goal.isCompleted && onComplete && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={onComplete}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Completed
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="flex items-center gap-2 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Material Progress */}
          <AnimatePresence>
            {isExpanded && !goal.isCompleted && legendary && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-dark-600 pt-4"
              >
                <MaterialProgressList
                  goalId={goal.id}
                  materials={legendary.requiredMaterials}
                  legendaryName={goal.legendaryName}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardBody>
    </Card>
  );
}
