'use client';

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  initialValue?: string;
}

export interface SearchBarRef {
  reset: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  ({ onSearch, isLoading, initialValue = '' }, ref) => {
    const [query, setQuery] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        setQuery('');
        inputRef.current?.blur();
      },
    }));

    useEffect(() => {
      if (query.trim().length === 0) {
        return;
      }

      const timeoutId = setTimeout(() => {
        onSearch(query);
      }, 500);

      return () => clearTimeout(timeoutId);
    }, [query]); // Removed onSearch from dependencies

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          className="w-full px-4 py-3 pl-12 text-foreground bg-input border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted"
          autoComplete="off"
        />
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isLoading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
