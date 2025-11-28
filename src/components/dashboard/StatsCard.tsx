import React from 'react';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import styles from './StatsCard.module.css';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <div className={styles.iconWrapper}>
                    <Icon size={20} />
                </div>
            </div>
            <div className={styles.value}>{value}</div>
            {trend && (
                <div className={clsx(styles.trend, trend.isPositive ? styles.positive : styles.negative)}>
                    <span>{trend.isPositive ? '+' : '-'}{trend.value}%</span>
                    <span>from last month</span>
                </div>
            )}
        </div>
    );
}
