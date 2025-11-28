'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Ban, CheckCircle } from 'lucide-react';
import styles from './UsersTable.module.css';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    kycLevel: string;
    active: boolean;
    createdAt: string;
}

interface UsersTableProps {
    users: User[];
    onBan: (id: number) => void;
    onUnban: (id: number) => void;
}

export function UsersTable({ users, onBan, onUnban }: UsersTableProps) {
    const router = useRouter();

    const handleRowClick = (userId: number, e: React.MouseEvent) => {
        // Don't navigate if clicking on action buttons
        if ((e.target as HTMLElement).closest('button')) {
            return;
        }
        router.push(`/dashboard/users/${userId}`);
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>User</th>
                        <th className={styles.th}>Role</th>
                        <th className={styles.th}>KYC Level</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Joined</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr
                            key={user.id}
                            className={styles.tr}
                            onClick={(e) => handleRowClick(user.id, e)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td className={styles.td}>
                                <div className={styles.userInfo}>
                                    <span>{user.name}</span>
                                    <span className={styles.userEmail}>{user.email}</span>
                                </div>
                            </td>
                            <td className={styles.td}>
                                <Badge variant={user.role === 'ADMIN' ? 'info' : 'default'}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td className={styles.td}>
                                <Badge variant="warning">{user.kycLevel}</Badge>
                            </td>
                            <td className={styles.td}>
                                <Badge variant={user.active ? 'success' : 'danger'}>
                                    {user.active ? 'Active' : 'Banned'}
                                </Badge>
                            </td>
                            <td className={styles.td}>
                                {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className={styles.td}>
                                <div className={styles.actions}>
                                    {user.active ? (
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onBan(user.id);
                                            }}
                                            title="Ban User"
                                        >
                                            <Ban size={16} />
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUnban(user.id);
                                            }}
                                            title="Unban User"
                                        >
                                            <CheckCircle size={16} />
                                        </Button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
