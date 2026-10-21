/**
 * Emission factors (approximate, based on IPCC / DEFRA / CEA India grid values).
 * All calculations produce estimates labeled as such in the UI.
 */
export const EMISSION_FACTORS = {
  // Transport (kg CO2e per passenger km)
  transport: {
    walkOrCycle: 0.0,
    metroOrTrain: 0.04,
    bus: 0.09,
    twoWheeler: 0.10,
    autoRickshaw: 0.11,
    carPetrol: 0.17,
    carDiesel: 0.19,
    carElectric: 0.07, // factoring India grid emission factor
  },

  // Energy
  energy: {
    gridElectricityKwh: 0.70, // CEA India CO2 baseline ~0.70 - 0.72 kg CO2e / kWh
    lpgCylinderKg: 2.98, // kg CO2e per kg LPG (standard Indian domestic cylinder is 14.2 kg)
    lpgStandardCylinderTotalKgCO2e: 42.3, // 14.2 kg * 2.98
  },

  // Food (kg CO2e per day)
  diet: {
    vegan: 2.2,
    vegetarian: 3.2,
    eggetarian: 3.8,
    moderateMeat: 5.4,
    heavyMeat: 7.2,
  },

  // Lifestyle / Shopping & Goods (kg CO2e per week)
  lifestyle: {
    minimal: 4.0,   // mindful consumer, repairs, thrifting
    moderate: 14.0, // average urban student/young adult
    high: 30.0,     // frequent fast-fashion, gadgets, packaging waste
  },

  // Flights (kg CO2e per one-way domestic trip ~ 2h)
  aviation: {
    domesticFlightPerTrip: 180.0,
  },

  // Benchmarks (kg CO2e per year & week)
  benchmarks: {
    indiaAverageAnnualKg: 1900,
    indiaAverageWeeklyKg: 36.5,
    parisGoalAnnualKg: 2000, // 2 metric tons / year target per capita
    parisGoalWeeklyKg: 38.4,
    worldAverageAnnualKg: 4700,
  },
};
