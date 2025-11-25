'use client';

import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import type { RebalanceSuggestion } from '@/types/liquidity';
import { AlertTriangle, ArrowRight, Info } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RebalanceSuggestionsCardProps {
    suggestions: RebalanceSuggestion | undefined;
    isLoading: boolean;
}

export function RebalanceSuggestionsCard({ suggestions, isLoading }: RebalanceSuggestionsCardProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rebalancing Suggestions</h3>
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </Card>
        );
    }

    if (!suggestions || suggestions.actions.length === 0) {
        return (
            <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Rebalancing Suggestions</h3>
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        No rebalancing required. All operator accounts are well-balanced.
                    </AlertDescription>
                </Alert>
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Rebalancing Suggestions</h3>
                <span className="text-xs text-muted-foreground">
                    {suggestions.actions.length} suggestion{suggestions.actions.length !== 1 ? 's' : ''}
                </span>
            </div>

            {suggestions.analysisTimestamp && (
                <p className="text-xs text-muted-foreground mb-4">
                    Analysis performed: {new Date(suggestions.analysisTimestamp).toLocaleString()}
                </p>
            )}

            <div className="space-y-3">
                {suggestions.actions.map((action, index) => (
                    <div
                        key={index}
                        className="border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                                Rebalancing Recommended
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="flex-1 text-center">
                                <p className="text-xs text-muted-foreground mb-1">From</p>
                                <p className="font-semibold">{action.fromProvider}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 text-center">
                                <p className="text-xs text-muted-foreground mb-1">To</p>
                                <p className="font-semibold">{action.toProvider}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded p-2 mb-2">
                            <p className="text-sm">
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-semibold">{formatCurrency(action.amount)} {action.currency}</span>
                            </p>
                        </div>

                        <p className="text-xs text-muted-foreground leading-relaxed">
                            <span className="font-medium">Reason:</span> {action.reason}
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
