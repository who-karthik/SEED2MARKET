import { WeatherSnapshot } from '@/types';

// In-memory cache to prevent hitting rate limits
let cachedWeather: { [key: string]: { timestamp: number; data: WeatherSnapshot } } = {};
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

// WMO Weather interpretation codes (WW)
const WMO_CODE_MAP: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

export async function fetchFarmWeather(
  latitude: number = 18.5204,
  longitude: number = 73.8567
): Promise<WeatherSnapshot> {
  const cacheKey = `${latitude.toFixed(3)},${longitude.toFixed(3)}`;
  const now = Date.now();

  if (cachedWeather[cacheKey] && (now - cachedWeather[cacheKey].timestamp < CACHE_TTL_MS)) {
    return cachedWeather[cacheKey].data;
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=Asia%2FKolkata`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP error: ${res.status}`);
    }

    const json = await res.json();
    const current = json.current;
    const hourly = json.hourly;
    const daily = json.daily;

    // Build 24h hourly forecast (next 24 hours)
    const hourlyForecast = [];
    if (hourly && hourly.time) {
      const startIndex = 0;
      for (let i = startIndex; i < Math.min(startIndex + 24, hourly.time.length); i++) {
        hourlyForecast.push({
          time: hourly.time[i],
          temperature: hourly.temperature_2m[i],
          humidity: hourly.relative_humidity_2m[i],
          rain_prob: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
        });
      }
    }

    // Build 7-day daily forecast
    const dailyForecast = [];
    if (daily && daily.time) {
      for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        dailyForecast.push({
          date: daily.time[i],
          temp_max: daily.temperature_2m_max[i],
          temp_min: daily.temperature_2m_min[i],
          precipitation_sum: daily.precipitation_sum[i],
          condition: WMO_CODE_MAP[daily.weather_code[i]] || 'Clear sky',
        });
      }
    }

    // Determine current rain probability from nearest hour
    const nearestRainProb = hourlyForecast.length > 0 ? hourlyForecast[0].rain_prob : 0;
    const weatherCondition = WMO_CODE_MAP[current.weather_code] || 'Partly cloudy';

    const snapshot: WeatherSnapshot = {
      temperature_celsius: current.temperature_2m,
      humidity_percentage: Math.round(current.relative_humidity_2m),
      rainfall_mm: current.precipitation,
      wind_speed_kmh: current.wind_speed_10m,
      rainfall_probability_pct: nearestRainProb,
      weather_condition: weatherCondition,
      is_day: current.is_day === 1,
      captured_at: current.time,
      is_live: true,
      source: 'Open-Meteo Live API (Asia/Kolkata)',
      hourly_forecast: hourlyForecast,
      daily_forecast: dailyForecast,
    };

    cachedWeather[cacheKey] = {
      timestamp: now,
      data: snapshot,
    };

    return snapshot;
  } catch (error) {
    console.warn('[WeatherService] Live API call failed, falling back to cached or verified baseline Pune weather', error);

    // Return realistic Pune baseline weather with clear stale/demo indicator
    return {
      temperature_celsius: 29.4,
      humidity_percentage: 54,
      rainfall_mm: 0.0,
      wind_speed_kmh: 11.2,
      rainfall_probability_pct: 10,
      weather_condition: 'Partly cloudy',
      is_day: true,
      captured_at: new Date().toISOString(),
      is_live: false,
      source: 'Offline Demonstration Baseline (Pune Station)',
      hourly_forecast: [
        { time: '06:00', temperature: 21, humidity: 75, rain_prob: 5 },
        { time: '09:00', temperature: 26, humidity: 62, rain_prob: 5 },
        { time: '12:00', temperature: 31, humidity: 48, rain_prob: 10 },
        { time: '15:00', temperature: 33, humidity: 42, rain_prob: 15 },
        { time: '18:00', temperature: 28, humidity: 56, rain_prob: 10 },
        { time: '21:00', temperature: 24, humidity: 68, rain_prob: 5 },
      ],
      daily_forecast: [
        { date: 'Today', temp_max: 33, temp_min: 20, precipitation_sum: 0, condition: 'Clear sky' },
        { date: 'Tomorrow', temp_max: 34, temp_min: 21, precipitation_sum: 0, condition: 'Mainly clear' },
        { date: 'Day 3', temp_max: 32, temp_min: 22, precipitation_sum: 1.2, condition: 'Partly cloudy' },
        { date: 'Day 4', temp_max: 30, temp_min: 21, precipitation_sum: 4.5, condition: 'Slight rain showers' },
        { date: 'Day 5', temp_max: 31, temp_min: 20, precipitation_sum: 0.5, condition: 'Partly cloudy' },
        { date: 'Day 6', temp_max: 33, temp_min: 21, precipitation_sum: 0, condition: 'Clear sky' },
        { date: 'Day 7', temp_max: 34, temp_min: 22, precipitation_sum: 0, condition: 'Mainly clear' },
      ],
    };
  }
}
