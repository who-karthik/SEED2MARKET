import { NextRequest, NextResponse } from 'next/server';
import { BASELINE_MARKET_PRICES, calculateMarketRealization } from '@/lib/marketEngine';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const commodity = searchParams.get('commodity');
    const transportRate = parseFloat(searchParams.get('rate') || '1.50');

    let records = BASELINE_MARKET_PRICES;
    if (commodity && commodity !== 'All') {
      records = records.filter((r) => r.commodity.toLowerCase() === commodity.toLowerCase());
    }

    const calculated = calculateMarketRealization(records, transportRate);
    return NextResponse.json({
      prices: calculated,
      data_source_notice: 'SIMULATED DEMO DATA (Academic demonstration calibrated to Pune APMC price bands)',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve market prices' }, { status: 500 });
  }
}
