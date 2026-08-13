'use client'

import { useQuery } from '@tanstack/react-query';
import { Loader2, Info } from 'lucide-react';

export default function GlobalMetrics() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['global-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/global');
      if (!res.ok) throw new Error('Failed to fetch global metrics');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="bg-aurex-surface border border-aurex-surface-alt rounded-2xl p-6 h-[110px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-aurex-gold" />
      </div>
    );
  }

  if (isError || !data?.data) {
    return null;
  }

  const { total_market_cap, total_volume, market_cap_percentage } = data.data;

  // Formatter for large numbers (billions/trillions)
  const formatCompact = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: "compact",
      compactDisplay: "short",
      maximumFractionDigits: 2
    }).format(num);
  };

  const marketCap = total_market_cap.usd;
  const volume24h = total_volume.usd;
  const btcDominance = market_cap_percentage.btc;

  return (
    <div className="bg-aurex-surface border border-aurex-surface-alt rounded-2xl p-4 md:p-6 grid grid-cols-3 gap-2 md:gap-4 h-[110px] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col justify-between">
        <span className="text-[11px] md:text-sm font-medium text-aurex-text-muted">Capitalización Total</span>
        <span className="text-base md:text-xl font-bold text-aurex-text">${formatCompact(marketCap)}</span>
      </div>
      
      <div className="flex flex-col justify-between border-l border-aurex-surface-alt pl-3 md:pl-4">
        <span className="text-[11px] md:text-sm font-medium text-aurex-text-muted">Volumen (24h)</span>
        <span className="text-base md:text-xl font-bold text-aurex-text">${formatCompact(volume24h)}</span>
      </div>

      <div className="flex flex-col justify-between border-l border-aurex-surface-alt pl-3 md:pl-4 relative group">
        <h2 className="text-[11px] md:text-sm font-medium text-aurex-text-muted flex items-center gap-1.5 md:gap-2">
          Dominio BTC
          <div className="relative">
            <Info className="w-3 h-3 md:w-4 md:h-4 cursor-help opacity-70 hover:opacity-100 transition-opacity text-aurex-text-muted" />
            <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-aurex-bg border border-aurex-surface-alt rounded-lg text-xs shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none text-aurex-text font-normal leading-relaxed">
              El <strong>{btcDominance.toFixed(1)}%</strong> de todo el dinero invertido en el ecosistema de criptomonedas está en Bitcoin. Esto refleja la influencia de BTC frente a otras alternativas (Altcoins).
            </div>
          </div>
        </h2>
        <span className="text-base md:text-xl font-bold text-aurex-text">{btcDominance.toFixed(1)}%</span>
      </div>
    </div>
  );
}
