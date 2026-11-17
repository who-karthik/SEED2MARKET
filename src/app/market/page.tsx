'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  MapPin,
  Truck,
  ArrowRight,
  Info,
  DollarSign,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { BASELINE_MARKET_PRICES, calculateMarketRealization } from '@/lib/marketEngine';

export default function MarketPage() {
  const [selectedCommodity, setSelectedCommodity] = useState('Tomato');
  const [transportRate, setTransportRate] = useState(1.50); // ₹1.50 / km / quintal

  const commodities = ['Tomato', 'Potato', 'Onion', 'Soybean', 'Wheat'];

  const filteredPrices = calculateMarketRealization(
    BASELINE_MARKET_PRICES.filter((p) => p.commodity === selectedCommodity),
    transportRate
  ).sort((a, b) => b.net_realization_per_qtl - a.net_realization_per_qtl);

  const bestMarket = filteredPrices[0];
  const lowestMarket = filteredPrices[filteredPrices.length - 1];
  const arbitrageSpread = bestMarket && lowestMarket ? bestMarket.net_realization_per_qtl - lowestMarket.net_realization_per_qtl : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                  Mandi Price Discovery & Logistics
                </span>
                <span className="text-lightBeige">•</span>
                <span className="badge-simulated">SIMULATED DEMO DATA</span>
              </div>
              <h1 className="text-2xl font-extrabold text-forest mt-1">
                Pune Regional Market Intelligence
              </h1>
              <p className="text-xs text-darkText/70 mt-1">
                Wholesale price spreads across Pune Market Yard, Junnar, Baramati, Shirur, Indapur, and Daund APMCs.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start space-x-3 text-xs text-amber-950">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Demonstration Price Disclosure:</strong> Prices shown below are calibrated demonstration values representing typical Western Maharashtra seasonal price bands. Never mix simulated values with verified live arrivals without explicit labels. Formula applied: <em>Estimated Net Realization = Modal Price - Estimated Transportation Cost</em>.
            </div>
          </div>
        </div>

        {/* Commodity Filter & Transport Rate Slider */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Commodity Pills */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-darkText/60 mb-2">
              Select Cash Commodity
            </label>
            <div className="flex flex-wrap gap-2">
              {commodities.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setSelectedCommodity(crop)}
                  className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                    selectedCommodity === crop
                      ? 'bg-primaryGreen text-white shadow-sm'
                      : 'bg-warmCream/60 text-darkText hover:bg-warmCream border border-lightBeige'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          </div>

          {/* Transportation Cost Slider */}
          <div className="md:w-72 bg-warmCream/40 p-3.5 rounded-xl border border-lightBeige space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-forest flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-primaryGreen" />
                <span>Haulage Rate / km</span>
              </span>
              <span className="font-extrabold text-primaryGreen">₹{transportRate.toFixed(2)} / qtl / km</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="3.00"
              step="0.10"
              value={transportRate}
              onChange={(e) => setTransportRate(Number(e.target.value))}
              className="w-full accent-primaryGreen cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-darkText/50 font-medium">
              <span>Shared Pickup (₹0.80)</span>
              <span>Dedicated Tempo (₹3.00)</span>
            </div>
          </div>
        </div>

        {/* Arbitrage Opportunity Highlight */}
        {bestMarket && (
          <div className="bg-gradient-to-r from-forest to-forest-800 text-warmCream p-6 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center space-x-2 text-leafGreen text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Optimal Market Arbitrage Route</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Dispatch to {bestMarket.market_name}
              </h2>
              <div className="text-lg sm:text-xl font-extrabold text-leafGreen">
                Net Realization: ₹{bestMarket.net_realization_per_qtl} / quintal
              </div>
            </div>
            <p className="text-xs text-warmCream/80 leading-relaxed max-w-3xl">
              Even after deducting ₹{bestMarket.estimated_transport_cost_per_qtl}/quintal haulage over {bestMarket.distance_km} km, selling {selectedCommodity} at {bestMarket.market_name} delivers an estimated net advantage of ₹{arbitrageSpread}/quintal over alternative local yards.
            </p>
          </div>
        )}

        {/* Mandi Comparison Table */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-lightBeige pb-3">
            <h2 className="font-extrabold text-forest text-base">
              {selectedCommodity} Mandi Rates Across Pune District
            </h2>
            <span className="text-xs text-darkText/60">{filteredPrices.length} mandis reporting</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">APMC Mandi</th>
                  <th className="p-3">Variety</th>
                  <th className="p-3">Min Price</th>
                  <th className="p-3">Max Price</th>
                  <th className="p-3">Modal Price</th>
                  <th className="p-3">Distance</th>
                  <th className="p-3">Est. Haulage</th>
                  <th className="p-3 font-black text-forest">Net Realization</th>
                  <th className="p-3 rounded-r-xl">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBeige">
                {filteredPrices.map((row, idx) => (
                  <tr key={row.id} className={`hover:bg-warmCream/30 transition ${idx === 0 ? 'bg-primaryGreen-light/30' : ''}`}>
                    <td className="p-3 font-bold text-forest">
                      {row.market_name}
                      {idx === 0 && (
                        <span className="ml-2 text-[10px] font-extrabold text-primaryGreen uppercase bg-primaryGreen-light px-2 py-0.5 rounded-full">
                          Top Choice
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-darkText/80">{row.variety}</td>
                    <td className="p-3 text-darkText/60">₹{row.min_price_per_quintal}</td>
                    <td className="p-3 text-darkText/60">₹{row.max_price_per_quintal}</td>
                    <td className="p-3 font-bold text-darkText">₹{row.modal_price_per_quintal}</td>
                    <td className="p-3 text-darkText/70">{row.distance_km} km</td>
                    <td className="p-3 text-red-600 font-semibold">-₹{row.estimated_transport_cost_per_qtl}</td>
                    <td className="p-3 font-black text-sm text-forest">
                      ₹{row.net_realization_per_qtl}
                    </td>
                    <td className="p-3">
                      <span className="badge-simulated">
                        DEMO
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
