'use client';

import { useState, useEffect, useRef } from 'react';
import { ETFInfo } from '@/types';

interface ETFSearchProps {
  onSelect: (etf: ETFInfo) => void;
  excludeTickers?: string[];
}

export default function ETFSearch({ onSelect, excludeTickers = [] }: ETFSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ETFInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/etf?q=${encodeURIComponent(query)}`);
        const data: ETFInfo[] = await res.json();
        setResults(data.filter((e) => !excludeTickers.includes(e.ticker)));
        setIsOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, [query, excludeTickers]);

  function handleSelect(etf: ETFInfo) {
    onSelect(etf);
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <svg className="w-4 h-4 ml-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ETF 검색 (예: QQQ, 나스닥, 배당)"
          className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none"
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onFocus={() => query && results.length > 0 && setIsOpen(true)}
        />
        {isLoading && (
          <div className="w-4 h-4 mr-3 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-auto">
          {results.map((etf) => (
            <li key={etf.ticker}>
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3"
                onMouseDown={() => handleSelect(etf)}
              >
                <span className="font-mono font-semibold text-blue-700 text-sm w-14 shrink-0">
                  {etf.ticker}
                </span>
                <span className="text-sm text-gray-700 truncate">{etf.name_ko}</span>
                <span className="text-xs text-gray-400 ml-auto shrink-0">{etf.category}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && !isLoading && results.length === 0 && query.trim() && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}
    </div>
  );
}
