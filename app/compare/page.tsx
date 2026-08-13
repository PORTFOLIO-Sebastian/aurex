'use client'

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import CompareChart from '@/components/CompareChart';
import { ArrowLeft, X, BarChart2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useCoins } from '@/hooks/useCoins';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
  market_cap_rank: number;
}

interface CompareCoin extends SearchResult {
  color: string;
}

// AUREX Gold, Positive Green, Negative Red/Orange for clear contrast
const COLORS = ['#C9A24B', '#3FAE72', '#E87D4B'];

export default function ComparePage() {
  const [selectedCoins, setSelectedCoins] = useState<CompareCoin[]>([]);
  const { data: topCoins } = useCoins();
  const quickPicks = topCoins?.slice(0, 10) || [];

  const handleSelectCoin = (coin: SearchResult) => {
    if (selectedCoins.find(c => c.id === coin.id)) return;
    if (selectedCoins.length >= 3) return;
    
    setSelectedCoins(prev => [...prev, {
      ...coin,
      color: COLORS[prev.length]
    }]);
  };

  const handleRemoveCoin = (coinId: string) => {
    setSelectedCoins(prev => {
      const filtered = prev.filter(c => c.id !== coinId);
      // Reassign colors to maintain order and contrast
      return filtered.map((c, idx) => ({ ...c, color: COLORS[idx] }));
    });
  };

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-8">
      <header className="flex flex-col gap-4 mt-8 mb-4">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-aurex-text-muted hover:text-aurex-gold transition-colors w-fit focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold rounded-md">
          <ArrowLeft className="w-4 h-4" />
          Volver al mercado
        </Link>
        <h1 className="text-4xl font-bold tracking-tight text-aurex-text mb-2 flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-aurex-gold" />
          Comparador
        </h1>
        <p className="text-aurex-text-muted">Compara el rendimiento porcentual (últimos 7 días) de hasta 3 monedas simultáneamente.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div className="bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-aurex-text mb-4">Añadir moneda ({selectedCoins.length}/3)</h2>
            {selectedCoins.length < 3 ? (
              <div className="flex flex-col gap-6">
                <div className="relative z-50">
                  <SearchBar onSelect={handleSelectCoin} />
                </div>
                
                {quickPicks.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <span className="text-xs text-aurex-text-muted font-medium uppercase tracking-wider">Sugerencias Rápidas</span>
                    <div className="flex flex-wrap gap-2">
                      {quickPicks.map(coin => {
                        const isSelected = selectedCoins.some(c => c.id === coin.id);
                        return (
                          <button
                            key={coin.id}
                            onClick={() => !isSelected && handleSelectCoin({
                              id: coin.id,
                              name: coin.name,
                              symbol: coin.symbol,
                              thumb: coin.image,
                              market_cap_rank: coin.market_cap_rank
                            })}
                            disabled={isSelected}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              isSelected 
                                ? 'bg-aurex-surface-alt border-aurex-surface-alt text-aurex-text-muted/50 cursor-not-allowed opacity-50'
                                : 'bg-aurex-surface border-aurex-surface-alt hover:border-aurex-gold hover:text-aurex-gold text-aurex-text focus:outline-none focus:ring-1 focus:ring-aurex-gold active:scale-95'
                            }`}
                            aria-label={`Añadir ${coin.name}`}
                          >
                            <Image src={coin.image} alt={coin.name} width={14} height={14} className="rounded-full w-auto h-auto" />
                            {coin.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-aurex-text-muted p-4 bg-aurex-surface-alt rounded-lg border border-aurex-surface-alt">
                Has alcanzado el límite máximo de 3 monedas.
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-3">
              {selectedCoins.map((coin) => (
                <div key={coin.id} className="flex items-center justify-between p-3 rounded-xl border border-aurex-surface-alt bg-aurex-bg animate-in fade-in slide-in-from-left-4 duration-300 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full shrink-0 border-2 border-aurex-bg shadow-sm" style={{ backgroundColor: coin.color }} />
                    <Image src={coin.thumb} alt={coin.name} width={28} height={28} className="rounded-full w-auto h-auto bg-aurex-surface border border-aurex-surface-alt" />
                    <span className="font-medium text-aurex-text">{coin.name}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveCoin(coin.id)}
                    className="p-1.5 text-aurex-text-muted hover:text-aurex-negative hover:bg-aurex-negative/10 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-negative"
                    aria-label={`Remover ${coin.name}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {selectedCoins.length === 0 && (
                <div className="text-sm text-aurex-text-muted italic text-center py-8">
                  Ninguna moneda seleccionada
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-2/3 bg-aurex-surface rounded-2xl border border-aurex-surface-alt p-4 md:p-8 shadow-xl">
          <CompareChart coins={selectedCoins} />
        </div>
      </div>
    </main>
  );
}
