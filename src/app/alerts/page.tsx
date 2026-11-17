'use client';

import React from 'react';
import {
  Bell,
  AlertTriangle,
  Droplets,
  CloudSun,
  ScanEye,
  TrendingUp,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAppStore } from '@/lib/store';

export default function AlertsPage() {
  const { alerts, markAlertRead, dismissAlert } = useAppStore();

  const activeAlerts = alerts.filter((a) => !a.is_dismissed);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'LOW_MOISTURE':
      case 'IRRIGATION_URGENT':
        return <Droplets className="w-5 h-5 text-red-600" />;
      case 'WEATHER_WARNING':
        return <CloudSun className="w-5 h-5 text-amber-600" />;
      case 'CROP_DISEASE':
        return <ScanEye className="w-5 h-5 text-red-600" />;
      case 'MARKET_OPPORTUNITY':
        return <TrendingUp className="w-5 h-5 text-primaryGreen" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-primaryGreen" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-lightBeige shadow-sm">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
                Operational Dispatch
              </span>
              <span className="text-lightBeige">•</span>
              <span className="text-xs text-darkText/60">Real-Time Threshold Triggers</span>
            </div>
            <h1 className="text-2xl font-extrabold text-forest mt-1">Alerts & Warnings</h1>
            <p className="text-xs text-darkText/70 mt-1">
              Automated notifications triggered by soil deficits, microclimate extremes, pathology scans, and mandi arbitrage.
            </p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {activeAlerts.length > 0 ? (
            activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`bg-white rounded-2xl border p-5 shadow-sm flex items-start justify-between gap-4 transition ${
                  alert.is_read ? 'opacity-75 border-lightBeige' : 'border-primaryGreen/40 ring-1 ring-primaryGreen/20'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-warmCream flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getAlertIcon(alert.alert_type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          alert.priority === 'CRITICAL'
                            ? 'bg-red-100 text-red-800'
                            : alert.priority === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-primaryGreen-light text-primaryGreen'
                        }`}
                      >
                        {alert.priority}
                      </span>
                      <span className="text-[10px] text-darkText/50 font-semibold">
                        {new Date(alert.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                      </span>
                    </div>

                    <h3 className="font-extrabold text-forest text-sm">{alert.title}</h3>
                    <p className="text-xs text-darkText/70 leading-relaxed max-w-2xl">{alert.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {!alert.is_read && (
                    <button
                      onClick={() => markAlertRead(alert.id)}
                      className="text-xs font-bold text-primaryGreen hover:text-forest px-2.5 py-1 rounded-lg hover:bg-warmCream transition"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-darkText/40 hover:text-red-500 p-1.5 rounded-lg transition"
                    title="Dismiss Alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-lightBeige text-center space-y-3 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-primaryGreen mx-auto" />
              <h3 className="text-base font-extrabold text-forest">Inbox Clear</h3>
              <p className="text-xs text-darkText/60 max-w-sm mx-auto">
                No active warnings. All environmental parameters are normal.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
