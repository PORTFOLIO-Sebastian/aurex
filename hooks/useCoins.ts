import { useQuery } from '@tanstack/react-query';
import { CoinMarketData } from '@/types/coin';

export function useCoins() {
  return useQuery<CoinMarketData[]>({
    queryKey: ['coins'],
    queryFn: async () => {
      const res = await fetch('/api/coins');
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('RATE_LIMIT');
        }
        throw new Error('Network error');
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
