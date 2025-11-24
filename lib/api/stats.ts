import { apiClient } from './client';
import { AdminStatsResponse } from '@/types/stats';

export async function getStats(): Promise<AdminStatsResponse> {
  const response = await apiClient.get<AdminStatsResponse>('/api/admin/stats');
  return response.data;
}
