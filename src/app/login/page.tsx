'use client';

import React, { useState } from 'react';
import { Activity, Mail, Lock } from 'lucide-react';
import axios from 'axios';
import styles from './page.module.css';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Assuming the backend is running on localhost:8080
            // In a real app, this URL should be in an environment variable
            const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
                identifier: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const { token, refreshToken, name, email: userEmail, role } = response.data;

            // Check if user is admin
            if (role !== 'ADMIN') {
                setError('Access denied. Admin privileges required.');
                setIsLoading(false);
                return;
            }

            // Create user object for context
            const userData = { name, email: userEmail, role };
            login(token, refreshToken, userData);
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Activity className="text-primary" size={32} />
                        <span className="text-2xl font-bold gradient-text">MbotamaPay</span>
                    </div>
                    <h1 className={styles.title}>Admin Login</h1>
                    <p className={styles.subtitle}>Sign in to access the dashboard</p>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="admin@mbotamapay.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail size={18} />}
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        icon={<Lock size={18} />}
                        required
                    />

                    <Button type="submit" fullWidth isLoading={isLoading}>
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
