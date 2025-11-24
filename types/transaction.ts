export interface TransactionResponse {
  id: number;
  reference: string;
  senderEmail: string;
  receiverEmail: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  type: 'TRANSFER' | 'TOP_UP' | 'WITHDRAWAL';
  createdAt: string;
  fees?: number;
  description?: string;
}

export interface TransactionFilters {
  search?: string;
  status?: string;
  page: number;
  pageSize: number;
}

export interface PaginatedTransactionsResponse {
  data: TransactionResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
