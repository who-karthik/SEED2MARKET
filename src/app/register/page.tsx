'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function RegisterPage() {
  const router = useRouter();
  const { loginUser } = useAppStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [district, setDistrict] = useState('Pune');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && fullName) {
      loginUser(email, fullName);
      router.push('/dashboard');
    }
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
          Create Farmer Account
        </h2>
        <p className="text-sm text-darkText/70">
          Join SEED2MARKET to receive data-driven agricultural intelligence.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-lightBeige shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Patil"
                className="w-full rounded-xl border border-lightBeige px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh@krishi.in"
                className="w-full rounded-xl border border-lightBeige px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full rounded-xl border border-lightBeige px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-lightBeige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
                >
                  <option value="en">English</option>
                  <option value="mr">मराठी (Marathi)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                  State
                </label>
                <input
                  type="text"
                  readOnly
                  value="Maharashtra"
                  className="w-full rounded-xl border border-lightBeige bg-warmCream/60 px-4 py-2.5 text-sm text-darkText/80"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-darkText/80 mb-1">
                  District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full rounded-xl border border-lightBeige px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primaryGreen bg-white"
                >
                  <option value="Pune">Pune</option>
                  <option value="Satara">Satara</option>
                  <option value="Ahmednagar">Ahmednagar</option>
                  <option value="Solapur">Solapur</option>
                  <option value="Nashik">Nashik</option>
                </select>
              </div>
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
              className="w-full bg-forest hover:bg-forest-800 text-white font-bold py-3 rounded-xl transition text-sm shadow-sm flex items-center justify-center space-x-2 mt-2"
            >
              <span>Complete Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-darkText/70 pt-2">
            Already registered?{' '}
            <Link href="/login" className="font-bold text-primaryGreen hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
