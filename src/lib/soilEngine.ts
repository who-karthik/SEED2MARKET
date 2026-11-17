import { SoilObservation } from '@/types';

export type NutrientStatus = 'Low' | 'Medium' | 'High' | 'Excess';

export type SoilAnalysisReport = {
  phStatus: 'Acidic' | 'Optimal' | 'Alkaline';
  phRecommendation: string;
  nitrogenStatus: NutrientStatus;
  nitrogenAdvice: string;
  phosphorusStatus: NutrientStatus;
  phosphorusAdvice: string;
  potassiumStatus: NutrientStatus;
  potassiumAdvice: string;
  organicCarbonStatus: 'Low' | 'Moderate' | 'Adequate';
  overallCondition: 'Excellent' | 'Good' | 'Needs Attention' | 'Degraded';
  summary: string;
};

// Benchmark reference standards for Western Maharashtra Agro-Climatic Zone (Vertisols & Inceptisols)
export function analyzeSoilHealth(obs: Partial<SoilObservation>, cropName?: string): SoilAnalysisReport {
  const ph = obs.ph ?? 7.0;
  const n = obs.nitrogen_kg_ha ?? 200;
  const p = obs.phosphorus_kg_ha ?? 35;
  const k = obs.potassium_kg_ha ?? 250;
  const oc = obs.organic_carbon_percentage ?? 0.55;

  // 1. pH evaluation
  let phStatus: 'Acidic' | 'Optimal' | 'Alkaline' = 'Optimal';
  let phRecommendation = 'Soil pH is well within the favorable 6.2 - 7.5 range for major cash crops.';
  if (ph < 6.0) {
    phStatus = 'Acidic';
    phRecommendation = 'Soil is moderately acidic. Consider applying agricultural lime (calcium carbonate) or dolomite to increase soil buffer capacity.';
  } else if (ph > 7.8) {
    phStatus = 'Alkaline';
    phRecommendation = 'Soil tends toward calcareous alkalinity. Apply agricultural gypsum (calcium sulphate) and incorporate organic farmyard manure to moderate pH.';
  }

  // 2. Nitrogen evaluation (kg/ha)
  let nitrogenStatus: NutrientStatus = 'Medium';
  let nitrogenAdvice = 'Available Nitrogen is within standard agronomic maintenance levels.';
  if (n < 180) {
    nitrogenStatus = 'Low';
    nitrogenAdvice = 'Nitrogen deficit detected. Top-dress with well-decomposed FYM, neem-coated urea, or biofertilizers (Azotobacter/Rhizobium).';
  } else if (n > 320) {
    nitrogenStatus = 'High';
    nitrogenAdvice = 'High Nitrogen reserve. Curtail excess urea application to prevent succulent foliage and fungal vulnerability.';
  }

  // 3. Phosphorus evaluation (kg/ha)
  let phosphorusStatus: NutrientStatus = 'Medium';
  let phosphorusAdvice = 'Phosphorus is sufficient for root anchoring and vigorous energy transfer.';
  if (p < 25) {
    phosphorusStatus = 'Low';
    phosphorusAdvice = 'Low available Phosphorus. Incorporate single superphosphate (SSP) or rock phosphate with PSB (phosphate solubilizing bacteria).';
  } else if (p > 55) {
    phosphorusStatus = 'High';
    phosphorusAdvice = 'High Phosphorus saturation. Reduce basal phosphate applications to avoid trace-element lockout (zinc/iron).';
  }

  // 4. Potassium evaluation (kg/ha)
  let potassiumStatus: NutrientStatus = 'Medium';
  let potassiumAdvice = 'Potassium level is optimal, supporting drought tolerance and fruit firmness.';
  if (k < 180) {
    potassiumStatus = 'Low';
    potassiumAdvice = 'Potassium level is below crop requirement. Apply muriate of potash (MOP) or sulphate of potash (SOP).';
  } else if (k > 350) {
    potassiumStatus = 'High';
    potassiumAdvice = 'High Potassium buffer typical of Maharashtra basaltic vertisols. Minimal supplementary potash needed.';
  }

  // 5. Organic Carbon evaluation (%)
  let organicCarbonStatus: 'Low' | 'Moderate' | 'Adequate' = 'Moderate';
  if (oc < 0.50) {
    organicCarbonStatus = 'Low';
  } else if (oc >= 0.70) {
    organicCarbonStatus = 'Adequate';
  }

  // 6. Overall condition
  let overallCondition: 'Excellent' | 'Good' | 'Needs Attention' | 'Degraded' = 'Good';
  if (phStatus === 'Optimal' && nitrogenStatus !== 'Low' && phosphorusStatus !== 'Low' && organicCarbonStatus !== 'Low') {
    overallCondition = 'Excellent';
  } else if (phStatus !== 'Optimal' && (nitrogenStatus === 'Low' || organicCarbonStatus === 'Low')) {
    overallCondition = 'Needs Attention';
  }

  const summary = `Soil is evaluated as ${overallCondition}. pH: ${ph.toFixed(1)} (${phStatus}), N: ${n} kg/ha (${nitrogenStatus}), P: ${p} kg/ha (${phosphorusStatus}), K: ${k} kg/ha (${potassiumStatus}), Organic Carbon: ${oc}% (${organicCarbonStatus}).`;

  return {
    phStatus,
    phRecommendation,
    nitrogenStatus,
    nitrogenAdvice,
    phosphorusStatus,
    phosphorusAdvice,
    potassiumStatus,
    potassiumAdvice,
    organicCarbonStatus,
    overallCondition,
    summary,
  };
}
