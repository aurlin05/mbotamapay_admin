'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { OperatorCard } from '@/components/operators/OperatorCard';
import { RebalanceSuggestions } from '@/components/operators/RebalanceSuggestions';
import { Loader2 } from 'lucide-react';

interface OperatorAccount {
    id: number;
    provider: string;
    currency: string;
    balance: number;
    lastUpdated: string;
}

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

export default function OperatorsPage() {
    const [accounts, setAccounts] = useState<OperatorAccount[]>([]);
    const [suggestions, setSuggestions] = useState<RebalanceSuggestion | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [accountsRes, suggestionsRes] = await Promise.all([
                axios.get('http://localhost:8080/api/v1/admin/operator/balances'),
                axios.get('http://localhost:8080/api/v1/admin/operator/rebalance-suggestions')
            ]);
            setAccounts(accountsRes.data);
            setSuggestions(suggestionsRes.data);
        } catch (error) {
            console.error('Error fetching operator data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTopup = async (provider: string, currency: string, amount: number) => {
        try {
            await axios.post('http://localhost:8080/api/v1/admin/operator/topup', null, {
                params: { provider, currency, amount }
            });
            // Refresh data
            fetchData();
        } catch (error) {
            console.error('Topup failed:', error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Operator Balances</h2>
                {/* Operator Cards Grid - 1 col mobile, 2 cols tablet, 3 cols desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {accounts.map((account) => (
                        <OperatorCard
                            key={account.id}
                            account={account}
                            onTopup={handleTopup}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Liquidity Management</h2>
                <RebalanceSuggestions suggestions={suggestions} />
            </div>
        </div>
    );
}
