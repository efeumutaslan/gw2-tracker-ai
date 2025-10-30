'use client';

import { Select } from '@/components/ui/Select';

interface Character {
  id: string;
  gw2CharacterName: string;
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
      label: char.gw2CharacterName,
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
