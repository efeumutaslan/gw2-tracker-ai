'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, ExternalLink, CheckCircle2, Circle, Info, Coins, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getLegendaryById } from '@/lib/data/legendaryWeapons';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { MaterialAcquisitionModal } from '@/components/legendary/MaterialAcquisitionModal';
import { MaterialReservationButton } from '@/components/legendary/MaterialReservationButton';
import { CraftingGuide } from '@/components/legendary/CraftingGuide';
import { getCraftingGuide } from '@/lib/data/craftingGuides';
import { ProgressHistoryChart } from '@/components/legendary/ProgressHistoryChart';

// This will be replaced with actual data from API
import { ETERNITY_DATA } from '@/types/legendary';

// Helper function to format GW2 currency (copper to gold/silver/copper)
function formatGold(copper: number): string {
  if (copper === 0) return '0c';

  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRemainder = copper % 100;

  const parts = [];
  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (copperRemainder > 0 || parts.length === 0) parts.push(`${copperRemainder}c`);

  return parts.join(' ');
}

export default function LegendaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const legendaryId = params.id as string;

  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [materialsData, setMaterialsData] = useState<any>(null);
  const [isLoadingMaterials, setIsLoadingMaterials] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [reservations, setReservations] = useState<Record<number, number>>({});
  const [activeTab, setActiveTab] = useState<'materials' | 'crafting-guide' | 'progress-history'>('materials');

  // Get basic legendary info
  const legendaryBasic = getLegendaryById(legendaryId);

  // For now, use Eternity example data for all legendaries
  const legendary = legendaryId === 'eternity' ? {
    ...ETERNITY_DATA,
    id: 'eternity',
    overallProgress: 0,
    totalMaterialsOwned: 0,
    isTracking: false,
  } : null;

  // Fetch user's materials from GW2 API
  const fetchMaterials = async (showSuccessToast = false) => {
    if (!legendary) return;

    setIsLoadingMaterials(true);
    try {
      // Extract all item IDs from legendary components
      const itemIds: number[] = [];
      const extractItemIds = (components: any[]) => {
        components.forEach((component: any) => {
          if (component.materials) {
            component.materials.forEach((mat: any) => {
              if (mat.itemId) {
                itemIds.push(mat.itemId);
              }
            });
          }
          if (component.subComponents) {
            extractItemIds(component.subComponents);
          }
        });
      };
      extractItemIds(legendary.components);

      if (itemIds.length > 0) {
        const response = await fetch('/api/legendary/materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemIds: Array.from(new Set(itemIds)) }),
        });

        if (response.ok) {
          const data = await response.json();
          setMaterialsData(data.materials);
          setLastSyncTime(new Date());
          if (showSuccessToast) {
            showToast('success', 'Materials updated successfully!');
          }
        } else {
          showToast('error', 'Failed to fetch materials');
        }
      }
    } catch (error) {
      console.error('Failed to fetch materials:', error);
      showToast('error', 'Failed to fetch materials');
    } finally {
      setIsLoadingMaterials(false);
    }
  };

  // Fetch reservations for this legendary
  const fetchReservations = async () => {
    if (!legendaryId) return;

    try {
      const response = await fetch(`/api/legendary/reservations?legendaryId=${legendaryId}`);
      if (response.ok) {
        const data = await response.json();
        setReservations(data.reservations || {});
      }
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legendaryId]);

  // Check if legendary is being tracked
  useEffect(() => {
    const checkTrackingStatus = async () => {
      if (!legendaryId) return;

      try {
        const response = await fetch(`/api/legendary/track?legendaryId=${legendaryId}`);
        if (response.ok) {
          const data = await response.json();
          setIsTracking(data.isTracking);
        }
      } catch (error) {
        console.error('Failed to check tracking status:', error);
      }
    };

    checkTrackingStatus();
  }, [legendaryId]);

  // Calculate real progress based on materialsData
  const calculateMaterialProgress = (materials: any[], materialsData: any) => {
    if (!materials || materials.length === 0) return { completed: 0, total: 0, percentage: 0 };

    let completedCount = 0;
    let totalCount = materials.length;

    materials.forEach((material: any) => {
      const realMaterial = materialsData?.find((m: any) => m.itemId === material.itemId);
      const ownedCount = realMaterial?.owned || material.owned || 0;

      if (ownedCount >= material.quantity) {
        completedCount++;
      }
    });

    return {
      completed: completedCount,
      total: totalCount,
      percentage: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
    };
  };

  const calculateComponentProgress = (component: any, materialsData: any): any => {
    let totalMaterials = 0;
    let completedMaterials = 0;
    let totalQuantityNeeded = 0;
    let totalQuantityOwned = 0;

    // Count direct materials
    if (component.materials && component.materials.length > 0) {
      component.materials.forEach((material: any) => {
        totalMaterials++;
        totalQuantityNeeded += material.quantity;

        const realMaterial = materialsData?.find((m: any) => m.itemId === material.itemId);
        const ownedCount = realMaterial?.owned || material.owned || 0;
        totalQuantityOwned += Math.min(ownedCount, material.quantity);

        if (ownedCount >= material.quantity) {
          completedMaterials++;
        }
      });
    }

    // Recursively count sub-components
    if (component.subComponents && component.subComponents.length > 0) {
      component.subComponents.forEach((subComp: any) => {
        const subProgress = calculateComponentProgress(subComp, materialsData);
        totalMaterials += subProgress.totalMaterials;
        completedMaterials += subProgress.completedMaterials;
        totalQuantityNeeded += subProgress.totalQuantityNeeded;
        totalQuantityOwned += subProgress.totalQuantityOwned;
      });
    }

    return {
      totalMaterials,
      completedMaterials,
      totalQuantityNeeded,
      totalQuantityOwned,
      progress: totalQuantityNeeded > 0 ? (totalQuantityOwned / totalQuantityNeeded) * 100 : 0,
    };
  };

  const calculateOverallProgress = () => {
    if (!legendary || !materialsData) {
      return { overallProgress: 0, completedComponents: 0, totalComponents: 0, totalCost: 0 };
    }

    let totalMaterials = 0;
    let completedMaterials = 0;
    let completedComponents = 0;
    let totalCost = 0;

    // Helper to calculate cost recursively
    const calculateCostForComponent = (component: any) => {
      let cost = 0;

      if (component.materials) {
        component.materials.forEach((material: any) => {
          const realMaterial = materialsData?.find((m: any) => m.itemId === material.itemId);
          const ownedCount = realMaterial?.owned || material.owned || 0;
          const buyPrice = realMaterial?.buyPrice || 0;
          const stillNeeded = Math.max(0, material.quantity - ownedCount);
          cost += stillNeeded * buyPrice;
        });
      }

      if (component.subComponents) {
        component.subComponents.forEach((subComp: any) => {
          cost += calculateCostForComponent(subComp);
        });
      }

      return cost;
    };

    legendary.components.forEach((component: any) => {
      const progress = calculateComponentProgress(component, materialsData);
      totalMaterials += progress.totalMaterials;
      completedMaterials += progress.completedMaterials;
      totalCost += calculateCostForComponent(component);

      // A component is complete if all its materials are complete
      if (progress.totalMaterials > 0 && progress.completedMaterials === progress.totalMaterials) {
        completedComponents++;
      }
    });

    const overallProgress = totalMaterials > 0 ? (completedMaterials / totalMaterials) * 100 : 0;

    return {
      overallProgress: Math.round(overallProgress),
      completedComponents,
      totalComponents: legendary.components.length,
      totalCost,
    };
  };

  const progressStats = calculateOverallProgress();

  if (!legendaryBasic) {
    return (
      <div className="space-y-6">
        <div className="glass p-12 rounded-lg border border-dark-600/50 text-center">
          <h3 className="text-xl font-bold text-gray-300 mb-2">Legendary Not Found</h3>
          <p className="text-gray-500 mb-6">
            The legendary weapon you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button onClick={() => router.push('/legendary')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Legendaries
          </Button>
        </div>
      </div>
    );
  }

  const handleTrackLegendary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/legendary/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legendaryId }),
      });

      if (response.ok) {
        setIsTracking(true);
        showToast('success', `Now tracking ${legendaryBasic.name}!`);
      } else {
        showToast('error', 'Failed to track legendary');
      }
    } catch (error) {
      showToast('error', 'Failed to track legendary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUntrackLegendary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/legendary/track', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legendaryId }),
      });

      if (response.ok) {
        setIsTracking(false);
        showToast('success', `Stopped tracking ${legendaryBasic.name}`);
      } else {
        showToast('error', 'Failed to untrack legendary');
      }
    } catch (error) {
      showToast('error', 'Failed to untrack legendary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push('/legendary')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Legendaries
      </Button>

      {/* Header */}
      <div className="glass p-8 rounded-lg border border-legendary/30">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Icon */}
          <div className="relative">
            <div className="w-32 h-32 bg-legendary/10 rounded-lg flex items-center justify-center">
              <img
                src={legendaryBasic.icon}
                alt={legendaryBasic.name}
                className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,183,77,0.6)]"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent && !parent.querySelector('.fallback-icon')) {
                    const fallback = document.createElement('div');
                    fallback.className = 'fallback-icon text-6xl';
                    fallback.textContent = '✨';
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-legendary/20 border border-legendary/30 rounded text-sm font-bold text-legendary">
              Gen {legendaryBasic.generation}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-legendary" />
              <h1 className="text-4xl font-bold text-gray-100">{legendaryBasic.name}</h1>
            </div>
            <p className="text-gray-400 capitalize mb-4">
              {legendaryBasic.type} • Generation {legendaryBasic.generation}
            </p>
            {legendaryBasic.description && (
              <p className="text-gray-300 mb-4">{legendaryBasic.description}</p>
            )}
            <div className="flex items-center gap-3">
              <a
                href={legendaryBasic.wikiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" />
                View on Wiki
              </a>
            </div>
          </div>

          {/* Track Button */}
          <div>
            {isTracking ? (
              <Button
                variant="ghost"
                onClick={handleUntrackLegendary}
                isLoading={isLoading}
                className="border border-legendary/30"
              >
                <CheckCircle2 className="w-4 h-4 mr-2 text-legendary" />
                Tracking
              </Button>
            ) : (
              <Button
                onClick={handleTrackLegendary}
                isLoading={isLoading}
              >
                <Circle className="w-4 h-4 mr-2" />
                Track This Legendary
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      {legendary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass p-4 rounded-lg border border-primary-500/30">
            <p className="text-sm text-gray-400 mb-1">Overall Progress</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-gray-200">{progressStats.overallProgress}%</p>
              <div className="flex-1 h-2 bg-dark-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-legendary transition-all duration-500"
                  style={{ width: `${progressStats.overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-lg border border-legendary/30">
            <p className="text-sm text-gray-400 mb-1">Components Completed</p>
            <p className="text-3xl font-bold text-legendary">
              {progressStats.completedComponents} / {progressStats.totalComponents}
            </p>
          </div>

          <div className="glass p-4 rounded-lg border border-primary-500/30">
            <p className="text-sm text-gray-400 mb-1">Estimated Cost</p>
            {materialsData && progressStats.totalCost > 0 ? (
              <p className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                {formatGold(progressStats.totalCost)}
              </p>
            ) : materialsData ? (
              <p className="text-2xl font-bold text-green-400 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Complete!
              </p>
            ) : (
              <p className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                Loading...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      {legendary && (
        <div className="glass p-1 rounded-lg border border-dark-600/50 inline-flex">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-6 py-2 rounded text-sm font-medium transition-all ${
              activeTab === 'materials'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Materials & Progress
          </button>
          <button
            onClick={() => setActiveTab('crafting-guide')}
            className={`px-6 py-2 rounded text-sm font-medium transition-all ${
              activeTab === 'crafting-guide'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Crafting Guide
          </button>
          <button
            onClick={() => setActiveTab('progress-history')}
            className={`px-6 py-2 rounded text-sm font-medium transition-all ${
              activeTab === 'progress-history'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Progress History
          </button>
        </div>
      )}

      {/* Materials Tab */}
      {legendary && activeTab === 'materials' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-200 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-legendary" />
              Required Materials
            </h2>
            <div className="flex items-center gap-4">
              {lastSyncTime && !isLoadingMaterials && (
                <span className="text-sm text-gray-400">
                  Last synced: {lastSyncTime.toLocaleTimeString()}
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fetchMaterials(true)}
                isLoading={isLoadingMaterials}
                disabled={isLoadingMaterials}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingMaterials ? 'animate-spin' : ''}`} />
                Sync Materials
              </Button>
            </div>
          </div>

          {legendary.components.map((component, index) => (
            <ComponentCard
              key={index}
              component={component}
              level={0}
              materialsData={materialsData}
              calculateProgress={calculateComponentProgress}
              legendaryId={legendaryId}
              legendaryName={legendaryBasic.name}
              reservations={reservations}
              onReservationChange={() => {
                fetchReservations();
                fetchMaterials();
              }}
            />
          ))}
        </div>
      ) : activeTab === 'crafting-guide' ? (
        <div>
          {(() => {
            const craftingGuide = getCraftingGuide(legendaryId);
            if (craftingGuide) {
              return <CraftingGuide guide={craftingGuide} />;
            }
            return (
              <div className="glass p-12 rounded-lg border border-dark-600/50 text-center">
                <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-300 mb-2">
                  Crafting Guide Coming Soon
                </h3>
                <p className="text-gray-500">
                  Detailed crafting guide for this legendary is being prepared.
                  <br />
                  Check back later for step-by-step instructions!
                </p>
              </div>
            );
          })()}
        </div>
      ) : activeTab === 'progress-history' ? (
        <ProgressHistoryChart legendaryId={legendaryId} />
      ) : (
        <div className="glass p-12 rounded-lg border border-dark-600/50 text-center">
          <Info className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">Material Data Coming Soon</h3>
          <p className="text-gray-500">
            Detailed material breakdown is currently only available for Eternity.
            <br />
            More legendaries will be added soon!
          </p>
        </div>
      )}
    </div>
  );
}

interface ComponentCardProps {
  component: any;
  level: number;
  materialsData?: any;
  calculateProgress?: (component: any, materialsData: any) => any;
  legendaryId?: string;
  legendaryName?: string;
  reservations?: Record<number, number>;
  onReservationChange?: () => void;
}

function ComponentCard({ component, level, materialsData, calculateProgress, legendaryId, legendaryName, reservations, onReservationChange }: ComponentCardProps) {
  const [isExpanded, setIsExpanded] = useState(level < 1); // Auto-expand first level

  const indentClass = level > 0 ? `ml-${level * 6}` : '';
  const bgOpacity = level === 0 ? 'bg-dark-700/50' : level === 1 ? 'bg-dark-700/30' : 'bg-dark-700/10';

  // Calculate real progress for this component
  const componentProgress = calculateProgress && materialsData
    ? calculateProgress(component, materialsData)
    : {
        totalMaterials: component.totalMaterials || 0,
        completedMaterials: component.completedMaterials || 0,
        progress: component.progress || 0,
      };

  const isComponentComplete = componentProgress.totalMaterials > 0 &&
                              componentProgress.completedMaterials === componentProgress.totalMaterials;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={indentClass}
    >
      <div className={`glass p-4 rounded-lg border ${isComponentComplete ? 'border-green-500/50 bg-green-500/5' : 'border-dark-600/50'} ${bgOpacity}`}>
        {/* Component Header */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3 flex-1">
            {component.icon && (
              <Image src={component.icon} alt={component.name} width={40} height={40} className="w-10 h-10" unoptimized />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-200">{component.name}</h3>
                {isComponentComplete && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                <a
                  href={component.wikiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {component.description && (
                <p className="text-sm text-gray-400">{component.description}</p>
              )}
            </div>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-4">
            {component.quantity && (
              <span className="text-sm text-gray-400">Qty: {component.quantity}</span>
            )}
            <div className="text-right">
              <div className={`text-sm font-medium ${isComponentComplete ? 'text-green-400' : 'text-gray-300'}`}>
                {componentProgress.completedMaterials} / {componentProgress.totalMaterials}
              </div>
              <div className="text-xs text-gray-500">materials</div>
            </div>
            <div className="w-24 h-2 bg-dark-600 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isComponentComplete
                    ? 'bg-green-500'
                    : 'bg-gradient-to-r from-primary-500 to-legendary'
                }`}
                style={{ width: `${Math.min(componentProgress.progress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Materials List */}
        {isExpanded && component.materials && component.materials.length > 0 && (
          <div className="mt-4 space-y-2 pl-4 border-l-2 border-dark-600/50">
            {component.materials.map((material: any, index: number) => (
              <MaterialRow
                key={index}
                material={material}
                materialsData={materialsData}
                legendaryId={legendaryId}
                legendaryName={legendaryName}
                reservations={reservations}
                onReservationChange={onReservationChange}
              />
            ))}
          </div>
        )}

        {/* Sub-components */}
        {isExpanded && component.subComponents && component.subComponents.length > 0 && (
          <div className="mt-4 space-y-3">
            {component.subComponents.map((subComponent: any, index: number) => (
              <ComponentCard
                key={index}
                component={subComponent}
                level={level + 1}
                materialsData={materialsData}
                calculateProgress={calculateProgress}
                legendaryId={legendaryId}
                legendaryName={legendaryName}
                reservations={reservations}
                onReservationChange={onReservationChange}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface MaterialRowProps {
  material: any;
  materialsData?: any;
  legendaryId?: string;
  legendaryName?: string;
  reservations?: Record<number, number>;
  onReservationChange?: () => void;
}

function MaterialRow({ material, materialsData, legendaryId, legendaryName, reservations, onReservationChange }: MaterialRowProps) {
  const [showModal, setShowModal] = useState(false);

  // Get real material data from API if available
  const realMaterial = materialsData?.find((m: any) => m.itemId === material.itemId);
  const ownedCount = realMaterial?.owned || material.owned || 0;
  const icon = realMaterial?.icon || material.icon;
  const buyPrice = realMaterial?.buyPrice || 0;
  const sellPrice = realMaterial?.sellPrice || 0;

  const completionPercentage = (ownedCount / material.quantity) * 100;
  const isComplete = ownedCount >= material.quantity;
  const available = material.available || ownedCount;

  // Calculate how much more is needed
  const stillNeeded = Math.max(0, material.quantity - ownedCount);
  const totalCostForNeeded = stillNeeded * buyPrice;

  return (
    <>
      <div className="glass p-3 rounded border border-dark-600/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {icon && (
              <Image src={icon} alt={material.itemName} width={32} height={32} className="w-8 h-8" unoptimized />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-200">{material.itemName}</span>
                <a
                  href={material.wikiLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-400 hover:text-primary-300"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-gray-400">
                  Need: {material.quantity}
                </span>
                <span className={`text-xs ${available >= material.quantity ? 'text-green-400' : 'text-gray-400'}`}>
                  Have: {available}
                </span>
                {material.reserved > 0 && (
                  <span className="text-xs text-orange-400">
                    Reserved: {material.reserved}
                  </span>
                )}
                {!isComplete && stillNeeded > 0 && buyPrice > 0 && (
                  <span className="text-xs text-yellow-400">
                    Cost: {formatGold(totalCostForNeeded)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress */}
            <div className="text-right">
              <div className="text-xs font-medium text-gray-300">
                {Math.min(completionPercentage, 100).toFixed(0)}%
              </div>
              <div className="w-20 h-1.5 bg-dark-600 rounded-full overflow-hidden mt-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    isComplete ? 'bg-green-500' : 'bg-primary-500'
                  }`}
                  style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                />
              </div>
            </div>

            {/* Reservation Button */}
            {legendaryId && legendaryName && (
              <MaterialReservationButton
                legendaryId={legendaryId}
                legendaryName={legendaryName}
                itemId={material.itemId}
                itemName={material.itemName}
                requiredQuantity={material.quantity}
                ownedQuantity={ownedCount}
                currentReservation={reservations?.[material.itemId] || 0}
                onReservationChange={onReservationChange}
              />
            )}

            {/* Acquisition Info Button */}
            {material.acquisitionMethods && material.acquisitionMethods.length > 0 && (
              <button
                onClick={() => setShowModal(true)}
                className="p-2 hover:bg-primary-500/10 rounded transition-colors"
              >
                <Info className="w-4 h-4 text-primary-400" />
              </button>
            )}

            {/* Completion Checkbox */}
            <button className="p-1">
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              ) : (
                <Circle className="w-5 h-5 text-gray-600 hover:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Sub-materials */}
        {material.subComponents && material.subComponents.length > 0 && (
          <div className="mt-3 pt-3 border-t border-dark-600/30 space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase">Crafted from:</p>
            {material.subComponents.map((subMaterial: any, index: number) => (
              <MaterialRow key={index} material={subMaterial} />
            ))}
          </div>
        )}
      </div>

      {/* Acquisition Modal */}
      <MaterialAcquisitionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        materialName={material.itemName}
        materialIcon={material.icon}
        acquisitionMethods={material.acquisitionMethods || []}
      />
    </>
  );
}
