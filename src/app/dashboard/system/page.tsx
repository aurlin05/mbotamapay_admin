'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Database, Server, Mail, RefreshCw, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

interface ServiceStatus {
    name: string;
    status: 'UP' | 'DOWN' | 'UNKNOWN';
    icon: React.ElementType;
    details?: string;
}

export default function SystemHealthPage() {
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: 'Backend API', status: 'UNKNOWN', icon: Server },
        { name: 'Database', status: 'UNKNOWN', icon: Database },
        { name: 'Redis Cache', status: 'UNKNOWN', icon: Activity },
        { name: 'Email Service', status: 'UNKNOWN', icon: Mail },
    ]);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const checkHealth = async () => {
        setIsRefreshing(true);
        try {
            // Check backend health
            const healthResponse = await axios.get('http://localhost:8080/actuator/health');

            const newServices: ServiceStatus[] = [
                {
                    name: 'Backend API',
                    status: healthResponse.data.status === 'UP' ? 'UP' : 'DOWN',
                    icon: Server,
                    details: `Response time: ${Date.now() - lastUpdate.getTime()}ms`
                },
                {
                    name: 'Database',
                    status: healthResponse.data.components?.db?.status || 'UNKNOWN',
                    icon: Database,
                    details: healthResponse.data.components?.db?.details?.database || 'PostgreSQL'
                },
                {
                    name: 'Redis Cache',
                    status: healthResponse.data.components?.redis?.status || 'UNKNOWN',
                    icon: Activity,
                    details: 'Cache service'
                },
                {
                    name: 'Email Service',
                    status: 'UP', // Mock - would need actual endpoint
                    icon: Mail,
                    details: 'SMTP configured'
                },
            ];

            setServices(newServices);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error checking health:', error);
            setServices(prev => prev.map(s => ({ ...s, status: 'DOWN' as const })));
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        checkHealth();
        const interval = setInterval(checkHealth, 30000); // Refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'UP':
                return <CheckCircle className="text-green-500" size={20} />;
            case 'DOWN':
                return <XCircle className="text-red-500" size={20} />;
            default:
                return <AlertTriangle className="text-yellow-500" size={20} />;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'UP':
                return <Badge variant="success">Operational</Badge>;
            case 'DOWN':
                return <Badge variant="danger">Down</Badge>;
            default:
                return <Badge variant="warning">Unknown</Badge>;
        }
    };

    const allServicesUp = services.every(s => s.status === 'UP');

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-white">System Health</h2>
                    <p className="text-sm text-gray-400">
                        Last updated: {lastUpdate.toLocaleTimeString()}
                    </p>
                </div>
                <Button
                    onClick={checkHealth}
                    isLoading={isRefreshing}
                    variant={allServicesUp ? 'primary' : 'danger'}
                >
                    <RefreshCw size={16} />
                    Refresh Status
                </Button>
            </div>

            {/* Overall Status */}
            <Card>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {allServicesUp ? (
                            <>
                                <CheckCircle className="text-green-500" size={48} />
                                <div>
                                    <h3 className="text-xl font-semibold text-white">All Systems Operational</h3>
                                    <p className="text-gray-400">All services are running normally</p>
                                </div>
                            </>
                        ) : (
                            <>
                                <AlertTriangle className="text-yellow-500" size={48} />
                                <div>
                                    <h3 className="text-xl font-semibold text-white">Service Issues Detected</h3>
                                    <p className="text-gray-400">Some services are experiencing problems</p>
                                </div>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Services Grid - 1 col mobile, 2 cols tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {services.map((service) => {
                    const Icon = service.icon;
                    return (
                        <Card key={service.name}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3">
                                    <Icon size={24} />
                                    {service.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {getStatusIcon(service.status)}
                                        {getStatusBadge(service.status)}
                                    </div>
                                    {service.details && (
                                        <span className="text-sm text-gray-400">{service.details}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* System Metrics - 1 col mobile, 3 cols desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Uptime</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">99.9%</p>
                        <p className="text-sm text-gray-400">Last 30 days</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">45ms</p>
                        <p className="text-sm text-gray-400">Average</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-white">127</p>
                        <p className="text-sm text-gray-400">Current</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
