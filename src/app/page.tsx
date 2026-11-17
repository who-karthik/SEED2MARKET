'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Droplets,
  CloudSun,
  TrendingUp,
  ScanEye,
  CheckCircle2,
  Award,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { loginAsDemo } = useAppStore();
  const router = useRouter();

  const handleLaunchDemo = () => {
    loginAsDemo();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F5EA] flex flex-col text-darkText">
      {/* Navigation Bar */}
      <header className="border-b border-lightBeige bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-forest flex items-center justify-center text-white shadow-md">
              <Sprout className="w-7 h-7 text-leafGreen" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-xl text-forest block">
                SEED2MARKET
              </span>
              <span className="text-[11px] text-primaryGreen font-semibold tracking-wider uppercase block">
                Agricultural Intelligence
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
            <a href="#features" className="hover:text-primaryGreen transition">Capabilities</a>
            <a href="#workflow" className="hover:text-primaryGreen transition">Workflow</a>
            <a href="#architecture" className="hover:text-primaryGreen transition">Architecture</a>
            <Link href="/about" className="hover:text-primaryGreen transition">About Team</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="text-sm font-semibold px-4 py-2 text-forest hover:text-primaryGreen transition"
            >
              Sign In
            </Link>
            <button
              onClick={handleLaunchDemo}
              className="bg-primaryGreen hover:bg-forest text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-sm transition flex items-center space-x-2"
            >
              <span>Live Demonstration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden bg-gradient-to-b from-[#F7F5EA] via-white to-[#F7F5EA]">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center space-x-2 bg-primaryGreen-light border border-primaryGreen/20 px-4 py-1.5 rounded-full text-xs font-bold text-forest">
            <Award className="w-4 h-4 text-primaryGreen" />
            <span>Target Deployment: Pune, Western Maharashtra (Agro-Climatic Zone IX)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-forest tracking-tight leading-tight">
            The goal isn’t to show farmers more data. <br />
            <span className="text-primaryGreen">It’s to help them make better decisions.</span>
          </h1>

          <p className="text-lg sm:text-xl text-darkText/75 max-w-3xl mx-auto leading-relaxed">
            SEED2MARKET is a complete decision-support system synthesizing dataset-driven soil chemistry, live Open-Meteo microclimate forecasts, deep vision plant pathology, and regional mandi economics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleLaunchDemo}
              className="w-full sm:w-auto bg-forest hover:bg-forest-800 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition flex items-center justify-center space-x-3 group"
            >
              <span>Explore Pune Demo Farm</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <Link
              href="/register"
              className="w-full sm:w-auto bg-white hover:bg-warmCream text-forest font-bold text-base px-8 py-4 rounded-xl border border-lightBeige shadow-sm transition"
            >
              Register Farmer Account
            </Link>
          </div>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto text-left">
            <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm">
              <span className="text-3xl font-extrabold text-forest block">₹135+</span>
              <span className="text-xs text-darkText/70 mt-1 block font-medium">Avg Arbitrage Gain / Quintal</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm">
              <span className="text-3xl font-extrabold text-primaryGreen block">30%</span>
              <span className="text-xs text-darkText/70 mt-1 block font-medium">Irrigation Water Conserved</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm">
              <span className="text-3xl font-extrabold text-leafGreen-hover block">12 Classes</span>
              <span className="text-xs text-darkText/70 mt-1 block font-medium">PyTorch Crop Vision Model</span>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-lightBeige shadow-sm">
              <span className="text-3xl font-extrabold text-earthBrown block">6 Mandis</span>
              <span className="text-xs text-darkText/70 mt-1 block font-medium">Pune District Real-Time Yard Matrix</span>
            </div>
          </div>
        </div>
      </section>

      {/* SENSE -> UNDERSTAND -> RECOMMEND -> ACT Workflow */}
      <section id="workflow" className="py-20 px-6 bg-forest text-warmCream">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-leafGreen text-xs font-bold tracking-widest uppercase">
              Core Architectural Paradigm
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              SENSE → UNDERSTAND → RECOMMEND → ACT
            </h2>
            <p className="text-warmCream/70 text-base">
              A transparent feedback loop answering three fundamental questions: What is happening? What should I do next? Why is this being recommended?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-forest-900/80 border border-forest-700/60 p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-leafGreen font-extrabold text-xl">
                01
              </div>
              <h3 className="text-xl font-bold text-white">SENSE</h3>
              <p className="text-warmCream/70 text-sm leading-relaxed">
                Ingest soil chemical profiles, satellite & Open-Meteo forecasts, and farmer smartphone leaf imagery.
              </p>
            </div>

            <div className="bg-forest-900/80 border border-forest-700/60 p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-leafGreen font-extrabold text-xl">
                02
              </div>
              <h3 className="text-xl font-bold text-white">UNDERSTAND</h3>
              <p className="text-warmCream/70 text-sm leading-relaxed">
                MobileNetV3 computer vision detects foliar pathogens while agronomic rules calculate root-zone moisture deficit.
              </p>
            </div>

            <div className="bg-forest-900/80 border border-forest-700/60 p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-leafGreen font-extrabold text-xl">
                03
              </div>
              <h3 className="text-xl font-bold text-white">RECOMMEND</h3>
              <p className="text-warmCream/70 text-sm leading-relaxed">
                Synthesize WHAT, WHY, and WHEN with supporting scientific evidence quality and exact water volume calculations.
              </p>
            </div>

            <div className="bg-forest-900/80 border border-forest-700/60 p-6 rounded-2xl space-y-4">
              <div className="w-12 h-12 rounded-xl bg-forest-800 flex items-center justify-center text-leafGreen font-extrabold text-xl">
                04
              </div>
              <h3 className="text-xl font-bold text-white">ACT</h3>
              <p className="text-warmCream/70 text-sm leading-relaxed">
                Farmer executes drip irrigation schedule, sanitizes early blight foci, and dispatches harvests to optimal Pune APMC mandis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-primaryGreen text-xs font-bold tracking-widest uppercase">
            Platform Modules
          </span>
          <h2 className="text-3xl font-extrabold text-forest">
            Engineered for Ground-Truth Practicality
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-lightBeige shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primaryGreen-light text-primaryGreen flex items-center justify-center">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest">Irrigation Decision Engine</h3>
            <p className="text-darkText/70 text-sm leading-relaxed">
              Transparent agronomic rule engine matching stage-specific moisture thresholds for Solanaceae and bulb crops against 48h Open-Meteo precipitation forecasts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-lightBeige shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-leafGreen-light text-leafGreen-hover flex items-center justify-center">
              <ScanEye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest">AI Plant Pathology</h3>
            <p className="text-darkText/70 text-sm leading-relaxed">
              MobileNetV3 transfer learning pipeline trained on PlantVillage & PlantDoc with built-in out-of-distribution uncertainty rejection and cultural mitigation steps.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-lightBeige shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-earthBrown-light/20 text-earthBrown flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-forest">Pune Mandi Intelligence</h3>
            <p className="text-darkText/70 text-sm leading-relaxed">
              Regional wholesale comparison across Pune Market Yard, Junnar, Baramati, Shirur, Indapur, and Daund with net realization factoring transport costs.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-lightBeige bg-white py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-darkText/60 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold text-forest text-sm">SEED2MARKET</span>
            <span>•</span>
            <span>Academic Demonstration Platform</span>
          </div>
          <div>
            <span>Developed for Pune Agro-Climatic Zone IX • Built with Next.js, FastAPI & PyTorch</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
