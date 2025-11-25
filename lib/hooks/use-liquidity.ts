import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOperatorBalances, getRebalanceSuggestions, topupOperatorAccount } from '@/lib/api/liquidity';
import type { TopupRequest } from '@/types/liquidity';
import { toast } from '@/lib/utils/toast';

export function useOperatorBalances() {
    return useQuery({
        queryKey: ['operator-balances'],
        queryFn: getOperatorBalances,
        refetchInterval: 30000, // Auto-refresh every 30 seconds
    });
}

export function useRebalanceSuggestions() {
    return useQuery({
        queryKey: ['rebalance-suggestions'],
        queryFn: getRebalanceSuggestions,
        refetchInterval: 60000, // Auto-refresh every minute
    });
}

export function useTopupMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: topupOperatorAccount,
        onSuccess: () => {
            // Invalidate and refetch operator balances
            queryClient.invalidateQueries({ queryKey: ['operator-balances'] });
            queryClient.invalidateQueries({ queryKey: ['rebalance-suggestions'] });
            toast.success('Operator account topped up successfully');
        },
        onError: (error: Error) => {
            toast.error(`Failed to topup: ${error.message}`);
        },
    });
}
