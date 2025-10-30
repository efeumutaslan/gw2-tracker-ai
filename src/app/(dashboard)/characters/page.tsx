'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Swords, Users, Trophy } from 'lucide-react';
import { CharacterList } from '@/components/characters/CharacterList';
import { Card } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';

export default function CharactersPage() {
  const { showToast } = useToast();
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/characters');
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCharacters();
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch('/api/gw2/sync', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sync characters');
      }

      showToast('success', data.message);
      fetchCharacters();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to sync characters');
    } finally {
      setIsSyncing(false);
    }
  };

  // Calculate stats
  const totalCharacters = characters.length;
  const maxLevelChars = characters.filter((c: any) => c.level === 80).length;
  const totalPlaytime = characters.reduce((sum: number, c: any) => sum + (c.age || 0), 0);
  const uniqueProfessions = new Set(characters.map((c: any) => c.profession)).size;

  const formatPlaytime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            Characters
          </h1>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync from GW2'}
        </button>
      </div>

      {/* Stats Overview */}
      {!isLoading && totalCharacters > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Swords}
            label="Total Characters"
            value={totalCharacters}
            color="text-primary-400"
            delay={0}
          />
          <StatCard
            icon={Trophy}
            label="Max Level"
            value={maxLevelChars}
            subtitle={`${((maxLevelChars / totalCharacters) * 100).toFixed(0)}% at level 80`}
            color="text-legendary"
            delay={0.1}
          />
          <StatCard
            icon={Users}
            label="Total Playtime"
            value={formatPlaytime(totalPlaytime)}
            color="text-blue-400"
            delay={0.2}
          />
          <StatCard
            icon={Swords}
            label="Professions"
            value={uniqueProfessions}
            subtitle={`${uniqueProfessions} different classes`}
            color="text-green-400"
            delay={0.3}
          />
        </div>
      )}

      {/* Character List */}
      <CharacterList characters={characters} isLoading={isLoading} onRefresh={fetchCharacters} />
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  subtitle?: string;
  color: string;
  delay: number;
}

function StatCard({ icon: Icon, label, value, subtitle, color, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass p-6 hover:border-primary-500/50 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-100">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </Card>
    </motion.div>
  );
}
