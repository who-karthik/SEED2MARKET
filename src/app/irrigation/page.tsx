'use client';

import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { evaluateIrrigationDecision } from '@/lib/irrigationEngine';

export default function IrrigationPage() {
  const {
    fields,
    soilObservations,
    weather,
    irrigationEvents,
    addIrrigationEvent,
    recommendations,
    updateRecommendationStatus,
  } = useAppStore();

  const [showLogModal, setShowLogModal] = useState(false);

  // Form State for logging an irrigation event
  const [fieldId, setFieldId] = useState(fields[0]?.id || '');
  const [liters, setLiters] = useState(15000);
  const [method, setMethod] = useState<'drip' | 'sprinkler' | 'furrow' | 'flood' | 'manual'>('drip');
  const [duration, setDuration] = useState(120);
  const [notes, setNotes] = useState('Standard morning drip cycle');

  const handleLogEvent = (e: React.FormEvent) => {
    e.preventDefault();
    addIrrigationEvent({
      field_id: fieldId,
      water_quantity_liters: Number(liters),
      method,
      duration_minutes: Number(duration),
      notes,
    });
    setShowLogModal(false);
  };

  const irrigationRecs = recommendations.filter((r) => r.category === 'irrigation');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Precision Water Scheduling
              </span>
              <span className="text-lightBeige">•</span>
              <span className="text-xs text-darkText/60">Agronomic Evapotranspiration Model</span>
            </div>
            <h1 className="text-2xl font-extrabold text-forest mt-1">Irrigation Intelligence</h1>
            <p className="text-xs text-darkText/70 mt-1">
              Deterministic rule-based decision support calculating root-zone soil water deficits for Western Maharashtra vertisols.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Record Irrigation Event</span>
          </button>
        </div>

        {/* Active Irrigation Decision Recommendations */}
        <div className="space-y-4">
          <h2 className="text-lg font-extrabold text-forest">Real-Time Field Irrigation Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => {
              const obs = soilObservations
                .filter((s) => s.field_id === field.id)
                .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];

              const currentMoisture = obs ? obs.moisture_percentage : 30;
              const rain48h = weather?.daily_forecast
                ? (weather.daily_forecast[0]?.precipitation_sum || 0) + (weather.daily_forecast[1]?.precipitation_sum || 0)
                : 0;

              const decision = evaluateIrrigationDecision(field, currentMoisture, rain48h, weather?.temperature_celsius || 28);

              return (
                <div
                  key={field.id}
                  className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 relative ${
                    decision.action === 'IRRIGATE NOW'
                      ? 'border-red-300 ring-2 ring-red-100'
                      : decision.action === 'MONITOR'
                      ? 'border-amber-300'
                      : 'border-lightBeige'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-forest text-base">{field.field_name}</h3>
                      <span className="text-xs text-darkText/60 block mt-0.5">
                        Crop: <strong>{field.current_crop}</strong> ({field.growth_stage})
                      </span>
                    </div>

                    <span
                      className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                        decision.action === 'IRRIGATE NOW'
                          ? 'bg-red-600 text-white animate-pulse'
                          : decision.action === 'MONITOR'
                          ? 'bg-amber-500 text-white'
                          : 'bg-primaryGreen text-white'
                      }`}
                    >
                      {decision.action}
                    </span>
                  </div>

                  {/* Scientific Data Matrix */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">Current Moisture</span>
                      <span
                        className={`text-base font-extrabold ${
                          currentMoisture < decision.supporting_data.threshold_pct
                            ? 'text-red-600'
                            : 'text-primaryGreen'
                        }`}
                      >
                        {currentMoisture}%
                      </span>
                      <span className="text-[10px] text-darkText/50 block">Threshold: {decision.supporting_data.threshold_pct}%</span>
                    </div>

                    <div className="bg-warmCream/60 p-2.5 rounded-xl border border-lightBeige">
                      <span className="text-darkText/60 block text-[11px]">48h Rain Forecast</span>
                      <span className="text-base font-extrabold text-forest">{rain48h.toFixed(1)} mm</span>
                      <span className="text-[10px] text-darkText/50 block">Open-Meteo</span>
                    </div>
                  </div>

                  {/* Decision Explanation */}
                  <div className="p-3.5 rounded-xl bg-forest-50/70 border border-forest-100/80 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-forest font-bold">
                      <Sparkles className="w-4 h-4 text-primaryGreen" />
                      <span>Why this recommendation?</span>
                    </div>
                    <p className="text-darkText/80 text-[11px] leading-relaxed">{decision.reason}</p>
                    {decision.recommended_liters && (
                      <div className="text-forest font-extrabold text-xs pt-1 border-t border-forest-100/80 flex items-center justify-between">
                        <span>Target Water Quantity:</span>
                        <span>{decision.recommended_liters.toLocaleString('en-IN')} L (~{decision.recommended_duration_minutes} min)</span>
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-darkText/50 flex items-center justify-between pt-1 border-t border-lightBeige">
                    <span>Evidence Quality: HIGH</span>
                    <span>No automated physical valve actuation</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Irrigation History Log */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-lightBeige pb-3">
            <h2 className="font-extrabold text-forest text-base">Irrigation Execution Log</h2>
            <span className="text-xs text-darkText/60 font-medium">{irrigationEvents.length} recorded events</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmCream/60 text-darkText/70 uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-3 rounded-l-xl">Date & Time</th>
                  <th className="p-3">Field</th>
                  <th className="p-3">Water Applied</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3 rounded-r-xl">Agronomic Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lightBeige">
                {irrigationEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-warmCream/30 transition">
                    <td className="p-3 font-medium text-darkText">
                      {new Date(evt.event_timestamp).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 font-bold text-forest">{evt.field_name || 'Plot'}</td>
                    <td className="p-3 font-extrabold text-primaryGreen">
                      {(evt.water_quantity_liters).toLocaleString('en-IN')} L
                    </td>
                    <td className="p-3 uppercase font-semibold text-darkText/80">{evt.method}</td>
                    <td className="p-3">{evt.duration_minutes} min</td>
                    <td className="p-3 text-darkText/70 max-w-xs truncate">{evt.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Irrigation Modal */}
        {showLogModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-lightBeige">
              <div className="flex items-center justify-between border-b border-lightBeige pb-3">
                <h3 className="font-extrabold text-forest text-lg">Record Irrigation Session</h3>
                <button onClick={() => setShowLogModal(false)} className="text-darkText/50 hover:text-darkText">
                  ✕
                </button>
              </div>

              <form onSubmit={handleLogEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Select Field Plot
                  </label>
                  <select
                    value={fieldId}
                    onChange={(e) => setFieldId(e.target.value)}
                    className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                  >
                    {fields.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.field_name} ({f.current_crop})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Water Applied (Liters)
                    </label>
                    <input
                      type="number"
                      step="500"
                      min="100"
                      required
                      value={liters}
                      onChange={(e) => setLiters(Number(e.target.value))}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                      Irrigation Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value as any)}
                      className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none bg-white"
                    >
                      <option value="drip">Drip Irrigation</option>
                      <option value="sprinkler">Sprinkler System</option>
                      <option value="furrow">Furrow Irrigation</option>
                      <option value="flood">Flood / Basin</option>
                      <option value="manual">Manual Hose</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="600"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-darkText/80 mb-1 uppercase tracking-wider">
                    Notes / Fertigation Additions
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Applied water soluble 19:19:19 via venturi injector"
                    className="w-full rounded-xl border border-lightBeige px-3.5 py-2 text-sm focus:ring-2 focus:ring-primaryGreen focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-lightBeige">
                  <button
                    type="button"
                    onClick={() => setShowLogModal(false)}
                    className="px-4 py-2 rounded-xl text-darkText/70 hover:bg-warmCream font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-800 text-white font-bold shadow-sm"
                  >
                    Save Irrigation Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
