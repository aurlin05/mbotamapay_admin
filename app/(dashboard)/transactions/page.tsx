'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/lib/hooks/use-transactions';
import type { TransactionResponse } from '@/types/transaction';
import { toast } from '@/lib/utils/toast';
import { exportToCSV } from '@/lib/utils/export';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, error } = useTransactions({
    search,
    status,
    page,
    pageSize: 20,
  });

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page on search
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(1); // Reset to first page on filter change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleTransactionClick = (transaction: TransactionResponse) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Get the filtered transaction data
      const transactions = data?.data || [];
      
      if (transactions.length === 0) {
        toast.error('No transactions to export');
        return;
      }

      // Prepare data for CSV export
      const exportData = transactions.map(transaction => ({
        id: transaction.id,
        reference: transaction.reference,
        type: transaction.type,
        senderEmail: transaction.senderEmail,
        receiverEmail: transaction.receiverEmail,
        amount: transaction.amount,
        fees: transaction.fees || 0,
        status: transaction.status,
        description: transaction.description || '',
        createdAt: format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      }));

      // Define custom headers for better readability
      const headers = [
        { key: 'id' as const, label: 'Transaction ID' },
        { key: 'reference' as const, label: 'Reference' },
        { key: 'type' as const, label: 'Type' },
        { key: 'senderEmail' as const, label: 'Sender Email' },
        { key: 'receiverEmail' as const, label: 'Receiver Email' },
        { key: 'amount' as const, label: 'Amount (XAF)' },
        { key: 'fees' as const, label: 'Fees (XAF)' },
        { key: 'status' as const, label: 'Status' },
        { key: 'description' as const, label: 'Description' },
        { key: 'createdAt' as const, label: 'Created At' },
      ];

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
      const filename = `mbotamapay_transactions_${timestamp}`;

      // Export to CSV
      exportToCSV(exportData, filename, headers);
      
      toast.success(`Successfully exported ${transactions.length} transaction(s)`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export transactions. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform transactions
          </p>
        </header>
        <div 
          className="rounded-lg border bg-card p-6"
          role="alert"
          aria-live="polite"
        >
          <p className="text-destructive">Failed to load transactions. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform transactions
          </p>
        </div>
        <Button
          onClick={handleExport}
          disabled={isExporting || isLoading || !data?.data.length}
          className="gap-2"
          aria-label="Export transactions to CSV"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </header>

      <section aria-label="Transactions list" className="rounded-lg border bg-card p-6">
        <TransactionsTable
          transactions={data?.data || []}
          isLoading={isLoading}
          onSearchChange={handleSearchChange}
          onStatusChange={handleStatusChange}
          onPageChange={handlePageChange}
          onTransactionClick={handleTransactionClick}
          currentPage={page}
          totalPages={data?.pagination.totalPages || 1}
          totalItems={data?.pagination.totalItems || 0}
        />
      </section>

      <TransactionDetailModal
        transaction={selectedTransaction}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
