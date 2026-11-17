'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Layers,
  FlaskConical,
  Droplets,
  ScanEye,
  TrendingUp,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

export default function ReportsPage() {
  const {
    soilObservations,
    irrigationEvents,
    cropHealthAnalyses,
    marketPrices,
    exportDataToCSV,
  } = useAppStore();

  const [activeReport, setActiveReport] = useState<'soil' | 'irrigation' | 'crop_health' | 'market'>('soil');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Agronomic Ledger & Analytics
              </span>
              <span className="text-lightBeige">•</span>
              <span className="text-xs text-darkText/60">Official Database Export</span>
            </div>
            <h1 className="text-2xl font-extrabold text-forest mt-1">Reports & Analytics</h1>
            <p className="text-xs text-darkText/70 mt-1">
              Download real, verified CSV audit trails for soil observations, irrigation logs, pathology scans, and mandi prices.
            </p>
          </div>

          <button
            onClick={() => exportDataToCSV(activeReport)}
            className="bg-forest hover:bg-forest-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-leafGreen" />
            <span>Export {activeReport.toUpperCase()} (CSV)</span>
          </button>
        </div>

        {/* Report Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveReport('soil')}
            className={`p-4 rounded-2xl border text-left transition space-y-1 ${
              activeReport === 'soil'
                ? 'bg-white border-primaryGreen ring-2 ring-primaryGreen/20 shadow-sm'
                : 'bg-white/60 hover:bg-white border-lightBeige'
            }`}
          >
            <FlaskConical className="w-5 h-5 text-primaryGreen" />
            <span className="text-sm font-extrabold text-forest block pt-1">Soil Records</span>
            <span className="text-xs text-darkText/60 block">{soilObservations.length} tests recorded</span>
          </button>

          <button
            onClick={() => setActiveReport('irrigation')}
            className={`p-4 rounded-2xl border text-left transition space-y-1 ${
              activeReport === 'irrigation'
                ? 'bg-white border-primaryGreen ring-2 ring-primaryGreen/20 shadow-sm'
                : 'bg-white/60 hover:bg-white border-lightBeige'
            }`}
          >
            <Droplets className="w-5 h-5 text-primaryGreen" />
            <span className="text-sm font-extrabold text-forest block pt-1">Irrigation Ledger</span>
            <span className="text-xs text-darkText/60 block">{irrigationEvents.length} events logged</span>
          </button>

          <button
            onClick={() => setActiveReport('crop_health')}
            className={`p-4 rounded-2xl border text-left transition space-y-1 ${
              activeReport === 'crop_health'
                ? 'bg-white border-primaryGreen ring-2 ring-primaryGreen/20 shadow-sm'
                : 'bg-white/60 hover:bg-white border-lightBeige'
            }`}
          >
            <ScanEye className="w-5 h-5 text-primaryGreen" />
            <span className="text-sm font-extrabold text-forest block pt-1">Pathology Scans</span>
            <span className="text-xs text-darkText/60 block">{cropHealthAnalyses.length} leaf diagnoses</span>
          </button>

          <button
            onClick={() => setActiveReport('market')}
            className={`p-4 rounded-2xl border text-left transition space-y-1 ${
              activeReport === 'market'
                ? 'bg-white border-primaryGreen ring-2 ring-primaryGreen/20 shadow-sm'
                : 'bg-white/60 hover:bg-white border-lightBeige'
            }`}
          >
            <TrendingUp className="w-5 h-5 text-primaryGreen" />
            <span className="text-sm font-extrabold text-forest block pt-1">Mandi Matrix</span>
            <span className="text-xs text-darkText/60 block">{marketPrices.length} mandi rates</span>
          </button>
        </div>

        {/* Report Preview Table */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-lightBeige pb-3">
            <h2 className="font-extrabold text-forest text-base uppercase tracking-wider text-xs">
              Live Preview: {activeReport.replace('_', ' ')} Dataset
            </h2>
            <button
              onClick={() => exportDataToCSV(activeReport)}
              className="text-xs font-bold text-primaryGreen hover:text-forest flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            {activeReport === 'soil' && (
              <table className="w-full text-left">
                <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Recorded At</th>
                    <th className="p-3">Field</th>
                    <th className="p-3">Soil Type</th>
                    <th className="p-3">pH</th>
                    <th className="p-3">N (kg/ha)</th>
                    <th className="p-3">P (kg/ha)</th>
                    <th className="p-3">K (kg/ha)</th>
                    <th className="p-3">Moisture</th>
                    <th className="p-3">Data Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightBeige">
                  {soilObservations.map((obs) => (
                    <tr key={obs.id} className="hover:bg-warmCream/20 transition">
                      <td className="p-3 text-darkText/60">{new Date(obs.recorded_at).toLocaleDateString('en-IN')}</td>
                      <td className="p-3 font-bold text-forest">{obs.field_name || 'Plot'}</td>
                      <td className="p-3 text-darkText/80">{obs.soil_type}</td>
                      <td className="p-3 font-extrabold text-forest">{obs.ph}</td>
                      <td className="p-3">{obs.nitrogen_kg_ha}</td>
                      <td className="p-3">{obs.phosphorus_kg_ha}</td>
                      <td className="p-3">{obs.potassium_kg_ha}</td>
                      <td className="p-3 font-bold text-primaryGreen">{obs.moisture_percentage}%</td>
                      <td className="p-3">
                        <span className="badge-simulated">{obs.data_source_type.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'irrigation' && (
              <table className="w-full text-left">
                <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3">Field</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Method</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightBeige">
                  {irrigationEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-warmCream/20 transition">
                      <td className="p-3 text-darkText/60">{new Date(evt.event_timestamp).toLocaleString('en-IN')}</td>
                      <td className="p-3 font-bold text-forest">{evt.field_name || 'Plot'}</td>
                      <td className="p-3 font-extrabold text-primaryGreen">{(evt.water_quantity_liters).toLocaleString('en-IN')} L</td>
                      <td className="p-3 uppercase font-semibold text-darkText/80">{evt.method}</td>
                      <td className="p-3">{evt.duration_minutes} min</td>
                      <td className="p-3 text-darkText/70">{evt.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeReport === 'crop_health' && (
              <table className="w-full text-left">
                <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Crop</th>
                    <th className="p-3">Condition Identified</th>
                    <th className="p-3">Confidence</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Uncertain Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightBeige">
                  {cropHealthAnalyses.length > 0 ? (
                    cropHealthAnalyses.map((item) => (
                      <tr key={item.id} className="hover:bg-warmCream/20 transition">
                        <td className="p-3 text-darkText/60">{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                        <td className="p-3 font-bold text-forest">{item.predicted_crop}</td>
                        <td className="p-3">{item.predicted_condition}</td>
                        <td className="p-3 font-bold text-primaryGreen">{(item.confidence_score * 100).toFixed(1)}%</td>
                        <td className="p-3">{item.is_healthy ? 'Healthy' : 'Diseased'}</td>
                        <td className="p-3">{item.is_uncertain ? 'YES' : 'NO'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-6 text-center text-darkText/50">
                        No crop health scans recorded yet. Upload a specimen in the Crop Health AI module.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}

            {activeReport === 'market' && (
              <table className="w-full text-left">
                <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">APMC Mandi</th>
                    <th className="p-3">Commodity</th>
                    <th className="p-3">Modal Rate</th>
                    <th className="p-3">Distance</th>
                    <th className="p-3">Est. Haulage</th>
                    <th className="p-3">Net Realization</th>
                    <th className="p-3">Source Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lightBeige">
                  {marketPrices.map((m) => (
                    <tr key={m.id} className="hover:bg-warmCream/20 transition">
                      <td className="p-3 font-bold text-forest">{m.market_name}</td>
                      <td className="p-3">{m.commodity} ({m.variety})</td>
                      <td className="p-3 font-bold">₹{m.modal_price_per_quintal}/qtl</td>
                      <td className="p-3">{m.distance_km} km</td>
                      <td className="p-3 text-red-600">-₹{m.estimated_transport_cost_per_qtl}</td>
                      <td className="p-3 font-black text-forest">₹{m.net_realization_per_qtl}/qtl</td>
                      <td className="p-3">
                        <span className="badge-simulated">{m.data_source}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
