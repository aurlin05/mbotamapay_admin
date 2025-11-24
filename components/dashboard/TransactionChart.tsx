'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChartDataPoint } from '@/types/stats';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TransactionChartProps {
  data?: ChartDataPoint[];
  isLoading?: boolean;
}

export function TransactionChart({ data, isLoading }: TransactionChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Volume Over Time</CardTitle>
          <CardDescription>Last 30 days of transaction activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction Volume Over Time</CardTitle>
          <CardDescription>Last 30 days of transaction activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            No transaction data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM dd'),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Volume Over Time</CardTitle>
        <CardDescription>Last 30 days of transaction activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div role="img" aria-label="Line chart showing transaction volume and count over the last 30 days">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="formattedDate"
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis
                className="text-xs"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `${(value / 1000000).toFixed(1)}M`;
                  }
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}K`;
                  }
                  return value.toString();
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || payload.length === 0) {
                    return null;
                  }

                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="text-sm font-medium">
                        {format(new Date(data.date), 'MMMM dd, yyyy')}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Transactions: </span>
                          <span className="font-semibold">{data.count}</span>
                        </p>
                        <p className="text-sm">
                          <span className="text-muted-foreground">Volume: </span>
                          <span className="font-semibold">{formatCurrency(data.volume)}</span>
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                activeDot={{ r: 6 }}
                name="Volume (XAF)"
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--chart-2))', r: 4 }}
                activeDot={{ r: 6 }}
                name="Transaction Count"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
