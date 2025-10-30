'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, TrendingUp, Clock, Target } from 'lucide-react';
import { getLegendaryById } from '@/lib/services/legendaryService';

interface LegendaryGoal {
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
}

interface LegendaryComparisonViewProps {
  goals: LegendaryGoal[];
}

export function LegendaryComparisonView({ goals }: LegendaryComparisonViewProps) {
  const [inventoryData, setInventoryData] = useState<{ [goalId: string]: any }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (goals.length > 0) {
      fetchAllInventoryData();
    }
  }, [goals]);

  const fetchAllInventoryData = async () => {
    setIsLoading(true);
    try {
      const dataPromises = goals.map(async (goal) => {
        const response = await fetch(`/api/legendary-goals/${goal.id}/materials`);
        if (response.ok) {
          const data = await response.json();
          return { goalId: goal.id, data };
        }
        return { goalId: goal.id, data: null };
      });

      const results = await Promise.all(dataPromises);
      const inventoryMap: { [goalId: string]: any } = {};
      results.forEach((result) => {
        if (result.data) {
          inventoryMap[result.goalId] = result.data;
        }
      });

      setInventoryData(inventoryMap);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (goalId: string, legendaryId: number) => {
    const legendary = getLegendaryById(legendaryId);
    if (!legendary || !inventoryData[goalId]) {
      return 0;
    }

    const inventory = inventoryData[goalId].inventoryData || {};
    const completedMaterials = legendary.requiredMaterials.filter((mat) => {
      const current = inventory[mat.id] || 0;
      return current >= mat.quantity;
    });

    return Math.round((completedMaterials.length / legendary.requiredMaterials.length) * 100);
  };

  const getDaysTracking = (startedAt: string) => {
    const startDate = new Date(startedAt);
    return Math.floor((Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  };

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

  if (goals.length === 0) {
    return null;
  }

  return (
    <Card className="glass border-primary-500/30">
      <CardBody>
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-bold text-gray-200">Legendary Goals Comparison</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => {
              const legendary = getLegendaryById(goal.legendaryId);
              const progress = calculateProgress(goal.id, goal.legendaryId);
              const daysTracking = getDaysTracking(goal.startedAt);

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-lg border border-primary-500/20 bg-dark-800/30 hover:border-primary-500/40 transition-colors"
                >
                  {/* Legendary Icon & Name */}
                  <div className="flex items-center gap-3 mb-3">
                    {legendary?.iconUrl ? (
                      <img
                        src={legendary.iconUrl}
                        alt={goal.legendaryName}
                        className="w-12 h-12 rounded border border-legendary/50"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded border border-legendary/50 bg-legendary/10 flex items-center justify-center text-xl">
                        ✨
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-200 truncate text-sm">
                        {goal.legendaryName}
                      </h4>
                      <Badge className={`${getTierColor(goal.legendaryTier)} text-xs`}>
                        {goal.legendaryTier.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Progress</span>
                      <span className="text-xs font-bold text-primary-400">{progress}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-500 to-legendary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{daysTracking}d</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Target className="w-3 h-3" />
                      <span>{legendary?.requiredMaterials.length || 0} materials</span>
                    </div>
                  </div>

                  {/* Progress Status */}
                  <div className="mt-3 pt-3 border-t border-dark-600">
                    {progress === 100 ? (
                      <div className="flex items-center gap-1 text-green-400 text-xs">
                        <Trophy className="w-3 h-3" />
                        <span className="font-semibold">Ready to craft!</span>
                      </div>
                    ) : progress >= 75 ? (
                      <div className="flex items-center gap-1 text-legendary text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">Almost there!</span>
                      </div>
                    ) : progress >= 50 ? (
                      <div className="flex items-center gap-1 text-yellow-400 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-semibold">Halfway done</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 text-xs">
                        <TrendingUp className="w-3 h-3" />
                        <span>Just getting started</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
