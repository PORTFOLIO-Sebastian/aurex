'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { CoinMarketData } from '@/types/coin';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import Sparkline from '@/components/Sparkline';
import WatchlistButton from '@/components/WatchlistButton';
import { cn } from '@/lib/utils';

interface CoinTableProps {
  coins: CoinMarketData[];
}

type SortConfig = {
  key: keyof CoinMarketData | '';
  direction: 'asc' | 'desc';
};

export default function CoinTable({ coins }: CoinTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'market_cap_rank', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const sortedCoins = [...coins].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const requestSort = (key: keyof CoinMarketData) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const SortIcon = ({ columnKey }: { columnKey: keyof CoinMarketData }) => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="w-4 h-4 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1 text-aurex-gold" /> 
      : <ArrowDown className="w-4 h-4 ml-1 text-aurex-gold" />;
  };

  const totalPages = Math.ceil(sortedCoins.length / itemsPerPage);
  const paginatedCoins = sortedCoins.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full overflow-x-auto rounded-2xl bg-aurex-surface border border-aurex-surface-alt shadow-xl">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <caption className="sr-only">Precios de criptomonedas y datos de mercado</caption>
        <thead>
          <tr className="border-b border-aurex-surface-alt bg-aurex-surface/50 text-xs uppercase tracking-wider text-aurex-text-muted">
            <th scope="col" className="p-4 cursor-pointer hover:bg-aurex-surface-alt/50 transition-colors" onClick={() => requestSort('market_cap_rank')}>
              <div className="flex items-center"># <SortIcon columnKey="market_cap_rank" /></div>
            </th>
            <th scope="col" className="p-4 cursor-pointer hover:bg-aurex-surface-alt/50 transition-colors" onClick={() => requestSort('name')}>
              <div className="flex items-center">Moneda <SortIcon columnKey="name" /></div>
            </th>
            <th scope="col" className="p-4 cursor-pointer hover:bg-aurex-surface-alt/50 transition-colors text-right" onClick={() => requestSort('current_price')}>
              <div className="flex items-center justify-end">Precio <SortIcon columnKey="current_price" /></div>
            </th>
            <th scope="col" className="p-4 cursor-pointer hover:bg-aurex-surface-alt/50 transition-colors text-right" onClick={() => requestSort('price_change_percentage_24h')}>
              <div className="flex items-center justify-end">24h <SortIcon columnKey="price_change_percentage_24h" /></div>
            </th>
            <th scope="col" className="p-4 cursor-pointer hover:bg-aurex-surface-alt/50 transition-colors text-right hidden md:table-cell" onClick={() => requestSort('market_cap')}>
              <div className="flex items-center justify-end">Cap. Mercado <SortIcon columnKey="market_cap" /></div>
            </th>
            <th scope="col" className="p-4 text-right hidden lg:table-cell">
              Últimos 7 días
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {paginatedCoins.map((coin) => {
            const isPositive24h = coin.price_change_percentage_24h >= 0;
            const sparklineData = coin.sparkline_in_7d?.price || [];
            const sparklineColor = coin.price_change_percentage_7d_in_currency >= 0 ? '#3FAE72' : '#C1554B';

            return (
              <tr 
                key={coin.id} 
                className="group border-b border-aurex-surface-alt/50 hover:bg-aurex-surface-alt transition-colors focus-within:bg-aurex-surface-alt relative"
              >
                <td className="p-4 text-aurex-text-muted">
                  <div className="flex items-center gap-2">
                    <WatchlistButton coinId={coin.id} />
                    <span>{coin.market_cap_rank}</span>
                  </div>
                </td>
                <td className="p-4">
                  <Link href={`/coin/${coin.id}`} className="flex items-center gap-3 outline-none before:absolute before:inset-0 focus-visible:ring-2 focus-visible:ring-aurex-gold focus-visible:ring-inset">
                    <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full w-auto h-auto" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-aurex-text group-hover:text-aurex-gold transition-colors">{coin.name}</span>
                      <span className="text-xs text-aurex-text-muted uppercase">{coin.symbol}</span>
                    </div>
                  </Link>
                </td>
                <td className="p-4 text-right font-medium">
                  {formatCurrency(coin.current_price)}
                </td>
                <td className={cn(
                  "p-4 text-right font-medium",
                  isPositive24h ? "text-aurex-positive" : "text-aurex-negative"
                )}>
                  <div className="flex justify-end items-center gap-1">
                    {isPositive24h ? <ArrowUp className="w-3 h-3 flex-shrink-0" /> : <ArrowDown className="w-3 h-3 flex-shrink-0" />}
                    <span>{formatPercentage(Math.abs(coin.price_change_percentage_24h))}</span>
                  </div>
                </td>
                <td className="p-4 text-right text-aurex-text-muted hidden md:table-cell">
                  {formatCurrency(coin.market_cap)}
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <div className="flex justify-end">
                    <Sparkline data={sparklineData} color={sparklineColor} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 bg-aurex-surface/80 border-t border-aurex-surface-alt">
          <div className="text-sm text-aurex-text-muted">
            Mostrando <span className="font-medium text-aurex-text">{((currentPage - 1) * itemsPerPage) + 1}</span> a <span className="font-medium text-aurex-text">{Math.min(currentPage * itemsPerPage, sortedCoins.length)}</span> de <span className="font-medium text-aurex-text">{sortedCoins.length}</span> monedas
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium bg-aurex-surface border border-aurex-surface-alt rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-aurex-surface-alt hover:text-aurex-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold"
            >
              Anterior
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium bg-aurex-surface border border-aurex-surface-alt rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-aurex-surface-alt hover:text-aurex-gold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
