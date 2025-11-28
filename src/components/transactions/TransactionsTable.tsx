'use client';

import React from 'react';
import styles from './TransactionsTable.module.css';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

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

interface TransactionsTableProps {
    transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
    const getStatusVariant = (status: string) => {
        switch (status.toUpperCase()) {
            case 'COMPLETED':
            case 'SUCCESS':
                return 'success';
            case 'PENDING':
                return 'warning';
            case 'FAILED':
            case 'CANCELLED':
                return 'danger';
            default:
                return 'default';
        }
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>Reference</th>
                        <th className={styles.th}>Type</th>
                        <th className={styles.th}>From / To</th>
                        <th className={styles.th}>Amount</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((tx) => (
                        <tr key={tx.id} className={styles.tr}>
                            <td className={styles.td}>
                                <span className="font-mono text-xs text-gray-400">{tx.reference}</span>
                            </td>
                            <td className={styles.td}>
                                <Badge variant="info">{tx.type}</Badge>
                            </td>
                            <td className={styles.td}>
                                <div className="flex flex-col text-xs">
                                    <span className="text-gray-400">From: {tx.senderEmail}</span>
                                    <span className="text-gray-400">To: {tx.receiverEmail}</span>
                                </div>
                            </td>
                            <td className={styles.td}>
                                <span className={clsx(styles.amount, styles.positive)}>
                                    {tx.amount.toLocaleString()} XAF
                                </span>
                            </td>
                            <td className={styles.td}>
                                <Badge variant={getStatusVariant(tx.status)}>{tx.status}</Badge>
                            </td>
                            <td className={styles.td}>
                                {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
