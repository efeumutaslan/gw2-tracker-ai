'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DailyStats } from '@/lib/services/analyticsService';

interface WeeklyChartProps {
  data: DailyStats[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  // Format dates for display
  const formattedData = data.map((day) => ({
    ...day,
    dateLabel: new Date(day.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
  }));

  return (
    <Card className="glass">
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-200">7-Day Activity</h3>
        <p className="text-sm text-gray-400">Quest completion and gold earned</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="dateLabel"
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 46, 0.95)',
                border: '1px solid rgba(242, 154, 55, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ color: '#9ca3af' }}
            />
            <Bar
              dataKey="questsCompleted"
              fill="#f29a37"
              name="Quests Completed"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="goldEarned"
              fill="#d4af37"
              name="Gold Earned"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
}
