'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { UsersTable } from '@/components/users/UsersTable';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/FadeIn';
import { useUsers } from '@/lib/hooks/use-users';
import type { UserFilters } from '@/types/user';
import { toast } from '@/lib/utils/toast';
import { exportToCSV } from '@/lib/utils/export';
import { format } from 'date-fns';

export default function UsersPage() {
  const [filters, setFilters] = useState<UserFilters>({
    page: 1,
    pageSize: 20,
  });
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading, error } = useUsers(filters);

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search: search || undefined, page: 1 }));
  };

  const handleKycLevelChange = (kycLevel: string) => {
    setFilters((prev) => ({ ...prev, kycLevel: kycLevel || undefined, page: 1 }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status ? (status as 'active' | 'banned') : undefined,
      page: 1,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Get the filtered user data
      const users = data?.data || [];
      
      if (users.length === 0) {
        toast.error('No users to export');
        return;
      }

      // Prepare data for CSV export
      const exportData = users.map(user => ({
        id: user.id,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        kycLevel: user.kycLevel,
        status: user.active ? 'Active' : 'Banned',
        walletBalance: user.wallet.balance,
        registrationDate: format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      }));

      // Define custom headers for better readability
      const headers = [
        { key: 'id' as const, label: 'User ID' },
        { key: 'email' as const, label: 'Email' },
        { key: 'phone' as const, label: 'Phone' },
        { key: 'firstName' as const, label: 'First Name' },
        { key: 'lastName' as const, label: 'Last Name' },
        { key: 'kycLevel' as const, label: 'KYC Level' },
        { key: 'status' as const, label: 'Status' },
        { key: 'walletBalance' as const, label: 'Wallet Balance (XAF)' },
        { key: 'registrationDate' as const, label: 'Registration Date' },
      ];

      // Generate filename with timestamp
      const timestamp = format(new Date(), 'yyyy-MM-dd_HHmmss');
      const filename = `mbotamapay_users_${timestamp}`;

      // Export to CSV
      exportToCSV(exportData, filename, headers);
      
      toast.success(`Successfully exported ${users.length} user(s)`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export users. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts
          </p>
        </header>
        <div 
          className="rounded-lg border bg-card p-6 text-center"
          role="alert"
          aria-live="polite"
        >
          <p className="text-destructive mb-4">Failed to load users</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage and monitor user accounts
          </p>
        </div>
        <Button 
          onClick={handleExport} 
          variant="outline"
          disabled={isExporting || isLoading || !data?.data.length}
          aria-label="Export users to CSV"
        >
          <Download className="mr-2 h-4 w-4" aria-hidden="true" />
          {isExporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </header>

      <section aria-label="Users list">
        {isLoading ? (
          <UsersTable
            users={[]}
            isLoading={true}
            onSearchChange={handleSearchChange}
            onKycLevelChange={handleKycLevelChange}
            onStatusChange={handleStatusChange}
            onPageChange={handlePageChange}
            currentPage={filters.page}
            totalPages={1}
            totalItems={0}
          />
        ) : (
          <FadeIn>
            <UsersTable
              users={data?.data || []}
              isLoading={false}
              onSearchChange={handleSearchChange}
              onKycLevelChange={handleKycLevelChange}
              onStatusChange={handleStatusChange}
              onPageChange={handlePageChange}
              currentPage={filters.page}
              totalPages={data?.pagination.totalPages || 1}
              totalItems={data?.pagination.totalItems || 0}
            />
          </FadeIn>
        )}
      </section>
    </div>
  );
}
