export type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  phone_number?: string;
  preferred_language: string;
  state: string;
  district: string;
  is_demo?: boolean;
};

export type Farm = {
  id: string;
  user_id: string;
  farm_name: string;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  total_area_acres: number;
  dominant_soil_type: string;
  is_active: boolean;
  created_at: string;
};

export type Field = {
  id: string;
  farm_id: string;
  field_name: string;
  area_acres: number;
  soil_type: string;
  current_crop: string;
  sowing_date: string;
  growth_stage: 'Germination' | 'Vegetative Growth' | 'Flowering & Fruit Setting' | 'Bulb Development' | 'Ripening / Maturity' | 'Harvesting';
};

export type SoilObservation = {
  id: string;
  field_id: string;
  field_name?: string;
  soil_type: string;
  ph: number;
  nitrogen_kg_ha: number;
  phosphorus_kg_ha: number;
  potassium_kg_ha: number;
  moisture_percentage: number;
  temperature_celsius?: number;
  organic_carbon_percentage?: number;
  data_source_type: 'farmer_entered' | 'dataset_derived' | 'simulated_demo';
  condition_summary?: string;
  recorded_at: string;
};

export type WeatherSnapshot = {
  temperature_celsius: number;
  humidity_percentage: number;
  rainfall_mm: number;
  wind_speed_kmh: number;
  rainfall_probability_pct: number;
  weather_condition: string;
  is_day: boolean;
  captured_at: string;
  is_live: boolean;
  source: string;
  hourly_forecast?: Array<{
    time: string;
    temperature: number;
    humidity: number;
    rain_prob: number;
  }>;
  daily_forecast?: Array<{
    date: string;
    temp_max: number;
    temp_min: number;
    precipitation_sum: number;
    condition: string;
  }>;
};

export type IrrigationEvent = {
  id: string;
  field_id: string;
  field_name?: string;
  event_timestamp: string;
  water_quantity_liters: number;
  method: 'drip' | 'sprinkler' | 'furrow' | 'flood' | 'manual';
  duration_minutes: number;
  notes?: string;
};

export type IrrigationRecommendation = {
  field_id: string;
  field_name: string;
  action: 'IRRIGATE NOW' | 'WAIT' | 'MONITOR';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  recommended_liters?: number;
  recommended_duration_minutes?: number;
  reason: string;
  supporting_data: {
    soil_moisture_pct: number;
    threshold_pct: number;
    crop: string;
    growth_stage: string;
    forecast_rain_48h_mm: number;
    temp_celsius: number;
  };
  generated_timestamp: string;
  evidence_quality: 'HIGH' | 'MEDIUM' | 'PRELIMINARY';
};

export type CropHealthAnalysis = {
  id: string;
  field_id?: string;
  user_id: string;
  image_url: string;
  predicted_crop: string;
  predicted_condition: string;
  is_healthy: boolean;
  confidence_score: number;
  is_uncertain: boolean;
  uncertain_reason?: string;
  description?: string;
  symptoms?: string[];
  recommended_next_steps?: string[];
  top_alternatives?: Array<{
    crop?: string;
    condition?: string;
    class_id?: string;
    confidence: number;
  }>;
  disclaimer: string;
  created_at: string;
};

export type MandiMarket = {
  id: string;
  market_name: string;
  district: string;
  state: string;
  distance_km_from_pune: number;
};

export type MarketPriceRecord = {
  id: string;
  market_id: string;
  market_name: string;
  commodity: string;
  variety: string;
  min_price_per_quintal: number;
  max_price_per_quintal: number;
  modal_price_per_quintal: number;
  price_date: string;
  data_source: 'AGMARKNET_OGD' | 'SIMULATED_DEMO_DATA';
  distance_km: number;
  estimated_transport_cost_per_qtl: number;
  net_realization_per_qtl: number;
};

export type UnifiedRecommendation = {
  id: string;
  farm_id: string;
  field_id?: string;
  field_name?: string;
  category: 'irrigation' | 'soil' | 'weather' | 'disease' | 'market' | 'general';
  what_action: string;
  why_reason: string;
  when_timing: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  supporting_data?: Record<string, any>;
  evidence_quality: 'HIGH' | 'MEDIUM' | 'PRELIMINARY';
  status: 'active' | 'completed' | 'dismissed' | 'deferred';
  created_at: string;
};

export type AlertNotification = {
  id: string;
  user_id: string;
  farm_id?: string;
  alert_type: 'LOW_MOISTURE' | 'IRRIGATION_URGENT' | 'WEATHER_WARNING' | 'CROP_DISEASE' | 'MARKET_OPPORTUNITY';
  title: string;
  description: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
};
