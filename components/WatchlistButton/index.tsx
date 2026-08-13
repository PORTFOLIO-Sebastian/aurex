'use client'

import { Star } from 'lucide-react';
import { useWatchlist } from '@/hooks/useWatchlist';
import { cn } from '@/lib/utils';

export default function WatchlistButton({ coinId, className }: { coinId: string, className?: string }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const isActive = isInWatchlist(coinId);

  return (
    <button 
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWatchlist(coinId);
      }}
      aria-label={isActive ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={isActive}
      className={cn(
        "p-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-aurex-gold group-hover/btn:bg-aurex-surface-alt",
        isActive ? "text-aurex-gold" : "text-aurex-text-muted hover:text-aurex-text",
        className
      )}
    >
      <Star className={cn("w-5 h-5", isActive && "fill-current")} />
    </button>
  );
}
