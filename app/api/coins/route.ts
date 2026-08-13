import { NextResponse } from 'next/server';
import { fetchFromCoinGecko } from '@/lib/coingeckoClient';

export async function GET() {
  try {
    const data = await fetchFromCoinGecko('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: '100',
      page: '1',
      sparkline: 'true',
      price_change_percentage: '24h,7d'
    });

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=90, stale-while-revalidate=60',
      },
    });
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
