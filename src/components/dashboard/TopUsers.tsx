'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Trophy, TrendingUp } from 'lucide-react';

// Mock data - in real app, this would come from API
const topUsers = [
    { name: 'Jean Dupont', email: 'jean@example.com', volume: 2500000, transactions: 145 },
    { name: 'Marie Nguema', email: 'marie@example.com', volume: 1850000, transactions: 98 },
    { name: 'Paul Essono', email: 'paul@example.com', volume: 1420000, transactions: 87 },
    { name: 'Sophie Mbida', email: 'sophie@example.com', volume: 980000, transactions: 56 },
    { name: 'Alain Owona', email: 'alain@example.com', volume: 750000, transactions: 42 },
];

export function TopUsers() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy size={20} />
                    Top Users by Volume
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {topUsers.map((user, index) => (
                        <div
                            key={user.email}
                            className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-white font-medium">{user.name}</p>
                                    <p className="text-xs text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-semibold">
                                    {user.volume.toLocaleString()} XAF
                                </p>
                                <p className="text-xs text-gray-400">
                                    {user.transactions} transactions
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
