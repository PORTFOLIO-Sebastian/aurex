'use client'

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  coinId: string;
}

type Range = '1' | '7' | '30' | '365';

export default function PriceChart({ coinId }: PriceChartProps) {
  const [range, setRange] = useState<Range>('7');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['coin-history', coinId, range],
    queryFn: async () => {
      const res = await fetch(`/api/coins/${coinId}/history?days=${range}`);
      if (!res.ok) throw new Error('Failed to fetch history');
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  const chartData = data?.prices?.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
    date: new Date(timestamp).toLocaleDateString(),
    time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })) || [];

  const minPrice = chartData.length > 0 ? Math.min(...chartData.map((d: any) => d.price)) : 0;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map((d: any) => d.price)) : 0;
  
  const padding = (maxPrice - minPrice) * 0.05;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-aurex-surface border border-aurex-surface-alt p-3 rounded-lg shadow-xl">
          <p className="text-aurex-text-muted text-xs mb-1">
            {range === '1' ? payload[0].payload.time : payload[0].payload.date}
          </p>
          <p className="text-aurex-text font-bold tabular-nums">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-center bg-aurex-surface/50 p-1 rounded-lg w-fit" role="tablist">
        {(['1', '7', '30', '365'] as Range[]).map((r) => (
          <button
            key={r}
            role="tab"
            aria-selected={range === r}
            onClick={() => setRange(r)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold",
              range === r 
                ? "bg-aurex-surface-alt text-aurex-text shadow-sm" 
                : "text-aurex-text-muted hover:text-aurex-text hover:bg-aurex-surface-alt/50"
            )}
          >
            {r === '1' ? '24h' : r === '7' ? '7d' : r === '30' ? '30d' : '1a'}
          </button>
        ))}
      </div>

      <div className="h-[400px] w-full relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-aurex-surface/20 rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-aurex-gold" />
          </div>
        )}
        
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-aurex-surface/20 rounded-xl text-aurex-negative text-sm">
            No se pudo cargar el gráfico
          </div>
        )}

        {!isLoading && !isError && chartData.length > 0 && (
          <>
            <div aria-hidden="true" className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A24B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C9A24B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey={range === '1' ? 'time' : 'date'} 
                    hide 
                  />
                  <YAxis 
                    domain={[minPrice - padding, maxPrice + padding]} 
                    hide 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9C978C', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#C9A24B" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="sr-only">
              <table>
                <caption>Datos históricos de precio para los últimos {range} días</caption>
                <thead>
                  <tr>
                    <th scope="col">Fecha/Hora</th>
                    <th scope="col">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((d: any, i: number) => (
                    <tr key={i}>
                      <td>{range === '1' ? d.time : d.date}</td>
                      <td>{formatCurrency(d.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
