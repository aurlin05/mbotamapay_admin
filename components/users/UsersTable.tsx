'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronUp, ChevronDown, CheckCircle, Ban } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/utils';
import type { UserResponse } from '@/types/user';
import { format } from 'date-fns';

interface UsersTableProps {
  users: UserResponse[];
  isLoading: boolean;
  onSearchChange: (search: string) => void;
  onKycLevelChange: (kycLevel: string) => void;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

type SortField = 'email' | 'phone' | 'kycLevel' | 'balance' | 'createdAt' | 'status';
type SortDirection = 'asc' | 'desc';

export function UsersTable({
  users,
  isLoading,
  onSearchChange,
  onKycLevelChange,
  onStatusChange,
  onPageChange,
  currentPage,
  totalPages,
  totalItems,
}: UsersTableProps) {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState('');
  const [kycLevelFilter, setKycLevelFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Debounced search
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const timeoutId = setTimeout(() => {
      onSearchChange(value);
    }, 300);
    return () => clearTimeout(timeoutId);
  };

  const handleKycLevelChange = (value: string) => {
    setKycLevelFilter(value);
    onKycLevelChange(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    onStatusChange(value);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedUsers = useMemo(() => {
    if (!users) return [];
    
    return [...users].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'email':
          aValue = a.email;
          bValue = b.email;
          break;
        case 'phone':
          aValue = a.phone;
          bValue = b.phone;
          break;
        case 'kycLevel':
          aValue = a.kycLevel;
          bValue = b.kycLevel;
          break;
        case 'balance':
          aValue = a.wallet.balance;
          bValue = b.wallet.balance;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'status':
          aValue = a.active;
          bValue = b.active;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, sortField, sortDirection]);

  const handleRowClick = (userId: number) => {
    router.push(`/users/${userId}`);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-1 h-4 w-4 inline" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4 inline" />
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4 transition-opacity duration-200">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="border rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <Skeleton className="h-6 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email or phone..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search users"
          />
        </div>
        <select
          value={kycLevelFilter}
          onChange={(e) => handleKycLevelChange(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Filter by KYC level"
        >
          <option value="">All KYC Levels</option>
          <option value="BASIC">Basic</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Filter by user status"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('email')}
              >
                Email <SortIcon field="email" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('phone')}
              >
                Phone <SortIcon field="phone" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('kycLevel')}
              >
                KYC Level <SortIcon field="kycLevel" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('balance')}
              >
                Wallet Balance <SortIcon field="balance" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                Registration Date <SortIcon field="createdAt" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              sortedUsers.map((user) => (
                <TableRow
                  key={user.id}
                  className="interactive-row"
                  onClick={() => handleRowClick(user.id)}
                >
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.kycLevel}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(user.wallet.balance)}</TableCell>
                  <TableCell>
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.active ? 'default' : 'destructive'}
                      className="flex items-center w-fit"
                    >
                      {user.active ? (
                        <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                      ) : (
                        <Ban className="h-3 w-3 mr-1" aria-hidden="true" />
                      )}
                      {user.active ? 'Active' : 'Banned'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 20 + 1} to{' '}
            {Math.min(currentPage * 20, totalItems)} of {totalItems} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              {totalPages > 5 && <span className="px-2">...</span>}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
