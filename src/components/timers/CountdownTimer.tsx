'use client';

import { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/lib/utils/formatting';

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

export function CountdownTimer({ targetDate, onComplete }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const target = new Date(targetDate);

      if (now >= target) {
        setTimeLeft('Ready to reset!');
        if (onComplete) onComplete();
        return;
      }

      setTimeLeft(formatRelativeTime(target));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
      {timeLeft}
    </span>
  );
}
