import {
  calculateHeatScore,
  calculateAqiScore,
  calculateFloodScore,
  calculateOverallRisk,
  ComprehensiveRiskResult,
  DayForecast,
  getRiskLevelAndColor,
} from './risk';

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  country: string;
}

/**
 * Validates and clamps geographical coordinates to safe bounds to prevent malformed queries.
 */
function sanitizeCoordinate(coord: number, min: number, max: number, defaultVal: number): number {
  if (typeof coord !== 'number' || !Number.isFinite(coord) || isNaN(coord)) {
    return defaultVal;
  }
  return Math.max(min, Math.min(max, coord));
}

/**
 * Robust fetch with timeout to prevent hung promises or memory denial of service.
 */
async function fetchWithTimeout(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

export async function searchCities(query: string): Promise<GeocodedCity[]> {
  if (!query || typeof query !== 'string') return [];
  // Strip control characters and sanitize query
  const sanitized = query.replace(/[^\w\s,.-]/gi, '').slice(0, 80).trim();
  if (sanitized.length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      sanitized
    )}&count=6&language=en&format=json`;
    const res = await fetchWithTimeout(url, 6000);
    if (!res.ok) throw new Error(`Geocoding HTTP error ${res.status}`);
    const data = await res.json();
    return Array.isArray(data?.results) ? data.results : [];
  } catch (error) {
    console.warn('[OpenMeteo] City search failed:', error);
    return [];
  }
}

export async function fetchClimateRiskData(
  latitude: number,
  longitude: number,
  cityName: string
): Promise<ComprehensiveRiskResult> {
  // Validate coordinates to safe latitude [-90, 90] and longitude [-180, 180]
  const safeLat = sanitizeCoordinate(latitude, -90, 90, 17.385);
  const safeLon = sanitizeCoordinate(longitude, -180, 180, 78.4867);
  const safeCity = (cityName || 'Hyderabad, India').slice(0, 100);

  // Parallel fetch: Forecast, Air Quality, Flood (Flood can gracefully fail)
  const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${safeLat}&longitude=${safeLon}&daily=apparent_temperature_max,precipitation_sum&timezone=auto&forecast_days=4`;
  const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${safeLat}&longitude=${safeLon}&current=us_aqi,pm2_5&timezone=auto`;
  const floodUrl = `https://flood-api.open-meteo.com/v1/flood?latitude=${safeLat}&longitude=${safeLon}&daily=river_discharge&forecast_days=7`;

  let forecastData: any = null;
  let aqiData: any = null;
  let floodData: any = null;

  try {
    const [forecastRes, aqiRes, floodRes] = await Promise.allSettled([
      fetchWithTimeout(forecastUrl, 8000),
      fetchWithTimeout(aqiUrl, 8000),
      fetchWithTimeout(floodUrl, 8000),
    ]);

    if (forecastRes.status === 'fulfilled' && forecastRes.value.ok) {
      forecastData = await forecastRes.value.json();
    }
    if (aqiRes.status === 'fulfilled' && aqiRes.value.ok) {
      aqiData = await aqiRes.value.json();
    }
    if (floodRes.status === 'fulfilled' && floodRes.value.ok) {
      floodData = await floodRes.value.json();
    }
  } catch (err) {
    console.warn('[OpenMeteo] Error during parallel fetch:', err);
  }

  // 1. Process Heat
  const apparentTempMaxToday =
    typeof forecastData?.daily?.apparent_temperature_max?.[0] === 'number'
      ? forecastData.daily.apparent_temperature_max[0]
      : 32.0;
  const heatScore = calculateHeatScore(apparentTempMaxToday);

  // 2. Process AQI
  const currentUsAqi = typeof aqiData?.current?.us_aqi === 'number' ? aqiData.current.us_aqi : 95;
  const currentPm25 = typeof aqiData?.current?.pm2_5 === 'number' ? aqiData.current.pm2_5 : 35;
  const aqiScore = calculateAqiScore(currentUsAqi, currentPm25);

  // 3. Process Flood
  const precipDaily = Array.isArray(forecastData?.daily?.precipitation_sum)
    ? forecastData.daily.precipitation_sum
    : [0, 0, 0];
  const next3DaysPrecip = (precipDaily[0] || 0) + (precipDaily[1] || 0) + (precipDaily[2] || 0);

  let riverRatio: number | undefined = undefined;
  if (floodData?.daily?.river_discharge && Array.isArray(floodData.daily.river_discharge)) {
    const discharges = floodData.daily.river_discharge.filter((v: any) => typeof v === 'number');
    if (discharges.length > 0) {
      const todayDischarge = discharges[0] || 1;
      const sorted = [...discharges].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] || 1;
      riverRatio = median > 0 ? todayDischarge / median : 1;
    }
  }
  const floodScore = calculateFloodScore(next3DaysPrecip, riverRatio);

  // 4. Overall score
  const overall = calculateOverallRisk(heatScore.score, aqiScore.score, floodScore.score);

  // 5. 3-day outlook
  const threeDayOutlook: DayForecast[] = [];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 1; i <= 3; i++) {
    const dateStr = forecastData?.daily?.time?.[i];
    const dateObj = dateStr ? new Date(dateStr) : new Date(Date.now() + i * 86400000);
    const dayName = daysOfWeek[dateObj.getDay()];
    const tempMax =
      typeof forecastData?.daily?.apparent_temperature_max?.[i] === 'number'
        ? forecastData.daily.apparent_temperature_max[i]
        : apparentTempMaxToday;
    const precip =
      typeof forecastData?.daily?.precipitation_sum?.[i] === 'number'
        ? forecastData.daily.precipitation_sum[i]
        : 0;

    const dayHeat = calculateHeatScore(tempMax).score;
    const dayFlood = calculateFloodScore(precip).score;
    const dayBlended = calculateOverallRisk(dayHeat, aqiScore.score, dayFlood);

    threeDayOutlook.push({
      date: dateStr || dateObj.toISOString().split('T')[0],
      dayName,
      apparentTempMax: tempMax,
      precipitationSum: precip,
      overallScore: dayBlended.overallScore,
      level: dayBlended.overallLevel,
    });
  }

  return {
    overallScore: overall.overallScore,
    overallLevel: overall.overallLevel,
    overallColor: overall.overallColor,
    heat: heatScore,
    aqi: aqiScore,
    flood: floodScore,
    threeDayOutlook,
    timestamp: Date.now(),
    locationName: safeCity,
  };
}

/**
 * Fallback risk data when offline and no cache is present.
 */
export function getMockFallbackRiskData(cityName = 'Hyderabad, India'): ComprehensiveRiskResult {
  const heat = calculateHeatScore(34.5);
  const aqi = calculateAqiScore(112, 42);
  const flood = calculateFloodScore(18);
  const overall = calculateOverallRisk(heat.score, aqi.score, flood.score);

  return {
    overallScore: overall.overallScore,
    overallLevel: overall.overallLevel,
    overallColor: overall.overallColor,
    heat,
    aqi,
    flood,
    threeDayOutlook: [
      {
        date: '2026-10-22',
        dayName: 'Thu',
        apparentTempMax: 35,
        precipitationSum: 4,
        overallScore: 48,
        level: 'Moderate',
      },
      {
        date: '2026-10-23',
        dayName: 'Fri',
        apparentTempMax: 36,
        precipitationSum: 12,
        overallScore: 54,
        level: 'Moderate',
      },
      {
        date: '2026-10-24',
        dayName: 'Sat',
        apparentTempMax: 33,
        precipitationSum: 28,
        overallScore: 62,
        level: 'High',
      },
    ],
    timestamp: Date.now(),
    locationName: cityName,
  };
}
