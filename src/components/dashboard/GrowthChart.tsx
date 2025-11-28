'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data - in real app, this would come from API
const monthlyData = [
    { month: 'Jan', users: 120, transactions: 450 },
    { month: 'Feb', users: 180, transactions: 680 },
    { month: 'Mar', users: 240, transactions: 920 },
    { month: 'Apr', users: 310, transactions: 1150 },
    { month: 'May', users: 390, transactions: 1420 },
    { month: 'Jun', users: 480, transactions: 1740 },
];

export function GrowthChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={20} />
                    Growth Trends
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis
                            dataKey="month"
                            stroke="#888"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#888"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            dot={{ fill: '#8b5cf6', r: 4 }}
                            name="New Users"
                        />
                        <Line
                            type="monotone"
                            dataKey="transactions"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ fill: '#10b981', r: 4 }}
                            name="Transactions"
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-8 mt-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm text-gray-400">New Users</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-400">Transactions</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
