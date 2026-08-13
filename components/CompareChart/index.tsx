'use client'

import { useQueries } from '@tanstack/react-query';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

interface CoinData {
  id: string;
  name: string;
  color: string;
}

interface CompareChartProps {
  coins: CoinData[];
}

export default function CompareChart({ coins }: CompareChartProps) {
  const queries = useQueries({
    queries: coins.map(coin => ({
      queryKey: ['coin-history', coin.id, '7'],
      queryFn: async () => {
        const res = await fetch(`/api/coins/${coin.id}/history?days=7`);
        if (!res.ok) {
          if (res.status === 429) throw new Error('RATE_LIMIT');
          throw new Error('Failed to fetch history');
        }
        return res.json();
      },
      staleTime: 60 * 1000,
    }))
  });

  const isLoading = queries.some(q => q.isLoading);
  const isError = queries.some(q => q.isError);

  if (coins.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center text-aurex-text-muted border border-dashed border-aurex-surface-alt rounded-2xl bg-aurex-surface/30">
        Busca y selecciona monedas para comparar su rendimiento
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-aurex-surface/20 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-aurex-gold" />
      </div>
    );
  }

  if (isError) {
    const isRateLimit = queries.some(q => q.error?.message === 'RATE_LIMIT');
    return (
      <div className="h-[400px] flex flex-col items-center justify-center text-aurex-negative bg-aurex-negative/5 border border-aurex-negative/20 rounded-2xl p-6 text-center">
        <span className="font-bold text-lg mb-2">
          {isRateLimit ? 'Límite de API excedido' : 'Error cargando los datos'}
        </span>
        <span className="text-sm text-aurex-text-muted">
          {isRateLimit 
            ? 'Has alcanzado el límite de peticiones de CoinGecko (30 por minuto). Por favor, espera un momento.' 
            : 'Ocurrió un error inesperado al contactar con el servidor.'}
        </span>
      </div>
    );
  }

  // Normalization logic
  const timeMap = new Map<number, any>();

  coins.forEach((coin, index) => {
    const queryData = queries[index].data;
    if (!queryData?.prices) return;

    let basePrice: number | null = null;

    queryData.prices.forEach(([timestamp, price]: [number, number]) => {
      // Find nearest hour to align timestamps roughly
      const hourTs = Math.floor(timestamp / 3600000) * 3600000;
      
      if (basePrice === null) basePrice = price;
      
      const percentageChange = ((price - basePrice) / basePrice) * 100;

      if (!timeMap.has(hourTs)) {
        timeMap.set(hourTs, { timestamp: hourTs, date: new Date(hourTs).toLocaleDateString(), time: new Date(hourTs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      }
      timeMap.get(hourTs)[coin.id] = percentageChange;
    });
  });

  const chartData = Array.from(timeMap.values()).sort((a, b) => a.timestamp - b.timestamp);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-aurex-surface border border-aurex-surface-alt p-3 rounded-xl shadow-xl">
          <p className="text-aurex-text-muted text-xs mb-3">{payload[0].payload.date} {payload[0].payload.time}</p>
          <div className="flex flex-col gap-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center gap-3 text-sm min-w-[150px]">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                <span className="text-aurex-text flex-1">{entry.name}</span>
                <span className="font-bold tabular-nums" style={{ color: entry.color }}>
                  {entry.value > 0 ? '+' : ''}{entry.value.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#242119" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#9C978C" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={50}
          />
          <YAxis 
            stroke="#9C978C" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value > 0 ? '+' : ''}${value.toFixed(0)}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#9C978C', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => <span className="text-aurex-text ml-2 font-medium">{value}</span>}
          />
          {coins.map(coin => (
            <Line 
              key={coin.id}
              type="monotone" 
              name={coin.name}
              dataKey={coin.id} 
              stroke={coin.color} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
