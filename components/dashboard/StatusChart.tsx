'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';

interface StatusChartProps {
  data?: {
    pending: number;
    success: number;
    failed: number;
  };
  isLoading?: boolean;
}

const STATUS_COLORS = {
  success: 'hsl(142, 76%, 36%)', // green
  pending: 'hsl(48, 96%, 53%)', // yellow
  failed: 'hsl(0, 84%, 60%)', // red
};

export function StatusChart({ data, isLoading }: StatusChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status Distribution</CardTitle>
          <CardDescription>Breakdown by transaction status</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Status Distribution</CardTitle>
          <CardDescription>Breakdown by transaction status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No status data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = [
    { status: 'Success', count: data.success, color: STATUS_COLORS.success },
    { status: 'Pending', count: data.pending, color: STATUS_COLORS.pending },
    { status: 'Failed', count: data.failed, color: STATUS_COLORS.failed },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Status Distribution</CardTitle>
        <CardDescription>Breakdown by transaction status</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          role="img" 
          aria-label={`Bar chart showing transaction status distribution: ${data.success} successful, ${data.pending} pending, ${data.failed} failed`}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="status"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="text-sm font-medium">{data.status}</p>
                      <p className="mt-1 text-sm">
                        <span className="text-muted-foreground">Count: </span>
                        <span className="font-semibold">{data.count}</span>
                      </p>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="rect"
              />
              <Bar dataKey="count" name="Transaction Count" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
