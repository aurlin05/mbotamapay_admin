export interface UserResponse {
  id: number;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  kycLevel: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  active: boolean;
  createdAt: string;
  wallet: {
    id: number;
    balance: number;
  };
}

export interface UserTransaction {
  id: number;
  reference: string;
  amount: number;
  type: 'TRANSFER' | 'TOP_UP' | 'WITHDRAWAL';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  otherParty?: string; // email of sender/receiver
}

export interface UserFilters {
  search?: string;
  kycLevel?: string;
  status?: 'active' | 'banned';
  page: number;
  pageSize: number;
}

export interface PaginatedUsersResponse {
  data: UserResponse[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
