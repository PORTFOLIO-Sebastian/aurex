const API_URL = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY;

export async function fetchFromCoinGecko(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(`${API_URL}${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const headers: HeadersInit = {};
  if (API_KEY) {
    headers['x-cg-demo-api-key'] = API_KEY;
  }

  // Next.js fetch cache configuration: 60 seconds revalidation
  const response = await fetch(url.toString(), {
    headers,
    next: { revalidate: 60 } 
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMIT");
    }
    throw new Error(`CoinGecko API Error: ${response.status}`);
  }

  return response.json();
}
