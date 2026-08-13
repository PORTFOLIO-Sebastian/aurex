export interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  sparkline_in_7d?: {
    price: number[];
  };
  last_updated: string;
  circulating_supply?: number;
  total_supply?: number;
  total_volume?: number;
  ath?: number;
  ath_date?: string;
}

export interface WatchlistItem {
  coinId: string;
  addedAt: string; // ISO
}
