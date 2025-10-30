'use client';

import { useState, useRef } from 'react';
import { Download, Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  exportToJSON,
  exportToCSV,
  downloadFile,
  parseImportedJSON,
  validateImportData,
} from '@/lib/utils/exportImport';

interface ExportImportButtonsProps {
  quests: any[];
  characters: any[];
  onImportComplete: () => void;
}

export function ExportImportButtons({
  quests,
  characters,
  onImportComplete,
}: ExportImportButtonsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleExportJSON = () => {
    try {
      setIsExporting(true);
      const content = exportToJSON(quests, characters);
      const filename = `gw2-quests-${new Date().toISOString().split('T')[0]}.json`;
      downloadFile(content, filename, 'application/json');
      showToast('success', 'Exported successfully!');
      setShowExportMenu(false);
    } catch (error) {
      showToast('error', 'Failed to export');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      setIsExporting(true);
      const content = exportToCSV(quests);
      const filename = `gw2-quests-${new Date().toISOString().split('T')[0]}.csv`;
      downloadFile(content, filename, 'text/csv');
      showToast('success', 'Exported to CSV!');
      setShowExportMenu(false);
    } catch (error) {
      showToast('error', 'Failed to export CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      const data = parseImportedJSON(content);
      const validation = validateImportData(data);

      if (!validation.valid) {
        showToast('error', `Invalid data: ${validation.errors.join(', ')}`);
        return;
      }

      // Import quests via API
      const response = await fetch('/api/quests/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quests: data.quests }),
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      showToast('success', `Imported ${data.quests.length} quests!`);
      onImportComplete();
    } catch (error: any) {
      showToast('error', error.message || 'Failed to import');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Export Button with Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowExportMenu(!showExportMenu)}
          disabled={isExporting || quests.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>

        {showExportMenu && (
          <div className="absolute top-full mt-2 right-0 z-50 w-48 glass rounded-lg border border-primary-500/30 shadow-xl overflow-hidden">
            <button
              onClick={handleExportJSON}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-primary-500/10 transition-colors"
            >
              <FileJson className="w-4 h-4 text-primary-400" />
              <div>
                <div className="text-sm font-medium text-gray-200">JSON</div>
                <div className="text-xs text-gray-400">Full backup</div>
              </div>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-primary-500/10 transition-colors border-t border-primary-500/20"
            >
              <FileSpreadsheet className="w-4 h-4 text-green-400" />
              <div>
                <div className="text-sm font-medium text-gray-200">CSV</div>
                <div className="text-xs text-gray-400">Spreadsheet</div>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Import Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Import
      </Button>
    </div>
  );
}
