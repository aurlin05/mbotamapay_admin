'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TransactionsTable } from '@/components/transactions/TransactionsTable';
import { Loader2 } from 'lucide-react';

interface Transaction {
    id: number;
    reference: string;
    type: string;
    status: string;
    amount: number;
    senderEmail: string;
    receiverEmail: string;
    description: string;
    createdAt: string;
}

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/admin/transactions');
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                <span className="text-sm text-gray-400">{transactions.length} transactions</span>
            </div>
            <TransactionsTable transactions={transactions} />
        </div>
    );
}
