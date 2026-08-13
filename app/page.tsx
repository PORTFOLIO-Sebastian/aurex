'use client'

import { Suspense } from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';
import { useCoins } from '@/hooks/useCoins';
import CoinTable from '@/components/CoinTable';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import SearchBar from '@/components/SearchBar';
import GlobalMetrics from '@/components/GlobalMetrics';
import FearAndGreedWidget from '@/components/FearAndGreedWidget';
import LastUpdatedBadge from '@/components/LastUpdatedBadge';

export default function Home() {
  const { data: coins, isLoading, isError, error, refetch } = useCoins();

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8 mb-4">
        <div className="flex flex-col gap-2">
          <span className="text-aurex-gold font-bold tracking-[0.2em] text-sm uppercase">AUREX</span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-aurex-text flex items-center gap-4">
            Mercado <span className="text-aurex-gold">Global</span>
            {coins && coins.length > 0 && (
              <LastUpdatedBadge timestamp={coins[0]?.last_updated} />
            )}
          </h1>
          <p className="text-aurex-text-muted">Precios y datos globales de criptomonedas en tiempo real.</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-4">
          <div className="flex w-full sm:w-auto gap-4">
            <Link href="/watchlist" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 border border-aurex-surface-alt bg-aurex-surface hover:bg-aurex-surface-alt text-aurex-text shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aurex-gold focus:ring-offset-2 focus:ring-offset-aurex-bg">
              <Star className="w-5 h-5 text-aurex-gold fill-current" />
              Favoritos
            </Link>
            <Link href="/compare" className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 border border-aurex-surface-alt bg-aurex-surface hover:bg-aurex-surface-alt text-aurex-text shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-aurex-gold focus:ring-offset-2 focus:ring-offset-aurex-bg">
              Comparador
            </Link>
          </div>
          <SearchBar />
        </div>
      </header>

      {/* V2: Top Widgets Layer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
        <div className="lg:col-span-2">
          <GlobalMetrics />
        </div>
        <div className="lg:col-span-1">
          <FearAndGreedWidget />
        </div>
      </div>

      {isLoading && <LoadingState />}

      {isError && (
        <ErrorState error={error as Error} resetErrorBoundary={() => refetch()} />
      )}

      {!isLoading && !isError && coins && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CoinTable coins={coins} />
        </div>
      )}
    </main>
  );
}
