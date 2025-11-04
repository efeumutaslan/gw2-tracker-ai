'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, Filter, Star } from 'lucide-react';
import Link from 'next/link';
import { LEGENDARY_WEAPONS } from '@/lib/data/legendaryWeapons';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function LegendaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showOnlyTracked, setShowOnlyTracked] = useState(false);
  const [trackedLegendaries, setTrackedLegendaries] = useState<string[]>([]);

  // Fetch tracked legendaries
  useEffect(() => {
    const fetchTrackedLegendaries = async () => {
      try {
        const response = await fetch('/api/legendary/track');
        if (response.ok) {
          const data = await response.json();
          setTrackedLegendaries(data.trackedLegendaries || []);
        }
      } catch (error) {
        console.error('Failed to fetch tracked legendaries:', error);
      }
    };

    fetchTrackedLegendaries();
  }, []);

  // Filter legendaries
  const filteredLegendaries = LEGENDARY_WEAPONS.filter((legendary) => {
    const matchesSearch = legendary.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         legendary.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGeneration = selectedGeneration === 'all' || legendary.generation.toString() === selectedGeneration;
    const matchesType = selectedType === 'all' || legendary.type === selectedType;
    const matchesTracked = !showOnlyTracked || trackedLegendaries.includes(legendary.id);

    return matchesSearch && matchesGeneration && matchesType && matchesTracked;
  });

  // Get unique weapon types
  const weaponTypes = Array.from(new Set(LEGENDARY_WEAPONS.map(l => l.type))).sort();

  const generationOptions = [
    { value: 'all', label: 'All Generations' },
    { value: '1', label: 'Generation 1' },
    { value: '2', label: 'Generation 2' },
    { value: '3', label: 'Generation 3' },
  ];

  const typeOptions = [
    { value: 'all', label: 'All Weapon Types' },
    ...weaponTypes.map(type => ({
      value: type,
      label: type.charAt(0).toUpperCase() + type.slice(1),
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-8 rounded-lg border border-legendary/30">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-legendary/20 rounded-lg border border-legendary/30">
            <Sparkles className="w-8 h-8 text-legendary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-100 tracking-tight">
              Legendary Weapons
            </h1>
            <p className="text-gray-400 mt-1">
              Track your legendary weapon crafting with detailed material breakdowns
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-4 rounded-lg border border-dark-600/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Input
              placeholder="Search legendary weapons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Generation Filter */}
          <Select
            options={generationOptions}
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
          />

          {/* Type Filter */}
          <Select
            options={typeOptions}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          />

          {/* Tracked Filter */}
          <button
            onClick={() => setShowOnlyTracked(!showOnlyTracked)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              showOnlyTracked
                ? 'bg-legendary/20 border-legendary/50 text-legendary'
                : 'bg-dark-700 border-dark-600 text-gray-400 hover:border-dark-500'
            }`}
          >
            <Star className={`w-4 h-4 ${showOnlyTracked ? 'fill-legendary' : ''}`} />
            <span className="text-sm">Tracked Only</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass p-4 rounded-lg border border-primary-500/30">
          <p className="text-sm text-gray-400 mb-1">Total Legendaries</p>
          <p className="text-3xl font-bold text-gray-200">{LEGENDARY_WEAPONS.length}</p>
        </div>
        <div className="glass p-4 rounded-lg border border-legendary/30">
          <p className="text-sm text-gray-400 mb-1">Currently Tracking</p>
          <p className="text-3xl font-bold text-legendary">{trackedLegendaries.length}</p>
        </div>
        <div className="glass p-4 rounded-lg border border-primary-500/30">
          <p className="text-sm text-gray-400 mb-1">Filtered Results</p>
          <p className="text-3xl font-bold text-gray-200">{filteredLegendaries.length}</p>
        </div>
      </div>

      {/* Legendary Grid */}
      {filteredLegendaries.length === 0 ? (
        <div className="glass p-12 rounded-lg border border-dark-600/50 text-center">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No Results Found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLegendaries.map((legendary, index) => (
            <LegendaryCard
              key={legendary.id}
              legendary={legendary}
              delay={index * 0.05}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface LegendaryCardProps {
  legendary: {
    id: string;
    name: string;
    type: string;
    generation: number;
    icon: string;
    wikiLink: string;
    description?: string;
  };
  delay: number;
}

function LegendaryCard({ legendary, delay }: LegendaryCardProps) {
  const generationColors = {
    1: 'border-yellow-500/30 bg-yellow-500/5',
    2: 'border-orange-500/30 bg-orange-500/5',
    3: 'border-purple-500/30 bg-purple-500/5',
  };

  const generationBadgeColors = {
    1: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    2: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    3: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={`/legendary/${legendary.id}`}>
        <div
          className={`glass p-6 rounded-lg border ${
            generationColors[legendary.generation as keyof typeof generationColors]
          } hover:border-legendary/50 transition-all duration-300 cursor-pointer group h-full`}
        >
          {/* Icon and Generation Badge */}
          <div className="relative mb-4">
            <div className="w-20 h-20 mx-auto relative bg-legendary/10 rounded-lg flex items-center justify-center">
              <img
                src={legendary.icon}
                alt={legendary.name}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(255,183,77,0.5)]"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-icon text-4xl';
                    fallback.textContent = '✨';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div
              className={`absolute top-0 right-0 px-2 py-1 rounded text-xs font-bold border ${
                generationBadgeColors[legendary.generation as keyof typeof generationBadgeColors]
              }`}
            >
              Gen {legendary.generation}
            </div>
          </div>

          {/* Name and Type */}
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold text-legendary mb-1 group-hover:text-legendary/80 transition-colors">
              {legendary.name}
            </h3>
            <p className="text-sm text-gray-400 capitalize">
              {legendary.type}
            </p>
          </div>

          {/* Description */}
          {legendary.description && (
            <p className="text-xs text-gray-500 text-center line-clamp-2">
              {legendary.description}
            </p>
          )}

          {/* Hover Effect */}
          <div className="mt-4 pt-4 border-t border-dark-600/50">
            <p className="text-xs text-center text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to view materials & progress →
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
