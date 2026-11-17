import { Field, IrrigationRecommendation } from '@/types';

// Crop and growth stage specific soil moisture depletion trigger thresholds (% vol)
export const CROP_MOISTURE_THRESHOLDS: Record<string, Record<string, number>> = {
  Tomato: {
    'Germination': 40,
    'Vegetative Growth': 32,
    'Flowering & Fruit Setting': 35,
    'Bulb Development': 32,
    'Ripening / Maturity': 28,
    'Harvesting': 25,
  },
  Potato: {
    'Germination': 42,
    'Vegetative Growth': 40,
    'Flowering & Fruit Setting': 45,
    'Bulb Development': 45,
    'Ripening / Maturity': 35,
    'Harvesting': 28,
  },
  Onion: {
    'Germination': 35,
    'Vegetative Growth': 32,
    'Flowering & Fruit Setting': 30,
    'Bulb Development': 30,
    'Ripening / Maturity': 25,
    'Harvesting': 20,
  },
  'Corn / Maize': {
    'Germination': 32,
    'Vegetative Growth': 30,
    'Flowering & Fruit Setting': 38,
    'Bulb Development': 35,
    'Ripening / Maturity': 25,
    'Harvesting': 20,
  },
  'Capsicum / Bell Pepper': {
    'Germination': 38,
    'Vegetative Growth': 32,
    'Flowering & Fruit Setting': 36,
    'Bulb Development': 32,
    'Ripening / Maturity': 28,
    'Harvesting': 25,
  },
};

export function getCropThreshold(crop: string, growthStage: string): number {
  const cropData = CROP_MOISTURE_THRESHOLDS[crop];
  if (cropData && cropData[growthStage]) {
    return cropData[growthStage];
  }
  // Baseline agronomic default for loamy-vertisol soils
  return 32;
}

export function evaluateIrrigationDecision(
  field: Field,
  currentMoisture: number,
  forecastRain48hMm: number = 0,
  currentTempCelsius: number = 28
): IrrigationRecommendation {
  const threshold = getCropThreshold(field.current_crop, field.growth_stage);
  const deficit = threshold - currentMoisture;

  let action: 'IRRIGATE NOW' | 'WAIT' | 'MONITOR' = 'WAIT';
  let priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let reason = '';
  let recommendedLiters = 0;
  let recommendedMinutes = 0;

  // 1. Natural Precipitation override: If substantial rain is forecast within 48h
  if (forecastRain48hMm >= 15.0) {
    action = 'WAIT';
    priority = 'LOW';
    reason = `Natural rainfall of ${forecastRain48hMm.toFixed(1)} mm is forecast over the next 48 hours. Irrigation deferred to conserve water and prevent root hypoxia.`;
  } else if (currentMoisture < threshold - 5.0) {
    // 2. Severe moisture deficit
    action = 'IRRIGATE NOW';
    priority = 'CRITICAL';
    const baseLitersPerAcre = 3200;
    recommendedLiters = Math.round(field.area_acres * baseLitersPerAcre * (1 + deficit / 15));
    recommendedMinutes = Math.min(240, Math.round(recommendedLiters / 80));
    reason = `Critical moisture deficit: Measured moisture (${currentMoisture.toFixed(1)}%) is severely below the ${threshold}% physiological requirement for ${field.current_crop} (${field.growth_stage}). High stress risk.`;
  } else if (currentMoisture <= threshold) {
    // 3. Moderate moisture deficit
    action = 'IRRIGATE NOW';
    priority = 'HIGH';
    const baseLitersPerAcre = 2600;
    recommendedLiters = Math.round(field.area_acres * baseLitersPerAcre);
    recommendedMinutes = Math.min(180, Math.round(recommendedLiters / 90));
    reason = `Soil moisture (${currentMoisture.toFixed(1)}%) has breached the ${threshold}% optimal trigger for ${field.current_crop}. Dry conditions ahead (${forecastRain48hMm.toFixed(1)} mm rain forecast).`;
  } else if (currentMoisture <= threshold + 4.0) {
    // 4. Monitoring zone
    action = 'MONITOR';
    priority = 'MEDIUM';
    reason = `Soil moisture (${currentMoisture.toFixed(1)}%) is approaching threshold (${threshold}%). Evaporative demand is elevated at ${currentTempCelsius.toFixed(1)}°C. Re-check in 24 hours.`;
  } else {
    // 5. Sufficient moisture
    action = 'WAIT';
    priority = 'LOW';
    reason = `Adequate moisture (${currentMoisture.toFixed(1)}%) well above minimum threshold (${threshold}%). Soil reserve is currently healthy for ${field.current_crop}.`;
  }

  return {
    field_id: field.id,
    field_name: field.field_name,
    action,
    priority,
    recommended_liters: recommendedLiters > 0 ? recommendedLiters : undefined,
    recommended_duration_minutes: recommendedMinutes > 0 ? recommendedMinutes : undefined,
    reason,
    supporting_data: {
      soil_moisture_pct: currentMoisture,
      threshold_pct: threshold,
      crop: field.current_crop,
      growth_stage: field.growth_stage,
      forecast_rain_48h_mm: forecastRain48hMm,
      temp_celsius: currentTempCelsius,
    },
    generated_timestamp: new Date().toISOString(),
    evidence_quality: 'HIGH',
  };
}
