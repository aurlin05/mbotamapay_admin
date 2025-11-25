export interface AdminStatsResponse {
  totalUsers: number;
  activeUsers: number;
  totalTransactions: number;
  totalFundsCirculating: number;
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
