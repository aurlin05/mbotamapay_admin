export interface OperatorAccount {
    id: number;
    provider: 'FEEXPAY' | 'CINETPAY';
    currency: string;
    balance: number;
    reservedBalance: number;
    lastSyncAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface RebalanceAction {
    fromProvider: 'FEEXPAY' | 'CINETPAY';
    toProvider: 'FEEXPAY' | 'CINETPAY';
    amount: number;
    currency: string;
    reason: string;
}

export interface RebalanceSuggestion {
    actions: RebalanceAction[];
    analysisTimestamp: string;
}

export interface TopupRequest {
    provider: 'FEEXPAY' | 'CINETPAY';
    currency: string;
    amount: number;
}
