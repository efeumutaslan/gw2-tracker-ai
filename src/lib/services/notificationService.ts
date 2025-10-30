// Browser Notification Service for GW2 Tracker

export type NotificationType = 'legendary_complete' | 'material_complete' | 'daily_reset' | 'boss_spawn';

interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationService {
  private static instance: NotificationService;
  private permission: NotificationPermission = 'default';
  private isSupported: boolean = false;

  private constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.isSupported = true;
      this.permission = Notification.permission;
    }
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Check if notifications are supported
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  // Get current permission status
  getPermission(): NotificationPermission {
    return this.permission;
  }

  // Request notification permission
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return 'denied';
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return 'denied';
    }
  }

  // Show a notification
  async showNotification(options: NotificationOptions): Promise<boolean> {
    // Check if notifications are supported
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    // Check permission
    if (this.permission === 'default') {
      await this.requestPermission();
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted');
      return false;
    }

    try {
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icon-192x192.png',
        badge: options.badge || '/icon-72x72.png',
        tag: options.tag,
        requireInteraction: options.requireInteraction || false,
      });

      // Auto close after 5 seconds if not requireInteraction
      if (!options.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      return true;
    } catch (error) {
      console.error('Error showing notification:', error);
      return false;
    }
  }

  // Legendary completion notification
  async notifyLegendaryComplete(legendaryName: string): Promise<boolean> {
    return this.showNotification({
      title: '🎉 Legendary Completed!',
      body: `Congratulations! You've completed ${legendaryName}!`,
      tag: 'legendary-complete',
      requireInteraction: true,
    });
  }

  // Material completion notification
  async notifyMaterialComplete(materialName: string, legendaryName: string): Promise<boolean> {
    return this.showNotification({
      title: '✅ Material Complete',
      body: `${materialName} for ${legendaryName} is now complete!`,
      tag: 'material-complete',
    });
  }

  // All materials ready notification
  async notifyAllMaterialsReady(legendaryName: string): Promise<boolean> {
    return this.showNotification({
      title: '🎊 All Materials Ready!',
      body: `All materials for ${legendaryName} are collected! Time to craft!`,
      tag: 'all-materials-ready',
      requireInteraction: true,
    });
  }

  // Daily reset notification
  async notifyDailyReset(): Promise<boolean> {
    return this.showNotification({
      title: '🔄 Daily Reset',
      body: 'Daily quests and achievements have been reset!',
      tag: 'daily-reset',
    });
  }

  // World boss spawn notification
  async notifyBossSpawn(bossName: string): Promise<boolean> {
    return this.showNotification({
      title: '⚔️ Boss Spawning Soon',
      body: `${bossName} is spawning in 5 minutes!`,
      tag: `boss-${bossName}`,
    });
  }

  // Progress milestone notification
  async notifyProgressMilestone(legendaryName: string, progress: number): Promise<boolean> {
    const milestones = [25, 50, 75, 90];
    if (!milestones.includes(progress)) {
      return false;
    }

    return this.showNotification({
      title: `📈 ${progress}% Progress!`,
      body: `You're ${progress}% done with ${legendaryName}!`,
      tag: `progress-${legendaryName}-${progress}`,
    });
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Helper hooks for React components
export function useNotificationPermission() {
  if (typeof window === 'undefined') {
    return {
      permission: 'default' as NotificationPermission,
      isSupported: false,
      requestPermission: async () => 'denied' as NotificationPermission,
    };
  }

  return {
    permission: notificationService.getPermission(),
    isSupported: notificationService.isNotificationSupported(),
    requestPermission: () => notificationService.requestPermission(),
  };
}
