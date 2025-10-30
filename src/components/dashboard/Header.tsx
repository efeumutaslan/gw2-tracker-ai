'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { LogOut, User } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      showToast('success', 'Logged out successfully');
      router.push('/');
    } catch (error) {
      showToast('error', 'Failed to logout');
    }
  };

  return (
    <header className="glass border-b border-primary-500/20 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        {/* User Info Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-200">Welcome back</p>
            <p className="text-xs text-gray-400">Commander</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="btn-glow flex items-center gap-2 text-gray-300 hover:text-primary-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
