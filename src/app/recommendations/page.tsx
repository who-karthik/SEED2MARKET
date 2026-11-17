'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Droplets,
  FlaskConical,
  CloudSun,
  ScanEye,
  TrendingUp,
  Info,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';
import { UnifiedRecommendation } from '@/types';

export default function RecommendationsPage() {
  const { recommendations, updateRecommendationStatus } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('active');

  const categories = [
    { id: 'all', label: 'All Advisory', icon: Sparkles },
    { id: 'irrigation', label: 'Irrigation', icon: Droplets },
    { id: 'soil', label: 'Soil Health', icon: FlaskConical },
    { id: 'weather', label: 'Weather Risk', icon: CloudSun },
    { id: 'disease', label: 'Plant Pathology', icon: ScanEye },
    { id: 'market', label: 'Market Arbitrage', icon: TrendingUp },
  ];

  const filtered = recommendations.filter((r) => {
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchesCat && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Synthesized Action Protocols
              </span>
              <h1 className="text-2xl font-extrabold text-forest mt-1">
                AI Agricultural Recommendations
              </h1>
              <p className="text-xs text-darkText/70 mt-1">
                Deterministic agronomic decisions answering WHAT, WHY, and WHEN with supporting scientific evidence.
              </p>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2 bg-warmCream p-1.5 rounded-xl border border-lightBeige self-start sm:self-auto">
              <button
                onClick={() => setFilterStatus('active')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  filterStatus === 'active' ? 'bg-forest text-white' : 'text-darkText/70 hover:text-darkText'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  filterStatus === 'completed' ? 'bg-forest text-white' : 'text-darkText/70 hover:text-darkText'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilterStatus('all')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                  filterStatus === 'all' ? 'bg-forest text-white' : 'text-darkText/70 hover:text-darkText'
                }`}
              >
                All
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-lightBeige">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-primaryGreen text-white shadow-sm'
                      : 'bg-warmCream/60 text-darkText hover:bg-warmCream border border-lightBeige'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendations Cards List */}
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((rec) => (
              <div
                key={rec.id}
                className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 transition ${
                  rec.status === 'completed'
                    ? 'opacity-70 bg-warmCream/30 border-lightBeige'
                    : rec.priority === 'CRITICAL'
                    ? 'border-red-300 ring-2 ring-red-100'
                    : 'border-lightBeige hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          rec.priority === 'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : rec.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-primaryGreen-light text-primaryGreen'
                        }`}
                      >
                        {rec.priority} Priority
                      </span>
                      <span className="text-[10px] uppercase font-bold text-darkText/50 tracking-wider">
                        {rec.category} • {rec.field_name || 'Farm-wide'}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-forest pt-1">
                      {rec.what_action}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2 self-start sm:self-auto">
                    {rec.status === 'active' ? (
                      <>
                        <button
                          onClick={() => updateRecommendationStatus(rec.id, 'completed')}
                          className="bg-primaryGreen hover:bg-forest text-white text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mark Done</span>
                        </button>
                        <button
                          onClick={() => updateRecommendationStatus(rec.id, 'dismissed')}
                          className="text-darkText/50 hover:text-darkText text-xs font-semibold px-2 py-1.5"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-primaryGreen flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* 3 Pillars: WHY, WHEN, EVIDENCE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige md:col-span-2 space-y-1">
                    <span className="font-extrabold text-forest uppercase tracking-wider text-[10px] block">
                      Agronomic Justification (WHY):
                    </span>
                    <p className="text-darkText/80 leading-relaxed text-xs">
                      {rec.why_reason}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-warmCream/60 border border-lightBeige space-y-1">
                    <span className="font-extrabold text-forest uppercase tracking-wider text-[10px] block flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-earthBrown" />
                      <span>Execution Window (WHEN):</span>
                    </span>
                    <p className="text-forest font-bold text-xs">{rec.when_timing}</p>
                    <span className="text-[10px] text-darkText/50 block pt-1">
                      Evidence Quality: <strong>{rec.evidence_quality}</strong>
                    </span>
                  </div>
                </div>

                {/* Supporting Input Data */}
                {rec.supporting_data && (
                  <div className="text-[11px] text-darkText/60 pt-2 border-t border-lightBeige flex items-center space-x-2 overflow-x-auto">
                    <span className="font-bold text-darkText/70 flex-shrink-0">Telemetric Inputs:</span>
                    <code className="bg-warmCream/80 px-2 py-0.5 rounded text-[10px] font-mono text-forest">
                      {JSON.stringify(rec.supporting_data)}
                    </code>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-lightBeige text-center space-y-3 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-primaryGreen mx-auto" />
              <h3 className="text-base font-extrabold text-forest">No Actions Pending</h3>
              <p className="text-xs text-darkText/60 max-w-sm mx-auto">
                All agricultural protocols for this category are up to date and in equilibrium.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
