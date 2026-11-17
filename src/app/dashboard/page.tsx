'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  Droplets,
  CloudSun,
  FlaskConical,
  ScanEye,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

export default function DashboardPage() {
  const {
    user,
    currentFarm,
    fields,
    soilObservations,
    weather,
    weatherLoading,
    irrigationEvents,
    cropHealthAnalyses,
    marketPrices,
    recommendations,
    alerts,
  } = useAppStore();

  const activeFieldsCount = fields.length;
  const criticalRecs = recommendations.filter((r) => r.priority === 'CRITICAL' && r.status === 'active');
  const activeRecs = recommendations.filter((r) => r.status === 'active');

  // Most recent soil observation
  const latestSoil = soilObservations[0];
  // Latest crop health
  const latestCropHealth = cropHealthAnalyses[0];
  // Tomato market benchmark
  const topTomatoMarket = marketPrices.find((m) => m.commodity === 'Tomato');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Command Center
              </span>
              <span className="text-lightBeige">•</span>
              <span className="text-xs text-darkText/60">Asia/Kolkata Timezone</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-forest mt-1">
              Welcome back, {user?.full_name || 'Farmer'}!
            </h1>
            <p className="text-sm text-darkText/70 mt-1 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-leafGreen flex-shrink-0" />
              <span>
                Managing <strong>{currentFarm?.farm_name}</strong> in {currentFarm?.village}, {currentFarm?.district}, Maharashtra
              </span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/recommendations"
              className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-leafGreen" />
              <span>{activeRecs.length} Actionable Recommendations</span>
            </Link>
          </div>
        </div>

        {/* Core Farm Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest flex items-center justify-center">
              <Sprout className="w-6 h-6 text-primaryGreen" />
            </div>
            <div>
              <span className="text-xs text-darkText/60 font-semibold block uppercase tracking-wider">
                Total Land Holding
              </span>
              <span className="text-2xl font-extrabold text-forest">
                {currentFarm?.total_area_acres || 12.5} <span className="text-sm font-medium">Acres</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-primaryGreen-light text-primaryGreen flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-darkText/60 font-semibold block uppercase tracking-wider">
                Active Cultivated Plots
              </span>
              <span className="text-2xl font-extrabold text-forest">
                {activeFieldsCount} <span className="text-sm font-medium">Fields</span>
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-leafGreen-light text-leafGreen-hover flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-darkText/60 font-semibold block uppercase tracking-wider">
                Soil Moisture Average
              </span>
              <span className="text-2xl font-extrabold text-forest">
                {latestSoil ? `${latestSoil.moisture_percentage}%` : '32%'}
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-warmCream text-earthBrown flex items-center justify-center">
              <FlaskConical className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-darkText/60 font-semibold block uppercase tracking-wider">
                Soil Chemistry
              </span>
              <span className="text-2xl font-extrabold text-forest">
                pH {latestSoil ? latestSoil.ph : '6.8'}
              </span>
            </div>
          </div>
        </div>

        {/* Critical Alerts Banner (if any) */}
        {criticalRecs.length > 0 && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start space-x-3 text-red-900 shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm">Critical Agronomic Attention Needed</h2>
                <span className="text-[11px] font-bold bg-red-200 text-red-900 px-2 py-0.5 rounded-full uppercase">
                  High Priority
                </span>
              </div>
              <p className="text-xs text-red-800 mt-1">
                {criticalRecs[0].what_action} — {criticalRecs[0].why_reason}
              </p>
            </div>
            <Link
              href="/irrigation"
              className="text-xs font-bold underline hover:text-red-950 flex-shrink-0 self-center"
            >
              Take Action
            </Link>
          </div>
        )}

        {/* 2-Column Grid: Left (Intelligence Widgets), Right (Recommendations & Activity) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Columns (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Weather Widget */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <div className="flex items-center space-x-2.5">
                  <CloudSun className="w-5 h-5 text-primaryGreen" />
                  <h2 className="font-bold text-forest text-base">Weather Intelligence</h2>
                  <span className={weather?.is_live ? 'badge-live' : 'badge-simulated'}>
                    {weather?.is_live ? 'LIVE OPEN-METEO' : 'OFFLINE BASELINE'}
                  </span>
                </div>
                <Link
                  href="/weather"
                  className="text-xs font-bold text-primaryGreen hover:text-forest flex items-center space-x-1"
                >
                  <span>Full Forecast</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {weatherLoading ? (
                <div className="py-8 text-center text-xs text-darkText/60">Fetching microclimate telemetry...</div>
              ) : weather ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige">
                    <span className="text-xs text-darkText/60 block">Temperature</span>
                    <span className="text-2xl font-extrabold text-forest">{weather.temperature_celsius}°C</span>
                    <span className="text-[10px] text-darkText/50 block mt-0.5">{weather.weather_condition}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige">
                    <span className="text-xs text-darkText/60 block">Humidity</span>
                    <span className="text-2xl font-extrabold text-forest">{weather.humidity_percentage}%</span>
                    <span className="text-[10px] text-darkText/50 block mt-0.5">Relative Humidity</span>
                  </div>
                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige">
                    <span className="text-xs text-darkText/60 block">Precipitation</span>
                    <span className="text-2xl font-extrabold text-forest">{weather.rainfall_mm} mm</span>
                    <span className="text-[10px] text-darkText/50 block mt-0.5">Rain Prob: {weather.rainfall_probability_pct}%</span>
                  </div>
                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige">
                    <span className="text-xs text-darkText/60 block">Wind Speed</span>
                    <span className="text-2xl font-extrabold text-forest">{weather.wind_speed_kmh} km/h</span>
                    <span className="text-[10px] text-darkText/50 block mt-0.5">Mild Breeze</span>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Field Status & Irrigation Snapshot */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <div className="flex items-center space-x-2.5">
                  <Droplets className="w-5 h-5 text-primaryGreen" />
                  <h2 className="font-bold text-forest text-base">Irrigation & Soil Moisture Matrix</h2>
                </div>
                <Link
                  href="/irrigation"
                  className="text-xs font-bold text-primaryGreen hover:text-forest flex items-center space-x-1"
                >
                  <span>Manage Irrigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {fields.map((field) => {
                  const obs = soilObservations.find((s) => s.field_id === field.id);
                  const moisture = obs ? obs.moisture_percentage : 32;
                  const isLow = moisture < 30;

                  return (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl border border-lightBeige flex items-center justify-between hover:bg-warmCream/30 transition"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-forest">{field.field_name}</span>
                          <span className="text-xs text-darkText/60 font-medium">({field.area_acres} ac)</span>
                        </div>
                        <div className="text-xs text-darkText/70 mt-0.5">
                          Crop: <strong>{field.current_crop}</strong> • Stage: {field.growth_stage}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <span className="text-xs text-darkText/60">Moisture:</span>
                          <span className={`font-bold text-sm ${isLow ? 'text-red-600' : 'text-primaryGreen'}`}>
                            {moisture}%
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-1 ${
                            isLow
                              ? 'bg-red-100 text-red-800'
                              : 'bg-primaryGreen-light text-primaryGreen'
                          }`}
                        >
                          {isLow ? 'Irrigate Now' : 'Optimal'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pune Mandi Market Intelligence Snapshot */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <div className="flex items-center space-x-2.5">
                  <TrendingUp className="w-5 h-5 text-primaryGreen" />
                  <h2 className="font-bold text-forest text-base">Pune Mandi Price Arbitrage</h2>
                  <span className="badge-simulated">SIMULATED DEMO DATA</span>
                </div>
                <Link
                  href="/market"
                  className="text-xs font-bold text-primaryGreen hover:text-forest flex items-center space-x-1"
                >
                  <span>Compare Mandis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {marketPrices.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-warmCream/50 border border-lightBeige space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-forest">{item.commodity}</span>
                      <span className="text-[10px] text-darkText/60">{item.distance_km} km</span>
                    </div>
                    <div className="text-xs text-darkText/70 truncate">{item.market_name}</div>
                    <div className="pt-1 border-t border-lightBeige flex items-baseline justify-between">
                      <span className="text-xs text-darkText/60">Net Realization:</span>
                      <span className="font-extrabold text-sm text-forest">₹{item.net_realization_per_qtl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: AI Recommendations & Recent Activity */}
          <div className="space-y-6">
            {/* Top AI Recommendations */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-primaryGreen" />
                  <h2 className="font-bold text-forest text-base">Top Recommendations</h2>
                </div>
                <Link
                  href="/recommendations"
                  className="text-xs font-bold text-primaryGreen hover:text-forest"
                >
                  View All ({activeRecs.length})
                </Link>
              </div>

              <div className="space-y-3">
                {activeRecs.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3.5 rounded-xl border border-lightBeige bg-warmCream/20 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          rec.priority === 'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : rec.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-primaryGreen-light text-primaryGreen'
                        }`}
                      >
                        {rec.priority}
                      </span>
                      <span className="text-[10px] font-semibold text-darkText/50 uppercase">
                        {rec.category}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-forest">{rec.what_action}</h3>
                    <p className="text-[11px] text-darkText/70 leading-relaxed">{rec.why_reason}</p>
                    <div className="text-[10px] text-darkText/50 flex items-center space-x-1 pt-1">
                      <Clock className="w-3 h-3" />
                      <span>{rec.when_timing}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Crop Health Quick Tile */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <div className="flex items-center space-x-2">
                  <ScanEye className="w-5 h-5 text-primaryGreen" />
                  <h2 className="font-bold text-forest text-base">AI Disease Scanner</h2>
                </div>
                <Link href="/crop-health" className="text-xs font-bold text-primaryGreen hover:text-forest">
                  Scan Leaf
                </Link>
              </div>
              <p className="text-xs text-darkText/70 leading-relaxed">
                MobileNetV3 PyTorch model trained on 12 crop/disease categories with uncertainty thresholding.
              </p>
              <Link
                href="/crop-health"
                className="w-full bg-forest hover:bg-forest-800 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center space-x-2"
              >
                <span>Upload Leaf Image</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Farm Activity Timeline */}
            <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-3">
              <h2 className="font-bold text-forest text-base border-b border-lightBeige pb-3">
                Recent Farm Operations
              </h2>
              <div className="space-y-3 text-xs">
                {irrigationEvents.slice(0, 2).map((irr) => (
                  <div key={irr.id} className="flex items-start space-x-2.5">
                    <Droplets className="w-4 h-4 text-primaryGreen flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-forest">
                        {irr.field_name}: {(irr.water_quantity_liters).toLocaleString('en-IN')} L applied
                      </p>
                      <p className="text-darkText/60 text-[11px]">{irr.method.toUpperCase()} method • {irr.duration_minutes} min</p>
                    </div>
                  </div>
                ))}

                {soilObservations.slice(0, 2).map((obs) => (
                  <div key={obs.id} className="flex items-start space-x-2.5">
                    <FlaskConical className="w-4 h-4 text-earthBrown flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-forest">
                        {obs.field_name}: Soil test logged (pH {obs.ph})
                      </p>
                      <p className="text-darkText/60 text-[11px]">{obs.data_source_type.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
