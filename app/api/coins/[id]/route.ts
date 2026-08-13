import { NextRequest, NextResponse } from 'next/server';
import { fetchFromCoinGecko } from '@/lib/coingeckoClient';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const data = await fetchFromCoinGecko(`/coins/${id}`, {
      localization: 'false',
      tickers: 'false',
      market_data: 'true',
      community_data: 'false',
      developer_data: 'false',
      sparkline: 'false',
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
