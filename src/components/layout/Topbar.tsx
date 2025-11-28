'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import styles from './Topbar.module.css';
import { Button } from '../ui/Button';

interface TopbarProps {
    title?: string;
}

export function Topbar({ title }: TopbarProps) {
    return (
        <header className={styles.topbar}>
            <h1 className={styles.title}>{title || 'Dashboard'}</h1>
            <div className={styles.actions}>
                <Button variant="ghost" size="icon">
                    <Bell size={20} />
                </Button>
            </div>
        </header>
    );
}
