'use client'

import { useQuery } from '@tanstack/react-query';
import { Loader2, Info } from 'lucide-react';

export default function FearAndGreedWidget() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['fear-and-greed'],
    queryFn: async () => {
      const res = await fetch('/api/fear-and-greed');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="bg-aurex-surface border border-aurex-surface-alt rounded-2xl p-6 h-[110px] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-aurex-gold" />
      </div>
    );
  }

  if (isError || !data?.data?.[0]) {
    return null; // Silent fail for widgets is usually better
  }

  const { value, value_classification } = data.data[0];
  const numValue = parseInt(value, 10);

  // Determine color based on value
  let colorClass = 'text-aurex-gold'; 
  let barColor = 'bg-aurex-gold';
  if (numValue <= 45) {
    colorClass = 'text-aurex-negative';
    barColor = 'bg-aurex-negative';
  } else if (numValue >= 55) {
    colorClass = 'text-[#3FAE72]';
    barColor = 'bg-[#3FAE72]';
  }

  // Map English to Spanish
  const classificationEs = value_classification
    .replace('Extreme Fear', 'Miedo Extremo')
    .replace('Fear', 'Miedo')
    .replace('Neutral', 'Neutral')
    .replace('Greed', 'Avaricia')
    .replace('Extreme Greed', 'Avaricia Extrema');

  return (
    <div className="bg-aurex-surface border border-aurex-surface-alt rounded-2xl p-6 flex flex-col justify-between h-[110px] relative group shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <h2 className="text-sm font-medium text-aurex-text-muted flex items-center gap-2">
          Miedo y Codicia
          <div className="relative">
            <Info className="w-4 h-4 cursor-help opacity-70 hover:opacity-100 transition-opacity text-aurex-text-muted" />
            <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-aurex-bg border border-aurex-surface-alt rounded-lg text-xs shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none text-aurex-text font-normal leading-relaxed">
              Índice que mide el sentimiento del mercado. El miedo extremo puede ser una oportunidad de compra, y la codicia una señal de corrección.
            </div>
          </div>
        </h2>
        <span className={`text-xl font-bold ${colorClass}`}>{numValue}/100</span>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <div className="w-full h-1.5 bg-aurex-surface-alt rounded-full overflow-hidden">
          <div 
            className={`h-full ${barColor} transition-all duration-1000 ease-out`}
            style={{ width: `${numValue}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-aurex-text-muted uppercase tracking-wider font-medium">
          <span>Miedo</span>
          <span className={colorClass}>{classificationEs}</span>
          <span>Avaricia</span>
        </div>
      </div>
    </div>
  );
}
