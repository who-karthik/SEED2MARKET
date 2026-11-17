'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Bell, CloudSun, Calendar, ShieldCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export const TopNav: React.FC<{ onMenuToggle: () => void }> = ({ onMenuToggle }) => {
  const { user, currentFarm, weather, weatherLoading, alerts } = useAppStore();

  const unreadAlerts = alerts.filter((a) => !a.is_read && !a.is_dismissed).length;

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-lightBeige/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile hamburger & Farm breadcrumb */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-darkText hover:bg-warmCream focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-darkText text-base md:text-lg">
              {currentFarm?.farm_name || 'Seed2Market Farm'}
            </span>
            {user?.is_demo && (
              <span className="badge-simulated">
                DEMO FARM
              </span>
            )}
          </div>
          <p className="text-xs text-darkText/60 hidden sm:block">
            {currentFarm?.village || 'Pune'}, Maharashtra • {currentFarm?.total_area_acres || 12.5} Acres • Vertisol
          </p>
        </div>
      </div>

      {/* Right: Live weather pill, Date, Notifications */}
      <div className="flex items-center space-x-3 md:space-x-5">
        {/* Weather Quick Widget */}
        <div className="hidden lg:flex items-center space-x-2 bg-warmCream px-3 py-1.5 rounded-full border border-lightBeige text-xs font-medium text-darkText">
          <CloudSun className="w-4 h-4 text-leafGreen" />
          {weatherLoading ? (
            <span>Loading weather...</span>
          ) : weather ? (
            <span>
              Pune: <strong className="font-bold">{weather.temperature_celsius}°C</strong>, {weather.humidity_percentage}% RH ({weather.weather_condition})
            </span>
          ) : (
            <span>Weather Unavailable</span>
          )}
        </div>

        {/* Date Display */}
        <div className="hidden sm:flex items-center space-x-1.5 text-xs text-darkText/70 font-medium">
          <Calendar className="w-4 h-4 text-earthBrown" />
          <span>{todayStr} (IST)</span>
        </div>

        {/* Notification Bell */}
        <Link
          href="/alerts"
          className="relative p-2 rounded-xl text-darkText hover:bg-warmCream border border-lightBeige transition"
          title="Alerts & Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {unreadAlerts}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};
