import { apiClient } from './client';
import type { TransactionResponse, TransactionFilters, PaginatedTransactionsResponse } from '@/types/transaction';

export async function getAllTransactions(filters: TransactionFilters): Promise<PaginatedTransactionsResponse> {
  const params = new URLSearchParams();
  
  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  params.append('page', filters.page.toString());
  params.append('pageSize', filters.pageSize.toString());

  const response = await apiClient.get<PaginatedTransactionsResponse>(`/admin/transactions?${params.toString()}`);
  return response.data;
}

export async function getTransactionById(transactionId: number): Promise<TransactionResponse> {
  const response = await apiClient.get<TransactionResponse>(`/admin/transactions/${transactionId}`);
  return response.data;
}
