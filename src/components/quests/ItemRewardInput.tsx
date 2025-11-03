'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Plus, X, Coins } from 'lucide-react';

export interface ItemReward {
  id: string;
  name: string;
  quantity: number;
}

interface ItemRewardInputProps {
  rewards: ItemReward[];
  goldReward: string;
  onRewardsChange: (rewards: ItemReward[]) => void;
  onGoldChange: (gold: string) => void;
  disabled?: boolean;
}

export function ItemRewardInput({
  rewards,
  goldReward,
  onRewardsChange,
  onGoldChange,
  disabled = false,
}: ItemRewardInputProps) {
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');

  const handleAddReward = () => {
    if (!itemName.trim() || !itemQuantity || parseInt(itemQuantity) <= 0) {
      return;
    }

    const newReward: ItemReward = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: parseInt(itemQuantity),
    };

    onRewardsChange([...rewards, newReward]);
    setItemName('');
    setItemQuantity('');
  };

  const handleRemoveReward = (id: string) => {
    onRewardsChange(rewards.filter(r => r.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddReward();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">
        Quest Rewards
      </label>

      {/* Gold Reward */}
      <div className="flex items-center gap-2">
        <Coins className="w-5 h-5 text-yellow-500 flex-shrink-0" />
        <Input
          label=""
          type="number"
          value={goldReward}
          onChange={(e) => onGoldChange(e.target.value)}
          placeholder="Gold amount (e.g., 2.5)"
          disabled={disabled}
          min="0"
          step="0.01"
        />
        <span className="text-sm text-gray-400 whitespace-nowrap">gold</span>
      </div>

      {/* Add Item Reward */}
      <div className="space-y-2">
        <p className="text-xs text-gray-400">Add material/item rewards:</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              label=""
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Item name (e.g., Kralkite Ore)"
              disabled={disabled}
            />
          </div>
          <div className="w-24">
            <Input
              label=""
              type="number"
              value={itemQuantity}
              onChange={(e) => setItemQuantity(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Qty"
              disabled={disabled}
              min="1"
            />
          </div>
          <Button
            type="button"
            onClick={handleAddReward}
            disabled={disabled || !itemName.trim() || !itemQuantity}
            className="px-3 flex-shrink-0"
            title="Add reward"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Reward List */}
      {rewards.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400">Item rewards:</p>
          <div className="space-y-1">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-2 bg-dark-700/50 rounded border border-dark-600/50 group hover:border-primary-500/30 transition-colors"
              >
                <span className="text-sm text-gray-200">
                  <span className="font-medium text-primary-400">{reward.quantity}x</span>{' '}
                  {reward.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveReward(reward.id)}
                  disabled={disabled}
                  className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove reward"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        Example rewards: Kralkite Ore, Mystic Coin, Laurel, Spirit Shard, etc.
      </p>
    </div>
  );
}
