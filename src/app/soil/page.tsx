'use client';

import React, { useState } from 'react';
import { FlaskConical, Plus, Info, CheckCircle2, AlertCircle, BarChart3, ShieldCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { analyzeSoilHealth } from '@/lib/soilEngine';

export default function SoilPage() {
  const { fields, soilObservations, addSoilObservation } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);

  // Form State
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id || '');
  const [soilType, setSoilType] = useState('Medium Black Soil');
  const [ph, setPh] = useState(6.8);
  const [n, setN] = useState(210);
  const [p, setP] = useState(38);
  const [k, setK] = useState(290);
  const [moisture, setMoisture] = useState(36);
  const [temperature, setTemperature] = useState(24.5);
  const [organicCarbon, setOrganicCarbon] = useState(0.68);
  const [dataSourceType, setDataSourceType] = useState<'farmer_entered' | 'dataset_derived' | 'simulated_demo'>('farmer_entered');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedField = fields.find((f) => f.id === selectedFieldId);

    const report = analyzeSoilHealth(
      { ph, nitrogen_kg_ha: n, phosphorus_kg_ha: p, potassium_kg_ha: k, organic_carbon_percentage: organicCarbon },
      matchedField?.current_crop
    );

    addSoilObservation({
      field_id: selectedFieldId,
      soil_type: soilType,
      ph: Number(ph),
      nitrogen_kg_ha: Number(n),
      phosphorus_kg_ha: Number(p),
      potassium_kg_ha: Number(k),
      moisture_percentage: Number(moisture),
      temperature_celsius: Number(temperature),
      organic_carbon_percentage: Number(organicCarbon),
      data_source_type: dataSourceType,
      condition_summary: report.summary,
    });

    setShowAddForm(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Transparency Banner */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Soil Chemistry & Agronomic Diagnostics
              </span>
              <h1 className="text-2xl font-extrabold text-forest mt-1">Soil Intelligence</h1>
              <p className="text-xs text-darkText/70 mt-1">
                Calibrated against ICAR-NBSS&LUP Western Maharashtra Vertisol benchmark standards.
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Log Soil Test</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-warmCream/70 border border-lightBeige flex items-start space-x-3 text-xs text-darkText/80">
            <Info className="w-4 h-4 text-earthBrown flex-shrink-0 mt-0.5" />
            <div>
              <strong>Hardware Transparency Disclosure:</strong> This platform does not simulate fake ESP32 hardware connection. Soil telemetry relies on certified lab soil-test inputs, dataset-derived ICAR reference norms, and clearly labeled simulated demonstration entries.
            </div>
          </div>
        </div>

        {/* Add Soil Test Form */}
        {showAddForm && (
          <div className="bg-white p-6 rounded-2xl border border-primaryGreen/30 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-lightBeige pb-3">
              <h3 className="font-extrabold text-forest text-base">Enter Soil Laboratory Test Values</h3>
              <button onClick={() => setShowAddForm(false)} className="text-darkText/50 hover:text-darkText text-xs font-bold">
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Select Target Field
                  </label>
                  <select
                    value={selectedFieldId}
                    onChange={(e) => setSelectedFieldId(e.target.value)}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.field_name} ({f.current_crop})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Soil Type Classification
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                  >
                    <option value="Medium Black Soil">Medium Black Soil (Vertisol)</option>
                    <option value="Black Clay Soil">Black Clay Soil</option>
                    <option value="Sandy Loam Soil">Sandy Loam Soil</option>
                    <option value="Red Laterite Soil">Red Laterite Soil</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Data Source Label
                  </label>
                  <select
                    value={dataSourceType}
                    onChange={(e) => setDataSourceType(e.target.value as any)}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                  >
                    <option value="farmer_entered">Farmer Lab Test Entry</option>
                    <option value="dataset_derived">ICAR Dataset Reference</option>
                    <option value="simulated_demo">Simulated Demo Data</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Soil pH (0 - 14)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="3"
                    max="11"
                    required
                    value={ph}
                    onChange={(e) => setPh(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Nitrogen (N) kg/ha
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="800"
                    required
                    value={n}
                    onChange={(e) => setN(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Phosphorus (P) kg/ha
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    required
                    value={p}
                    onChange={(e) => setP(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Potassium (K) kg/ha
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="800"
                    required
                    value={k}
                    onChange={(e) => setK(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Soil Moisture (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="5"
                    max="90"
                    required
                    value={moisture}
                    onChange={(e) => setMoisture(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Soil Temp (°C)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Organic Carbon (%)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={organicCarbon}
                    onChange={(e) => setOrganicCarbon(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-lightBeige">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl text-darkText/70 hover:bg-warmCream font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-800 text-white font-bold shadow-sm"
                >
                  Save Soil Record
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Observation Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-forest">Recent Soil Observations & Diagnostics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {soilObservations.map((obs) => {
              const matchedField = fields.find((f) => f.id === obs.field_id);
              const analysis = analyzeSoilHealth(obs, matchedField?.current_crop);

              return (
                <div
                  key={obs.id}
                  className="bg-white rounded-2xl border border-lightBeige p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-forest text-base">
                        {obs.field_name || matchedField?.field_name || 'Field Plot'}
                      </h3>
                      <span className="text-xs text-darkText/60 block">{obs.soil_type}</span>
                    </div>

                    <span
                      className={
                        obs.data_source_type === 'farmer_entered'
                          ? 'badge-live'
                          : 'badge-simulated'
                      }
                    >
                      {obs.data_source_type.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Chemistry Meters */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">pH</span>
                      <span className="font-extrabold text-forest text-base">{obs.ph}</span>
                      <span className="text-[10px] text-darkText/50 block font-semibold">{analysis.phStatus}</span>
                    </div>
                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">Nitrogen</span>
                      <span className="font-extrabold text-forest text-base">{obs.nitrogen_kg_ha}</span>
                      <span className="text-[10px] text-darkText/50 block font-semibold">{analysis.nitrogenStatus}</span>
                    </div>
                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">Phosphorus</span>
                      <span className="font-extrabold text-forest text-base">{obs.phosphorus_kg_ha}</span>
                      <span className="text-[10px] text-darkText/50 block font-semibold">{analysis.phosphorusStatus}</span>
                    </div>
                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">Potassium</span>
                      <span className="font-extrabold text-forest text-base">{obs.potassium_kg_ha}</span>
                      <span className="text-[10px] text-darkText/50 block font-semibold">{analysis.potassiumStatus}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-100/80 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-forest font-bold">
                      <CheckCircle2 className="w-4 h-4 text-primaryGreen" />
                      <span>Agronomic Diagnostic Summary</span>
                    </div>
                    <p className="text-darkText/80 leading-relaxed text-[11px]">
                      {obs.condition_summary || analysis.summary}
                    </p>
                    <p className="text-primaryGreen font-semibold text-[11px] pt-1">
                      Advice: {analysis.phRecommendation}
                    </p>
                  </div>

                  <div className="text-[10px] text-darkText/50 flex justify-between pt-1 border-t border-lightBeige">
                    <span>Moisture: {obs.moisture_percentage}% • OC: {obs.organic_carbon_percentage || 0.65}%</span>
                    <span>{new Date(obs.recorded_at).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
