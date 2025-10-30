'use client';

import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategoryBreakdown } from '@/lib/services/analyticsService';

interface CategoryChartProps {
  data: CategoryBreakdown[];
}

const COLORS = [
  '#f29a37', // primary
  '#d4af37', // legendary
  '#fb3e8d', // ascended
  '#ffa500', // exotic
  '#72c1d9', // rare
  '#1a9306', // masterwork
];

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-200">Quest Categories</h3>
        <p className="text-sm text-gray-400">Breakdown by category</p>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.category}: ${entry.count}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 31, 46, 0.95)',
                border: '1px solid rgba(242, 154, 55, 0.3)',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Category List */}
        <div className="mt-4 space-y-2">
          {data.map((category, index) => (
            <div
              key={category.category}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-300">{category.category}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400">{category.count} quests</span>
                <span className="text-legendary font-medium">
                  {category.goldEarned}g
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
