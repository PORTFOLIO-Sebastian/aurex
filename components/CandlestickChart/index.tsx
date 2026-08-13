'use client'

import { useEffect, useRef } from 'react';
import { createChart, ColorType, CrosshairMode, CandlestickSeries } from 'lightweight-charts';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface CandlestickChartProps {
  coinId: string;
  days: string;
}

export default function CandlestickChart({ coinId, days }: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['coin-ohlc', coinId, days],
    queryFn: async () => {
      const res = await fetch(`/api/coins/${coinId}/ohlc?days=${days}`);
      if (!res.ok) {
        if (res.status === 429) throw new Error('RATE_LIMIT');
        throw new Error('Failed to fetch OHLC');
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9C978C',
      },
      grid: {
        vertLines: { color: 'transparent' },
        horzLines: { color: '#242119', style: 1 },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: '#242119',
      },
      timeScale: {
        borderColor: '#242119',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#3FAE72',
      downColor: '#E87D4B',
      borderVisible: false,
      wickUpColor: '#3FAE72',
      wickDownColor: '#E87D4B',
    });

    const formattedData = data.map((item: any) => ({
      time: item[0] / 1000,
      open: item[1],
      high: item[2],
      low: item[3],
      close: item[4],
    }));
    
    formattedData.sort((a: any, b: any) => a.time - b.time);

    const uniqueData = [];
    const seen = new Set();
    for (const item of formattedData) {
      if (!seen.has(item.time)) {
        seen.add(item.time);
        uniqueData.push(item);
      }
    }

    series.setData(uniqueData);
    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-[400px] w-full flex items-center justify-center bg-aurex-surface/20 rounded-2xl">
        <Loader2 className="w-8 h-8 animate-spin text-aurex-gold" />
      </div>
    );
  }

  if (isError) {
    const isRateLimit = error?.message === 'RATE_LIMIT';
    return (
      <div className="h-[400px] w-full flex flex-col items-center justify-center text-aurex-negative bg-aurex-negative/5 border border-aurex-negative/20 rounded-2xl p-6 text-center">
        <span className="font-bold text-lg mb-2">
          {isRateLimit ? 'Límite de API excedido' : 'Error cargando las velas'}
        </span>
        <span className="text-sm text-aurex-text-muted">
          {isRateLimit 
            ? 'Espera un momento, se alcanzó el límite de CoinGecko.' 
            : 'Ocurrió un error inesperado al intentar cargar los datos OHLC.'}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}
