export interface AdminStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalVolume: number;
  transactionsByStatus: {
    pending: number;
    success: number;
    failed: number;
  };
  transactionsByDay: Array<{
    date: string;
    count: number;
    volume: number;
  }>;
}

export interface ChartDataPoint {
  date: string;
  count: number;
  volume: number;
}

export interface StatusChartData {
  status: string;
  count: number;
  color: string;
}
