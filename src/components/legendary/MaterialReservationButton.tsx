'use client';

import { useState } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface MaterialReservationButtonProps {
  legendaryId: string;
  legendaryName: string;
  itemId: number;
  itemName: string;
  requiredQuantity: number;
  ownedQuantity: number;
  currentReservation?: number;
  onReservationChange?: () => void;
}

export function MaterialReservationButton({
  legendaryId,
  legendaryName,
  itemId,
  itemName,
  requiredQuantity,
  ownedQuantity,
  currentReservation = 0,
  onReservationChange,
}: MaterialReservationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const isReserved = currentReservation > 0;
  const canReserve = ownedQuantity >= requiredQuantity;

  const handleToggleReservation = async () => {
    setIsLoading(true);
    try {
      if (isReserved) {
        // Remove reservation
        const response = await fetch('/api/legendary/reservations', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            legendaryId,
            itemId,
          }),
        });

        if (response.ok) {
          showToast('success', `Unreserved ${itemName}`);
          onReservationChange?.();
        } else {
          showToast('error', 'Failed to remove reservation');
        }
      } else {
        // Add reservation
        if (!canReserve) {
          showToast('warning', 'Not enough materials to reserve');
          return;
        }

        const response = await fetch('/api/legendary/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            legendaryId,
            itemId,
            quantity: requiredQuantity,
          }),
        });

        if (response.ok) {
          showToast('success', `Reserved ${requiredQuantity}x ${itemName} for ${legendaryName}`);
          onReservationChange?.();
        } else {
          showToast('error', 'Failed to reserve materials');
        }
      }
    } catch (error) {
      console.error('Reservation error:', error);
      showToast('error', 'Failed to update reservation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleReservation}
      disabled={isLoading || (!isReserved && !canReserve)}
      className={`flex items-center gap-1 ${
        isReserved
          ? 'text-orange-400 hover:text-orange-300'
          : 'text-gray-400 hover:text-gray-300'
      }`}
      title={
        isReserved
          ? 'Click to unreserve'
          : canReserve
          ? 'Reserve materials for this legendary'
          : 'Not enough materials to reserve'
      }
    >
      {isLoading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : isReserved ? (
        <Lock className="w-3 h-3" />
      ) : (
        <Unlock className="w-3 h-3" />
      )}
      <span className="text-xs">
        {isReserved ? 'Reserved' : 'Reserve'}
      </span>
    </Button>
  );
}
