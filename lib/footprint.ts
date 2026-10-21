import { EMISSION_FACTORS } from '../data/emissionFactors';

export type DietType = 'vegan' | 'vegetarian' | 'eggetarian' | 'moderateMeat' | 'heavyMeat';
export type LifestyleLevel = 'minimal' | 'moderate' | 'high';

export interface FootprintInputs {
  // Weekly km by mode
  kmWalkCycle: number;
  kmMetroTrain: number;
  kmBus: number;
  kmTwoWheeler: number;
  kmAuto: number;
  kmCar: number;

  // Monthly home energy
  monthlyElectricityUnits: number; // kWh
  monthlyLpgCylinders: number; // count of 14.2 kg domestic cylinders

  // Food & consumption
  diet: DietType;
  lifestyle: LifestyleLevel;
  flightsPerYear: number;
}

export interface FootprintBreakdown {
  transportKgWeek: number;
  energyKgWeek: number;
  foodKgWeek: number;
  lifestyleKgWeek: number;
  totalKgWeek: number;
  totalKgYear: number;

  biggestCategory: 'Transport' | 'Energy' | 'Food' | 'Lifestyle';
  biggestPercentage: number;
  biggestInsight: string;

  vsIndiaAvgPercent: number; // e.g. -15% or +30%
  vsParisTargetPercent: number; // vs 2,000 kg/yr target
  statusTone: 'good' | 'moderate' | 'high';
}

export const DEFAULT_FOOTPRINT_INPUTS: FootprintInputs = {
  kmWalkCycle: 6,
  kmMetroTrain: 35,
  kmBus: 15,
  kmTwoWheeler: 20,
  kmAuto: 10,
  kmCar: 0,
  monthlyElectricityUnits: 90,
  monthlyLpgCylinders: 0.5,
  diet: 'vegetarian',
  lifestyle: 'moderate',
  flightsPerYear: 1,
};

export function calculateFootprint(inputs: FootprintInputs): FootprintBreakdown {
  const { transport, energy, diet, lifestyle, aviation, benchmarks } = EMISSION_FACTORS;

  // 1. Transport (weekly kg)
  const transportKgWeek =
    inputs.kmWalkCycle * transport.walkOrCycle +
    inputs.kmMetroTrain * transport.metroOrTrain +
    inputs.kmBus * transport.bus +
    inputs.kmTwoWheeler * transport.twoWheeler +
    inputs.kmAuto * transport.autoRickshaw +
    inputs.kmCar * transport.carPetrol;

  // 2. Energy (monthly converted to weekly = / 4.33 weeks per month)
  const weeklyKwh = Math.max(0, inputs.monthlyElectricityUnits) / 4.33;
  const weeklyLpgCylinders = Math.max(0, inputs.monthlyLpgCylinders) / 4.33;
  const energyKgWeek =
    weeklyKwh * energy.gridElectricityKwh +
    weeklyLpgCylinders * energy.lpgStandardCylinderTotalKgCO2e;

  // 3. Food (daily converted to weekly = * 7)
  const dailyFoodFactor = diet[inputs.diet] || diet.vegetarian;
  const foodKgWeek = dailyFoodFactor * 7;

  // 4. Lifestyle & Aviation (weekly kg)
  const baseLifestyle = lifestyle[inputs.lifestyle] || lifestyle.moderate;
  const flightWeeklyKg = (inputs.flightsPerYear * aviation.domesticFlightPerTrip) / 52;
  const lifestyleKgWeek = baseLifestyle + flightWeeklyKg;

  // Totals
  const totalKgWeek = transportKgWeek + energyKgWeek + foodKgWeek + lifestyleKgWeek;
  const totalKgYear = totalKgWeek * 52;

  // Biggest category analysis
  const categories: { name: 'Transport' | 'Energy' | 'Food' | 'Lifestyle'; value: number }[] = [
    { name: 'Transport', value: transportKgWeek },
    { name: 'Energy', value: energyKgWeek },
    { name: 'Food', value: foodKgWeek },
    { name: 'Lifestyle', value: lifestyleKgWeek },
  ];

  categories.sort((a, b) => b.value - a.value);
  const biggest = categories[0];
  const safeTotal = totalKgWeek > 0 ? totalKgWeek : 1;
  const biggestPercentage = Math.round((biggest.value / safeTotal) * 100);

  let biggestInsight = '';
  switch (biggest.name) {
    case 'Transport':
      biggestInsight = `Transport is your primary emissions driver (${biggestPercentage}%). Shifting motorbike/car trips to metro or bus yields the biggest reduction.`;
      break;
    case 'Energy':
      biggestInsight = `Home power is your primary emissions driver (${biggestPercentage}%). Setting AC to 24°C and cutting vampire idle loads will shrink this quickly.`;
      break;
    case 'Food':
      biggestInsight = `Diet is your primary emissions driver (${biggestPercentage}%). Introducing plant-based protein days reduces agricultural emissions significantly.`;
      break;
    case 'Lifestyle':
      biggestInsight = `Goods & flights are your primary emissions driver (${biggestPercentage}%). Reducing fast fashion purchases or choosing high-speed rail cuts this sharply.`;
      break;
  }

  // Comparisons
  const vsIndiaAvgPercent = Math.round(
    ((totalKgYear - benchmarks.indiaAverageAnnualKg) / benchmarks.indiaAverageAnnualKg) * 100
  );
  const vsParisTargetPercent = Math.round(
    ((totalKgYear - benchmarks.parisGoalAnnualKg) / benchmarks.parisGoalAnnualKg) * 100
  );

  let statusTone: 'good' | 'moderate' | 'high' = 'moderate';
  if (totalKgYear <= benchmarks.parisGoalAnnualKg) {
    statusTone = 'good';
  } else if (totalKgYear <= benchmarks.indiaAverageAnnualKg * 1.5) {
    statusTone = 'moderate';
  } else {
    statusTone = 'high';
  }

  return {
    transportKgWeek: Math.round(transportKgWeek * 10) / 10,
    energyKgWeek: Math.round(energyKgWeek * 10) / 10,
    foodKgWeek: Math.round(foodKgWeek * 10) / 10,
    lifestyleKgWeek: Math.round(lifestyleKgWeek * 10) / 10,
    totalKgWeek: Math.round(totalKgWeek * 10) / 10,
    totalKgYear: Math.round(totalKgYear),
    biggestCategory: biggest.name,
    biggestPercentage,
    biggestInsight,
    vsIndiaAvgPercent,
    vsParisTargetPercent,
    statusTone,
  };
}
