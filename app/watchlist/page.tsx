'use client'

import { useCoins } from '@/hooks/useCoins';
import { useWatchlist } from '@/hooks/useWatchlist';
import CoinTable from '@/components/CoinTable';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';

export default function Watchlist() {
  const { data: coins, isLoading, isError, error, refetch } = useCoins();
  const { watchlist } = useWatchlist();

  const watchlistCoins = coins?.filter(coin => watchlist.includes(coin.id)) || [];

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mt-8 mb-4">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-aurex-text-muted hover:text-aurex-gold transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Volver al mercado
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-aurex-text mb-2 flex items-center gap-3">
            <Star className="w-8 h-8 text-aurex-gold fill-current" />
            Favoritos
          </h1>
          <p className="text-aurex-text-muted">Tu lista personalizada de seguimiento.</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchBar />
        </div>
      </header>

      {isLoading && <LoadingState />}
      
      {isError && (
        <ErrorState error={error as Error} resetErrorBoundary={() => refetch()} />
      )}

      {!isLoading && !isError && watchlistCoins.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 bg-aurex-surface/30 rounded-2xl border border-dashed border-aurex-surface-alt mt-8">
          <Star className="w-16 h-16 text-aurex-surface-alt mb-4" />
          <h2 className="text-xl font-bold text-aurex-text mb-2">Tu lista está vacía</h2>
          <p className="text-aurex-text-muted mb-6 text-center max-w-md">
            Busca monedas y márcalas como favoritas para hacerles seguimiento desde aquí.
          </p>
          <Link href="/" className="px-6 py-2.5 bg-aurex-gold text-aurex-bg rounded-lg font-medium hover:bg-aurex-gold-soft transition-colors focus:outline-none focus:ring-2 focus:ring-aurex-gold focus:ring-offset-2 focus:ring-offset-aurex-bg">
            Explorar mercado
          </Link>
        </div>
      )}

      {!isLoading && !isError && watchlistCoins.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CoinTable coins={watchlistCoins} />
        </div>
      )}
    </main>
  );
}
