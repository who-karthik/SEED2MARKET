import { MandiMarket, MarketPriceRecord } from '@/types';

export const PUNE_MARKETS: MandiMarket[] = [
  { id: 'mkt-pune', market_name: 'Pune Market Yard (Gultekdi)', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 6.5 },
  { id: 'mkt-baramati', market_name: 'Baramati APMC Mandi', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 98.0 },
  { id: 'mkt-junnar', market_name: 'Junnar (Narayangaon) Mandi', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 76.5 },
  { id: 'mkt-shirur', market_name: 'Shirur APMC Market', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 64.0 },
  { id: 'mkt-indapur', market_name: 'Indapur Sub-Market', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 132.0 },
  { id: 'mkt-daund', market_name: 'Daund APMC Yard', district: 'Pune', state: 'Maharashtra', distance_km_from_pune: 82.0 },
];

// Baseline price dataset for Pune markets (Demonstration & Verified Fallback)
// ALL GENERATED DEMO DATA IS EXPLICITLY LABELED AS SIMULATED DEMO DATA
export const BASELINE_MARKET_PRICES: Omit<MarketPriceRecord, 'estimated_transport_cost_per_qtl' | 'net_realization_per_qtl'>[] = [
  // Tomato
  {
    id: 'pr-tom-pune',
    market_id: 'mkt-pune',
    market_name: 'Pune Market Yard (Gultekdi)',
    commodity: 'Tomato',
    variety: 'Hybrid Local',
    min_price_per_quintal: 1800,
    max_price_per_quintal: 2600,
    modal_price_per_quintal: 2250,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 6.5,
  },
  {
    id: 'pr-tom-junnar',
    market_id: 'mkt-junnar',
    market_name: 'Junnar (Narayangaon) Mandi',
    commodity: 'Tomato',
    variety: 'Narayangaon Special',
    min_price_per_quintal: 2000,
    max_price_per_quintal: 2850,
    modal_price_per_quintal: 2500,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 76.5,
  },
  {
    id: 'pr-tom-baramati',
    market_id: 'mkt-baramati',
    market_name: 'Baramati APMC Mandi',
    commodity: 'Tomato',
    variety: 'Hybrid Local',
    min_price_per_quintal: 1700,
    max_price_per_quintal: 2450,
    modal_price_per_quintal: 2100,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 98.0,
  },
  // Potato
  {
    id: 'pr-pot-pune',
    market_id: 'mkt-pune',
    market_name: 'Pune Market Yard (Gultekdi)',
    commodity: 'Potato',
    variety: 'Jyoti / Lokkar',
    min_price_per_quintal: 1500,
    max_price_per_quintal: 2100,
    modal_price_per_quintal: 1850,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 6.5,
  },
  {
    id: 'pr-pot-shirur',
    market_id: 'mkt-shirur',
    market_name: 'Shirur APMC Market',
    commodity: 'Potato',
    variety: 'Jyoti Local',
    min_price_per_quintal: 1400,
    max_price_per_quintal: 1950,
    modal_price_per_quintal: 1720,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 64.0,
  },
  // Onion
  {
    id: 'pr-oni-pune',
    market_id: 'mkt-pune',
    market_name: 'Pune Market Yard (Gultekdi)',
    commodity: 'Onion',
    variety: 'Gavthi Red',
    min_price_per_quintal: 2200,
    max_price_per_quintal: 3100,
    modal_price_per_quintal: 2750,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 6.5,
  },
  {
    id: 'pr-oni-shirur',
    market_id: 'mkt-shirur',
    market_name: 'Shirur APMC Market',
    commodity: 'Onion',
    variety: 'Nashik Red',
    min_price_per_quintal: 2150,
    max_price_per_quintal: 3000,
    modal_price_per_quintal: 2680,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 64.0,
  },
  {
    id: 'pr-oni-daund',
    market_id: 'mkt-daund',
    market_name: 'Daund APMC Yard',
    commodity: 'Onion',
    variety: 'Red Onion',
    min_price_per_quintal: 2100,
    max_price_per_quintal: 2900,
    modal_price_per_quintal: 2550,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 82.0,
  },
  // Soybean
  {
    id: 'pr-soy-baramati',
    market_id: 'mkt-baramati',
    market_name: 'Baramati APMC Mandi',
    commodity: 'Soybean',
    variety: 'Yellow Standard',
    min_price_per_quintal: 4100,
    max_price_per_quintal: 4800,
    modal_price_per_quintal: 4520,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 98.0,
  },
  // Wheat
  {
    id: 'pr-whe-daund',
    market_id: 'mkt-daund',
    market_name: 'Daund APMC Yard',
    commodity: 'Wheat',
    variety: 'Lokwan Grade-A',
    min_price_per_quintal: 2400,
    max_price_per_quintal: 3100,
    modal_price_per_quintal: 2850,
    price_date: new Date().toISOString().split('T')[0],
    data_source: 'SIMULATED_DEMO_DATA',
    distance_km: 82.0,
  },
];

/**
 * Calculates net realization for a given mandi
 * Transportation rate: Base ₹30 loading/unloading + ₹1.50 per km per quintal (typical small pickup/tempo rate in rural Maharashtra)
 */
export function calculateMarketRealization(
  records: Omit<MarketPriceRecord, 'estimated_transport_cost_per_qtl' | 'net_realization_per_qtl'>[],
  customTransportRatePerKmPerQtl: number = 1.50
): MarketPriceRecord[] {
  return records.map((r) => {
    const transportCost = Math.round(30 + r.distance_km * customTransportRatePerKmPerQtl);
    const netRealization = Math.max(0, r.modal_price_per_quintal - transportCost);

    return {
      ...r,
      estimated_transport_cost_per_qtl: transportCost,
      net_realization_per_qtl: netRealization,
    };
  });
}

export function getCommodityPriceComparison(commodity: string): MarketPriceRecord[] {
  const filtered = BASELINE_MARKET_PRICES.filter(
    (p) => p.commodity.toLowerCase() === commodity.toLowerCase()
  );
  const calculated = calculateMarketRealization(filtered);
  // Sort by highest net realization
  return calculated.sort((a, b) => b.net_realization_per_qtl - a.net_realization_per_qtl);
}
