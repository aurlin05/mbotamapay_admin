import React from 'react';
import clsx from 'clsx';
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    return (
        <span className={clsx(styles.badge, styles[variant], className)} {...props}>
            {children}
        </span>
    );
}
