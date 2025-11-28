import React from 'react';
import styles from './DashboardLayout.module.css';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <Topbar title={title} />
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
}
