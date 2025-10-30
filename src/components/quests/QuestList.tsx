'use client';

import { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { QuestCard } from './QuestCard';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { AchievementToast } from '@/components/AchievementToast';
import { filterAndSortQuests, QuestFilters } from '@/lib/utils/questFilters';
import type { Achievement } from '@/lib/services/achievementService';

interface Quest {
  id: string;
  name: string;
  description?: string;
  category: string;
  frequency: string;
  isCompleted: boolean;
  goldReward?: string;
  estimatedDurationMinutes?: number;
  waypointCode?: string;
  nextResetAt: Date;
}

interface QuestListProps {
  quests: Quest[];
  filters?: QuestFilters;
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function QuestList({ quests: initialQuests, filters, isLoading, onRefresh }: QuestListProps) {
  const { showToast } = useToast();
  const [quests, setQuests] = useState(initialQuests);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);

  // Sync local state with prop changes
  useEffect(() => {
    setQuests(initialQuests);
  }, [initialQuests]);

  // Apply filters and sorting
  const filteredQuests = useMemo(() => {
    if (!filters) return quests;
    return filterAndSortQuests(quests, filters);
  }, [quests, filters]);

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#f29a37', '#d4af37', '#fb3e8d', '#ffa500'],
    });

    fire(0.2, {
      spread: 60,
      colors: ['#f29a37', '#d4af37', '#fb3e8d'],
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#f29a37', '#d4af37'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#ffa500', '#fb3e8d'],
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#d4af37'],
    });
  };

  const handleToggleComplete = async (
    questId: string,
    timeSpent?: number,
    goldEarned?: string
  ) => {
    setProcessingIds((prev) => new Set(prev).add(questId));

    try {
      const response = await fetch('/api/quests/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questId,
          timeSpent,
          goldEarned,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update quest');
      }

      // Check if quest was completed (not uncompleted)
      const wasCompleted = data.quest?.isCompleted;

      if (wasCompleted) {
        // Fire confetti celebration!
        fireConfetti();

        // Show success message
        if (data.streak) {
          showToast(
            'success',
            `Quest completed! 🔥 ${data.streak.currentStreak} day streak!`
          );
        } else {
          showToast('success', 'Quest completed! 🎉');
        }

        // Show achievement toast if any new achievements unlocked
        if (data.newAchievements && data.newAchievements.length > 0) {
          // Show first achievement (others will queue)
          setTimeout(() => {
            setCurrentAchievement(data.newAchievements[0]);
          }, 500);

          // Show remaining achievements with delay
          data.newAchievements.slice(1).forEach((achievement: Achievement, index: number) => {
            setTimeout(() => {
              setCurrentAchievement(achievement);
            }, 500 + (index + 1) * 4000); // 4 seconds between each
          });
        }
      } else {
        showToast('success', 'Quest marked as incomplete');
      }

      if (onRefresh) onRefresh();
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

  const handleDelete = async (questId: string) => {
    if (!confirm('Are you sure you want to delete this quest?')) {
      return;
    }

    setProcessingIds((prev) => new Set(prev).add(questId));

    try {
      const response = await fetch(`/api/quests/${questId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete quest');
      }

      showToast('success', 'Quest deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to delete quest');
    } finally {
      setProcessingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questId);
        return newSet;
      });
    }
  };

  const handleToggleFavorite = async (questId: string, isFavorite: boolean) => {
    // Optimistic update - update UI immediately
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId
          ? { ...quest, isFavorite }
          : quest
      )
    );

    try {
      const response = await fetch('/api/quests/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, isFavorite }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert on error
        setQuests(prevQuests =>
          prevQuests.map(quest =>
            quest.id === questId
              ? { ...quest, isFavorite: !isFavorite }
              : quest
          )
        );
        throw new Error(data.error || 'Failed to update favorite status');
      }

      showToast('success', isFavorite ? 'Added to favorites!' : 'Removed from favorites');
      if (onRefresh) onRefresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update favorite');
    }
  };

  const handlePriorityChange = async (questId: string, priority: 'low' | 'medium' | 'high') => {
    // Store old priority for rollback
    const oldQuest = quests.find(q => q.id === questId);
    const oldPriority = oldQuest?.priority;

    // Optimistic update - update UI immediately
    setQuests(prevQuests =>
      prevQuests.map(quest =>
        quest.id === questId
          ? { ...quest, priority }
          : quest
      )
    );

    try {
      const response = await fetch('/api/quests/priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questId, priority }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert on error
        setQuests(prevQuests =>
          prevQuests.map(quest =>
            quest.id === questId
              ? { ...quest, priority: oldPriority }
              : quest
          )
        );
        throw new Error(data.error || 'Failed to update priority');
      }

      showToast('success', `Priority set to ${priority}`);
      if (onRefresh) onRefresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to update priority');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (quests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No quests found. Create your first quest!</p>
      </div>
    );
  }

  if (filteredQuests.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No quests match your filters. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filteredQuests.map((quest) => (
          <QuestCard
            key={quest.id}
            quest={quest}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onToggleFavorite={handleToggleFavorite}
            onPriorityChange={handlePriorityChange}
          />
        ))}
      </div>

      {/* Achievement Toast */}
      <AchievementToast
        achievement={currentAchievement}
        onClose={() => setCurrentAchievement(null)}
      />
    </>
  );
}
