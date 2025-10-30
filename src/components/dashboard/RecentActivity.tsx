'use client';

import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Clock, TrendingUp, Zap } from 'lucide-react';

interface Activity {
  quest: string;
  completedAt: Date;
  goldEarned?: string;
  timeSpent?: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return null;
  }

  return (
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-bold text-gray-200">Recent Activity</h3>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-3">
          {activities.slice(0, 5).map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-background-darker border border-primary-500/10 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-200 truncate">
                  {activity.quest}
                </p>
                <p className="text-xs text-gray-500">
                  {activity.completedAt.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="flex items-center gap-3 ml-4">
                {activity.goldEarned && (
                  <span className="text-sm font-medium text-legendary">
                    {activity.goldEarned}
                  </span>
                )}
                {activity.timeSpent && (
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">{activity.timeSpent}m</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
