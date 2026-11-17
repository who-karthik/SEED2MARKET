'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Farm,
  Field,
  SoilObservation,
  WeatherSnapshot,
  IrrigationEvent,
  CropHealthAnalysis,
  MarketPriceRecord,
  UnifiedRecommendation,
  AlertNotification,
} from '@/types';
import { fetchFarmWeather } from './weatherService';
import { getCommodityPriceComparison, BASELINE_MARKET_PRICES, calculateMarketRealization } from './marketEngine';
import { generateUnifiedRecommendations } from './recommendationEngine';

// Default Demo User Profile (Pune, Maharashtra, India)
const DEMO_USER: UserProfile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  full_name: 'Demo Farmer',
  email: 'demo@seed2market.ag',
  phone_number: '+91 98220 12345',
  preferred_language: 'en',
  state: 'Maharashtra',
  district: 'Pune',
  is_demo: true,
};

// Default Demo Farm (12.5 acres, Pune)
const DEMO_FARM: Farm = {
  id: 'b0000000-0000-0000-0000-000000000001',
  user_id: 'a0000000-0000-0000-0000-000000000001',
  farm_name: 'Green Valley Farm',
  state: 'Maharashtra',
  district: 'Pune',
  village: 'Haveli / Narhe',
  latitude: 18.4575,
  longitude: 73.8184,
  total_area_acres: 12.5,
  dominant_soil_type: 'Medium Black Soil (Vertisol)',
  is_active: true,
  created_at: new Date(Date.now() - 90 * 86400000).toISOString(),
};

// Default Fields: Tomato, Potato, Onion
const DEMO_FIELDS: Field[] = [
  {
    id: 'c0000000-0000-0000-0000-000000000001',
    farm_id: 'b0000000-0000-0000-0000-000000000001',
    field_name: 'Field 1: North Plot (Tomato)',
    area_acres: 4.5,
    soil_type: 'Medium Black Soil',
    current_crop: 'Tomato',
    sowing_date: new Date(Date.now() - 45 * 86400000).toISOString().split('T')[0],
    growth_stage: 'Flowering & Fruit Setting',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000002',
    farm_id: 'b0000000-0000-0000-0000-000000000001',
    field_name: 'Field 2: East Terrace (Potato)',
    area_acres: 4.0,
    soil_type: 'Black Clay Soil',
    current_crop: 'Potato',
    sowing_date: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    growth_stage: 'Vegetative Growth',
  },
  {
    id: 'c0000000-0000-0000-0000-000000000003',
    farm_id: 'b0000000-0000-0000-0000-000000000001',
    field_name: 'Field 3: South Field (Onion)',
    area_acres: 4.0,
    soil_type: 'Sandy Loam Soil',
    current_crop: 'Onion',
    sowing_date: new Date(Date.now() - 60 * 86400000).toISOString().split('T')[0],
    growth_stage: 'Bulb Development',
  },
];

// Baseline Soil Observations (Explicitly labeled as simulated_demo)
const DEMO_SOIL_OBS: SoilObservation[] = [
  {
    id: 'so-tom-001',
    field_id: 'c0000000-0000-0000-0000-000000000001',
    field_name: 'Field 1: North Plot (Tomato)',
    soil_type: 'Medium Black Soil',
    ph: 6.8,
    nitrogen_kg_ha: 185.0,
    phosphorus_kg_ha: 32.5,
    potassium_kg_ha: 290.0,
    moisture_percentage: 38.5,
    temperature_celsius: 24.5,
    organic_carbon_percentage: 0.65,
    data_source_type: 'simulated_demo',
    condition_summary: 'Optimum pH for Solanaceae; slightly low Nitrogen, adequate Potassium; moisture approaching 35% trigger.',
    recorded_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'so-pot-001',
    field_id: 'c0000000-0000-0000-0000-000000000002',
    field_name: 'Field 2: East Terrace (Potato)',
    soil_type: 'Black Clay Soil',
    ph: 6.2,
    nitrogen_kg_ha: 220.0,
    phosphorus_kg_ha: 48.0,
    potassium_kg_ha: 340.0,
    moisture_percentage: 48.0,
    temperature_celsius: 23.8,
    organic_carbon_percentage: 0.78,
    data_source_type: 'simulated_demo',
    condition_summary: 'Excellent nutrient balance for tuber development; high organic carbon; moisture remains well within optimal range.',
    recorded_at: new Date(Date.now() - 5 * 3600000).toISOString(),
  },
  {
    id: 'so-oni-001',
    field_id: 'c0000000-0000-0000-0000-000000000003',
    field_name: 'Field 3: South Field (Onion)',
    soil_type: 'Sandy Loam Soil',
    ph: 7.4,
    nitrogen_kg_ha: 160.0,
    phosphorus_kg_ha: 28.0,
    potassium_kg_ha: 210.0,
    moisture_percentage: 26.0,
    temperature_celsius: 26.2,
    organic_carbon_percentage: 0.45,
    data_source_type: 'simulated_demo',
    condition_summary: 'Soil moisture critically low (26%) for bulb formation stage. Requires immediate controlled irrigation.',
    recorded_at: new Date(Date.now() - 1 * 3600000).toISOString(),
  },
];

// Baseline Irrigation Events
const DEMO_IRRIGATION: IrrigationEvent[] = [
  {
    id: 'irr-001',
    field_id: 'c0000000-0000-0000-0000-000000000001',
    field_name: 'Field 1: North Plot (Tomato)',
    event_timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    water_quantity_liters: 18000,
    method: 'drip',
    duration_minutes: 180,
    notes: 'Scheduled morning drip fertigation with water-soluble 19:19:19',
  },
  {
    id: 'irr-002',
    field_id: 'c0000000-0000-0000-0000-000000000002',
    field_name: 'Field 2: East Terrace (Potato)',
    event_timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    water_quantity_liters: 22000,
    method: 'sprinkler',
    duration_minutes: 240,
    notes: 'Evening sprinkler coverage across 4 acres plot',
  },
];

// Baseline Alerts
const DEMO_ALERTS: AlertNotification[] = [
  {
    id: 'alt-001',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    alert_type: 'LOW_MOISTURE',
    title: 'Critical Soil Moisture Deficit in South Field',
    description: 'Onion crop moisture measured at 26% (Threshold: 30%). Immediate irrigation required.',
    priority: 'CRITICAL',
    is_read: false,
    is_dismissed: false,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'alt-002',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    alert_type: 'WEATHER_WARNING',
    title: 'Afternoon Heat Spike Forecast (34°C)',
    description: 'Open-Meteo predicts peak temperature of 34°C between 13:00 - 15:30. Avoid midday foliar sprays.',
    priority: 'MEDIUM',
    is_read: false,
    is_dismissed: false,
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'alt-003',
    user_id: 'a0000000-0000-0000-0000-000000000001',
    alert_type: 'MARKET_OPPORTUNITY',
    title: 'Tomato Price Surge at Junnar Mandi',
    description: 'Wholesale modal rate reached ₹2,500/qtl, +11.1% higher than regional average.',
    priority: 'HIGH',
    is_read: true,
    is_dismissed: false,
    created_at: new Date(Date.now() - 360 * 60000).toISOString(),
  },
];

interface AppContextType {
  user: UserProfile | null;
  farms: Farm[];
  currentFarm: Farm | null;
  fields: Field[];
  soilObservations: SoilObservation[];
  weather: WeatherSnapshot | null;
  weatherLoading: boolean;
  irrigationEvents: IrrigationEvent[];
  cropHealthAnalyses: CropHealthAnalysis[];
  marketPrices: MarketPriceRecord[];
  recommendations: UnifiedRecommendation[];
  alerts: AlertNotification[];
  loginAsDemo: () => void;
  loginUser: (email: string, fullName?: string) => void;
  logoutUser: () => void;
  setCurrentFarm: (farm: Farm) => void;
  addFarm: (farm: Omit<Farm, 'id' | 'user_id' | 'created_at'>) => void;
  editFarm: (id: string, updates: Partial<Farm>) => void;
  deleteFarm: (id: string) => void;
  addField: (field: Omit<Field, 'id'>) => void;
  editField: (id: string, updates: Partial<Field>) => void;
  deleteField: (id: string) => void;
  addSoilObservation: (obs: Omit<SoilObservation, 'id' | 'recorded_at'>) => void;
  addIrrigationEvent: (event: Omit<IrrigationEvent, 'id' | 'event_timestamp'>) => void;
  addCropHealthAnalysis: (analysis: Omit<CropHealthAnalysis, 'id' | 'created_at'>) => void;
  updateRecommendationStatus: (id: string, status: UnifiedRecommendation['status']) => void;
  markAlertRead: (id: string) => void;
  dismissAlert: (id: string) => void;
  refreshWeather: () => Promise<void>;
  exportDataToCSV: (dataType: 'soil' | 'irrigation' | 'crop_health' | 'market') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USER);
  const [farms, setFarms] = useState<Farm[]>([DEMO_FARM]);
  const [currentFarm, setCurrentFarmState] = useState<Farm | null>(DEMO_FARM);
  const [fields, setFields] = useState<Field[]>(DEMO_FIELDS);
  const [soilObservations, setSoilObservations] = useState<SoilObservation[]>(DEMO_SOIL_OBS);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [irrigationEvents, setIrrigationEvents] = useState<IrrigationEvent[]>(DEMO_IRRIGATION);
  const [cropHealthAnalyses, setCropHealthAnalyses] = useState<CropHealthAnalysis[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPriceRecord[]>(
    calculateMarketRealization(BASELINE_MARKET_PRICES)
  );
  const [recommendations, setRecommendations] = useState<UnifiedRecommendation[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>(DEMO_ALERTS);

  // Load from localStorage on mount if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('s2m_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const savedFarms = localStorage.getItem('s2m_farms');
        if (savedFarms) {
          const parsed = JSON.parse(savedFarms);
          setFarms(parsed);
          setCurrentFarmState(parsed[0] || null);
        }

        const savedFields = localStorage.getItem('s2m_fields');
        if (savedFields) setFields(JSON.parse(savedFields));

        const savedSoil = localStorage.getItem('s2m_soil');
        if (savedSoil) setSoilObservations(JSON.parse(savedSoil));

        const savedIrr = localStorage.getItem('s2m_irrigation');
        if (savedIrr) setIrrigationEvents(JSON.parse(savedIrr));

        const savedCropHealth = localStorage.getItem('s2m_crop_health');
        if (savedCropHealth) setCropHealthAnalyses(JSON.parse(savedCropHealth));

        const savedAlerts = localStorage.getItem('s2m_alerts');
        if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
      } catch (e) {
        console.warn('Could not parse local storage state', e);
      }
    }
  }, []);

  // Fetch weather when current farm changes
  useEffect(() => {
    async function loadWeather() {
      setWeatherLoading(true);
      const lat = currentFarm ? currentFarm.latitude : 18.5204;
      const lon = currentFarm ? currentFarm.longitude : 73.8567;
      const wx = await fetchFarmWeather(lat, lon);
      setWeather(wx);
      setWeatherLoading(false);
    }
    loadWeather();
  }, [currentFarm]);

  // Recalculate recommendations whenever core signals change
  useEffect(() => {
    if (currentFarm && weather) {
      const recs = generateUnifiedRecommendations({
        farm: currentFarm,
        fields,
        soilObservations,
        weather,
        irrigationEvents,
        cropHealthAnalyses,
      });
      setRecommendations(recs);
    }
  }, [currentFarm, fields, soilObservations, weather, irrigationEvents, cropHealthAnalyses]);

  // Save changes to localStorage
  const persist = (key: string, data: any) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (err) {
        console.warn('Failed to save to localStorage', err);
      }
    }
  };

  const loginAsDemo = () => {
    setUser(DEMO_USER);
    setCurrentFarmState(DEMO_FARM);
    persist('s2m_user', DEMO_USER);
  };

  const loginUser = (email: string, fullName?: string) => {
    const newUser: UserProfile = {
      id: 'usr-' + Date.now(),
      full_name: fullName || email.split('@')[0],
      email,
      state: 'Maharashtra',
      district: 'Pune',
      preferred_language: 'en',
    };
    setUser(newUser);
    persist('s2m_user', newUser);
  };

  const logoutUser = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('s2m_user');
    }
  };

  const setCurrentFarm = (farm: Farm) => {
    setCurrentFarmState(farm);
  };

  const addFarm = (farmData: Omit<Farm, 'id' | 'user_id' | 'created_at'>) => {
    const newFarm: Farm = {
      ...farmData,
      id: 'farm-' + Date.now(),
      user_id: user?.id || 'demo-user',
      created_at: new Date().toISOString(),
    };
    const updated = [newFarm, ...farms];
    setFarms(updated);
    setCurrentFarmState(newFarm);
    persist('s2m_farms', updated);
  };

  const editFarm = (id: string, updates: Partial<Farm>) => {
    const updated = farms.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFarms(updated);
    if (currentFarm?.id === id) {
      setCurrentFarmState({ ...currentFarm, ...updates });
    }
    persist('s2m_farms', updated);
  };

  const deleteFarm = (id: string) => {
    const updated = farms.filter((f) => f.id !== id);
    setFarms(updated);
    if (currentFarm?.id === id) {
      setCurrentFarmState(updated[0] || null);
    }
    persist('s2m_farms', updated);
  };

  const addField = (fieldData: Omit<Field, 'id'>) => {
    const newField: Field = {
      ...fieldData,
      id: 'field-' + Date.now(),
    };
    const updated = [...fields, newField];
    setFields(updated);
    persist('s2m_fields', updated);
  };

  const editField = (id: string, updates: Partial<Field>) => {
    const updated = fields.map((f) => (f.id === id ? { ...f, ...updates } : f));
    setFields(updated);
    persist('s2m_fields', updated);
  };

  const deleteField = (id: string) => {
    const updated = fields.filter((f) => f.id !== id);
    setFields(updated);
    persist('s2m_fields', updated);
  };

  const addSoilObservation = (obsData: Omit<SoilObservation, 'id' | 'recorded_at'>) => {
    const matchedField = fields.find((f) => f.id === obsData.field_id);
    const newObs: SoilObservation = {
      ...obsData,
      id: 'soil-' + Date.now(),
      field_name: matchedField?.field_name || 'Plot',
      recorded_at: new Date().toISOString(),
    };
    const updated = [newObs, ...soilObservations];
    setSoilObservations(updated);
    persist('s2m_soil', updated);
  };

  const addIrrigationEvent = (eventData: Omit<IrrigationEvent, 'id' | 'event_timestamp'>) => {
    const matchedField = fields.find((f) => f.id === eventData.field_id);
    const newEvent: IrrigationEvent = {
      ...eventData,
      id: 'irr-' + Date.now(),
      field_name: matchedField?.field_name || 'Plot',
      event_timestamp: new Date().toISOString(),
    };
    const updated = [newEvent, ...irrigationEvents];
    setIrrigationEvents(updated);
    persist('s2m_irrigation', updated);
  };

  const addCropHealthAnalysis = (analysisData: Omit<CropHealthAnalysis, 'id' | 'created_at'>) => {
    const newAnalysis: CropHealthAnalysis = {
      ...analysisData,
      id: 'cha-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newAnalysis, ...cropHealthAnalyses];
    setCropHealthAnalyses(updated);
    persist('s2m_crop_health', updated);

    // If disease detected with high confidence, auto-create alert!
    if (!newAnalysis.is_healthy && !newAnalysis.is_uncertain) {
      const newAlert: AlertNotification = {
        id: 'alt-dis-' + Date.now(),
        user_id: user?.id || 'demo-user',
        alert_type: 'CROP_DISEASE',
        title: `Disease Alert: ${newAnalysis.predicted_condition}`,
        description: `Identified ${newAnalysis.predicted_condition} on ${newAnalysis.predicted_crop} with ${(newAnalysis.confidence_score * 100).toFixed(0)}% confidence. Review next steps.`,
        priority: 'HIGH',
        is_read: false,
        is_dismissed: false,
        created_at: new Date().toISOString(),
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const updateRecommendationStatus = (id: string, status: UnifiedRecommendation['status']) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const markAlertRead = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, is_read: true } : a));
    setAlerts(updated);
    persist('s2m_alerts', updated);
  };

  const dismissAlert = (id: string) => {
    const updated = alerts.map((a) => (a.id === id ? { ...a, is_dismissed: true } : a));
    setAlerts(updated);
    persist('s2m_alerts', updated);
  };

  const refreshWeather = async () => {
    if (currentFarm) {
      setWeatherLoading(true);
      const wx = await fetchFarmWeather(currentFarm.latitude, currentFarm.longitude);
      setWeather(wx);
      setWeatherLoading(false);
    }
  };

  const exportDataToCSV = (dataType: 'soil' | 'irrigation' | 'crop_health' | 'market') => {
    let headers: string[] = [];
    let rows: string[][] = [];
    let filename = `seed2market_${dataType}_report_${new Date().toISOString().split('T')[0]}.csv`;

    if (dataType === 'soil') {
      headers = ['Recorded At', 'Field Name', 'Soil Type', 'pH', 'Nitrogen (kg/ha)', 'Phosphorus (kg/ha)', 'Potassium (kg/ha)', 'Moisture (%)', 'Temp (C)', 'Organic Carbon (%)', 'Data Source'];
      rows = soilObservations.map((s) => [
        s.recorded_at,
        s.field_name || '',
        s.soil_type,
        s.ph.toString(),
        s.nitrogen_kg_ha.toString(),
        s.phosphorus_kg_ha.toString(),
        s.potassium_kg_ha.toString(),
        s.moisture_percentage.toString(),
        (s.temperature_celsius || '').toString(),
        (s.organic_carbon_percentage || '').toString(),
        s.data_source_type,
      ]);
    } else if (dataType === 'irrigation') {
      headers = ['Timestamp', 'Field Name', 'Quantity (Liters)', 'Method', 'Duration (Minutes)', 'Notes'];
      rows = irrigationEvents.map((i) => [
        i.event_timestamp,
        i.field_name || '',
        i.water_quantity_liters.toString(),
        i.method,
        i.duration_minutes.toString(),
        `"${(i.notes || '').replace(/"/g, '""')}"`,
      ]);
    } else if (dataType === 'crop_health') {
      headers = ['Analyzed At', 'Crop', 'Condition', 'Status', 'Confidence Score', 'Uncertain Flag', 'Disclaimer'];
      rows = cropHealthAnalyses.map((c) => [
        c.created_at,
        c.predicted_crop,
        c.predicted_condition,
        c.is_healthy ? 'Healthy' : 'Diseased',
        (c.confidence_score * 100).toFixed(1) + '%',
        c.is_uncertain ? 'YES' : 'NO',
        `"${c.disclaimer}"`,
      ]);
    } else if (dataType === 'market') {
      headers = ['Market Name', 'Commodity', 'Variety', 'Min Price (INR/qtl)', 'Max Price (INR/qtl)', 'Modal Price (INR/qtl)', 'Distance (km)', 'Est Transport Cost (INR/qtl)', 'Net Realization (INR/qtl)', 'Data Source'];
      rows = marketPrices.map((m) => [
        m.market_name,
        m.commodity,
        m.variety,
        m.min_price_per_quintal.toString(),
        m.max_price_per_quintal.toString(),
        m.modal_price_per_quintal.toString(),
        m.distance_km.toString(),
        m.estimated_transport_cost_per_qtl.toString(),
        m.net_realization_per_qtl.toString(),
        m.data_source,
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        farms,
        currentFarm,
        fields,
        soilObservations,
        weather,
        weatherLoading,
        irrigationEvents,
        cropHealthAnalyses,
        marketPrices,
        recommendations,
        alerts,
        loginAsDemo,
        loginUser,
        logoutUser,
        setCurrentFarm,
        addFarm,
        editFarm,
        deleteFarm,
        addField,
        editField,
        deleteField,
        addSoilObservation,
        addIrrigationEvent,
        addCropHealthAnalysis,
        updateRecommendationStatus,
        markAlertRead,
        dismissAlert,
        refreshWeather,
        exportDataToCSV,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
