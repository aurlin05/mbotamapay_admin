'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { OperatorAccount } from '@/types/liquidity';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OperatorBalancesCardProps {
    balances: OperatorAccount[] | undefined;
    isLoading: boolean;
}

export function OperatorBalancesCard({ balances, isLoading }: OperatorBalancesCardProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Operator Balances</h3>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    ))}
                </div>
            </Card>
        );
    }

    if (!balances || balances.length === 0) {
        return (
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Operator Balances</h3>
                <p className="text-muted-foreground text-sm">No operator accounts found</p>
            </Card>
        );
    }

    const totalBalance = balances.reduce((sum, account) => sum + account.balance, 0);
    const totalReserved = balances.reduce((sum, account) => sum + account.reservedBalance, 0);
    const totalAvailable = totalBalance - totalReserved;

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Operator Balances</h3>
                <Wallet className="h-5 w-5 text-muted-foreground" />
            </div>

            {/* Total Overview */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Balance</p>
                    <p className="text-lg font-semibold">{formatCurrency(totalBalance)}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Reserved</p>
                    <p className="text-lg font-semibold text-amber-600">{formatCurrency(totalReserved)}</p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Available</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(totalAvailable)}</p>
                </div>
            </div>

            {/* Individual Operator Accounts */}
            <div className="space-y-4">
                {balances.map((account) => {
                    const available = account.balance - account.reservedBalance;
                    const utilizationRate = account.balance > 0
                        ? ((account.reservedBalance / account.balance) * 100).toFixed(1)
                        : '0.0';

                    return (
                        <div key={account.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{account.provider}</span>
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                        {account.currency}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    {parseFloat(utilizationRate) > 70 ? (
                                        <TrendingUp className="h-3 w-3 text-amber-500" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3 text-green-500" />
                                    )}
                                    <span>{utilizationRate}% utilized</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Balance</p>
                                    <p className="font-medium">{formatCurrency(account.balance)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Reserved</p>
                                    <p className="font-medium">{formatCurrency(account.reservedBalance)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Available</p>
                                    <p className="font-medium text-green-600">{formatCurrency(available)}</p>
                                </div>
                            </div>

                            {account.lastSyncAt && (
                                <p className="text-xs text-muted-foreground mt-2">
                                    Last synced: {new Date(account.lastSyncAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
