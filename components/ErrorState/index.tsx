import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorState({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-aurex-surface/30 rounded-2xl border border-aurex-negative/20 mt-8">
      <AlertTriangle className="w-12 h-12 text-aurex-negative mb-4" />
      <h2 className="text-xl font-bold text-aurex-text mb-2">Ha ocurrido un error</h2>
      <p className="text-aurex-text-muted mb-6 max-w-md text-center">
        {error.message === 'RATE_LIMIT' 
          ? 'Has excedido el límite de consultas a la API de CoinGecko. Por favor, espera un minuto e intenta nuevamente.' 
          : 'No se pudieron cargar los datos del mercado en este momento.'}
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="flex items-center gap-2 px-4 py-2 bg-aurex-surface-alt hover:bg-aurex-gold hover:text-aurex-bg transition-colors rounded-lg font-medium"
      >
        <RefreshCcw className="w-4 h-4" />
        Reintentar
      </button>
    </div>
  );
}
