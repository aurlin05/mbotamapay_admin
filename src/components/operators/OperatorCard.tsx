'use client';

import React, { useState } from 'react';
import { Wallet, Plus } from 'lucide-react';
import styles from './OperatorCard.module.css';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface OperatorAccount {
    id: number;
    provider: string;
    currency: string;
    balance: number;
    lastUpdated: string;
}

interface OperatorCardProps {
    account: OperatorAccount;
    onTopup: (provider: string, currency: string, amount: number) => Promise<void>;
}

export function OperatorCard({ account, onTopup }: OperatorCardProps) {
    const [isTopupMode, setIsTopupMode] = useState(false);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTopup = async () => {
        if (!amount) return;
        setIsLoading(true);
        try {
            await onTopup(account.provider, account.currency, parseFloat(amount));
            setIsTopupMode(false);
            setAmount('');
        } catch (error) {
            console.error('Topup failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.provider}>
                    <div className="p-2 rounded-lg bg-white/5">
                        <Wallet size={20} className="text-primary" />
                    </div>
                    <div>
                        <div className={styles.providerName}>{account.provider}</div>
                        <Badge variant="default" className="text-xs">{account.currency}</Badge>
                    </div>
                </div>
            </div>

            <div className={styles.balance}>
                {account.balance.toLocaleString()}
                <span className={styles.currency}>{account.currency}</span>
            </div>

            {isTopupMode ? (
                <div className="flex flex-col gap-2">
                    <Input
                        type="number"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoFocus
                    />
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={handleTopup}
                            isLoading={isLoading}
                            fullWidth
                        >
                            Confirm
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setIsTopupMode(false)}
                            fullWidth
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    variant="secondary"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setIsTopupMode(true)}
                >
                    <Plus size={16} />
                    Top Up Balance
                </Button>
            )}
        </div>
    );
}
