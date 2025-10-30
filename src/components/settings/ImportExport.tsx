'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Download, Upload, Database } from 'lucide-react';

interface ImportExportProps {
  onImportSuccess?: () => void;
}

export function ImportExport({ onImportSuccess }: ImportExportProps) {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/export');

      if (!response.ok) {
        throw new Error('Failed to export quests');
      }

      const data = await response.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gw2-quests-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast('success', 'Quests exported successfully!');
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to export quests');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to import quests');
      }

      showToast('success', `Successfully imported ${result.count} quests!`);
      if (onImportSuccess) onImportSuccess();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : 'Failed to import quests');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card className="glass border border-primary-500/20 h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-500/20 rounded-lg border border-primary-500/30">
            <Database className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-100">Data Management</h2>
            <p className="text-sm text-gray-400">Import and export your quest data</p>
          </div>
        </div>

        {/* Export Section */}
        <div className="space-y-6">
          <div className="p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="flex items-center gap-2 mb-2">
              <Download className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-gray-200">Export Quests</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Download all your quest templates as a JSON file for backup or sharing.
            </p>
            <Button onClick={handleExport} isLoading={isExporting} className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export All Quests
            </Button>
          </div>

          {/* Import Section */}
          <div className="p-4 bg-dark-700/30 rounded-lg border border-dark-600">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="w-4 h-4 text-primary-400" />
              <h3 className="font-semibold text-gray-200">Import Quests</h3>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Import quest templates from a JSON file to restore or merge data.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button onClick={handleImportClick} isLoading={isImporting} className="w-full">
              <Upload className="w-4 h-4 mr-2" />
              Import Quest File
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
