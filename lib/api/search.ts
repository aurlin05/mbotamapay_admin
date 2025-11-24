import { apiClient } from './client';
import {
  GlobalSearchResponse,
  GroupedSearchResults,
  SearchResult,
} from '@/types/search';

/**
 * Perform a global search across users and transactions
 * @param query - Search query string
 * @returns Grouped search results by entity type
 */
export async function globalSearch(query: string): Promise<GroupedSearchResults> {
  if (!query.trim()) {
    return { users: [], transactions: [] };
  }

  try {
    const response = await apiClient.get<GlobalSearchResponse>(
      '/api/admin/search',
      {
        params: { q: query },
      }
    );

    const data = response.data;

    // Transform users into search results
    const users: SearchResult[] = (data.users || []).map((user) => ({
      id: user.id,
      type: 'user' as const,
      title: user.email,
      subtitle: user.phone,
      url: `/users/${user.id}`,
    }));

    // Transform transactions into search results
    const transactions: SearchResult[] = (data.transactions || []).map(
      (transaction) => ({
        id: transaction.id,
        type: 'transaction' as const,
        title: transaction.reference,
        subtitle: `${transaction.senderEmail} → ${transaction.receiverEmail} • ${transaction.amount.toLocaleString()} XAF`,
        url: `/transactions?ref=${transaction.reference}`,
      })
    );

    return {
      users,
      transactions,
    };
  } catch (error) {
    console.error('Global search error:', error);
    // Return empty results on error
    return { users: [], transactions: [] };
  }
}
