'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { KycTable } from '@/components/kyc/KycTable';
import { Loader2 } from 'lucide-react';

interface KycDocument {
    id: number;
    userId: number;
    type: string;
    status: string;
    fileUrl: string;
    uploadedAt: string;
}

export default function KycPage() {
    const [documents, setDocuments] = useState<KycDocument[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/kyc/pending');
            setDocuments(response.data);
        } catch (error) {
            console.error('Error fetching KYC documents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleVerify = async (id: number, approved: boolean) => {
        try {
            await axios.post(`http://localhost:8080/api/v1/kyc/${id}/verify`, null, {
                params: { approved }
            });
            // Refresh list
            fetchDocuments();
        } catch (error) {
            console.error('Error verifying document:', error);
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
                <h2 className="text-2xl font-bold text-white">KYC Verification</h2>
                <span className="text-sm text-gray-400">{documents.length} pending documents</span>
            </div>
            <KycTable
                documents={documents}
                onVerify={handleVerify}
            />
        </div>
    );
}
