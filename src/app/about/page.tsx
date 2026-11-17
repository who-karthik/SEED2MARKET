'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Database, Cpu, ShieldCheck, CheckCircle2, Globe2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F5EA] text-darkText flex flex-col">
      <header className="border-b border-lightBeige bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center space-x-2 text-sm font-semibold text-forest hover:text-primaryGreen transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <span className="font-extrabold text-forest text-base">SEED2MARKET Academic Brief</span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-primaryGreen">
            Project Overview & Team Credits
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-forest">
            Engineering a Decision-First Agricultural Platform
          </h1>
          <p className="text-base text-darkText/80 leading-relaxed">
            SEED2MARKET is an academic engineering capstone developed by a collaborative team of four engineers. The mission is to bridge the chasm between raw environmental telemetry and contextual agronomic actions for smallholder farmers in Western Maharashtra.
          </p>
        </div>

        {/* Team Credits */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-forest font-bold text-lg border-b border-lightBeige pb-3">
            <Users className="w-5 h-5 text-primaryGreen" />
            <span>Development Team (Core Responsibilities)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-warmCream/60 border border-lightBeige">
              <strong className="block text-forest font-bold">1. Full-Stack Lead & Platform Architect</strong>
              <p className="text-xs text-darkText/70 mt-1">Next.js App Router, Supabase RLS schema design, and microservice integration.</p>
            </div>
            <div className="p-4 rounded-xl bg-warmCream/60 border border-lightBeige">
              <strong className="block text-forest font-bold">2. AI/ML & Computer Vision Engineer</strong>
              <p className="text-xs text-darkText/70 mt-1">PyTorch MobileNetV3 transfer learning, PlantVillage & PlantDoc curation, uncertainty rejection.</p>
            </div>
            <div className="p-4 rounded-xl bg-warmCream/60 border border-lightBeige">
              <strong className="block text-forest font-bold">3. Agronomic Engine & Weather Specialist</strong>
              <p className="text-xs text-darkText/70 mt-1">Crop stage moisture thresholds, Open-Meteo telemetry integration, irrigation rule logic.</p>
            </div>
            <div className="p-4 rounded-xl bg-warmCream/60 border border-lightBeige">
              <strong className="block text-forest font-bold">4. Market Intelligence & UI/UX Designer</strong>
              <p className="text-xs text-darkText/70 mt-1">Pune APMC mandi models, net realization transportation formula, accessible farmer UI.</p>
            </div>
          </div>
        </div>

        {/* Target Agro-Climatic Zone */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-forest font-bold text-lg border-b border-lightBeige pb-3">
            <Globe2 className="w-5 h-5 text-earthBrown" />
            <span>Geographic Calibration: Pune, Maharashtra (Zone IX)</span>
          </div>
          <p className="text-sm text-darkText/80 leading-relaxed">
            The platform is calibrated specifically for the Western Maharashtra Plateau Zone. Dominant soil orders modeled include deep black vertisols and medium clay loam inceptisols. Focus cash crops comprise Solanaceous varieties (Tomato, Potato), bulb crops (Onion), and regional cereals (Wheat, Maize).
          </p>
        </div>

        {/* Non-Negotiable Transparency Disclosures */}
        <div className="bg-white p-6 rounded-2xl border border-lightBeige shadow-sm space-y-4">
          <div className="flex items-center space-x-3 text-forest font-bold text-lg border-b border-lightBeige pb-3">
            <ShieldCheck className="w-5 h-5 text-primaryGreen" />
            <span>Ethical Transparency & Disclosures</span>
          </div>
          <ul className="space-y-3 text-sm text-darkText/80">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-primaryGreen flex-shrink-0 mt-0.5" />
              <span><strong>No Fake Sensors:</strong> The platform explicitly distinguishes between farmer-entered soil inputs, ICAR benchmark datasets, and simulated demonstration readings.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-primaryGreen flex-shrink-0 mt-0.5" />
              <span><strong>Uncertainty Rejection:</strong> Crop health images with low clarity, non-leaf backgrounds, or sub-65% confidence are flagged as uncertain with instructions to re-upload.</span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-primaryGreen flex-shrink-0 mt-0.5" />
              <span><strong>Mandi Data Badging:</strong> Demonstration market prices are clearly labeled with &quot;SIMULATED DEMO DATA&quot; badges to avoid confusing simulated test values with verified live arrivals.</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
