'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Package, Coins } from 'lucide-react';

interface ProgressSnapshot {
  id: string;
  user_id: string;
  legendary_id: string;
  progress_percentage: number;
  materials_obtained: number;
  total_materials: number;
  total_value_copper: number;
  snapshot_type: string;
  snapshot_at: string;
  created_at: string;
}

interface ProgressHistoryChartProps {
  legendaryId: string;
}

interface ChartDataPoint {
  date: string;
  dateFormatted: string;
  progress: number;
  materialsObtained: number;
  totalMaterials: number;
  valueGold: number;
}

export function ProgressHistoryChart({ legendaryId }: ProgressHistoryChartProps) {
  const [history, setHistory] = useState<ProgressSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'progress' | 'materials' | 'value'>('progress');

  useEffect(() => {
    fetchProgressHistory();
  }, [legendaryId]);

  const fetchProgressHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/legendary/progress-history?legendaryId=${legendaryId}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch progress history');
      }

      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching progress history:', err);
      setError('Failed to load progress history');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const copperToGold = (copper: number) => {
    return (copper / 10000).toFixed(2);
  };

  const chartData: ChartDataPoint[] = history.map(snapshot => ({
    date: snapshot.snapshot_at,
    dateFormatted: formatDate(snapshot.snapshot_at),
    progress: snapshot.progress_percentage,
    materialsObtained: snapshot.materials_obtained,
    totalMaterials: snapshot.total_materials,
    valueGold: parseFloat(copperToGold(snapshot.total_value_copper)),
  }));

  const stats = history.length > 0 ? {
    currentProgress: history[history.length - 1]?.progress_percentage || 0,
    progressChange: history.length > 1
      ? history[history.length - 1].progress_percentage - history[0].progress_percentage
      : 0,
    currentMaterials: history[history.length - 1]?.materials_obtained || 0,
    currentValue: parseFloat(copperToGold(history[history.length - 1]?.total_value_copper || 0)),
    totalSnapshots: history.length,
  } : null;

  if (loading) {
    return (
      <div className="glass rounded-lg border border-dark-600/50 p-8">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-400"></div>
          <p className="text-gray-400">Loading progress history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-lg border border-red-500/30 p-8">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="glass rounded-lg border border-dark-600/50 p-8">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">No Progress History Yet</h3>
          <p className="text-gray-500">
            Your progress will be tracked automatically as you make changes.
            <br />
            Check back after updating your materials!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass rounded-lg border border-dark-600/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Current Progress</span>
              <TrendingUp className="w-4 h-4 text-primary-400" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{stats.currentProgress}%</div>
            {stats.progressChange > 0 && (
              <div className="text-xs text-green-400 mt-1">
                +{stats.progressChange}% from start
              </div>
            )}
          </div>

          <div className="glass rounded-lg border border-dark-600/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Materials Obtained</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{stats.currentMaterials}</div>
            <div className="text-xs text-gray-500 mt-1">materials collected</div>
          </div>

          <div className="glass rounded-lg border border-dark-600/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Estimated Value</span>
              <Coins className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{stats.currentValue}g</div>
            <div className="text-xs text-gray-500 mt-1">total worth</div>
          </div>

          <div className="glass rounded-lg border border-dark-600/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Tracking Since</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-100">{stats.totalSnapshots}</div>
            <div className="text-xs text-gray-500 mt-1">snapshots recorded</div>
          </div>
        </div>
      )}

      {/* Chart Type Selector */}
      <div className="glass p-1 rounded-lg border border-dark-600/50 inline-flex">
        <button
          onClick={() => setActiveChart('progress')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            activeChart === 'progress'
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Progress %
        </button>
        <button
          onClick={() => setActiveChart('materials')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            activeChart === 'materials'
              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Materials
        </button>
        <button
          onClick={() => setActiveChart('value')}
          className={`px-4 py-2 rounded text-sm font-medium transition-all ${
            activeChart === 'value'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Value
        </button>
      </div>

      {/* Chart */}
      <div className="glass rounded-lg border border-dark-600/50 p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          {activeChart === 'progress' && 'Progress Over Time'}
          {activeChart === 'materials' && 'Materials Collection Progress'}
          {activeChart === 'value' && 'Estimated Value Over Time'}
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          {activeChart === 'progress' && (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="dateFormatted"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Area
                type="monotone"
                dataKey="progress"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#colorProgress)"
                name="Progress %"
              />
            </AreaChart>
          )}

          {activeChart === 'materials' && (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="dateFormatted"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="materialsObtained"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Materials Obtained"
                dot={{ fill: '#3B82F6' }}
              />
            </LineChart>
          )}

          {activeChart === 'value' && (
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="dateFormatted"
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#D1D5DB' }}
              />
              <Area
                type="monotone"
                dataKey="valueGold"
                stroke="#EAB308"
                strokeWidth={2}
                fill="url(#colorValue)"
                name="Value (gold)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
