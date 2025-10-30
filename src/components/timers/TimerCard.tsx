import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CountdownTimer } from './CountdownTimer';

interface TimerCardProps {
  quest: {
    id: string;
    name: string;
    frequency: string;
    nextResetAt: Date;
    isCompleted: boolean;
  };
}

export function TimerCard({ quest }: TimerCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {quest.name}
            </h3>
            <Badge variant={quest.isCompleted ? 'success' : 'default'}>
              {quest.frequency}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Resets in</p>
            <CountdownTimer targetDate={quest.nextResetAt} />
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
