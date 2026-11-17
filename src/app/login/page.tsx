'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { loginAsDemo, loginUser } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      loginUser(email);
      router.push('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-darkText">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="w-12 h-12 rounded-xl bg-forest flex items-center justify-center text-white shadow-md">
            <Sprout className="w-7 h-7 text-leafGreen" />
          </div>
        </Link>
        <h2 className="text-3xl font-extrabold text-forest tracking-tight">
          Sign In to SEED2MARKET
        </h2>
        <p className="text-sm text-darkText/70">
          Access your farm records, AI recommendations and market intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-lightBeige shadow-sm space-y-6">
          {/* Fast Demo Access Button */}
          <div className="p-4 rounded-xl bg-primaryGreen-light border border-primaryGreen/20 space-y-3">
            <div className="flex items-center space-x-2 text-forest font-bold text-sm">
              <UserCheck className="w-4 h-4 text-primaryGreen" />
              <span>Academic Demonstration Account</span>
            </div>
            <p className="text-xs text-darkText/80 leading-relaxed">
              Instantly inspect the complete Pune, Maharashtra demo farm with pre-loaded vertisol soil tests, crop stages, and irrigation models.
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-primaryGreen hover:bg-forest text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
            >
              <span>Sign In as Demo Farmer (Pune)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-lightBeige" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-darkText/50 font-bold tracking-wider">
                Or custom credentials
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-lightBeige px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-lightBeige px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-forest hover:bg-forest-800 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-xs text-darkText/70 pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-primaryGreen hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
