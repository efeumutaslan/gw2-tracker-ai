'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RefreshCw, ShoppingCart, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { formatGold, type MaterialRequirement } from '@/lib/services/legendaryService';

interface MaterialProgressListProps {
  goalId: string;
  materials: MaterialRequirement[];
  legendaryName: string;
}

interface InventoryData {
  [itemId: number]: number;
}

interface PriceData {
  [itemId: number]: {
    buyPrice: number;
    sellPrice: number;
    buyQuantity: number;
    sellQuantity: number;
  };
}

export function MaterialProgressList({
  goalId,
  materials,
  legendaryName,
}: MaterialProgressListProps) {
  const [inventoryData, setInventoryData] = useState<InventoryData>({});
  const [priceData, setPriceData] = useState<PriceData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    fetchInventoryAndPrices();
  }, [goalId]);

  const fetchInventoryAndPrices = async () => {
    setIsLoading(true);
    try {
      // Fetch inventory data
      const inventoryResponse = await fetch(`/api/legendary-goals/${goalId}/materials`);
      if (inventoryResponse.ok) {
        const data = await inventoryResponse.json();
        setInventoryData(data.inventoryData || {});
        setHasApiKey(data.hasApiKey);
      }

      // Fetch TP prices
      const itemIds = materials.map(m => m.id).join(',');
      const pricesResponse = await fetch(`/api/gw2/prices?ids=${itemIds}`);
      if (pricesResponse.ok) {
        const prices = await pricesResponse.json();
        setPriceData(prices);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Failed to fetch inventory and prices');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = () => {
    const completed = materials.filter(mat => {
      const current = inventoryData[mat.id] || 0;
      return current >= mat.quantity;
    }).length;
    return Math.round((completed / materials.length) * 100);
  };

  const calculateTotalCost = () => {
    return materials.reduce((total, mat) => {
      const current = inventoryData[mat.id] || 0;
      const needed = Math.max(0, mat.quantity - current);
      const price = priceData[mat.id]?.sellPrice || 0;
      return total + (needed * price);
    }, 0);
  };

  const calculateTotalValue = () => {
    return materials.reduce((total, mat) => {
      const price = priceData[mat.id]?.sellPrice || 0;
      return total + (mat.quantity * price);
    }, 0);
  };

  const progress = calculateProgress();
  const totalCost = calculateTotalCost();
  const totalValue = calculateTotalValue();
  const completedMaterials = materials.filter(mat => {
    const current = inventoryData[mat.id] || 0;
    return current >= mat.quantity;
  }).length;

  return (
    <div className="space-y-4">
      {/* Header with Progress */}
      <Card className="glass border-primary-500/30">
        <CardBody>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-200 mb-1">Material Progress</h3>
                <p className="text-sm text-gray-400">
                  {completedMaterials} of {materials.length} materials ready
                </p>
              </div>
              <Button
                size="sm"
                onClick={fetchInventoryAndPrices}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Syncing...' : 'Sync Inventory'}
              </Button>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">Overall Progress</span>
                <span className="text-sm font-bold text-primary-400">{progress}%</span>
              </div>
              <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-legendary transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Cost Summary */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-dark-600">
              <div>
                <p className="text-xs text-gray-400 mb-1">Total Value</p>
                <p className="text-lg font-bold text-gray-200">{formatGold(totalValue)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Still Needed</p>
                <p className="text-lg font-bold text-yellow-400">{formatGold(totalCost)}</p>
              </div>
            </div>

            {!hasApiKey && (
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium mb-1">API Key Required</p>
                  <p className="text-blue-400">
                    Add your GW2 API key in settings to automatically sync your inventory.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Material List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Required Materials
        </h4>
        {materials.map((material) => {
          const current = inventoryData[material.id] || 0;
          const needed = Math.max(0, material.quantity - current);
          const isCompleted = current >= material.quantity;
          const materialProgress = Math.min(100, (current / material.quantity) * 100);
          const price = priceData[material.id];
          const costForNeeded = needed * (price?.sellPrice || 0);

          return (
            <Card
              key={material.id}
              className={`glass-hover border ${
                isCompleted
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-primary-500/20'
              }`}
            >
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  {/* Material Icon */}
                  {material.iconUrl ? (
                    <Image
                      src={material.iconUrl}
                      alt={material.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded border border-primary-500/30"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 rounded border border-primary-500/30 bg-primary-500/10 flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-primary-400" />
                    </div>
                  )}

                  {/* Material Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-gray-200 mb-1 flex items-center gap-2">
                          {material.name}
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          )}
                        </h5>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span className={isCompleted ? 'text-green-400' : ''}>
                            {current.toLocaleString()} / {material.quantity.toLocaleString()}
                          </span>
                          {!isCompleted && (
                            <>
                              <span>•</span>
                              <span className="text-red-400">
                                Need {needed.toLocaleString()} more
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Price Info */}
                      {price && !isCompleted && (
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-gray-400">Cost</p>
                          <p className="text-sm font-bold text-yellow-400">
                            {formatGold(costForNeeded)}
                          </p>
                          <a
                            href={`https://www.gw2tp.com/item/${material.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            View on TP
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {!isCompleted && (
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-300"
                          style={{ width: `${materialProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* Shopping List Button */}
      {totalCost > 0 && (
        <Card className="glass border-yellow-500/30">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-gray-200 mb-1">Shopping List Ready</h4>
                <p className="text-sm text-gray-400">
                  Total cost for missing materials: <span className="text-yellow-400 font-bold">{formatGold(totalCost)}</span>
                </p>
              </div>
              <Button className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Export List
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
