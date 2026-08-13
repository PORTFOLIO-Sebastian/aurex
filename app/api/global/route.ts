import { NextResponse } from 'next/server';
import { fetchFromCoinGecko } from '@/lib/coingeckoClient';

export async function GET() {
  try {
    const data = await fetchFromCoinGecko('/global');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=120',
      },
    });
  } catch (error: any) {
    if (error.message === 'RATE_LIMIT') {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
