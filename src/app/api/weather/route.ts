import { NextRequest, NextResponse } from 'next/server';
import { fetchFarmWeather } from '@/lib/weatherService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = parseFloat(searchParams.get('lat') || '18.5204');
    const lon = parseFloat(searchParams.get('lon') || '73.8567');

    const weather = await fetchFarmWeather(lat, lon);
    return NextResponse.json(weather);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
  }
}
