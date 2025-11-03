'use client';

import { Select } from '@/components/ui/Select';

interface Character {
  id: string;
  characterName?: string;
  gw2CharacterName?: string; // Fallback for compatibility
}

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacterId?: string;
  onChange: (characterId: string) => void;
  includeAll?: boolean;
}

export function CharacterSelector({
  characters,
  selectedCharacterId,
  onChange,
  includeAll = true,
}: CharacterSelectorProps) {
  const options = [
    ...(includeAll ? [{ value: 'all', label: 'All Characters' }] : []),
    ...characters.map((char) => ({
      value: char.id,
      label: char.characterName || char.gw2CharacterName || 'Unknown',
    })),
  ];

  return (
    <Select
      label="Filter by Character"
      options={options}
      value={selectedCharacterId || 'all'}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
