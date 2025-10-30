'use client';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface WaypointButtonProps {
  waypointCode: string;
}

export function WaypointButton({ waypointCode }: WaypointButtonProps) {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(waypointCode);
      showToast('success', 'Waypoint code copied to clipboard!');
    } catch (error) {
      showToast('error', 'Failed to copy waypoint code');
    }
  };

  return (
    <Button size="sm" variant="secondary" onClick={handleCopy}>
      📍 Copy Waypoint
    </Button>
  );
}
