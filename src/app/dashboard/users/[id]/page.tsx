'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Wallet, FileText, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface UserDetails {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
    kycLevel: string;
    active: boolean;
    createdAt: string;
    referralCode: string;
}

interface Transaction {
    id: number;
    reference: string;
    type: string;
    status: string;
    amount: number;
    createdAt: string;
}

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id;

    const [user, setUser] = useState<UserDetails | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user from users list
                const usersResponse = await axios.get('http://localhost:8080/api/v1/admin/users');
                const foundUser = usersResponse.data.find((u: UserDetails) => u.id === Number(userId));

                if (foundUser) {
                    setUser(foundUser);
                }

                // Fetch all transactions and filter by user email
                const txResponse = await axios.get('http://localhost:8080/api/v1/admin/transactions');
                const userTransactions = txResponse.data.filter(
                    (tx: any) => tx.senderEmail === foundUser?.email || tx.receiverEmail === foundUser?.email
                );
                setTransactions(userTransactions.slice(0, 10)); // Last 10 transactions
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-gray-400">User not found</p>
                <Button onClick={() => router.push('/dashboard/users')}>
                    Back to Users
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/users')}>
                    <ArrowLeft size={20} />
                </Button>
                <h2 className="text-2xl font-bold text-white">User Profile</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* User Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User size={20} />
                            Personal Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Name</label>
                            <p className="text-white font-medium">{user.name}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Mail size={14} /> Email
                            </label>
                            <p className="text-white">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Phone size={14} /> Phone
                            </label>
                            <p className="text-white">{user.phone}</p>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400 flex items-center gap-2">
                                <Calendar size={14} /> Member Since
                            </label>
                            <p className="text-white">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shield size={20} />
                            Account Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-400">Role</label>
                            <div className="mt-1">
                                <Badge variant={user.role === 'ADMIN' ? 'info' : 'default'}>
                                    {user.role}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">KYC Level</label>
                            <div className="mt-1">
                                <Badge variant="warning">{user.kycLevel}</Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Status</label>
                            <div className="mt-1">
                                <Badge variant={user.active ? 'success' : 'danger'}>
                                    {user.active ? 'Active' : 'Banned'}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-gray-400">Referral Code</label>
                            <p className="text-white font-mono">{user.referralCode}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText size={20} />
                        Recent Transactions ({transactions.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.length > 0 ? (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-mono text-gray-400">{tx.reference}</span>
                                        <span className="text-xs text-gray-500">
                                            {new Date(tx.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="info">{tx.type}</Badge>
                                        <span className="font-semibold text-white">{tx.amount.toLocaleString()} XAF</span>
                                        <Badge
                                            variant={
                                                tx.status === 'COMPLETED' ? 'success' :
                                                    tx.status === 'PENDING' ? 'warning' : 'danger'
                                            }
                                        >
                                            {tx.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-4">No transactions found</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
