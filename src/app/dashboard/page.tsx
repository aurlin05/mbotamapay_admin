'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, CreditCard, DollarSign, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { OverviewCharts } from '@/components/dashboard/OverviewCharts';
import { GrowthChart } from '@/components/dashboard/GrowthChart';
import { TopUsers } from '@/components/dashboard/TopUsers';

interface AdminStats {
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    totalFundsCirculating: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/v1/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Stats Cards - 1 col mobile, 2 cols tablet, 4 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <StatsCard
                    title="Total Users"
                    value={stats?.totalUsers || 0}
                    icon={Users}
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Active Users"
                    value={stats?.activeUsers || 0}
                    icon={Activity}
                    trend={{ value: 4, isPositive: true }}
                />
                <StatsCard
                    title="Total Transactions"
                    value={stats?.totalTransactions || 0}
                    icon={CreditCard}
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Funds Circulating"
                    value={`$${stats?.totalFundsCirculating || 0}`}
                    icon={DollarSign}
                    trend={{ value: 2, isPositive: false }}
                />
            </div>

            {/* Overview Chart - Full width on all screens */}
            <OverviewCharts />

            {/* Analytics Grid - 1 col mobile, 2 cols desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <GrowthChart />
                <TopUsers />
            </div>
        </div>
    );
}
