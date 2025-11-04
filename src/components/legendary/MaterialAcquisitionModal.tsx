'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import {
  X,
  ShoppingCart,
  Pickaxe,
  Hammer,
  Trophy,
  Award,
  Recycle,
  Sparkles,
  TrendingUp,
  MapPin,
  ExternalLink,
  Coins,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { AcquisitionMethod } from '@/types/legendary';

interface MaterialAcquisitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialName: string;
  materialIcon?: string;
  acquisitionMethods: AcquisitionMethod[];
}

export function MaterialAcquisitionModal({
  isOpen,
  onClose,
  materialName,
  materialIcon,
  acquisitionMethods,
}: MaterialAcquisitionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto glass rounded-lg border border-primary-500/30 shadow-2xl"
        >
          {/* Header */}
          <div className="sticky top-0 glass border-b border-dark-600/50 p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {materialIcon && (
                <Image src={materialIcon} alt={materialName} width={48} height={48} className="w-12 h-12" unoptimized />
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-100">{materialName}</h3>
                <p className="text-sm text-gray-400">Acquisition Methods</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark-600/50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {acquisitionMethods.length === 0 ? (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No acquisition methods available</p>
              </div>
            ) : (
              acquisitionMethods.map((method, index) => (
                <AcquisitionMethodCard key={index} method={method} />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 glass border-t border-dark-600/50 p-4 flex justify-end">
            <Button onClick={onClose} variant="ghost">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface AcquisitionMethodCardProps {
  method: AcquisitionMethod;
}

function AcquisitionMethodCard({ method }: AcquisitionMethodCardProps) {
  const { icon: Icon, color, bgColor } = getMethodStyle(method.type);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass p-4 rounded-lg border border-dark-600/30 hover:border-primary-500/30 transition-all"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-lg ${bgColor} border border-${color}/30 shrink-0`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Type Header */}
          <div>
            <h4 className={`font-bold uppercase text-sm ${color}`}>
              {method.type.replace('_', ' ')}
            </h4>
            {method.description && (
              <p className="text-gray-300 mt-1">{method.description}</p>
            )}
          </div>

          {/* Vendor Info */}
          {method.vendors && method.vendors.length > 0 && (
            <div className="space-y-3">
              {method.vendors.map((vendor, idx) => (
                <div key={idx} className="p-3 bg-dark-700/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <ShoppingCart className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-200">{vendor.name}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.location}</span>
                        {vendor.waypointLink && (
                          <a
                            href={vendor.waypointLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="text-xs">Wiki</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cost */}
                  {vendor.cost && (
                    <div className="flex items-center gap-2 pt-2 border-t border-dark-600/30 mt-2">
                      <Coins className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-300">
                        <span className="font-semibold">{vendor.cost}</span>{' '}
                        <span className="text-gray-400 capitalize">
                          {vendor.currency.replace('_', ' ')}
                        </span>
                      </span>
                    </div>
                  )}

                  {/* Alternative Costs */}
                  {vendor.alternativeCost && vendor.alternativeCost.length > 0 && (
                    <div className="space-y-1 pt-2 border-t border-dark-600/30 mt-2">
                      <p className="text-xs text-gray-400 uppercase font-semibold">Alternative:</p>
                      {vendor.alternativeCost.map((alt, altIdx) => (
                        <div key={altIdx} className="flex items-center gap-2 text-sm text-gray-300">
                          <Coins className="w-3 h-3 text-yellow-400" />
                          <span>
                            <span className="font-semibold">{alt.cost}</span>{' '}
                            <span className="text-gray-400 capitalize">
                              {alt.currency.replace('_', ' ')}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Mystic Forge Recipe */}
          {method.mysticForge && (
            <div className="space-y-2 p-3 bg-purple-900/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-300">Recipe:</span>
              </div>
              <div className="space-y-1">
                {method.mysticForge.ingredients.map((ingredient, idx) => (
                  <div key={idx} className="text-sm text-gray-300 flex items-center gap-2">
                    <span className="w-1 h-1 bg-purple-400 rounded-full"></span>
                    <span>
                      {ingredient.quantity}x {ingredient.itemName}
                    </span>
                  </div>
                ))}
              </div>
              {method.mysticForge.outputQuantity && (
                <p className="text-xs text-purple-300 mt-2">
                  Output: {method.mysticForge.outputQuantity}
                </p>
              )}
              {method.mysticForge.successRate && (
                <p className="text-xs text-purple-300">
                  Success Rate: {method.mysticForge.successRate}
                </p>
              )}
              {method.mysticForge.notes && (
                <p className="text-xs text-gray-400 italic mt-2">{method.mysticForge.notes}</p>
              )}
            </div>
          )}

          {/* Efficiency Badge */}
          {method.efficiency && (
            <div className="flex items-center gap-2">
              <TrendingUp className={`w-4 h-4 ${getEfficiencyColor(method.efficiency)}`} />
              <span className={`text-xs font-semibold uppercase ${getEfficiencyColor(method.efficiency)}`}>
                {method.efficiency} efficiency
              </span>
            </div>
          )}

          {/* Notes */}
          {method.notes && (
            <p className="text-xs text-gray-400 italic bg-dark-700/30 p-2 rounded">
              💡 {method.notes}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function getMethodStyle(type: string) {
  const styles: Record<string, { icon: any; color: string; bgColor: string }> = {
    vendor: {
      icon: ShoppingCart,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    mystic_forge: {
      icon: Sparkles,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    crafting: {
      icon: Hammer,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    achievement: {
      icon: Trophy,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    reward_track: {
      icon: Award,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    world_completion: {
      icon: MapPin,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    salvage: {
      icon: Recycle,
      color: 'text-gray-400',
      bgColor: 'bg-gray-500/10',
    },
    loot: {
      icon: Pickaxe,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
    },
    trading_post: {
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  };

  return styles[type] || styles.vendor;
}

function getEfficiencyColor(efficiency: string): string {
  switch (efficiency) {
    case 'high':
      return 'text-green-400';
    case 'medium':
      return 'text-yellow-400';
    case 'low':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}
