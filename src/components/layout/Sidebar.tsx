'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, Activity, LogOut, Wallet, FileCheck, Server } from 'lucide-react';
import clsx from 'clsx';
import styles from './Sidebar.module.css';
import { Button } from '../ui/Button';

const NAV_ITEMS = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/dashboard/users', icon: Users },
    { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
    { label: 'Operators', href: '/dashboard/operators', icon: Wallet },
    { label: 'KYC', href: '/dashboard/kyc', icon: FileCheck },
    { label: 'System Health', href: '/dashboard/system', icon: Server },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Activity className="text-primary" size={24} />
                <span className={clsx(styles.logoText, 'gradient-text')}>MbotamaPay</span>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.navItem, isActive && styles.active)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <div className={styles.userProfile}>
                    <div className={styles.avatar}>A</div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>Admin User</span>
                        <span className={styles.userRole}>Administrator</span>
                    </div>
                </div>
                <Button variant="ghost" fullWidth className="justify-start text-danger hover:bg-red-500/10 hover:text-red-400">
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        </aside>
    );
}
