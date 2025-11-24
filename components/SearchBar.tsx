'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/lib/utils/toast';
import { globalSearch } from '@/lib/api/search';
import { SearchResult, GroupedSearchResults } from '@/types/search';

interface SearchBarProps {
  className?: string;
}

export function SearchBar({ className }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GroupedSearchResults>({
    users: [],
    transactions: [],
  });
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ users: [], transactions: [] });
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const searchResults = await globalSearch(query);
        setResults(searchResults);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to search. Please try again.');
        setResults({ users: [], transactions: [] });
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allResults = [...results.users, ...results.transactions];
  const hasResults = allResults.length > 0;

  const handleClear = useCallback(() => {
    setQuery('');
    setResults({ users: [], transactions: [] });
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const handleResultClick = useCallback(
    (result: SearchResult) => {
      router.push(result.url);
      setQuery('');
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [router]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || !hasResults) {
        if (e.key === 'Escape') {
          handleClear();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            handleResultClick(allResults[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    },
    [isOpen, hasResults, allResults, selectedIndex, handleClear, handleResultClick]
  );

  return (
    <div ref={searchRef} className={cn('relative w-full', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search users, transactions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim() && hasResults) {
              setIsOpen(true);
            }
          }}
          className="pl-9 pr-9"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-activedescendant={
            selectedIndex >= 0 ? `search-result-${selectedIndex}` : undefined
          }
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-label="Searching" />
        )}
        {!isLoading && query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Search results dropdown */}
      {isOpen && (
        <div
          id="search-results"
          className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg z-50 max-h-96 overflow-y-auto"
          role="listbox"
        >
          {!hasResults && !isLoading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}

          {/* Users section */}
          {results.users.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                Users
              </div>
              {results.users.map((result, index) => {
                const globalIndex = index;
                return (
                  <button
                    key={`user-${result.id}`}
                    id={`search-result-${globalIndex}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      'w-full px-3 py-2 text-left hover:bg-accent transition-colors',
                      selectedIndex === globalIndex && 'bg-accent'
                    )}
                    role="option"
                    aria-selected={selectedIndex === globalIndex}
                  >
                    <div className="text-sm font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Transactions section */}
          {results.transactions.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
                Transactions
              </div>
              {results.transactions.map((result, index) => {
                const globalIndex = results.users.length + index;
                return (
                  <button
                    key={`transaction-${result.id}`}
                    id={`search-result-${globalIndex}`}
                    onClick={() => handleResultClick(result)}
                    className={cn(
                      'w-full px-3 py-2 text-left hover:bg-accent transition-colors',
                      selectedIndex === globalIndex && 'bg-accent'
                    )}
                    role="option"
                    aria-selected={selectedIndex === globalIndex}
                  >
                    <div className="text-sm font-medium">{result.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {result.subtitle}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
