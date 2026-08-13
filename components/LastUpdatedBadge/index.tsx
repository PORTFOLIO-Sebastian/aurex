'use client'

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LastUpdatedBadge({ timestamp }: { timestamp?: string }) {
  const [timeAgo, setTimeAgo] = useState('justo ahora');

  useEffect(() => {
    if (!timestamp) return;
    
    const updateTime = () => {
      const seconds = Math.floor((new Date().getTime() - new Date(timestamp).getTime()) / 1000);
      if (seconds < 60) setTimeAgo('hace unos segundos');
      else if (seconds < 3600) setTimeAgo(`hace ${Math.floor(seconds / 60)} min`);
      else setTimeAgo(`hace ${Math.floor(seconds / 3600)} horas`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  if (!timestamp) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs font-medium text-aurex-text-muted bg-aurex-surface border border-aurex-surface-alt px-3 py-1.5 rounded-full" aria-live="off">
      <Clock className="w-3.5 h-3.5" />
      <span>Actualizado {timeAgo}</span>
    </div>
  );
}
