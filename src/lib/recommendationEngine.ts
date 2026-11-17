import {
  Farm,
  Field,
  SoilObservation,
  WeatherSnapshot,
  IrrigationEvent,
  CropHealthAnalysis,
  UnifiedRecommendation,
} from '@/types';
import { evaluateIrrigationDecision } from './irrigationEngine';
import { analyzeSoilHealth } from './soilEngine';
import { BASELINE_MARKET_PRICES } from './marketEngine';

export function generateUnifiedRecommendations(params: {
  farm: Farm;
  fields: Field[];
  soilObservations: SoilObservation[];
  weather: WeatherSnapshot;
  irrigationEvents: IrrigationEvent[];
  cropHealthAnalyses: CropHealthAnalysis[];
}): UnifiedRecommendation[] {
  const { farm, fields, soilObservations, weather, irrigationEvents, cropHealthAnalyses } = params;
  const recommendations: UnifiedRecommendation[] = [];

  // 1. IRRIGATION & SOIL MOISTURE RECOMMENDATIONS PER FIELD
  fields.forEach((field) => {
    // Find latest soil observation for this field
    const fieldSoilObs = soilObservations
      .filter((s) => s.field_id === field.id)
      .sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0];

    const currentMoisture = fieldSoilObs ? fieldSoilObs.moisture_percentage : 30;

    // Calculate 48h forecasted precipitation sum
    let forecastRain48h = 0;
    if (weather.daily_forecast && weather.daily_forecast.length >= 2) {
      forecastRain48h = (weather.daily_forecast[0].precipitation_sum || 0) + (weather.daily_forecast[1].precipitation_sum || 0);
    }

    const irDec = evaluateIrrigationDecision(field, currentMoisture, forecastRain48h, weather.temperature_celsius);

    if (irDec.action === 'IRRIGATE NOW') {
      recommendations.push({
        id: `rec-irr-${field.id}-${Date.now()}`,
        farm_id: farm.id,
        field_id: field.id,
        field_name: field.field_name,
        category: 'irrigation',
        what_action: `IRRIGATE NOW: Apply ${irDec.recommended_liters ? (irDec.recommended_liters).toLocaleString('en-IN') + ' L' : 'scheduled water'} via drip irrigation`,
        why_reason: irDec.reason,
        when_timing: 'Within next 4 hours (avoid midday evaporation)',
        priority: irDec.priority,
        supporting_data: irDec.supporting_data,
        evidence_quality: irDec.evidence_quality,
        status: 'active',
        created_at: new Date().toISOString(),
      });
    } else if (irDec.action === 'MONITOR') {
      recommendations.push({
        id: `rec-mon-${field.id}-${Date.now()}`,
        farm_id: farm.id,
        field_id: field.id,
        field_name: field.field_name,
        category: 'irrigation',
        what_action: `MONITOR MOISTURE: Re-test soil probe or soil sample at 15cm depth`,
        why_reason: irDec.reason,
        when_timing: 'Tomorrow morning before 09:00 IST',
        priority: 'MEDIUM',
        supporting_data: irDec.supporting_data,
        evidence_quality: 'HIGH',
        status: 'active',
        created_at: new Date().toISOString(),
      });
    }

    // 2. SOIL NUTRIENT & PH RECOMMENDATIONS
    if (fieldSoilObs) {
      const soilReport = analyzeSoilHealth(fieldSoilObs, field.current_crop);
      if (soilReport.phStatus !== 'Optimal') {
        recommendations.push({
          id: `rec-soil-ph-${field.id}`,
          farm_id: farm.id,
          field_id: field.id,
          field_name: field.field_name,
          category: 'soil',
          what_action: `Soil Amendment: ${soilReport.phRecommendation}`,
          why_reason: `Field soil pH is measured at ${fieldSoilObs.ph.toFixed(1)} (${soilReport.phStatus}). Out of range for optimal nutrient uptake in ${field.current_crop}.`,
          when_timing: 'Prior to next fertigation cycle',
          priority: 'HIGH',
          supporting_data: { ph: fieldSoilObs.ph, status: soilReport.phStatus },
          evidence_quality: 'HIGH',
          status: 'active',
          created_at: new Date().toISOString(),
        });
      }

      if (soilReport.nitrogenStatus === 'Low') {
        recommendations.push({
          id: `rec-soil-n-${field.id}`,
          farm_id: farm.id,
          field_id: field.id,
          field_name: field.field_name,
          category: 'soil',
          what_action: `Nitrogen Replenishment: ${soilReport.nitrogenAdvice}`,
          why_reason: `Measured Nitrogen is ${fieldSoilObs.nitrogen_kg_ha} kg/ha (Deficient threshold < 180 kg/ha). Can cause leaf chlorosis and stunted growth.`,
          when_timing: 'During the upcoming weekly fertigation',
          priority: 'MEDIUM',
          supporting_data: { nitrogen_kg_ha: fieldSoilObs.nitrogen_kg_ha },
          evidence_quality: 'HIGH',
          status: 'active',
          created_at: new Date().toISOString(),
        });
      }
    }
  });

  // 3. WEATHER RISK RECOMMENDATION
  if (weather.temperature_celsius >= 34.0) {
    recommendations.push({
      id: `rec-wx-heat-${Date.now()}`,
      farm_id: farm.id,
      category: 'weather',
      what_action: 'Heat Stress Protocol: Shade nursery seedlings and suspend midday foliar spraying',
      why_reason: `Open-Meteo forecasts peak ambient temperature of ${weather.temperature_celsius}°C with relative humidity at ${weather.humidity_percentage}%. Midday spraying causes rapid droplet evaporation and leaf scorch.`,
      when_timing: 'Between 12:00 PM and 03:30 PM today',
      priority: 'HIGH',
      supporting_data: { temp: weather.temperature_celsius, humidity: weather.humidity_percentage },
      evidence_quality: 'HIGH',
      status: 'active',
      created_at: new Date().toISOString(),
    });
  }

  // 4. CROP DISEASE DETECTION FOLLOW-UPS
  const diseasedAnalyses = cropHealthAnalyses.filter((a) => !a.is_healthy && !a.is_uncertain);
  if (diseasedAnalyses.length > 0) {
    const latestDisease = diseasedAnalyses[0];
    recommendations.push({
      id: `rec-disease-${latestDisease.id}`,
      farm_id: farm.id,
      field_id: latestDisease.field_id,
      category: 'disease',
      what_action: `Targeted Disease Containment: ${latestDisease.predicted_condition} (${latestDisease.predicted_crop})`,
      why_reason: `AI vision analysis identified ${latestDisease.predicted_condition} with ${(latestDisease.confidence_score * 100).toFixed(1)}% confidence. Rapid intervention prevents secondary spread across the canopy.`,
      when_timing: 'Immediate agronomic sanitation within 24 hours',
      priority: 'CRITICAL',
      supporting_data: {
        condition: latestDisease.predicted_condition,
        confidence: latestDisease.confidence_score,
        symptoms: latestDisease.symptoms,
      },
      evidence_quality: 'HIGH',
      status: 'active',
      created_at: new Date().toISOString(),
    });
  }

  // 5. MARKET ARBITRAGE OPPORTUNITY
  const junnarTomato = BASELINE_MARKET_PRICES.find((m) => m.commodity === 'Tomato' && m.market_name.includes('Junnar'));
  const puneTomato = BASELINE_MARKET_PRICES.find((m) => m.commodity === 'Tomato' && m.market_name.includes('Pune'));

  if (junnarTomato && puneTomato && junnarTomato.modal_price_per_quintal > puneTomato.modal_price_per_quintal) {
    const diff = junnarTomato.modal_price_per_quintal - puneTomato.modal_price_per_quintal;
    recommendations.push({
      id: `rec-mkt-arb-${Date.now()}`,
      farm_id: farm.id,
      category: 'market',
      what_action: `Market Realization: Junnar (Narayangaon) Mandi offers ₹${diff}/qtl premium for Tomato`,
      why_reason: `Wholesale modal rate at Junnar APMC is ₹${junnarTomato.modal_price_per_quintal}/qtl compared to ₹${puneTomato.modal_price_per_quintal}/qtl at Pune Market Yard. Even after ₹115/qtl extra transport, net gain is ₹${diff - 115}/qtl.`,
      when_timing: 'Plan harvest dispatch for Wednesday morning arrivals',
      priority: 'MEDIUM',
      supporting_data: { junnar_price: junnarTomato.modal_price_per_quintal, pune_price: puneTomato.modal_price_per_quintal },
      evidence_quality: 'MEDIUM',
      status: 'active',
      created_at: new Date().toISOString(),
    });
  }

  return recommendations;
}
