'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, MapPin, Gift, AlertCircle, Copy, Check, Timer, Swords, Target, Activity, Filter } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  getUpcomingBosses,
  getDifficultyBadge,
  WORLD_BOSSES,
  type UpcomingBoss,
  type WorldBoss,
} from '@/lib/services/worldBossService';

export default function TimersPage() {
  const [upcomingBosses, setUpcomingBosses] = useState<UpcomingBoss[]>([]);
  const [copiedWaypoint, setCopiedWaypoint] = useState<string | null>(null);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | WorldBoss['difficulty']>('all');
  const { showToast } = useToast();

  useEffect(() => {
    // Initial fetch
    const updateBosses = () => {
      const allBosses = getUpcomingBosses(20);
      const filtered = difficultyFilter === 'all'
        ? allBosses
        : allBosses.filter(b => b.boss.difficulty === difficultyFilter);
      setUpcomingBosses(filtered);
    };

    updateBosses();

    // Update every second
    const interval = setInterval(updateBosses, 1000);

    return () => clearInterval(interval);
  }, [difficultyFilter]);

  const copyWaypoint = (waypointCode: string, bossName: string) => {
    navigator.clipboard.writeText(waypointCode);
    setCopiedWaypoint(waypointCode);
    showToast('success', `${bossName} waypoint copied!`);

    setTimeout(() => {
      setCopiedWaypoint(null);
    }, 2000);
  };

  // Calculate stats
  const activeBosses = upcomingBosses.filter(b => b.isActive).length;
  const nextBoss = upcomingBosses.find(b => !b.isActive);
  const easyBosses = WORLD_BOSSES.filter(b => b.difficulty === 'easy').length;
  const mediumBosses = WORLD_BOSSES.filter(b => b.difficulty === 'medium').length;
  const hardBosses = WORLD_BOSSES.filter(b => b.difficulty === 'hard').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-8 rounded-lg border border-primary-500/20">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <Timer className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-100 tracking-tight">
              World Boss Timers
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Swords className="w-4 h-4 text-primary-400" />
              <p className="text-gray-400">Track world boss spawns and events in real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Bosses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="glass border-green-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Now</p>
                  <p className="text-3xl font-bold text-green-400">{activeBosses}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Activity className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Next Boss */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-400 mb-1">Next Boss</p>
                  <p className="text-lg font-bold text-gray-200 truncate">
                    {nextBoss ? nextBoss.boss.name : 'Loading...'}
                  </p>
                  {nextBoss && (
                    <p className="text-xs text-primary-400 font-mono">{nextBoss.timeUntil}</p>
                  )}
                </div>
                <div className="p-3 bg-primary-500/20 rounded-lg flex-shrink-0">
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Total Bosses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Bosses</p>
                  <p className="text-3xl font-bold text-gray-200">{WORLD_BOSSES.length}</p>
                </div>
                <div className="p-3 bg-primary-500/20 rounded-lg">
                  <Swords className="w-6 h-6 text-primary-400" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Difficulty Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass border-primary-500/30">
            <CardBody>
              <div>
                <p className="text-sm text-gray-400 mb-3">By Difficulty</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-400">Easy</span>
                    <span className="font-bold text-green-400">{easyBosses}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-yellow-400">Medium</span>
                    <span className="font-bold text-yellow-400">{mediumBosses}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-red-400">Hard</span>
                    <span className="font-bold text-red-400">{hardBosses}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Info Card & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="glass border-blue-500/30">
            <CardBody>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">
                    All times are automatically converted to your local timezone. Click the waypoint code to copy it, then paste in-game chat to teleport.
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <Card className="glass border-primary-500/30">
          <CardBody>
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-primary-400" />
              <p className="text-sm font-semibold text-gray-300">Filter by Difficulty</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={difficultyFilter === 'all' ? 'primary' : 'ghost'}
                onClick={() => setDifficultyFilter('all')}
                className="flex-1"
              >
                All
              </Button>
              <Button
                size="sm"
                variant={difficultyFilter === 'easy' ? 'primary' : 'ghost'}
                onClick={() => setDifficultyFilter('easy')}
                className="flex-1 text-green-400 hover:text-green-300"
              >
                Easy
              </Button>
              <Button
                size="sm"
                variant={difficultyFilter === 'medium' ? 'primary' : 'ghost'}
                onClick={() => setDifficultyFilter('medium')}
                className="flex-1 text-yellow-400 hover:text-yellow-300"
              >
                Medium
              </Button>
              <Button
                size="sm"
                variant={difficultyFilter === 'hard' ? 'primary' : 'ghost'}
                onClick={() => setDifficultyFilter('hard')}
                className="flex-1 text-red-400 hover:text-red-300"
              >
                Hard
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Boss List */}
      <div className="space-y-4">
        {upcomingBosses.map((upcoming, index) => (
          <motion.div
            key={upcoming.boss.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              className={`glass-hover overflow-hidden ${
                upcoming.isActive
                  ? 'border-green-500 ring-2 ring-green-500/50'
                  : 'border-primary-500/20'
              }`}
            >
              <CardBody>
                <div className="flex items-start gap-4">
                  {/* Timer */}
                  <div className="flex-shrink-0 w-32">
                    <div className="text-center">
                      <Clock
                        className={`w-8 h-8 mx-auto mb-2 ${
                          upcoming.isActive ? 'text-green-400' : 'text-primary-400'
                        }`}
                      />
                      <motion.div
                        className={`text-2xl font-bold font-mono ${
                          upcoming.isActive
                            ? 'text-green-400'
                            : 'text-gray-200'
                        }`}
                        animate={upcoming.isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        {upcoming.isActive ? 'ACTIVE!' : upcoming.timeUntil}
                      </motion.div>
                      {!upcoming.isActive && (
                        <div className="text-xs text-gray-500 mt-1">
                          {upcoming.nextSpawn.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Boss Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-100 mb-1">
                          {upcoming.boss.name}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span>{upcoming.boss.map}</span>
                          <span className="text-gray-600">•</span>
                          <span>{upcoming.boss.waypoint}</span>
                        </div>
                      </div>

                      <Badge
                        className={getDifficultyBadge(upcoming.boss.difficulty)}
                      >
                        {upcoming.boss.difficulty.toUpperCase()}
                      </Badge>
                    </div>

                    {/* Rewards */}
                    <div className="flex items-center gap-2 mb-3">
                      <Gift className="w-4 h-4 text-legendary" />
                      <div className="flex flex-wrap gap-2">
                        {upcoming.boss.rewards.map((reward, i) => (
                          <span
                            key={i}
                            className="text-xs px-2 py-1 rounded bg-legendary/10 text-legendary border border-legendary/30"
                          >
                            {reward}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Waypoint */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyWaypoint(upcoming.boss.waypointCode, upcoming.boss.name)
                      }
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300"
                    >
                      {copiedWaypoint === upcoming.boss.waypointCode ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="font-mono text-xs">
                            {upcoming.boss.waypointCode}
                          </span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span className="font-mono text-xs">
                            {upcoming.boss.waypointCode}
                          </span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
