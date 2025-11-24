'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, Wallet, Shield, Ban, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import type { UserResponse, UserTransaction } from '@/types/user';
import { toast } from '@/lib/utils/toast';

interface UserDetailCardProps {
  user: UserResponse | null;
  transactions: UserTransaction[];
  isLoading: boolean;
  onBan: (userId: number) => Promise<void>;
  onUnban: (userId: number) => Promise<void>;
}

export function UserDetailCard({
  user,
  transactions,
  isLoading,
  onBan,
  onUnban,
}: UserDetailCardProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<'ban' | 'unban'>('ban');

  const handleActionClick = (type: 'ban' | 'unban') => {
    setActionType(type);
    setShowConfirmDialog(true);
  };

  const handleConfirmAction = async () => {
    if (!user) return;

    setIsActionLoading(true);
    try {
      if (actionType === 'ban') {
        await onBan(user.id);
        toast.success('User has been banned successfully');
      } else {
        await onUnban(user.id);
        toast.success('User has been unbanned successfully');
      }
      setShowConfirmDialog(false);
    } catch (error) {
      toast.error(
        actionType === 'ban'
          ? 'Failed to ban user. Please try again.'
          : 'Failed to unban user. Please try again.'
      );
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          User not found
        </CardContent>
      </Card>
    );
  }

  const getKycLevelColor = (level: string) => {
    switch (level) {
      case 'BASIC':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'INTERMEDIATE':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'ADVANCED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'SUCCESS':
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Success</Badge>;
      case 'FAILED':
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : 'User Profile'}
                </CardTitle>
                <CardDescription>User ID: {user.id}</CardDescription>
              </div>
              <Badge variant={user.active ? 'default' : 'destructive'} className="text-sm">
                {user.active ? 'Active' : 'Banned'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KYC Level</p>
                  <Badge variant="outline" className={getKycLevelColor(user.kycLevel)}>
                    {user.kycLevel}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registration Date</p>
                  <p className="font-medium">
                    {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  <p className="text-2xl font-bold">{formatCurrency(user.wallet.balance)}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {user.active ? (
                <Button
                  variant="destructive"
                  onClick={() => handleActionClick('ban')}
                  disabled={isActionLoading}
                  className="flex-1"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Ban User
                </Button>
              ) : (
                <Button
                  variant="default"
                  onClick={() => handleActionClick('unban')}
                  disabled={isActionLoading}
                  className="flex-1"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Unban User
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Latest transactions for this user
            </CardDescription>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No transactions found
              </p>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{transaction.reference}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{transaction.type.toLowerCase().replace('_', ' ')}</span>
                        {transaction.otherParty && (
                          <>
                            <span>•</span>
                            <span>{transaction.otherParty}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(transaction.amount)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'ban' ? 'Ban User' : 'Unban User'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'ban'
                ? 'Are you sure you want to ban this user? They will no longer be able to access their account.'
                : 'Are you sure you want to unban this user? They will regain access to their account.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isActionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={actionType === 'ban' ? 'destructive' : 'default'}
              onClick={handleConfirmAction}
              disabled={isActionLoading}
            >
              {isActionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {actionType === 'ban' ? 'Ban User' : 'Unban User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
