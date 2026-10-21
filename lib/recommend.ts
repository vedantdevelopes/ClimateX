import { ACTION_LIBRARY, ActionDefinition } from '../data/actions';
import { RiskLevel } from './risk';

export interface ActionWithState extends ActionDefinition {
  isDone: boolean;
  completedAt?: number;
}

export interface RecommendationParams {
  heatLevel: RiskLevel;
  aqiLevel: RiskLevel;
  floodLevel: RiskLevel;
  biggestFootprintCategory: 'Transport' | 'Energy' | 'Food' | 'Lifestyle';
  recentCompletedIds: { id: string; timestamp: number }[];
}

export function recommendActions(params: RecommendationParams): {
  daily: ActionDefinition[];
  weekly: ActionDefinition[];
} {
  const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
  const recentIds = new Set(
    params.recentCompletedIds
      .filter((item) => item.timestamp > threeDaysAgo)
      .map((item) => item.id)
  );

  // Available pools excluding recently completed
  const available = ACTION_LIBRARY.filter((act) => !recentIds.has(act.id));
  const fallbackPool = available.length > 8 ? available : ACTION_LIBRARY;

  const dailyPool = fallbackPool.filter((a) => a.timeframe === 'daily');
  const weeklyPool = fallbackPool.filter((a) => a.timeframe === 'weekly');

  const selectedDaily: ActionDefinition[] = [];
  const selectedWeekly: ActionDefinition[] = [];

  // 1. RISK-DRIVEN DAILY ACTION
  // Priority: if Heat is High/Severe, pick heat; else if AQI is High/Severe, pick aqi; else if Flood is High/Severe, pick flood
  let riskCandidate: ActionDefinition | undefined;

  if (params.heatLevel === 'High' || params.heatLevel === 'Severe') {
    riskCandidate = dailyPool.find((a) => a.category === 'heat');
  } else if (params.aqiLevel === 'High' || params.aqiLevel === 'Severe') {
    riskCandidate = dailyPool.find((a) => a.category === 'aqi');
  } else if (params.floodLevel === 'High' || params.floodLevel === 'Severe') {
    riskCandidate = dailyPool.find((a) => a.category === 'flood');
  } else if (params.heatLevel === 'Moderate') {
    riskCandidate = dailyPool.find((a) => a.category === 'heat');
  } else if (params.aqiLevel === 'Moderate') {
    riskCandidate = dailyPool.find((a) => a.category === 'aqi');
  }

  if (riskCandidate) {
    selectedDaily.push(riskCandidate);
  }

  // 2. FOOTPRINT-DRIVEN DAILY ACTION
  const categoryMap: Record<string, 'transport' | 'energy' | 'food' | 'lifestyle'> = {
    Transport: 'transport',
    Energy: 'energy',
    Food: 'food',
    Lifestyle: 'lifestyle',
  };
  const targetCategory = categoryMap[params.biggestFootprintCategory] || 'transport';

  const footprintDaily = dailyPool.find(
    (a) => a.category === targetCategory && !selectedDaily.some((s) => s.id === a.id)
  );
  if (footprintDaily) {
    selectedDaily.push(footprintDaily);
  }

  // Fill up to 3 daily actions
  for (const act of dailyPool) {
    if (selectedDaily.length >= 3) break;
    if (!selectedDaily.some((s) => s.id === act.id)) {
      selectedDaily.push(act);
    }
  }

  // 3. WEEKLY ACTIONS (1 footprint, 1 resilience/maintenance, 1 systemic)
  const footprintWeekly = weeklyPool.find((a) => a.category === targetCategory);
  if (footprintWeekly) {
    selectedWeekly.push(footprintWeekly);
  }

  // Resilience / risk weekly
  const resilienceWeekly = weeklyPool.find(
    (a) =>
      (a.category === 'heat' || a.category === 'flood' || a.category === 'aqi') &&
      !selectedWeekly.some((s) => s.id === a.id)
  );
  if (resilienceWeekly) {
    selectedWeekly.push(resilienceWeekly);
  }

  // Fill up to 3 weekly actions
  for (const act of weeklyPool) {
    if (selectedWeekly.length >= 3) break;
    if (!selectedWeekly.some((s) => s.id === act.id)) {
      selectedWeekly.push(act);
    }
  }

  return {
    daily: selectedDaily.slice(0, 3),
    weekly: selectedWeekly.slice(0, 3),
  };
}
