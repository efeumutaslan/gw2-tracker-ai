'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Scroll,
  Swords,
  Clock,
  Settings,
  Sparkles,
  Trophy,
  TrendingUp,
  History,
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/quests', label: 'Quests', icon: Scroll },
  { href: '/achievements', label: 'Achievements', icon: Trophy },
  { href: '/legendary', label: 'Legendary', icon: Sparkles },
  { href: '/analytics', label: 'Analytics', icon: TrendingUp },
  { href: '/history', label: 'History', icon: History },
  { href: '/characters', label: 'Characters', icon: Swords },
  { href: '/timers', label: 'Timers', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass border-r border-primary-500/20 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-primary-500/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-legendary animate-pulse" />
          <h1 className="text-2xl font-bold text-legendary text-glow">
            GW2 Tracker
          </h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Daily Quest Companion
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden',
                isActive
                  ? 'nav-active text-primary-300'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              {/* Hover gradient overlay */}
              {!isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              )}

              {/* Icon with glow on active */}
              <Icon
                className={cn(
                  'w-5 h-5 relative z-10 transition-all duration-300',
                  isActive && 'drop-shadow-[0_0_8px_rgba(242,154,55,0.8)]'
                )}
              />

              {/* Label */}
              <span className="font-medium relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-500/20">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Sparkles className="w-3 h-3" />
          <span>Powered by Guild Wars 2</span>
        </div>
      </div>
    </aside>
  );
}
