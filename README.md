# SEED2MARKET
## AI-Powered Agricultural Intelligence Platform
**Target Deployment: Pune, Western Maharashtra, India (Agro-Climatic Zone IX)**

---

### Overview
SEED2MARKET is a production-grade full-stack agricultural decision-intelligence platform engineered to answer three core questions for farmers:
1. **What is happening on my farm?** (Foliar disease, root-zone moisture deficit, soil chemical imbalance, mandi arrivals)
2. **What should I do next?** (Precise drip irrigation volume, sanitation of blight lesions, APMC mandi arbitrage dispatch)
3. **Why is this recommendation being provided?** (Transparent agronomic physiological thresholds, 48h Open-Meteo precipitation models, haulage economics)

Core Operational Paradigm: **SENSE → UNDERSTAND → RECOMMEND → ACT**

---

### Key Capabilities & Architectural Components

1. **Precision Irrigation Decision Engine**
   - Stage-specific physiological moisture thresholds for Solanaceae (Tomato, Potato), bulb crops (Onion), and cereals (Corn, Wheat).
   - Live integration with Open-Meteo 48-hour precipitation forecasts.
   - Calculates exact water volume in Litres and duration in minutes for drip and sprinkler systems.

2. **AI Crop Health & Plant Pathology (PyTorch)**
   - Transfer learning using **MobileNetV3-Small** trained on PlantVillage & PlantDoc benchmark subsets.
   - 12 target classes including Early Blight, Late Blight, Tomato Yellow Leaf Curl Virus, Bacterial Spot, Common Rust, and healthy foliage.
   - **Out-of-Distribution Safety & Uncertainty Rejection:** Blurry photos, low-confidence predictions (<65%), and non-leaf backgrounds are rejected with re-photographing and physical KVK inspection advice.

3. **Pune Mandi Market Arbitrage & Logistics**
   - Real-time wholesale price tracking across Pune Market Yard (Gultekdi), Junnar (Narayangaon), Baramati, Shirur, Indapur, and Daund APMCs.
   - Net Realization Formula:  
     $$\text{Estimated Net Realization} = \text{Modal Mandi Price} - \text{Estimated Transportation Cost}$$
   - Interactive haulage cost slider per quintal per kilometer.

4. **Soil Intelligence (Without Physical Sensors)**
   - Lab-grade soil chemistry input (pH, N, P, K, moisture, temperature, organic carbon).
   - Benchmark evaluation against ICAR-NBSS&LUP Western Maharashtra vertisol standards.
   - Clear distinction between farmer-entered lab tests, reference datasets, and demonstration values.

5. **Authentication & Supabase PostgreSQL**
   - Full PostgreSQL migration schema with Row Level Security (RLS) in `supabase/migrations/`.
   - Comprehensive seed data for Demo Farmer in Pune, Maharashtra in `supabase/seed.sql`.
   - Built-in resilient local state fallback allowing immediate offline academic demonstration.

6. **Audit & Reporting**
   - Full CSV export capability for Soil observations, Irrigation logs, Crop health diagnoses, and Market matrices.

---

### Tech Stack
- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend APIs:** Next.js Server Routes (`/api/predict`, `/api/weather`, `/api/market`, `/api/model-metrics`)
- **ML Inference:** Python 3.14, FastAPI, PyTorch 2.15 (CPU-optimized MobileNetV3), Torchvision
- **Database & Auth:** Supabase PostgreSQL with RLS, Supabase Storage
- **Telemetry:** Open-Meteo Global Forecasting API (Asia/Kolkata timezone)

---

### Quick Start Guide

#### 1. Start Python ML Microservice
```bash
python ml/main.py
# Runs FastAPI on http://127.0.0.1:8000
```

#### 2. Start Next.js Full-Stack Application
```bash
npm run start
# Runs web application on http://localhost:3000
```

#### 3. Access Application
Open [http://localhost:3000](http://localhost:3000) in your browser.
- Click **"Live Demonstration"** or **"Sign In as Demo Farmer (Pune)"** to immediately access the pre-configured 12.5-acre Green Valley Farm in Pune.
