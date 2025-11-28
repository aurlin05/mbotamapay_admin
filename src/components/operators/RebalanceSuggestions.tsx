'use client';

import React from 'react';
import { ArrowRightLeft, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RebalanceAction {
    sourceProvider: string;
    targetProvider: string;
    amount: number;
    currency: string;
    reason: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

interface RebalanceSuggestion {
    actions: RebalanceAction[];
    timestamp: string;
}

interface RebalanceSuggestionsProps {
    suggestions: RebalanceSuggestion | null;
}

export function RebalanceSuggestions({ suggestions }: RebalanceSuggestionsProps) {
    if (!suggestions || suggestions.actions.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ArrowRightLeft size={20} />
                        Liquidity Rebalancing
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-gray-400 py-4">
                        No rebalancing actions needed at this time.
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ArrowRightLeft size={20} />
                    Liquidity Rebalancing
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {suggestions.actions.map((action, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{action.sourceProvider}</span>
                                <ArrowRightLeft size={14} className="text-gray-400" />
                                <span className="font-semibold text-white">{action.targetProvider}</span>
                            </div>
                            <span className="text-xs text-gray-400">{action.reason}</span>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                            <span className="font-mono font-bold text-primary-light">
                                {action.amount.toLocaleString()} {action.currency}
                            </span>
                            <Badge
                                variant={
                                    action.priority === 'HIGH' ? 'danger' :
                                        action.priority === 'MEDIUM' ? 'warning' : 'info'
                                }
                            >
                                {action.priority} Priority
                            </Badge>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
