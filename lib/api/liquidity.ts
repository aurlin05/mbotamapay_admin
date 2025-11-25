import { apiClient } from './client';
import type { OperatorAccount, RebalanceSuggestion, TopupRequest } from '@/types/liquidity';

export async function getOperatorBalances(): Promise<OperatorAccount[]> {
    const response = await apiClient.get<OperatorAccount[]>('/admin/operator/balances');
    return response.data;
}

export async function getRebalanceSuggestions(): Promise<RebalanceSuggestion> {
    const response = await apiClient.get<RebalanceSuggestion>('/admin/operator/rebalance-suggestions');
    return response.data;
}

export async function topupOperatorAccount(data: TopupRequest): Promise<string> {
    const response = await apiClient.post<string>('/admin/operator/topup', null, {
        params: data,
    });
    return response.data;
}
