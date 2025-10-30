'use client';

import { useState } from 'react';
import { CharacterCard } from './CharacterCard';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Swords } from 'lucide-react';

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

interface CharacterListProps {
  characters: Character[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

export function CharacterList({ characters, isLoading, onRefresh }: CharacterListProps) {
  const { showToast } = useToast();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const handleDelete = async (characterId: string) => {
    if (!confirm('Are you sure you want to delete this character?')) {
      return;
    }

    setDeletingIds((prev) => new Set(prev).add(characterId));

    try {
      const response = await fetch(`/api/characters?id=${characterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }

      showToast('success', 'Character deleted successfully');
      if (onRefresh) onRefresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to delete character');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(characterId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <Card className="glass p-12 text-center">
        <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-300 mb-2">No Characters Found</h3>
        <p className="text-gray-500">
          Click &quot;Sync from GW2&quot; to import your characters from the Guild Wars 2 API
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {characters.map((character, index) => (
        <CharacterCard
          key={character.id}
          character={character}
          onDelete={handleDelete}
          delay={index * 0.05}
        />
      ))}
    </div>
  );
}
