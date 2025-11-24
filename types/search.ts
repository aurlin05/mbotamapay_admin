export interface SearchResult {
  id: number;
  type: 'user' | 'transaction';
  title: string;
  subtitle: string;
  url: string;
}

export interface GroupedSearchResults {
  users: SearchResult[];
  transactions: SearchResult[];
}

export interface GlobalSearchResponse {
  users: Array<{
    id: number;
    email: string;
    phone: string;
  }>;
  transactions: Array<{
    id: number;
    reference: string;
    senderEmail: string;
    receiverEmail: string;
    amount: number;
  }>;
}
