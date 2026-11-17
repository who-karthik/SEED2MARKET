'use client';

import React from 'react';
import {
  CloudSun,
  RefreshCw,
  Droplets,
  Wind,
  Thermometer,
  Calendar,
  CloudRain,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

export default function WeatherPage() {
  const { currentFarm, weather, weatherLoading, refreshWeather } = useAppStore();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Microclimate Forecast
              </span>
              <span className="text-lightBeige">•</span>
              <span className={weather?.is_live ? 'badge-live' : 'badge-simulated'}>
                {weather?.is_live ? 'LIVE OPEN-METEO' : 'CACHED BASELINE'}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-forest mt-1">Weather Intelligence</h1>
            <p className="text-xs text-darkText/70 mt-1 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-primaryGreen flex-shrink-0" />
              <span>
                Coordinates: {currentFarm?.latitude.toFixed(4)}°N, {currentFarm?.longitude.toFixed(4)}°E ({currentFarm?.village || 'Pune'}, Maharashtra)
              </span>
            </p>
          </div>

          <button
            onClick={refreshWeather}
            disabled={weatherLoading}
            className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${weatherLoading ? 'animate-spin' : ''}`} />
            <span>{weatherLoading ? 'Refreshing...' : 'Refresh Telemetry'}</span>
          </button>
        </div>

        {/* Current Weather Highlight Card */}
        {weather && (
          <div className="bg-gradient-to-br from-forest to-forest-800 text-warmCream p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-forest-900/60 border border-forest-700/60 flex items-center justify-center text-leafGreen">
                  <CloudSun className="w-10 h-10" />
                </div>
                <div>
                  <span className="text-xs uppercase tracking-widest text-leafGreen font-bold block">
                    Current Conditions
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-white">
                    {weather.temperature_celsius}°C
                  </div>
                  <span className="text-sm text-warmCream/80 block mt-0.5 font-medium">
                    {weather.weather_condition}
                  </span>
                </div>
              </div>

              <div className="text-xs text-warmCream/70 sm:text-right space-y-1">
                <div>Source: <strong className="text-white">{weather.source}</strong></div>
                <div>Updated: {new Date(weather.captured_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-forest-700/60 text-xs">
              <div className="p-3.5 rounded-2xl bg-forest-900/50 border border-forest-700/40">
                <span className="text-warmCream/60 block text-[11px] flex items-center space-x-1">
                  <Droplets className="w-3.5 h-3.5 text-leafGreen" />
                  <span>Humidity</span>
                </span>
                <span className="text-xl font-bold text-white block mt-1">{weather.humidity_percentage}%</span>
                <span className="text-[10px] text-leafGreen block mt-0.5">Atmospheric Vapor</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-900/50 border border-forest-700/40">
                <span className="text-warmCream/60 block text-[11px] flex items-center space-x-1">
                  <CloudRain className="w-3.5 h-3.5 text-leafGreen" />
                  <span>Rainfall</span>
                </span>
                <span className="text-xl font-bold text-white block mt-1">{weather.rainfall_mm} mm</span>
                <span className="text-[10px] text-leafGreen block mt-0.5">Prob: {weather.rainfall_probability_pct}%</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-900/50 border border-forest-700/40">
                <span className="text-warmCream/60 block text-[11px] flex items-center space-x-1">
                  <Wind className="w-3.5 h-3.5 text-leafGreen" />
                  <span>Wind Velocity</span>
                </span>
                <span className="text-xl font-bold text-white block mt-1">{weather.wind_speed_kmh} km/h</span>
                <span className="text-[10px] text-leafGreen block mt-0.5">Optimal for Spray</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-forest-900/50 border border-forest-700/40">
                <span className="text-warmCream/60 block text-[11px] flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-leafGreen" />
                  <span>Evapotranspiration</span>
                </span>
                <span className="text-xl font-bold text-white block mt-1">Moderate</span>
                <span className="text-[10px] text-leafGreen block mt-0.5">ET0: ~4.2 mm/day</span>
              </div>
            </div>
          </div>
        )}

        {/* 24-Hour Hourly Forecast Strip */}
        {weather?.hourly_forecast && weather.hourly_forecast.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
            <h2 className="font-extrabold text-forest text-base">Next 24 Hours Micro-Forecast</h2>
            <div className="flex overflow-x-auto pb-2 space-x-3">
              {weather.hourly_forecast.map((h, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-24 p-3 rounded-xl bg-warmCream/50 border border-lightBeige text-center space-y-1.5"
                >
                  <span className="text-[11px] font-semibold text-darkText/60 block">
                    {h.time.includes('T') ? h.time.split('T')[1].slice(0, 5) : h.time}
                  </span>
                  <span className="text-base font-extrabold text-forest block">{h.temperature}°</span>
                  <div className="text-[10px] text-primaryGreen font-bold flex items-center justify-center space-x-0.5">
                    <Droplets className="w-3 h-3" />
                    <span>{h.humidity}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7-Day Agronomic Forecast Table */}
        {weather?.daily_forecast && weather.daily_forecast.length > 0 && (
          <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
            <h2 className="font-extrabold text-forest text-base">7-Day Agro-Meteorological Outlook</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.daily_forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-lightBeige bg-warmCream/30 text-center space-y-2"
                >
                  <span className="text-xs font-bold text-forest block">
                    {day.date.length > 5 ? day.date.slice(5) : day.date}
                  </span>
                  <div className="text-sm font-extrabold text-forest">
                    {day.temp_max}° <span className="text-darkText/40 text-xs font-normal">/ {day.temp_min}°</span>
                  </div>
                  <p className="text-[10px] text-darkText/70 line-clamp-1">{day.condition}</p>
                  <div className="text-[11px] font-semibold text-primaryGreen pt-1 border-t border-lightBeige">
                    {day.precipitation_sum > 0 ? `${day.precipitation_sum} mm rain` : 'Dry / Sunny'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
