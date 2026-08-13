import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.alternative.me/fng/', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!res.ok) throw new Error('Failed to fetch Fear and Greed Index');
    
    const data = await res.json();
    
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
