'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/FadeIn';
import { useOperatorBalances, useRebalanceSuggestions } from '@/lib/hooks/use-liquidity';
import { OperatorBalancesCard } from '@/components/liquidity/OperatorBalancesCard';
import { RebalanceSuggestionsCard } from '@/components/liquidity/RebalanceSuggestionsCard';
import { TopupDialog } from '@/components/liquidity/TopupDialog';
import { Plus, RefreshCw } from 'lucide-react';
import { toast } from '@/lib/utils/toast';

export default function LiquidityPage() {
    const [showTopupDialog, setShowTopupDialog] = useState(false);

    const {
        data: balances,
        isLoading: balancesLoading,
        error: balancesError,
        refetch: refetchBalances,
    } = useOperatorBalances();

    const {
        data: suggestions,
        isLoading: suggestionsLoading,
        error: suggestionsError,
        refetch: refetchSuggestions,
    } = useRebalanceSuggestions();

    const handleRefresh = async () => {
        try {
            await Promise.all([refetchBalances(), refetchSuggestions()]);
            toast.success('Liquidity data refreshed successfully');
        } catch {
            toast.error('Failed to refresh liquidity data');
        }
    };

    if (balancesError || suggestionsError) {
        return (
            <div className="space-y-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Liquidity Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage operator account balances
                    </p>
                </header>
                <div
                    className="rounded-lg border bg-card p-6 text-center"
                    role="alert"
                    aria-live="polite"
                >
                    <p className="text-destructive mb-4">Failed to load liquidity data</p>
                    <Button onClick={handleRefresh}>Retry</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Liquidity Management</h1>
                    <p className="text-muted-foreground">
                        Monitor and manage operator account balances
                    </p>
                </div>
                <div className="flex gap-2" role="group" aria-label="Liquidity actions">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        size="sm"
                        aria-label="Refresh liquidity data"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Refresh
                    </Button>
                    <Button
                        onClick={() => setShowTopupDialog(true)}
                        size="sm"
                        aria-label="Topup operator account"
                    >
                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                        Topup Account
                    </Button>
                </div>
            </header>

            <section className="grid gap-6 md:grid-cols-1 lg:grid-cols-2" aria-label="Liquidity overview">
                {balancesLoading ? (
                    <>
                        <OperatorBalancesCard balances={undefined} isLoading={true} />
                        <RebalanceSuggestionsCard suggestions={undefined} isLoading={true} />
                    </>
                ) : (
                    <>
                        <FadeIn delay={0.1}>
                            <OperatorBalancesCard balances={balances} isLoading={false} />
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <RebalanceSuggestionsCard suggestions={suggestions} isLoading={suggestionsLoading} />
                        </FadeIn>
                    </>
                )}
            </section>

            <TopupDialog open={showTopupDialog} onOpenChange={setShowTopupDialog} />
        </div>
    );
}
