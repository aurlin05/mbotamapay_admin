'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserDetailCard } from '@/components/users/UserDetailCard';
import { useUser, useUserTransactions, useBanUser, useUnbanUser } from '@/lib/hooks/use-users';

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.id as string);

  const { data: user, isLoading: isUserLoading, error: userError } = useUser(userId);
  const { data: transactions = [], isLoading: isTransactionsLoading } = useUserTransactions(userId);
  const banUserMutation = useBanUser();
  const unbanUserMutation = useUnbanUser();

  const isLoading = isUserLoading || isTransactionsLoading;

  const handleBan = async (userId: number) => {
    await banUserMutation.mutateAsync(userId);
  };

  const handleUnban = async (userId: number) => {
    await unbanUserMutation.mutateAsync(userId);
  };

  const handleBack = () => {
    router.push('/users');
  };

  if (userError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">User Details</h1>
            <p className="text-muted-foreground">View and manage user information</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Failed to Load User</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  {(userError as any)?.response?.data?.error || 
                   'An error occurred while loading user details. Please try again.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleBack}>
                  Back to Users
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">User Details</h1>
          <p className="text-muted-foreground">View and manage user information</p>
        </div>
      </div>

      {/* User Detail Card */}
      <UserDetailCard
        user={user || null}
        transactions={transactions}
        isLoading={isLoading}
        onBan={handleBan}
        onUnban={handleUnban}
      />
    </div>
  );
}
