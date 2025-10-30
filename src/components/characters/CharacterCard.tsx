'use client';

import { motion } from 'framer-motion';
import { Clock, Skull, Wrench, Users, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface Character {
  id: string;
  characterName: string;
  race: string;
  profession: string;
  level: number;
  guild?: string;
  age: number;
  deaths: number;
  crafting?: Array<{ discipline: string; rating: number }>;
  lastSynced?: string | Date;
}

interface CharacterCardProps {
  character: Character;
  onDelete?: (characterId: string) => void;
  delay?: number;
}

export function CharacterCard({ character, onDelete, delay = 0 }: CharacterCardProps) {
  const professionColors = {
    Warrior: { bg: 'bg-yellow-900/20', border: 'border-yellow-600/50', text: 'text-yellow-400' },
    Guardian: { bg: 'bg-blue-900/20', border: 'border-blue-600/50', text: 'text-blue-400' },
    Revenant: { bg: 'bg-red-900/20', border: 'border-red-600/50', text: 'text-red-400' },
    Engineer: { bg: 'bg-orange-900/20', border: 'border-orange-600/50', text: 'text-orange-400' },
    Ranger: { bg: 'bg-green-900/20', border: 'border-green-600/50', text: 'text-green-400' },
    Thief: { bg: 'bg-purple-900/20', border: 'border-purple-600/50', text: 'text-purple-400' },
    Elementalist: { bg: 'bg-red-900/20', border: 'border-red-600/50', text: 'text-red-400' },
    Mesmer: { bg: 'bg-pink-900/20', border: 'border-pink-600/50', text: 'text-pink-400' },
    Necromancer: { bg: 'bg-emerald-900/20', border: 'border-emerald-600/50', text: 'text-emerald-400' },
  };

  const colors = professionColors[character.profession as keyof typeof professionColors] || {
    bg: 'bg-gray-900/20',
    border: 'border-gray-600/50',
    text: 'text-gray-400',
  };

  const raceIcons: Record<string, string> = {
    Asura: '🔬',
    Human: '👤',
    Charr: '🐱',
    Norn: '🐻',
    Sylvari: '🌿',
  };

  const formatPlaytime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      <Card className={`glass p-5 ${colors.border} border-2 ${colors.bg} hover:shadow-lg transition-all relative`}>
        {/* Delete Button */}
        {onDelete && (
          <button
            onClick={() => onDelete(character.id)}
            className="absolute top-3 right-3 p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-colors group"
            title="Delete character"
          >
            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
          </button>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4 mr-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{raceIcons[character.race] || '⚔️'}</span>
              <h3 className="text-xl font-bold text-gray-100 truncate">
                {character.characterName}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-1 text-xs font-medium rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                {character.profession}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-dark-700/50 text-gray-300 border border-dark-600">
                {character.race}
              </span>
            </div>
          </div>

          {/* Level Badge */}
          <div className={`${colors.bg} ${colors.border} border-2 rounded-lg px-3 py-2 text-center flex-shrink-0`}>
            <div className="text-xs text-gray-400 mb-1">Level</div>
            <div className={`text-2xl font-bold ${colors.text}`}>{character.level}</div>
          </div>
        </div>

        {/* Guild */}
        {character.guild && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-primary-400" />
            <span className="text-gray-300">{character.guild}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 p-2 bg-dark-700/30 rounded">
            <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500">Playtime</div>
              <div className="text-sm font-semibold text-gray-200">
                {formatPlaytime(character.age)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-dark-700/30 rounded">
            <Skull className="w-4 h-4 text-red-400 flex-shrink-0" />
            <div>
              <div className="text-xs text-gray-500">Deaths</div>
              <div className="text-sm font-semibold text-gray-200">{character.deaths}</div>
            </div>
          </div>
        </div>

        {/* Crafting Disciplines */}
        {character.crafting && character.crafting.length > 0 && (
          <div className="border-t border-dark-600 pt-3">
            <div className="flex items-center gap-2 mb-2">
              <Wrench className="w-4 h-4 text-primary-400" />
              <span className="text-xs font-medium text-gray-400">Crafting</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {character.crafting.map((craft, index) => (
                <div
                  key={index}
                  className="px-2 py-1 bg-primary-500/10 border border-primary-500/30 rounded text-xs"
                >
                  <span className="text-primary-300 font-medium">{craft.discipline}</span>
                  <span className="text-gray-500 ml-1">({craft.rating})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Synced */}
        {character.lastSynced && (
          <div className="mt-3 pt-3 border-t border-dark-600">
            <div className="text-xs text-gray-500">
              Last synced: {new Date(character.lastSynced).toLocaleString()}
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
