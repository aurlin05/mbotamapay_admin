'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UsersTable } from '@/components/users/UsersTable';
import { Loader2 } from 'lucide-react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    kycLevel: string;
    active: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBan = async (id: number) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/admin/users/${id}/ban`);
            // Optimistic update or refetch
            setUsers(users.map(user => user.id === id ? { ...user, active: false } : user));
        } catch (error) {
            console.error('Error banning user:', error);
        }
    };

    const handleUnban = async (id: number) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/admin/users/${id}/unban`);
            // Optimistic update or refetch
            setUsers(users.map(user => user.id === id ? { ...user, active: true } : user));
        } catch (error) {
            console.error('Error unbanning user:', error);
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <span className="text-sm text-gray-400">{users.length} total users</span>
            </div>
            <UsersTable
                users={users}
                onBan={handleBan}
                onUnban={handleUnban}
            />
        </div>
    );
}
