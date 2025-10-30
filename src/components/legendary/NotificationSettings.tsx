'use client';

import { useState, useEffect } from 'react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '@/lib/services/notificationService';
import { useToast } from '@/components/ui/Toast';

export function NotificationSettings() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSupported(notificationService.isNotificationSupported());
      setPermission(notificationService.getPermission());
    }
  }, []);

  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);

      if (newPermission === 'granted') {
        showToast('success', 'Notifications enabled! You&apos;ll receive alerts for legendary progress.');
        // Send test notification
        await notificationService.showNotification({
          title: '🔔 Notifications Enabled',
          body: 'You&apos;ll now receive updates about your legendary goals!',
          tag: 'test-notification',
        });
      } else {
        showToast('error', 'Notification permission denied. Enable it in browser settings.');
      }
    } catch (error) {
      showToast('error', 'Failed to request notification permission');
    } finally {
      setIsRequesting(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="glass border-gray-500/30">
        <CardBody>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-300 mb-1">Notifications Not Supported</h3>
              <p className="text-sm text-gray-400">
                Your browser doesn&apos;t support notifications. Try using Chrome, Firefox, or Edge.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (permission === 'granted') {
    return (
      <Card className="glass border-green-500/30">
        <CardBody>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Bell className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-green-300 mb-1 flex items-center gap-2">
                  Notifications Enabled
                  <CheckCircle className="w-4 h-4" />
                </h3>
                <p className="text-sm text-gray-400">
                  You&apos;ll receive alerts for legendary completion and material progress
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  if (permission === 'denied') {
    return (
      <Card className="glass border-red-500/30">
        <CardBody>
          <div className="flex items-start gap-3">
            <BellOff className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-300 mb-1">Notifications Blocked</h3>
              <p className="text-sm text-gray-400 mb-3">
                You&apos;ve blocked notifications. To enable them:
              </p>
              <ol className="text-sm text-gray-400 list-decimal list-inside space-y-1">
                <li>Click the lock icon in your browser&apos;s address bar</li>
                <li>Find &quot;Notifications&quot; in the permissions list</li>
                <li>Change it to &quot;Allow&quot;</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="glass border-primary-500/30">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-500/20 rounded-lg">
              <Bell className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-200 mb-1">Enable Notifications</h3>
              <p className="text-sm text-gray-400">
                Get notified when you complete legendary goals or materials
              </p>
            </div>
          </div>
          <Button
            onClick={handleRequestPermission}
            disabled={isRequesting}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {isRequesting ? 'Requesting...' : 'Enable'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
