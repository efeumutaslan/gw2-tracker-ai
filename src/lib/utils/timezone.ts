import { DateTime } from 'luxon';
import { GW2_RESET_TIMES } from '@/lib/constants';

export function calculateNextReset(
  frequency: 'daily' | 'weekly' | 'custom' | 'once',
  resetTime: string = '00:00',
  userTimezone: string = 'UTC',
  customDays?: number
): Date {
  const tz = userTimezone || 'UTC';
  const [hours, minutes] = resetTime.split(':').map(Number);
  
  let now = DateTime.now().setZone(tz);
  
  if (frequency === 'once') {
    return DateTime.fromMillis(0).toJSDate();
  }
  
  if (frequency === 'daily') {
    let nextReset = DateTime.fromObject(
      { hour: hours, minute: minutes, second: 0, millisecond: 0 },
      { zone: tz }
    );
    
    if (nextReset <= now) {
      nextReset = nextReset.plus({ days: 1 });
    }
    
    return nextReset.toUTC().toJSDate();
  }
  
  if (frequency === 'weekly') {
    const [weeklyHours, weeklyMinutes] = GW2_RESET_TIMES.WEEKLY_TIME.split(':').map(Number);
    
    let nextReset = DateTime.now()
      .setZone('UTC')
      .set({ weekday: GW2_RESET_TIMES.WEEKLY_DAY as any, hour: weeklyHours, minute: weeklyMinutes, second: 0, millisecond: 0 });
    
    if (nextReset <= DateTime.now().setZone('UTC')) {
      nextReset = nextReset.plus({ weeks: 1 });
    }
    
    return nextReset.toJSDate();
  }
  
  if (frequency === 'custom' && customDays) {
    let nextReset = DateTime.fromObject(
      { hour: hours, minute: minutes, second: 0, millisecond: 0 },
      { zone: tz }
    );
    
    if (nextReset <= now) {
      nextReset = nextReset.plus({ days: customDays });
    }
    
    return nextReset.toUTC().toJSDate();
  }
  
  return calculateNextReset('daily', resetTime, userTimezone);
}

export function formatInUserTimezone(
  utcDate: Date,
  userTimezone: string = 'UTC',
  format: string = 'yyyy-MM-dd HH:mm'
): string {
  return DateTime.fromJSDate(utcDate)
    .setZone(userTimezone)
    .toFormat(format);
}

export function getTimeUntilReset(nextResetDate: Date, userTimezone: string = 'UTC') {
  const now = DateTime.now().setZone(userTimezone);
  const reset = DateTime.fromJSDate(nextResetDate).setZone(userTimezone);
  
  const diff = reset.diff(now, ['days', 'hours', 'minutes', 'seconds']);
  
  return {
    days: Math.floor(diff.days),
    hours: Math.floor(diff.hours % 24),
    minutes: Math.floor(diff.minutes % 60),
    seconds: Math.floor(diff.seconds % 60),
    totalSeconds: Math.floor(diff.as('seconds')),
  };
}

export function formatTimeUntil(nextResetDate: Date, userTimezone: string = 'UTC'): string {
  const time = getTimeUntilReset(nextResetDate, userTimezone);
  
  if (time.totalSeconds <= 0) {
    return 'Ready to reset';
  }
  
  if (time.days > 0) {
    return `${time.days}d ${time.hours}h`;
  }
  
  if (time.hours > 0) {
    return `${time.hours}h ${time.minutes}m`;
  }
  
  if (time.minutes > 0) {
    return `${time.minutes}m ${time.seconds}s`;
  }
  
  return `${time.seconds}s`;
}

export function getNextDailyReset(): Date {
  return calculateNextReset('daily', GW2_RESET_TIMES.DAILY, 'UTC');
}

export function getNextWeeklyReset(): Date {
  return calculateNextReset('weekly', GW2_RESET_TIMES.WEEKLY_TIME, 'UTC');
}

export function isValidTimezone(timezone: string): boolean {
  try {
    DateTime.now().setZone(timezone);
    return true;
  } catch {
    return false;
  }
}

export function getTimezones(): string[] {
  return [
    'UTC',
    'Europe/Istanbul',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Australia/Sydney',
  ];
}
