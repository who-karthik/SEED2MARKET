'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Layers,
  FlaskConical,
  CloudSun,
  Droplets,
  ScanEye,
  TrendingUp,
  Sparkles,
  Bell,
  FileSpreadsheet,
  Settings,
  LogOut,
  Sprout,
  ChevronDown,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Farms', href: '/farms', icon: MapPin },
  { name: 'Fields & Crops', href: '/fields', icon: Layers },
  { name: 'Soil Intelligence', href: '/soil', icon: FlaskConical },
  { name: 'Weather', href: '/weather', icon: CloudSun },
  { name: 'Irrigation', href: '/irrigation', icon: Droplets },
  { name: 'Crop Health AI', href: '/crop-health', icon: ScanEye },
  { name: 'Market Intelligence', href: '/market', icon: TrendingUp },
  { name: 'AI Recommendations', href: '/recommendations', icon: Sparkles },
  { name: 'Alerts', href: '/alerts', icon: Bell, badgeKey: 'alerts' },
  { name: 'Reports & Analytics', href: '/reports', icon: FileSpreadsheet },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen?: boolean; onClose?: () => void }> = ({
  isOpen = false,
  onClose,
}) => {
  const pathname = usePathname();
  const { user, farms, currentFarm, setCurrentFarm, logoutUser, alerts } = useAppStore();

  const unreadAlerts = alerts.filter((a) => !a.is_read && !a.is_dismissed).length;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-forest text-warmCream flex flex-col border-r border-forest-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-forest-800 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primaryGreen flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6 text-leafGreen" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-lg text-white block">
                SEED2MARKET
              </span>
              <span className="text-[10px] text-leafGreen font-medium tracking-wider uppercase block">
                Agricultural Intelligence
              </span>
            </div>
          </Link>
        </div>

        {/* Farm Switcher Widget */}
        <div className="px-4 py-3 border-b border-forest-800/60 bg-forest-950/40">
          <label className="text-[10px] uppercase font-semibold text-warmCream/60 tracking-wider block mb-1">
            Active Farm
          </label>
          <div className="relative">
            <select
              value={currentFarm?.id || ''}
              onChange={(e) => {
                const found = farms.find((f) => f.id === e.target.value);
                if (found) setCurrentFarm(found);
              }}
              className="w-full bg-forest-800 text-sm font-medium text-warmCream rounded-lg px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-leafGreen cursor-pointer border border-forest-700"
            >
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id} className="bg-forest-900 text-warmCream">
                  {farm.farm_name} ({farm.total_area_acres} ac)
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-warmCream/70 absolute right-2.5 top-3 pointer-events-none" />
          </div>
          <div className="text-[11px] text-leafGreen/90 mt-1.5 flex items-center space-x-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{currentFarm?.village || 'Pune'}, {currentFarm?.district}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primaryGreen text-white shadow-sm font-semibold'
                    : 'text-warmCream/80 hover:text-white hover:bg-forest-800/70'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-leafGreen' : 'text-warmCream/70'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badgeKey === 'alerts' && unreadAlerts > 0 && (
                  <span className="bg-amber-500 text-forest-950 font-bold text-xs px-2 py-0.5 rounded-full">
                    {unreadAlerts}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="p-4 border-t border-forest-800 bg-forest-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-leafGreen/20 border border-leafGreen/40 flex items-center justify-center font-bold text-leafGreen text-sm">
                {user?.full_name ? user.full_name[0] : 'F'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.full_name || 'Demo Farmer'}
                </p>
                <p className="text-xs text-warmCream/60 truncate">
                  {user?.email || 'demo@seed2market.ag'}
                </p>
              </div>
            </div>
            <button
              onClick={logoutUser}
              title="Sign Out"
              className="text-warmCream/60 hover:text-red-400 p-2 rounded-lg hover:bg-forest-800/60 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
