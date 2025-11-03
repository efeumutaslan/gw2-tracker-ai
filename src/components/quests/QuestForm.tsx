'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { QuestTemplateSelector } from './QuestTemplateSelector';
import { ItemRewardInput, ItemReward } from './ItemRewardInput';
import { QuestTemplate } from '@/lib/data/questTemplates';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const categoryOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'farming', label: 'Farming' },
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'custom', label: 'Custom' },
  { value: 'once', label: 'Once' },
];

export function QuestForm({ onSuccess, onCancel }: QuestFormProps) {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);
  const [itemRewards, setItemRewards] = useState<ItemReward[]>([]);
  const [goldReward, setGoldReward] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'daily',
    frequency: 'daily',
    resetTime: '00:00',
    questType: 'account', // 'account' or 'character'
    waypointCode: '',
    durationMinutes: '',
    durationSeconds: '',
    notes: '',
  });

  const handleTemplateSelect = (template: QuestTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      category: template.category,
      frequency: template.frequency,
      resetTime: template.frequency === 'daily' ? '00:00' : '07:30',
      questType: 'account',
      waypointCode: template.waypointCode || '',
      durationMinutes: template.estimatedDurationMinutes?.toString() || '',
      durationSeconds: '',
      notes: template.tags.join(', '),
    });
    // Set gold reward if template has one
    if (template.goldReward) {
      setGoldReward(template.goldReward.toString());
    }
    setItemRewards([]);
    setShowTemplates(false);
    showToast('success', `Template "${template.name}" loaded!`);
  };

  // Auto-set reset time based on frequency
  useEffect(() => {
    if (formData.frequency === 'daily') {
      setFormData(prev => ({ ...prev, resetTime: '00:00' }));
    } else if (formData.frequency === 'weekly') {
      setFormData(prev => ({ ...prev, resetTime: '07:30' }));
    }
  }, [formData.frequency]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      showToast('error', 'Quest name is required');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate total duration in minutes
      const minutes = parseInt(formData.durationMinutes || '0');
      const seconds = parseInt(formData.durationSeconds || '0');
      const totalMinutes = minutes + (seconds > 0 ? 1 : 0); // Round up if has seconds

      // Build reward string
      const rewardParts: string[] = [];

      // Add gold reward
      if (goldReward && parseFloat(goldReward) > 0) {
        rewardParts.push(`${goldReward} gold`);
      }

      // Add item rewards
      itemRewards.forEach(reward => {
        rewardParts.push(`${reward.quantity}x ${reward.name}`);
      });

      const rewardString = rewardParts.length > 0 ? `Rewards: ${rewardParts.join(', ')}` : '';

      const requestData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        category: formData.category,
        frequency: formData.frequency,
        resetTime: formData.frequency === 'once' ? '00:00' : formData.resetTime,
        isAccountBound: formData.questType === 'account',
        isCharacterBound: formData.questType === 'character',
        waypointCode: formData.waypointCode.trim() || undefined,
        goldReward: parseFloat(goldReward) || 0,
        estimatedDurationMinutes: totalMinutes || 0,
        notes: rewardString ? `${rewardString}${formData.notes ? '\n\n' + formData.notes : ''}` : formData.notes || undefined,
      };

      console.log('Sending quest data:', requestData);

      const response = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Quest creation error:', data);
        throw new Error(data.error || 'Failed to create quest');
      }

      showToast('success', 'Quest created successfully!');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Submit error:', error);
      showToast('error', error instanceof Error ? error.message : 'Failed to create quest');
    } finally {
      setIsLoading(false);
    }
  };

  const showResetTime = formData.frequency === 'custom';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Template Selector Section */}
      <div className="glass rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-primary-500/10 transition-colors group"
        >
          <span className="text-sm font-medium text-gray-200 group-hover:text-primary-300 transition-colors">
            {showTemplates ? 'Hide' : 'Show'} Quest Templates
          </span>
          {showTemplates ? (
            <ChevronUp className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary-400 group-hover:text-primary-300 transition-colors" />
          )}
        </button>
        {showTemplates && (
          <div className="p-4 border-t border-dark-600/50">
            <QuestTemplateSelector onSelectTemplate={handleTemplateSelect} />
          </div>
        )}
      </div>

      <Input
        label="Quest Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
        disabled={isLoading}
        placeholder="e.g., Daily Fractals"
      />

      <Input
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        disabled={isLoading}
        placeholder="Optional quest description"
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Category"
          options={categoryOptions}
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          disabled={isLoading}
        />
        <Select
          label="Frequency"
          options={frequencyOptions}
          value={formData.frequency}
          onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
          disabled={isLoading}
        />
      </div>

      {showResetTime && (
        <Input
          label="Custom Reset Time (HH:MM)"
          type="time"
          value={formData.resetTime}
          onChange={(e) => setFormData({ ...formData, resetTime: e.target.value })}
          disabled={isLoading}
          helperText="Set your custom reset time"
        />
      )}

      {formData.frequency !== 'once' && !showResetTime && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
          ℹ️ Reset time: {formData.frequency === 'daily' ? '00:00 UTC (GW2 daily reset)' : 'Monday 07:30 UTC (GW2 weekly reset)'}
        </div>
      )}

      <ItemRewardInput
        rewards={itemRewards}
        goldReward={goldReward}
        onRewardsChange={setItemRewards}
        onGoldChange={setGoldReward}
        disabled={isLoading}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Estimated Duration
        </label>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Minutes"
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
            disabled={isLoading}
            placeholder="0"
            min="0"
          />
          <Input
            label="Seconds"
            type="number"
            value={formData.durationSeconds}
            onChange={(e) => setFormData({ ...formData, durationSeconds: e.target.value })}
            disabled={isLoading}
            placeholder="0"
            min="0"
            max="59"
          />
        </div>
      </div>

      <Input
        label="Waypoint Code"
        value={formData.waypointCode}
        onChange={(e) => setFormData({ ...formData, waypointCode: e.target.value })}
        placeholder="[&BAAAAA=]"
        disabled={isLoading}
        helperText="GW2 waypoint chat code"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quest Type
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="questType"
              value="account"
              checked={formData.questType === 'account'}
              onChange={(e) => setFormData({ ...formData, questType: e.target.value })}
              disabled={isLoading}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Account Bound</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">One quest for your entire account</p>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="questType"
              value="character"
              checked={formData.questType === 'character'}
              onChange={(e) => setFormData({ ...formData, questType: e.target.value })}
              disabled={isLoading}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Character Bound</span>
              <p className="text-xs text-gray-500 dark:text-gray-400">Separate quest for each character</p>
            </div>
          </label>
        </div>
      </div>

      <Input
        label="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        disabled={isLoading}
        placeholder="Additional notes or tips"
      />

      <div className="flex gap-2">
        <Button type="submit" isLoading={isLoading} className="flex-1">
          Create Quest
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
