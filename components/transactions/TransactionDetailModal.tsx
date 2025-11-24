'use client';

import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { TransactionResponse } from '@/types/transaction';
import { format } from 'date-fns';

interface TransactionDetailModalProps {
  transaction: TransactionResponse | null;
  open: boolean;
  onClose: () => void;
}

export function TransactionDetailModal({
  transaction,
  open,
  onClose,
}: TransactionDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(transaction.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'text-green-600 dark:text-green-400';
      case 'PENDING':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'FAILED':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reference Number */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
              <p className="font-mono font-semibold">{transaction.reference}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyReference}
              className="gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          {/* Status and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Status</p>
              <Badge variant={getStatusBadgeVariant(transaction.status)} className="text-sm">
                {transaction.status}
              </Badge>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Amount</p>
              <p className="text-2xl font-bold">{formatCurrency(transaction.amount)}</p>
            </div>
          </div>

          {/* Sender and Receiver */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Sender</p>
              <p className="font-medium break-all">{transaction.senderEmail}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Receiver</p>
              <p className="font-medium break-all">{transaction.receiverEmail}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-3 p-4 border rounded-lg">
            <h3 className="font-semibold mb-3">Transaction Information</h3>
            
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Type</span>
              <span className="font-medium">{transaction.type}</span>
            </div>

            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Timestamp</span>
              <span className="font-medium">
                {format(new Date(transaction.createdAt), 'MMM dd, yyyy HH:mm:ss')}
              </span>
            </div>

            {transaction.fees !== undefined && (
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Fees</span>
                <span className="font-medium">{formatCurrency(transaction.fees)}</span>
              </div>
            )}

            {transaction.description && (
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Description</span>
                <span className="font-medium">{transaction.description}</span>
              </div>
            )}
          </div>

          {/* Total Breakdown (if fees exist) */}
          {transaction.fees !== undefined && transaction.fees > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total (Amount + Fees)</span>
                <span className="text-xl font-bold">
                  {formatCurrency(transaction.amount + transaction.fees)}
                </span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
