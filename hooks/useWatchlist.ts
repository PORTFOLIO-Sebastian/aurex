import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aurex_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing watchlist from local storage');
      }
    }
  }, []);

  const toggleWatchlist = (coinId: string) => {
    setWatchlist((prev) => {
      let newWatchlist;
      if (prev.includes(coinId)) {
        newWatchlist = prev.filter((id) => id !== coinId);
      } else {
        newWatchlist = [...prev, coinId];
      }
      localStorage.setItem('aurex_watchlist', JSON.stringify(newWatchlist));
      return newWatchlist;
    });
  };

  const isInWatchlist = (coinId: string) => watchlist.includes(coinId);

  return { watchlist, toggleWatchlist, isInWatchlist };
}
