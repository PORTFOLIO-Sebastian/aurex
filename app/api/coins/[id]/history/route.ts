import { NextRequest, NextResponse } from 'next/server';
import { fetchFromCoinGecko } from '@/lib/coingeckoClient';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const searchParams = request.nextUrl.searchParams;
  const days = searchParams.get('days') || '7';

  try {
    const data = await fetchFromCoinGecko(`/coins/${id}/market_chart`, {
      vs_currency: 'usd',
      days,
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
