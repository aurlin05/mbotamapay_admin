'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTopupMutation } from '@/lib/hooks/use-liquidity';
import type { TopupRequest } from '@/types/liquidity';

interface TopupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TopupDialog({ open, onOpenChange }: TopupDialogProps) {
    const [formData, setFormData] = useState<TopupRequest>({
        provider: 'FEEXPAY',
        currency: 'XAF',
        amount: 0,
    });

    const topupMutation = useTopupMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.amount <= 0) {
            return;
        }

        try {
            await topupMutation.mutateAsync(formData);
            onOpenChange(false);
            // Reset form
            setFormData({
                provider: 'FEEXPAY',
                currency: 'XAF',
                amount: 0,
            });
        } catch (error) {
            // Error is handled by the mutation onError callback
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Topup Operator Account</DialogTitle>
                    <DialogDescription>
                        Simulate adding funds to an operator account balance. This is for testing purposes.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <select
                            id="provider"
                            value={formData.provider}
                            onChange={(e) => setFormData({ ...formData, provider: e.target.value as 'FEEXPAY' | 'CINETPAY' })}
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            required
                        >
                            <option value="FEEXPAY">FeexPay</option>
                            <option value="CINETPAY">CinetPay</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Input
                            id="currency"
                            type="text"
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            placeholder="XAF"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                            id="amount"
                            type="number"
                            min="1"
                            step="0.01"
                            value={formData.amount || ''}
                            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                            placeholder="10000"
                            required
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={topupMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={topupMutation.isPending || formData.amount <= 0}>
                            {topupMutation.isPending ? 'Processing...' : 'Topup Account'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
