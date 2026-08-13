import { NextRequest, NextResponse } from 'next/server';
import { fetchFromCoinGecko } from '@/lib/coingeckoClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    const data = await fetchFromCoinGecko('/search', { query });
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
