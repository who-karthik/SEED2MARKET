-- ==============================================================================
-- SEED2MARKET Production Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS)
-- Location Focus: Pune, Maharashtra, India
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Farmer Profile linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    preferred_language TEXT DEFAULT 'en',
    state TEXT DEFAULT 'Maharashtra',
    district TEXT DEFAULT 'Pune',
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FARMS TABLE
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    district TEXT NOT NULL DEFAULT 'Pune',
    village TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 18.5204,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 73.8567,
    total_area_acres NUMERIC(6, 2) NOT NULL CHECK (total_area_acres > 0),
    dominant_soil_type TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FIELDS TABLE (Individual plots within a farm)
CREATE TABLE IF NOT EXISTS public.fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    field_name TEXT NOT NULL,
    area_acres NUMERIC(6, 2) NOT NULL CHECK (area_acres > 0),
    soil_type TEXT NOT NULL,
    current_crop TEXT,
    sowing_date DATE,
    growth_stage TEXT, -- Germination, Vegetative, Flowering, Fruiting, Harvesting
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CROP CYCLES (Historical tracking of crop plantings)
CREATE TABLE IF NOT EXISTS public.crop_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    crop_name TEXT NOT NULL,
    variety TEXT,
    sowing_date DATE NOT NULL,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    yield_quintals NUMERIC(8, 2),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SOIL DATASET METADATA (Public research/reference baseline metadata)
CREATE TABLE IF NOT EXISTS public.soil_dataset_metadata (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dataset_name TEXT NOT NULL,
    source TEXT NOT NULL,
    region TEXT NOT NULL,
    published_year INT NOT NULL,
    description TEXT,
    reference_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SOIL PROFILES & OBSERVATIONS
CREATE TABLE IF NOT EXISTS public.soil_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    soil_type TEXT NOT NULL,
    ph NUMERIC(4, 2) NOT NULL CHECK (ph BETWEEN 0 AND 14),
    nitrogen_kg_ha NUMERIC(6, 2) NOT NULL CHECK (nitrogen_kg_ha >= 0),
    phosphorus_kg_ha NUMERIC(6, 2) NOT NULL CHECK (phosphorus_kg_ha >= 0),
    potassium_kg_ha NUMERIC(6, 2) NOT NULL CHECK (potassium_kg_ha >= 0),
    moisture_percentage NUMERIC(5, 2) NOT NULL CHECK (moisture_percentage BETWEEN 0 AND 100),
    temperature_celsius NUMERIC(5, 2),
    organic_carbon_percentage NUMERIC(4, 2),
    data_source_type TEXT NOT NULL CHECK (data_source_type IN ('farmer_entered', 'dataset_derived', 'simulated_demo')),
    condition_summary TEXT,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. WEATHER SNAPSHOTS (Cached Open-Meteo forecasts/history)
CREATE TABLE IF NOT EXISTS public.weather_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    temperature_celsius NUMERIC(4, 1) NOT NULL,
    humidity_percentage INT NOT NULL,
    rainfall_mm NUMERIC(5, 2) NOT NULL,
    wind_speed_kmh NUMERIC(5, 2) NOT NULL,
    rainfall_probability_pct INT,
    weather_condition TEXT,
    forecast_json JSONB,
    source TEXT DEFAULT 'Open-Meteo',
    is_live BOOLEAN DEFAULT TRUE,
    captured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. IRRIGATION EVENTS
CREATE TABLE IF NOT EXISTS public.irrigation_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    water_quantity_liters NUMERIC(10, 2) NOT NULL CHECK (water_quantity_liters > 0),
    method TEXT NOT NULL CHECK (method IN ('drip', 'sprinkler', 'furrow', 'flood', 'manual')),
    duration_minutes INT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CROP HEALTH ANALYSES (AI Disease Detection records)
CREATE TABLE IF NOT EXISTS public.crop_health_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_id UUID REFERENCES public.fields(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    predicted_crop TEXT NOT NULL,
    predicted_condition TEXT NOT NULL,
    is_healthy BOOLEAN NOT NULL DEFAULT FALSE,
    confidence_score NUMERIC(5, 4) NOT NULL CHECK (confidence_score BETWEEN 0 AND 1),
    is_uncertain BOOLEAN DEFAULT FALSE,
    top_alternatives JSONB,
    symptoms_description TEXT,
    recommended_next_steps TEXT,
    disclaimer TEXT NOT NULL DEFAULT 'AI-assisted preliminary assessment. Not a confirmed agricultural diagnosis.',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MARKETS (Pune Agricultural Mandis)
CREATE TABLE IF NOT EXISTS public.markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_name TEXT NOT NULL UNIQUE,
    district TEXT NOT NULL DEFAULT 'Pune',
    state TEXT NOT NULL DEFAULT 'Maharashtra',
    distance_km_from_pune NUMERIC(5, 1) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. MARKET PRICES (Historical & Daily Mandi Prices)
CREATE TABLE IF NOT EXISTS public.market_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
    commodity TEXT NOT NULL,
    variety TEXT DEFAULT 'Common',
    min_price_per_quintal NUMERIC(8, 2) NOT NULL,
    max_price_per_quintal NUMERIC(8, 2) NOT NULL,
    modal_price_per_quintal NUMERIC(8, 2) NOT NULL,
    price_date DATE NOT NULL,
    data_source TEXT NOT NULL CHECK (data_source IN ('AGMARKNET_OGD', 'SIMULATED_DEMO_DATA')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. RECOMMENDATIONS (Unified Decision Support: WHAT, WHY, WHEN, Priority)
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES public.farms(id) ON DELETE CASCADE,
    field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('irrigation', 'soil', 'weather', 'disease', 'market', 'general')),
    what_action TEXT NOT NULL,
    why_reason TEXT NOT NULL,
    when_timing TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    supporting_data JSONB,
    evidence_quality TEXT NOT NULL CHECK (evidence_quality IN ('HIGH', 'MEDIUM', 'PRELIMINARY')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dismissed', 'deferred')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. ALERTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
    alert_type TEXT NOT NULL CHECK (alert_type IN ('LOW_MOISTURE', 'IRRIGATION_URGENT', 'WEATHER_WARNING', 'CROP_DISEASE', 'MARKET_OPPORTUNITY')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'INFO')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    is_dismissed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_fields_farm_id ON public.fields(farm_id);
CREATE INDEX IF NOT EXISTS idx_soil_obs_field_id ON public.soil_observations(field_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_field_id ON public.irrigation_events(field_id);
CREATE INDEX IF NOT EXISTS idx_crop_health_user_id ON public.crop_health_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON public.market_prices(price_date, commodity);
CREATE INDEX IF NOT EXISTS idx_recs_farm_id ON public.recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_health_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_dataset_metadata ENABLE ROW LEVEL SECURITY;

-- Profiles: users read & update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Farms: users manage their own farms
CREATE POLICY "Users can view own farms" ON public.farms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own farms" ON public.farms FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own farms" ON public.farms FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own farms" ON public.farms FOR DELETE USING (auth.uid() = user_id);

-- Fields: access through farm ownership
CREATE POLICY "Users can view fields of own farms" ON public.fields FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can insert fields to own farms" ON public.fields FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can update fields of own farms" ON public.fields FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can delete fields of own farms" ON public.fields FOR DELETE 
    USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = fields.farm_id AND farms.user_id = auth.uid()));

-- Soil Observations: access through field -> farm ownership
CREATE POLICY "Users can view soil observations of own farms" ON public.soil_observations FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.fields JOIN public.farms ON fields.farm_id = farms.id WHERE fields.id = soil_observations.field_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can insert soil observations to own farms" ON public.soil_observations FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.fields JOIN public.farms ON fields.farm_id = farms.id WHERE fields.id = soil_observations.field_id AND farms.user_id = auth.uid()));

-- Irrigation: access through field -> farm ownership
CREATE POLICY "Users can view irrigation of own farms" ON public.irrigation_events FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.fields JOIN public.farms ON fields.farm_id = farms.id WHERE fields.id = irrigation_events.field_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can insert irrigation to own farms" ON public.irrigation_events FOR INSERT 
    WITH CHECK (EXISTS (SELECT 1 FROM public.fields JOIN public.farms ON fields.farm_id = farms.id WHERE fields.id = irrigation_events.field_id AND farms.user_id = auth.uid()));

-- Crop Health Analyses: user_id check
CREATE POLICY "Users can view own crop health analyses" ON public.crop_health_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own crop health analyses" ON public.crop_health_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Recommendations: farm ownership check
CREATE POLICY "Users can view recommendations of own farms" ON public.recommendations FOR SELECT 
    USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = recommendations.farm_id AND farms.user_id = auth.uid()));
CREATE POLICY "Users can update recommendations status" ON public.recommendations FOR UPDATE 
    USING (EXISTS (SELECT 1 FROM public.farms WHERE farms.id = recommendations.farm_id AND farms.user_id = auth.uid()));

-- Alerts: user_id check
CREATE POLICY "Users can view own alerts" ON public.alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.alerts FOR UPDATE USING (auth.uid() = user_id);

-- Markets and Prices: public read-only
CREATE POLICY "Everyone can view markets" ON public.markets FOR SELECT USING (true);
CREATE POLICY "Everyone can view market prices" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Everyone can view soil metadata" ON public.soil_dataset_metadata FOR SELECT USING (true);
