import { apiClient } from './client';
import type { UserResponse, UserFilters, PaginatedUsersResponse, UserTransaction } from '@/types/user';

export async function getAllUsers(filters: UserFilters): Promise<PaginatedUsersResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.kycLevel) params.append('kycLevel', filters.kycLevel);
  if (filters.status) params.append('status', filters.status);
  params.append('page', filters.page.toString());
  params.append('pageSize', filters.pageSize.toString());

  const response = await apiClient.get<PaginatedUsersResponse>(`/admin/users?${params.toString()}`);
  return response.data;
}

export async function getUserById(userId: number): Promise<UserResponse> {
  const response = await apiClient.get<UserResponse>(`/admin/users/${userId}`);
  return response.data;
}

export async function getUserTransactions(userId: number): Promise<UserTransaction[]> {
  const response = await apiClient.get<UserTransaction[]>(`/admin/users/${userId}/transactions`);
  return response.data;
}

export async function banUser(userId: number): Promise<void> {
  await apiClient.post(`/admin/users/${userId}/ban`);
}

export async function unbanUser(userId: number): Promise<void> {
  await apiClient.post(`/admin/users/${userId}/unban`);
}
