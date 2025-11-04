'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Coins,
  Lightbulb,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { CraftingStep, LegendaryCraftingGuide } from '@/lib/data/craftingGuides';

interface CraftingGuideProps {
  guide: LegendaryCraftingGuide;
}

export function CraftingGuide({ guide }: CraftingGuideProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['gift-of-mastery']));

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Guide Header */}
      <div className="glass p-6 rounded-lg border border-primary-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <BookOpen className="w-8 h-8 text-primary-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">
              Crafting Guide: {guide.legendaryName}
            </h2>
            <p className="text-gray-400 mb-4">{guide.overview}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary-400" />
                <span className="text-gray-400">Estimated Time:</span>
                <span className="text-gray-200 font-medium">{guide.estimatedTotalTime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Coins className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-400">Estimated Cost:</span>
                <span className="text-yellow-400 font-medium">{guide.estimatedTotalCost}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        {guide.prerequisites.length > 0 && (
          <div className="mt-4 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-gray-200">Prerequisites</h3>
            </div>
            <ul className="space-y-1 text-sm text-gray-400">
              {guide.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Circle className="w-3 h-3 mt-1 flex-shrink-0" />
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Crafting Steps */}
      <div className="space-y-3">
        {guide.steps.map((step, index) => (
          <CraftingStepCard
            key={step.id}
            step={step}
            stepNumber={index + 1}
            isExpanded={expandedSteps.has(step.id)}
            onToggle={() => toggleStep(step.id)}
            getDifficultyColor={getDifficultyColor}
            expandedSteps={expandedSteps}
            toggleSubstep={toggleStep}
          />
        ))}
      </div>
    </div>
  );
}

interface CraftingStepCardProps {
  step: CraftingStep;
  stepNumber: number;
  isExpanded: boolean;
  onToggle: () => void;
  getDifficultyColor: (difficulty?: string) => string;
  expandedSteps: Set<string>;
  toggleSubstep: (id: string) => void;
  level?: number;
}

function CraftingStepCard({
  step,
  stepNumber,
  isExpanded,
  onToggle,
  getDifficultyColor,
  expandedSteps,
  toggleSubstep,
  level = 0,
}: CraftingStepCardProps) {
  const indentClass = level > 0 ? 'ml-6 border-l-2 border-primary-500/30 pl-4' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={indentClass}
    >
      <div className="glass rounded-lg border border-dark-600/50 overflow-hidden">
        {/* Step Header */}
        <div
          className="p-4 cursor-pointer hover:bg-primary-500/5 transition-colors"
          onClick={onToggle}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {isExpanded ? (
                <ChevronDown className="w-5 h-5 text-primary-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-bold text-gray-100">{step.title}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {step.difficulty && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(
                        step.difficulty
                      )}`}
                    >
                      {step.difficulty.toUpperCase()}
                    </span>
                  )}
                  {step.estimatedTime && (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {step.estimatedTime}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-gray-400 text-sm">{step.description}</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-dark-600/50"
            >
              <div className="p-4 space-y-4">
                {/* Requirements */}
                {step.requirements && step.requirements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary-400" />
                      Requirements
                    </h4>
                    <ul className="space-y-1">
                      {step.requirements.map((req, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-400 flex items-start gap-2 pl-6"
                        >
                          <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 fill-primary-400 text-primary-400" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                {step.tips && step.tips.length > 0 && (
                  <div className="p-3 bg-primary-500/5 rounded-lg border border-primary-500/20">
                    <h4 className="text-sm font-semibold text-primary-400 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Pro Tips
                    </h4>
                    <ul className="space-y-2">
                      {step.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-primary-400 font-bold mt-0.5">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Substeps */}
                {step.substeps && step.substeps.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {step.substeps.map((substep, index) => (
                      <CraftingStepCard
                        key={substep.id}
                        step={substep}
                        stepNumber={index + 1}
                        isExpanded={expandedSteps.has(substep.id)}
                        onToggle={() => toggleSubstep(substep.id)}
                        getDifficultyColor={getDifficultyColor}
                        expandedSteps={expandedSteps}
                        toggleSubstep={toggleSubstep}
                        level={level + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
