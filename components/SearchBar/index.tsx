'use client'

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

interface SearchBarProps {
  onSelect?: (coin: SearchResult) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps = {}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchCoins = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setResults([]);
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/search?query=${encodeURIComponent(debouncedQuery)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data.coins?.slice(0, 5) || []);
        setIsOpen(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    searchCoins();
  }, [debouncedQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (coin: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    if (onSelect) {
      onSelect(coin);
    } else {
      router.push(`/coin/${coin.id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm z-50">
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-aurex-text-muted" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Buscar moneda..."
          className="w-full bg-aurex-surface border border-aurex-surface-alt rounded-full py-2.5 pl-10 pr-4 text-sm text-aurex-text placeholder:text-aurex-text-muted focus:outline-none focus:ring-2 focus:ring-aurex-gold focus:border-transparent transition-all"
        />
        {isLoading && <Loader2 className="absolute right-3 w-4 h-4 text-aurex-gold animate-spin" />}
      </div>
      
      {isOpen && query.length > 1 && (
        <div className="absolute top-full mt-2 w-full bg-aurex-surface border border-aurex-surface-alt rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-80">
          {!isLoading && results.length === 0 && (
            <div className="p-4 text-sm text-aurex-text-muted text-center">No se encontraron resultados para "{query}"</div>
          )}
          {!isLoading && results.length > 0 && (
            <ul className="overflow-y-auto p-1">
              {results.map((coin) => (
                <li key={coin.id}>
                  <button
                    onClick={() => handleSelect(coin)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-aurex-surface-alt transition-colors focus:outline-none focus-visible:bg-aurex-surface-alt text-left"
                  >
                    <Image src={coin.thumb} alt={coin.name} width={24} height={24} className="rounded-full w-auto h-auto" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-aurex-text leading-tight">{coin.name}</span>
                      <span className="text-xs text-aurex-text-muted">{coin.symbol}</span>
                    </div>
                    <span className="ml-auto text-xs text-aurex-text-muted">#{coin.market_cap_rank}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
