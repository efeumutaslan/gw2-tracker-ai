'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Coins, Copy, Sparkles } from 'lucide-react';
import { QUEST_TEMPLATES, QuestTemplate, getAllTags } from '@/lib/data/questTemplates';

interface QuestTemplateSelectorProps {
  onSelectTemplate: (template: QuestTemplate) => void;
}

export function QuestTemplateSelector({ onSelectTemplate }: QuestTemplateSelectorProps) {
  const [selectedFrequency, setSelectedFrequency] = useState<'daily' | 'weekly'>('daily');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = getAllTags();

  const filteredTemplates = QUEST_TEMPLATES.filter((template) => {
    const matchesFrequency = template.frequency === selectedFrequency;
    const matchesTag = selectedTag === 'all' || template.tags.includes(selectedTag);
    return matchesFrequency && matchesTag;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 text-primary-400">
        <Sparkles className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Quick Start Templates</h3>
      </div>

      {/* Frequency Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedFrequency('daily')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFrequency === 'daily'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
              : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50 hover:text-gray-200'
          }`}
        >
          Daily Quests
        </button>
        <button
          onClick={() => setSelectedFrequency('weekly')}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
            selectedFrequency === 'weekly'
              ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
              : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50 hover:text-gray-200'
          }`}
        >
          Weekly Quests
        </button>
      </div>

      {/* Tag Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTag('all')}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            selectedTag === 'all'
              ? 'bg-primary-500/20 border border-primary-500/50 text-primary-300'
              : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50 hover:text-gray-200'
          }`}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedTag === tag
                ? 'bg-primary-500/20 border border-primary-500/50 text-primary-300'
                : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50 hover:text-gray-200'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredTemplates.map((template) => (
            <motion.button
              key={template.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectTemplate(template)}
              className="glass p-4 rounded-lg text-left group hover:border-primary-500/50 transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="text-3xl">{template.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-200 group-hover:text-primary-400 transition-colors">
                      {template.name}
                    </h4>
                    <Copy className="w-4 h-4 text-gray-500 group-hover:text-primary-400 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    {template.estimatedDurationMinutes && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.estimatedDurationMinutes}m
                      </div>
                    )}
                    {template.goldReward && (
                      <div className="flex items-center gap-1 text-[#C9B037]">
                        <Coins className="w-3 h-3" />
                        {template.goldReward}g
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-dark-700/80 text-gray-300 text-xs rounded group-hover:bg-primary-500/20 group-hover:text-primary-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No templates found for the selected filters.
        </div>
      )}
    </div>
  );
}
