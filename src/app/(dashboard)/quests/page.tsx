'use client';

import { useEffect, useState } from 'react';
import { QuestList } from '@/components/quests/QuestList';
import { QuestForm } from '@/components/quests/QuestForm';
import { CharacterSelector } from '@/components/characters/CharacterSelector';
import { ExportImportButtons } from '@/components/quests/ExportImportButtons';
import { FilterBar } from '@/components/quests/FilterBar';
import { QuickActions } from '@/components/quests/QuickActions';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { QuestFilters, getUniqueCategories, getQuestCounts } from '@/lib/utils/questFilters';

export default function QuestsPage() {
  const [quests, setQuests] = useState([]);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');
  const [filters, setFilters] = useState<QuestFilters>({
    searchQuery: '',
    category: 'all',
    status: 'all',
    priority: 'all',
    favorite: 'all',
    sortBy: 'dateAdded',
  });

  const fetchQuests = async () => {
    setIsLoading(true);
    try {
      const url = selectedCharacter && selectedCharacter !== 'all'
        ? `/api/quests?characterId=${selectedCharacter}`
        : '/api/quests';

      const response = await fetch(url);
      const data = await response.json();
      setQuests(data.quests || []);
    } catch (error) {
      console.error('Failed to fetch quests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await fetch('/api/characters');
      const data = await response.json();
      setCharacters(data.characters || []);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
  };

  useEffect(() => {
    fetchQuests();
    fetchCharacters();
  }, [selectedCharacter]);

  const handleQuestCreated = () => {
    setIsModalOpen(false);
    fetchQuests();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-1 w-12 bg-gradient-to-r from-primary-500 to-transparent rounded-full" />
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
            Quests
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <QuickActions quests={quests} onRefresh={fetchQuests} />
          <ExportImportButtons
            quests={quests}
            characters={characters}
            onImportComplete={fetchQuests}
          />
          <Button onClick={() => setIsModalOpen(true)} className="btn-glow">
            + Create Quest
          </Button>
        </div>
      </div>

      <div className="mb-6 max-w-xs">
        <CharacterSelector
          characters={characters}
          selectedCharacterId={selectedCharacter}
          onChange={setSelectedCharacter}
        />
      </div>

      <FilterBar
        filters={filters}
        categories={getUniqueCategories(quests)}
        questCounts={getQuestCounts(quests)}
        onFiltersChange={setFilters}
      />

      <QuestList quests={quests} filters={filters} isLoading={isLoading} onRefresh={fetchQuests} />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Quest"
        size="lg"
      >
        <QuestForm
          onSuccess={handleQuestCreated}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
