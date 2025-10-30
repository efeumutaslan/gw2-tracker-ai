'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Filter } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  ALL_LEGENDARIES,
  type LegendaryItem,
} from '@/lib/services/legendaryService';

interface LegendarySelectorProps {
  onSelect: (legendaryId: number, name: string, type: string, tier: string) => void;
  onClose: () => void;
}

export function LegendarySelector({ onSelect, onClose }: LegendarySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'weapon' | 'armor'>('all');
  const [filterTier, setFilterTier] = useState<'all' | 'gen1' | 'gen2' | 'gen3'>('all');

  // Filter legendaries
  const filteredLegendaries = ALL_LEGENDARIES.filter((legendary) => {
    const matchesSearch = legendary.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || legendary.type === filterType;
    const matchesTier = filterTier === 'all' || legendary.tier === filterTier;
    return matchesSearch && matchesType && matchesTier;
  });

  const handleSelect = (legendary: LegendaryItem) => {
    onSelect(legendary.id, legendary.name, legendary.type, legendary.tier);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gen1':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'gen2':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'gen3':
        return 'bg-legendary/20 text-legendary border-legendary/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          <Card className="glass border-legendary/30">
            <CardBody>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100">Select Legendary</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4 mb-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search legendary items..."
                    className="pl-10"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">Filters:</span>
                  </div>

                  {/* Type Filter */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={filterType === 'all' ? 'primary' : 'ghost'}
                      onClick={() => setFilterType('all')}
                    >
                      All Types
                    </Button>
                    <Button
                      size="sm"
                      variant={filterType === 'weapon' ? 'primary' : 'ghost'}
                      onClick={() => setFilterType('weapon')}
                    >
                      Weapons
                    </Button>
                    <Button
                      size="sm"
                      variant={filterType === 'armor' ? 'primary' : 'ghost'}
                      onClick={() => setFilterType('armor')}
                    >
                      Armor
                    </Button>
                  </div>

                  {/* Tier Filter */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={filterTier === 'all' ? 'primary' : 'ghost'}
                      onClick={() => setFilterTier('all')}
                    >
                      All Gens
                    </Button>
                    <Button
                      size="sm"
                      variant={filterTier === 'gen1' ? 'primary' : 'ghost'}
                      onClick={() => setFilterTier('gen1')}
                      className="text-blue-400"
                    >
                      Gen 1
                    </Button>
                    <Button
                      size="sm"
                      variant={filterTier === 'gen2' ? 'primary' : 'ghost'}
                      onClick={() => setFilterTier('gen2')}
                      className="text-purple-400"
                    >
                      Gen 2
                    </Button>
                    <Button
                      size="sm"
                      variant={filterTier === 'gen3' ? 'primary' : 'ghost'}
                      onClick={() => setFilterTier('gen3')}
                      className="text-legendary"
                    >
                      Gen 3
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="max-h-[50vh] overflow-y-auto pr-2">
                {filteredLegendaries.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No legendaries found matching your criteria</p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {filteredLegendaries.map((legendary) => (
                      <motion.div
                        key={legendary.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-hover p-4 rounded-lg border border-primary-500/20 cursor-pointer hover:border-legendary/50 transition-colors"
                        onClick={() => handleSelect(legendary)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          {legendary.iconUrl ? (
                            <img
                              src={legendary.iconUrl}
                              alt={legendary.name}
                              className="w-16 h-16 rounded border-2 border-legendary/50"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded border-2 border-legendary/50 bg-legendary/10 flex items-center justify-center text-2xl">
                              ✨
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-100 mb-1">
                              {legendary.name}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-xs px-2 py-1 rounded border ${getTierColor(legendary.tier)}`}>
                                {legendary.tier.toUpperCase()}
                              </span>
                              <span className="text-sm text-gray-400 capitalize">
                                {legendary.type}
                                {legendary.weaponType && ` - ${legendary.weaponType}`}
                                {legendary.armorType && ` - ${legendary.armorType}`}
                              </span>
                            </div>
                            {legendary.description && (
                              <p className="text-sm text-gray-500 mt-1 truncate">
                                {legendary.description}
                              </p>
                            )}
                          </div>

                          {/* Material Count */}
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Materials</p>
                            <p className="text-lg font-bold text-primary-400">
                              {legendary.requiredMaterials.length}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
