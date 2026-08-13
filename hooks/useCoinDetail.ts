import { useQuery } from '@tanstack/react-query';

export function useCoinDetail(id: string) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: async () => {
      const res = await fetch(`/api/coins/${id}`);
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
