export interface ExportData {
  version: string;
  exportDate: string;
  quests: any[];
  characters: any[];
  metadata?: {
    totalQuests: number;
    totalCharacters: number;
  };
}

export function exportToJSON(quests: any[], characters: any[]): string {
  const data: ExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    quests,
    characters,
    metadata: {
      totalQuests: quests.length,
      totalCharacters: characters.length,
    },
  };

  return JSON.stringify(data, null, 2);
}

export function exportToCSV(quests: any[]): string {
  const headers = [
    'Name',
    'Description',
    'Category',
    'Frequency',
    'Completed',
    'Estimated Duration (min)',
    'Waypoint Code',
    'Notes',
    'Next Reset',
  ];

  const rows = quests.map((quest) => [
    quest.name,
    quest.description || '',
    quest.category,
    quest.frequency,
    quest.isCompleted ? 'Yes' : 'No',
    quest.estimatedDurationMinutes || '',
    quest.waypointCode || '',
    quest.notes?.replace(/\n/g, ' ') || '',
    new Date(quest.nextResetAt).toLocaleString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  return csvContent;
}

export function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(content: string): ExportData {
  try {
    const data = JSON.parse(content);

    // Validate structure
    if (!data.quests || !Array.isArray(data.quests)) {
      throw new Error('Invalid format: missing quests array');
    }

    return data;
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error}`);
  }
}

export function validateImportData(data: ExportData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.version) {
    errors.push('Missing version');
  }

  if (!data.quests || data.quests.length === 0) {
    errors.push('No quests found in import data');
  }

  // Validate quest structure
  data.quests?.forEach((quest, index) => {
    if (!quest.name) {
      errors.push(`Quest ${index + 1}: Missing name`);
    }
    if (!quest.category) {
      errors.push(`Quest ${index + 1}: Missing category`);
    }
    if (!quest.frequency) {
      errors.push(`Quest ${index + 1}: Missing frequency`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}
