import { colors } from '../theme/tokens';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface SingleRiskScore {
  score: number; // 0 - 100
  level: RiskLevel;
  color: string;
  rawValue: string;
  explanation: string;
  tip: string;
}

export interface DayForecast {
  date: string;
  dayName: string;
  apparentTempMax: number;
  precipitationSum: number;
  overallScore: number;
  level: RiskLevel;
}

export interface ComprehensiveRiskResult {
  overallScore: number; // 0 - 100
  overallLevel: RiskLevel;
  overallColor: string;
  heat: SingleRiskScore;
  aqi: SingleRiskScore;
  flood: SingleRiskScore;
  threeDayOutlook: DayForecast[];
  timestamp: number;
  locationName: string;
}

/**
 * Maps risk score 0-100 to RiskLevel and color token.
 */
export function getRiskLevelAndColor(score: number): { level: RiskLevel; color: string } {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  if (clamped < 30) {
    return { level: 'Low', color: colors.ok };
  } else if (clamped < 60) {
    return { level: 'Moderate', color: colors.warn };
  } else if (clamped < 80) {
    return { level: 'High', color: colors.danger };
  } else {
    return { level: 'Severe', color: colors.danger };
  }
}

/**
 * Heat Score calculation:
 * <=30°C -> 0–20
 * 30–35°C -> 20–50
 * 35–41°C -> 50–80
 * >=41°C -> 80–100 (cap 45°C = 100)
 */
export function calculateHeatScore(apparentTempMax: number): SingleRiskScore {
  let score = 0;
  if (apparentTempMax <= 20) {
    score = 5;
  } else if (apparentTempMax <= 30) {
    // 20 - 30 deg -> 5 - 20
    score = 5 + ((apparentTempMax - 20) / 10) * 15;
  } else if (apparentTempMax <= 35) {
    // 30 - 35 deg -> 20 - 50
    score = 20 + ((apparentTempMax - 30) / 5) * 30;
  } else if (apparentTempMax <= 41) {
    // 35 - 41 deg -> 50 - 80
    score = 50 + ((apparentTempMax - 35) / 6) * 30;
  } else {
    // 41 - 45 deg -> 80 - 100
    const ratio = Math.min(1, (apparentTempMax - 41) / 4);
    score = 80 + ratio * 20;
  }

  const rounded = Math.max(0, Math.min(100, Math.round(score)));
  const { level, color } = getRiskLevelAndColor(rounded);

  let explanation = 'Comfortable thermal index without heat exhaustion risk.';
  let tip = 'Great conditions for cycling and outdoor campus activities.';

  if (level === 'Moderate') {
    explanation = `Feels like ${Math.round(apparentTempMax)}°C. Mild thermal stress during direct midday sun.`;
    tip = 'Hydrate before leaving campus and seek tree canopy shade.';
  } else if (level === 'High') {
    explanation = `Intense heat index of ${Math.round(apparentTempMax)}°C. High risk of dehydration and cramps.`;
    tip = 'Avoid outdoor exertion between 12–4 PM; carry electrolyte water.';
  } else if (level === 'Severe') {
    explanation = `Dangerous heatwave condition (${Math.round(apparentTempMax)}°C). Severe risk of heat stroke.`;
    tip = 'Stay indoors with cooling; check on vulnerable neighbours.';
  }

  return {
    score: rounded,
    level,
    color,
    rawValue: `${Math.round(apparentTempMax)}°C`,
    explanation,
    tip,
  };
}

/**
 * AQI Score calculation:
 * US AQI 0–500 mapped to 0–100 (cap at 300 = 100)
 */
export function calculateAqiScore(usAqi: number, pm25?: number): SingleRiskScore {
  const safeAqi = Math.max(0, usAqi);
  const score = Math.min(100, Math.round((safeAqi / 300) * 100));
  const { level, color } = getRiskLevelAndColor(score);

  const pmText = pm25 !== undefined ? ` (PM2.5: ${Math.round(pm25)} µg/m³)` : '';

  let explanation = `Air quality is satisfactory with minimal health risk${pmText}.`;
  let tip = 'Ideal window for outdoor exercise and cross-ventilation.';

  if (level === 'Moderate') {
    explanation = `Moderate air pollution${pmText}. Sensitive individuals may feel throat irritation.`;
    tip = 'Sensitive individuals should limit prolonged heavy outdoor exertion.';
  } else if (level === 'High') {
    explanation = `Unhealthy air quality index (${safeAqi})${pmText}. Elevated particulate hazard.`;
    tip = 'Wear an N95 respirator for roadside commutes; move workouts indoors.';
  } else if (level === 'Severe') {
    explanation = `Hazardous smog inversion (${safeAqi})${pmText}. Severe respiratory and cardiovascular danger.`;
    tip = 'Keep windows shut; run air filtration; avoid all outdoor workouts.';
  }

  return {
    score,
    level,
    color,
    rawValue: `AQI ${safeAqi}`,
    explanation,
    tip,
  };
}

/**
 * Flood Score calculation:
 * 0.6 * (next-3-day precipitation sum scaled 0-100mm -> 0-100)
 * + 0.4 * (river discharge vs recent median ratio scaled 1x -> 0, >=3x -> 100)
 * If river discharge is unavailable, use precipitation scaled directly.
 */
export function calculateFloodScore(
  next3DaysPrecipSumMm: number,
  riverDischargeRatio?: number
): SingleRiskScore {
  const precipScaled = Math.min(100, Math.max(0, (next3DaysPrecipSumMm / 100) * 100));

  let score = precipScaled;
  if (riverDischargeRatio !== undefined && !isNaN(riverDischargeRatio)) {
    const dischargeScaled = Math.min(100, Math.max(0, ((riverDischargeRatio - 1) / 2) * 100));
    score = 0.6 * precipScaled + 0.4 * dischargeScaled;
  }

  const rounded = Math.max(0, Math.min(100, Math.round(score)));
  const { level, color } = getRiskLevelAndColor(rounded);

  let explanation = `Forecast rain is light (${Math.round(next3DaysPrecipSumMm)} mm/3d). Storm drains have ample headroom.`;
  let tip = 'Normal transit routes are safe and unhindered.';

  if (level === 'Moderate') {
    explanation = `Substantial rainfall forecast (${Math.round(next3DaysPrecipSumMm)} mm/3d). Localized puddle buildup expected.`;
    tip = 'Keep rain gear ready; clear building drain grates of plastic debris.';
  } else if (level === 'High') {
    explanation = `Heavy precipitation (${Math.round(next3DaysPrecipSumMm)} mm/3d). High risk of road waterlogging & underpass stalls.`;
    tip = 'Avoid low-lying underpasses; charge phones & backup power banks.';
  } else if (level === 'Severe') {
    explanation = `Extreme deluge (${Math.round(next3DaysPrecipSumMm)} mm/3d). Severe flash flood and urban inundation hazard.`;
    tip = 'Elevate electronics & valuables; avoid all non-essential road travel.';
  }

  return {
    score: rounded,
    level,
    color,
    rawValue: `${Math.round(next3DaysPrecipSumMm)} mm`,
    explanation,
    tip,
  };
}

/**
 * Blended overall risk score:
 * weighted max-leaning blend: 0.5 * max + 0.5 * mean of (heat, aqi, flood)
 */
export function calculateOverallRisk(
  heatScore: number,
  aqiScore: number,
  floodScore: number
): { overallScore: number; overallLevel: RiskLevel; overallColor: string } {
  const max = Math.max(heatScore, aqiScore, floodScore);
  const mean = (heatScore + aqiScore + floodScore) / 3;
  const blended = Math.round(0.5 * max + 0.5 * mean);
  const clamped = Math.max(0, Math.min(100, blended));
  const { level, color } = getRiskLevelAndColor(clamped);

  return {
    overallScore: clamped,
    overallLevel: level,
    overallColor: color,
  };
}
