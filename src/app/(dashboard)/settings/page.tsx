'use client';

import { ApiKeyForm } from '@/components/settings/ApiKeyForm';
import { ImportExport } from '@/components/settings/ImportExport';
import { Settings, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-8 rounded-lg border border-primary-500/20">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <Settings className="w-8 h-8 text-primary-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-100 tracking-tight">
              Settings
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-4 h-4 text-primary-400" />
              <p className="text-gray-400">Configure your Guild Wars 2 integration and preferences</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ApiKeyForm />
        <ImportExport />
      </div>
    </div>
  );
}
