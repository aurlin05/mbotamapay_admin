'use client';

import React from 'react';
import { Check, X, FileText } from 'lucide-react';
import styles from './KycTable.module.css';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface KycDocument {
    id: number;
    userId: number;
    type: string;
    status: string;
    fileUrl: string;
    uploadedAt: string;
}

interface KycTableProps {
    documents: KycDocument[];
    onVerify: (id: number, approved: boolean) => void;
}

export function KycTable({ documents, onVerify }: KycTableProps) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.tr}>
                        <th className={styles.th}>User ID</th>
                        <th className={styles.th}>Document Type</th>
                        <th className={styles.th}>Status</th>
                        <th className={styles.th}>Uploaded At</th>
                        <th className={styles.th}>File</th>
                        <th className={styles.th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc) => (
                        <tr key={doc.id} className={styles.tr}>
                            <td className={styles.td}>#{doc.userId}</td>
                            <td className={styles.td}>
                                <Badge variant="info">{doc.type}</Badge>
                            </td>
                            <td className={styles.td}>
                                <Badge variant={
                                    doc.status === 'APPROVED' ? 'success' :
                                        doc.status === 'REJECTED' ? 'danger' : 'warning'
                                }>
                                    {doc.status}
                                </Badge>
                            </td>
                            <td className={styles.td}>
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className={styles.td}>
                                <a
                                    href={doc.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.documentLink}
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText size={16} />
                                        View
                                    </div>
                                </a>
                            </td>
                            <td className={styles.td}>
                                {doc.status === 'PENDING' && (
                                    <div className={styles.actions}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => onVerify(doc.id, true)}
                                            title="Approve"
                                            className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"
                                        >
                                            <Check size={16} />
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => onVerify(doc.id, false)}
                                            title="Reject"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    {documents.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-400">
                                No pending KYC documents found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
