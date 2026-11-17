-- ==============================================================================
-- SEED2MARKET Realistic Demonstration Seed Data (Pune, Maharashtra, India)
-- ALL GENERATED DEMONSTRATION OBSERVATIONS ARE EXPLICITLY LABELED AS SIMULATED DEMO DATA
-- ==============================================================================

-- Demo User ID constant
DO $$
DECLARE
    v_user_id UUID := 'a0000000-0000-0000-0000-000000000001'::uuid;
    v_farm_id UUID := 'b0000000-0000-0000-0000-000000000001'::uuid;
    v_field_tomato UUID := 'c0000000-0000-0000-0000-000000000001'::uuid;
    v_field_potato UUID := 'c0000000-0000-0000-0000-000000000002'::uuid;
    v_field_onion UUID := 'c0000000-0000-0000-0000-000000000003'::uuid;
    
    v_mkt_pune UUID := 'd0000000-0000-0000-0000-000000000001'::uuid;
    v_mkt_baramati UUID := 'd0000000-0000-0000-0000-000000000002'::uuid;
    v_mkt_junnar UUID := 'd0000000-0000-0000-0000-000000000003'::uuid;
    v_mkt_shirur UUID := 'd0000000-0000-0000-0000-000000000004'::uuid;
    v_mkt_indapur UUID := 'd0000000-0000-0000-0000-000000000005'::uuid;
    v_mkt_daund UUID := 'd0000000-0000-0000-0000-000000000006'::uuid;
BEGIN
    -- 1. Insert Profile
    INSERT INTO public.profiles (id, full_name, email, phone_number, preferred_language, state, district, is_demo)
    VALUES (v_user_id, 'Demo Farmer', 'demo@seed2market.ag', '+91 98220 12345', 'en', 'Maharashtra', 'Pune', TRUE)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 2. Insert Farm: Green Valley Farm (Pune, Maharashtra)
    INSERT INTO public.farms (id, user_id, farm_name, state, district, village, latitude, longitude, total_area_acres, dominant_soil_type, is_active)
    VALUES (v_farm_id, v_user_id, 'Green Valley Farm', 'Maharashtra', 'Pune', 'Haveli / Narhe', 18.4575, 73.8184, 12.50, 'Medium Black Soil (Vertisol)', TRUE)
    ON CONFLICT (id) DO NOTHING;

    -- 3. Insert Fields
    INSERT INTO public.fields (id, farm_id, field_name, area_acres, soil_type, current_crop, sowing_date, growth_stage)
    VALUES 
    (v_field_tomato, v_farm_id, 'Field 1: North Plot (Tomato)', 4.50, 'Medium Black Soil', 'Tomato', CURRENT_DATE - INTERVAL '45 days', 'Flowering & Fruit Setting'),
    (v_field_potato, v_farm_id, 'Field 2: East Terrace (Potato)', 4.00, 'Black Clay Soil', 'Potato', CURRENT_DATE - INTERVAL '30 days', 'Vegetative Growth'),
    (v_field_onion, v_farm_id, 'Field 3: South Field (Onion)', 4.00, 'Sandy Loam Soil', 'Onion', CURRENT_DATE - INTERVAL '60 days', 'Bulb Development')
    ON CONFLICT (id) DO NOTHING;

    -- 4. Soil Dataset Reference Metadata
    INSERT INTO public.soil_dataset_metadata (id, dataset_name, source, region, published_year, description, reference_url)
    VALUES (
        uuid_generate_v4(),
        'ICAR-NBSS&LUP Soil Benchmark Database (Western Maharashtra Agro-Climatic Zone IX)',
        'National Bureau of Soil Survey and Land Use Planning, ICAR, Nagpur/Pune',
        'Pune & Western Ghats Foothills',
        2023,
        'Standard benchmark physical and chemical properties of vertisols and inceptisols in semi-arid Pune district.',
        'https://www.nbsslup.in'
    ) ON CONFLICT DO NOTHING;

    -- 5. Insert Soil Observations (Explicitly marked as simulated_demo)
    INSERT INTO public.soil_observations (field_id, soil_type, ph, nitrogen_kg_ha, phosphorus_kg_ha, potassium_kg_ha, moisture_percentage, temperature_celsius, organic_carbon_percentage, data_source_type, condition_summary, recorded_at)
    VALUES
    (v_field_tomato, 'Medium Black Soil', 6.80, 185.0, 32.5, 290.0, 38.5, 24.5, 0.65, 'simulated_demo', 'Optimum pH for Solanaceae; slightly low Nitrogen, adequate Potassium; moisture is currently approaching the critical 35% depletion threshold.', NOW() - INTERVAL '2 hours'),
    (v_field_potato, 'Black Clay Soil', 6.20, 220.0, 48.0, 340.0, 48.0, 23.8, 0.78, 'simulated_demo', 'Excellent nutrient balance for tuber development; high organic carbon; moisture remains well within optimal range (45-55%).', NOW() - INTERVAL '5 hours'),
    (v_field_onion, 'Sandy Loam Soil', 7.40, 160.0, 28.0, 210.0, 26.0, 26.2, 0.45, 'simulated_demo', 'Soil moisture critically low (26%) for bulb formation stage. Requires immediate controlled irrigation.', NOW() - INTERVAL '1 hour');

    -- 6. Insert Irrigation Events
    INSERT INTO public.irrigation_events (field_id, event_timestamp, water_quantity_liters, method, duration_minutes, notes)
    VALUES
    (v_field_tomato, NOW() - INTERVAL '3 days', 18000, 'drip', 180, 'Scheduled morning drip fertigation with water-soluble NPK 19:19:19'),
    (v_field_potato, NOW() - INTERVAL '2 days', 22000, 'sprinkler', 240, 'Evening sprinkler irrigation covering 4 acres'),
    (v_field_onion, NOW() - INTERVAL '5 days', 14000, 'drip', 150, 'Standard drip cycle; soil moisture depletion noted since then');

    -- 7. Markets in Pune Region
    INSERT INTO public.markets (id, market_name, district, state, distance_km_from_pune)
    VALUES
    (v_mkt_pune, 'Pune Market Yard (Gultekdi)', 'Pune', 'Maharashtra', 6.5),
    (v_mkt_baramati, 'Baramati APMC Mandi', 'Pune', 'Maharashtra', 98.0),
    (v_mkt_junnar, 'Junnar (Narayangaon) Mandi', 'Pune', 'Maharashtra', 76.5),
    (v_mkt_shirur, 'Shirur APMC Market', 'Pune', 'Maharashtra', 64.0),
    (v_mkt_indapur, 'Indapur Sub-Market', 'Pune', 'Maharashtra', 132.0),
    (v_mkt_daund, 'Daund APMC Yard', 'Pune', 'Maharashtra', 82.0)
    ON CONFLICT (market_name) DO NOTHING;

    -- 8. Market Prices (Clearly marked SIMULATED_DEMO_DATA)
    INSERT INTO public.market_prices (market_id, commodity, variety, min_price_per_quintal, max_price_per_quintal, modal_price_per_quintal, price_date, data_source)
    VALUES
    (v_mkt_pune, 'Tomato', 'Hybrid Local', 1800, 2600, 2250, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_baramati, 'Tomato', 'Hybrid Local', 1700, 2450, 2100, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_junnar, 'Tomato', 'Narayangaon Special', 2000, 2850, 2500, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_pune, 'Potato', 'Jyoti / Lokkar', 1500, 2100, 1850, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_pune, 'Onion', 'Gavthi Red', 2200, 3100, 2750, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_shirur, 'Onion', 'Nashik Red', 2150, 3000, 2680, CURRENT_DATE, 'SIMULATED_DEMO_DATA'),
    (v_mkt_daund, 'Wheat', 'Lokwan', 2400, 3100, 2850, CURRENT_DATE, 'SIMULATED_DEMO_DATA');

    -- 9. Insert High-Value Recommendations
    INSERT INTO public.recommendations (farm_id, field_id, category, what_action, why_reason, when_timing, priority, supporting_data, evidence_quality, status)
    VALUES
    (
        v_farm_id, 
        v_field_onion, 
        'irrigation', 
        'IRRIGATE NOW: Initiate 120-minute drip cycle (approx. 12,500 L)', 
        'Soil moisture in South Field is at 26%, which is below the critical 30% threshold for Onion bulb development stage. Open-Meteo forecasts 0mm rain over the next 48 hours.', 
        'Within next 4 hours (prefer early morning or late evening)', 
        'CRITICAL', 
        '{"current_moisture_pct": 26, "crop": "Onion", "threshold_pct": 30, "forecast_rain_48h_mm": 0, "evapotranspiration": "high"}'::jsonb, 
        'HIGH', 
        'active'
    ),
    (
        v_farm_id, 
        v_field_tomato, 
        'irrigation', 
        'MONITOR: Tomato moisture at 38.5% — Re-check in 24 hours', 
        'Soil moisture in North Plot is above the 35% trigger point. Open-Meteo predicts warm conditions (31°C). No immediate water stress detected.', 
        'Next evaluation tomorrow 08:00 IST', 
        'LOW', 
        '{"current_moisture_pct": 38.5, "crop": "Tomato", "threshold_pct": 35, "forecast_temp_c": 31}'::jsonb, 
        'HIGH', 
        'active'
    ),
    (
        v_farm_id, 
        v_field_tomato, 
        'disease', 
        'Foliar Inspection: High humidity window tonight may favor Early Blight', 
        'Relative humidity is projected to reach 82% between 02:00 and 06:00 IST with mild temperatures (20°C). Inspect lower foliage for concentric brown rings.', 
        'Inspect foliage tomorrow morning at sunrise', 
        'HIGH', 
        '{"humidity_forecast": 82, "temp_range": "20-22C", "pathogen_risk": "Alternaria solani"}'::jsonb, 
        'MEDIUM', 
        'active'
    ),
    (
        v_farm_id, 
        v_field_tomato, 
        'market', 
        'Market Arbitrage: Junnar (Narayangaon) Mandi offering ₹250/qtl premium over Pune Yard', 
        'Modal price at Junnar is ₹2,500/quintal vs ₹2,250 in Pune. After accounting for estimated ₹115/qtl transport difference, Junnar yields a net gain of ₹135/quintal.', 
        'For harvests scheduled in the next 3 days', 
        'MEDIUM', 
        '{"junnar_modal": 2500, "pune_modal": 2250, "net_realization_gain_per_qtl": 135}'::jsonb, 
        'MEDIUM', 
        'active'
    );

    -- 10. Insert Alerts
    INSERT INTO public.alerts (user_id, farm_id, alert_type, title, description, priority, is_read, is_dismissed)
    VALUES
    (v_user_id, v_farm_id, 'LOW_MOISTURE', 'Critical Soil Moisture Deficit in South Field', 'Onion crop moisture measured at 26% (Threshold: 30%). Tuber/bulb stress risk.', 'CRITICAL', FALSE, FALSE),
    (v_user_id, v_farm_id, 'WEATHER_WARNING', 'Afternoon Heat Spike Forecast (34°C)', 'Open-Meteo predicts peak temperature of 34°C between 13:00 - 15:30. Avoid midday fertigation.', 'MEDIUM', FALSE, FALSE),
    (v_user_id, v_farm_id, 'MARKET_OPPORTUNITY', 'Tomato Price Surge at Junnar Mandi', 'Wholesale modal rate reached ₹2,500/qtl, +11.1% higher than regional average.', 'HIGH', TRUE, FALSE);

END $$;
