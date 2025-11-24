'use client';

import { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, CheckCircle, Clock, XCircle } from 'lucide-react';
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
import type { TransactionResponse } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionsTableProps {
  transactions: TransactionResponse[];
  isLoading: boolean;
  onSearchChange: (search: string) => void;
  onStatusChange: (status: string) => void;
  onPageChange: (page: number) => void;
  onTransactionClick: (transaction: TransactionResponse) => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

type SortField = 'reference' | 'senderEmail' | 'receiverEmail' | 'amount' | 'status' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function TransactionsTable({
  transactions,
  isLoading,
  onSearchChange,
  onStatusChange,
  onPageChange,
  onTransactionClick,
  currentPage,
  totalPages,
  totalItems,
}: TransactionsTableProps) {
  const [searchValue, setSearchValue] = useState('');
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

  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    
    return [...transactions].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'reference':
          aValue = a.reference;
          bValue = b.reference;
          break;
        case 'senderEmail':
          aValue = a.senderEmail;
          bValue = b.senderEmail;
          break;
        case 'receiverEmail':
          aValue = a.receiverEmail;
          bValue = b.receiverEmail;
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, sortField, sortDirection]);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'default';
      case 'PENDING':
        return 'secondary';
      case 'FAILED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />;
      case 'PENDING':
        return <Clock className="h-3 w-3 mr-1" aria-hidden="true" />;
      case 'FAILED':
        return <XCircle className="h-3 w-3 mr-1" aria-hidden="true" />;
      default:
        return null;
    }
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
            placeholder="Search by reference, sender, or receiver..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search transactions"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Filter by transaction status"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('reference')}
              >
                Reference <SortIcon field="reference" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('senderEmail')}
              >
                Sender <SortIcon field="senderEmail" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('receiverEmail')}
              >
                Receiver <SortIcon field="receiverEmail" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('amount')}
              >
                Amount <SortIcon field="amount" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('status')}
              >
                Status <SortIcon field="status" />
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleSort('createdAt')}
              >
                Timestamp <SortIcon field="createdAt" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              sortedTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="interactive-row"
                  onClick={() => onTransactionClick(transaction)}
                >
                  <TableCell className="font-medium font-mono text-sm">
                    {transaction.reference}
                  </TableCell>
                  <TableCell>{transaction.senderEmail}</TableCell>
                  <TableCell>{transaction.receiverEmail}</TableCell>
                  <TableCell className="font-semibold">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(transaction.status)}
                      className="flex items-center w-fit"
                    >
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}
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
            {Math.min(currentPage * 20, totalItems)} of {totalItems} transactions
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
