'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCheck, Trash2, Star, X, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { Button } from '@/components/ui/Button';

interface QuickActionsProps {
  quests: any[];
  onRefresh: () => void;
}

export function QuickActions({ quests, onRefresh }: QuickActionsProps) {
  const { showToast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeQuests = quests.filter((q) => !q.isCompleted);
  const completedQuests = quests.filter((q) => q.isCompleted);

  const handleCompleteAll = async () => {
    if (activeQuests.length === 0) {
      showToast('info', 'No active quests to complete');
      return;
    }

    const confirmed = window.confirm(
      `Complete all ${activeQuests.length} active quests? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      // Complete all active quests
      for (const quest of activeQuests) {
        try {
          const response = await fetch('/api/quests/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questId: quest.id,
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `${successCount} quests completed!`);
      }

      if (errorCount > 0) {
        showToast('error', `Failed to complete ${errorCount} quests`);
      }

      onRefresh();
    } catch (error) {
      showToast('error', 'Failed to complete quests');
    } finally {
      setIsProcessing(false);
      setIsExpanded(false);
    }
  };

  const handleDeleteCompleted = async () => {
    if (completedQuests.length === 0) {
      showToast('info', 'No completed quests to delete');
      return;
    }

    const confirmed = window.confirm(
      `Delete all ${completedQuests.length} completed quests? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      // Delete all completed quests
      for (const quest of completedQuests) {
        try {
          const response = await fetch(`/api/quests/${quest.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `${successCount} quests deleted!`);
      }

      if (errorCount > 0) {
        showToast('error', `Failed to delete ${errorCount} quests`);
      }

      onRefresh();
    } catch (error) {
      showToast('error', 'Failed to delete quests');
    } finally {
      setIsProcessing(false);
      setIsExpanded(false);
    }
  };

  const handleResetAll = async () => {
    if (completedQuests.length === 0) {
      showToast('info', 'No completed quests to reset');
      return;
    }

    const confirmed = window.confirm(
      `Reset all ${completedQuests.length} completed quests to active? This cannot be undone.`
    );

    if (!confirmed) return;

    setIsProcessing(true);

    try {
      let successCount = 0;
      let errorCount = 0;

      // Reset all completed quests
      for (const quest of completedQuests) {
        try {
          const response = await fetch('/api/quests/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              questId: quest.id,
            }),
          });

          if (response.ok) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }
      }

      if (successCount > 0) {
        showToast('success', `${successCount} quests reset to active!`);
      }

      if (errorCount > 0) {
        showToast('error', `Failed to reset ${errorCount} quests`);
      }

      onRefresh();
    } catch (error) {
      showToast('error', 'Failed to reset quests');
    } finally {
      setIsProcessing(false);
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        variant="ghost"
        className="relative group"
        disabled={isProcessing}
      >
        <Zap className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
        <span className="ml-2">Quick Actions</span>
        {isExpanded && <X className="w-4 h-4 ml-2" />}
      </Button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-64 glass rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={handleCompleteAll}
                disabled={isProcessing || activeQuests.length === 0}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-600/50
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left group"
              >
                <CheckCheck className="w-5 h-5 text-green-400 group-hover:text-green-300" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Complete All</div>
                  <div className="text-xs text-gray-400">
                    {activeQuests.length} active quest{activeQuests.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </button>

              <button
                onClick={handleResetAll}
                disabled={isProcessing || completedQuests.length === 0}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-600/50
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left group"
              >
                <Star className="w-5 h-5 text-primary-400 group-hover:text-primary-300" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Reset All</div>
                  <div className="text-xs text-gray-400">
                    Mark {completedQuests.length} as active
                  </div>
                </div>
              </button>

              <button
                onClick={handleDeleteCompleted}
                disabled={isProcessing || completedQuests.length === 0}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-600/50
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-left group"
              >
                <Trash2 className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                <div>
                  <div className="text-sm font-medium text-gray-200">Delete Completed</div>
                  <div className="text-xs text-gray-400">
                    Remove {completedQuests.length} quest{completedQuests.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </button>
            </div>

            <div className="px-4 py-2 bg-dark-700/50 border-t border-dark-600 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Active: {activeQuests.length}</span>
                <span>Completed: {completedQuests.length}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
