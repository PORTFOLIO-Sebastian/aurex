'use client'

import { useCoinDetail } from '@/hooks/useCoinDetail';
import PriceChart from '@/components/PriceChart';
import LoadingState from '@/components/LoadingState';
import ErrorState from '@/components/ErrorState';
import WatchlistButton from '@/components/WatchlistButton';
import { formatCurrency, formatPercentage, formatCompactNumber } from '@/lib/formatters';
import { ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { use, useState } from 'react';
import CandlestickChart from '@/components/CandlestickChart';

export default function CoinDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: coin, isLoading, isError, error, refetch } = useCoinDetail(id);
  const [chartType, setChartType] = useState<'line' | 'candle'>('line');

  if (isLoading) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <LoadingState />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        <ErrorState error={error as Error} resetErrorBoundary={() => refetch()} />
      </main>
    );
  }

  if (!coin) return null;

  const isPositive24h = coin.market_data?.price_change_percentage_24h >= 0;

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
      <header className="flex flex-col gap-4 mt-8 mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-aurex-text-muted hover:text-aurex-gold transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" />
          Volver al mercado
        </Link>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex items-center gap-4">
            <Image src={coin.image?.large} alt={coin.name} width={64} height={64} className="rounded-full border border-aurex-surface-alt bg-aurex-surface w-auto h-auto" />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-aurex-text leading-none">{coin.name}</h1>
                <span className="text-lg text-aurex-text-muted uppercase font-medium bg-aurex-surface-alt px-2.5 py-1 rounded-md">{coin.symbol}</span>
                <WatchlistButton coinId={coin.id} className="w-10 h-10 p-2.5 ml-2 bg-aurex-surface border border-aurex-surface-alt hover:bg-aurex-surface-alt" />
              </div>
              <div className="flex items-center gap-4 mt-4 tabular-nums">
                <span className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-none text-aurex-text">
                  {formatCurrency(coin.market_data?.current_price?.usd)}
                </span>
                <span className={`flex items-center gap-1 text-lg font-medium px-4 py-1.5 rounded-full ${isPositive24h ? 'bg-aurex-positive/10 text-aurex-positive' : 'bg-aurex-negative/10 text-aurex-negative'}`}>
                  {isPositive24h ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
                  {formatPercentage(Math.abs(coin.market_data?.price_change_percentage_24h))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-6 shadow-xl relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex bg-aurex-bg p-1 rounded-lg border border-aurex-surface-alt">
            <button 
              onClick={() => setChartType('line')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold ${chartType === 'line' ? 'bg-aurex-surface-alt text-aurex-text shadow-sm' : 'text-aurex-text-muted hover:text-aurex-text'}`}
            >
              Línea
            </button>
            <button 
              onClick={() => setChartType('candle')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold ${chartType === 'candle' ? 'bg-aurex-surface-alt text-aurex-text shadow-sm' : 'text-aurex-text-muted hover:text-aurex-text'}`}
            >
              Velas (OHLC)
            </button>
          </div>
        </div>
        {chartType === 'line' ? (
          <PriceChart coinId={coin.id} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-xs text-aurex-text-muted mb-2 text-right">Mostrando últimos 30 días</div>
            <CandlestickChart coinId={coin.id} days="30" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-4">
        <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-5 flex flex-col gap-1.5 shadow-sm hover:border-aurex-gold/30 transition-colors overflow-hidden">
          <span className="text-aurex-text-muted text-xs md:text-sm font-medium truncate">Cap. de Mercado</span>
          <span className="text-aurex-text font-semibold text-sm sm:text-base md:text-xl tabular-nums truncate">${formatCompactNumber(coin.market_data?.market_cap?.usd)}</span>
        </div>
        <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-5 flex flex-col gap-1.5 shadow-sm hover:border-aurex-gold/30 transition-colors overflow-hidden">
          <span className="text-aurex-text-muted text-xs md:text-sm font-medium truncate">Volumen (24h)</span>
          <span className="text-aurex-text font-semibold text-sm sm:text-base md:text-xl tabular-nums truncate">${formatCompactNumber(coin.market_data?.total_volume?.usd)}</span>
        </div>
        <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-5 flex flex-col gap-1.5 shadow-sm hover:border-aurex-gold/30 transition-colors overflow-hidden">
          <span className="text-aurex-text-muted text-xs md:text-sm font-medium truncate">Circulante</span>
          <span className="text-aurex-text font-semibold text-sm sm:text-base md:text-xl tabular-nums truncate">{formatCompactNumber(coin.market_data?.circulating_supply)} <span className="text-[10px] md:text-sm text-aurex-text-muted">{coin.symbol.toUpperCase()}</span></span>
        </div>
        <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-5 flex flex-col gap-1.5 shadow-sm hover:border-aurex-gold/30 transition-colors overflow-hidden">
          <span className="text-aurex-text-muted text-xs md:text-sm font-medium truncate">Máx. Histórico</span>
          <span className="text-aurex-text font-semibold text-sm sm:text-base md:text-xl tabular-nums truncate" title={formatCurrency(coin.market_data?.ath?.usd)}>{formatCurrency(coin.market_data?.ath?.usd)}</span>
        </div>
      </div>
    </main>
  );
}
