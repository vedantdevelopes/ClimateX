export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ModuleCard {
  title: string;
  subtitle: string;
  body: string;
  stat?: {
    value: string;
    label: string;
  };
  keyTakeaway: string;
}

export interface LearningModule {
  id: string;
  title: string;
  tagline: string;
  readTimeMinutes: number;
  sdgGoal: number;
  xpReward: number;
  badgeId: string;
  cards: ModuleCard[];
  quiz: QuizQuestion[];
}

export const MODULES: LearningModule[] = [
  {
    id: 'heatwaves',
    title: 'Heatwaves & Staying Safe',
    tagline: 'Surviving extreme wet-bulb temperatures and urban heat islands in India.',
    readTimeMinutes: 3,
    sdgGoal: 13,
    xpReward: 30,
    badgeId: 'heat_smart',
    cards: [
      {
        title: 'The Wet-Bulb Danger',
        subtitle: 'Why humidity makes heat fatal',
        body: 'Human bodies cool down by evaporating sweat. When air temperature exceeds 35°C alongside high relative humidity (known as high wet-bulb temperature), sweat cannot evaporate. Internal core body temperature rises rapidly to dangerous levels.',
        stat: { value: '35°C', label: 'Wet-bulb limit of human thermal tolerance' },
        keyTakeaway: 'Humidity prevents sweat evaporation, turning normal heat into a medical emergency.',
      },
      {
        title: 'Concrete Heat Traps',
        subtitle: 'Urban Heat Island (UHI) Effect',
        body: 'Dense concrete roads, glass buildings, and asphalt trap solar radiation all day and radiate heat long into the night. Indian cities can be 4°C to 8°C hotter than surrounding rural green spaces.',
        stat: { value: '+6°C', label: 'Average night temperature spike in Indian metros' },
        keyTakeaway: 'City concrete retains heat overnight, depriving bodies of biological cooling recovery.',
      },
      {
        title: 'The Golden Hours Rule',
        subtitle: 'Managing your physical exposure',
        body: 'Direct solar radiation peaks between 12:00 PM and 4:00 PM. Schedule your commutes, athletic routines, and heavy errands before 10:00 AM or after 5:30 PM. Wear loose, light-coloured cotton fabrics.',
        stat: { value: '12-4 PM', label: 'Danger window for peak solar radiation' },
        keyTakeaway: 'Rescheduling peak outdoor activity cuts heat stroke incidence by over 70%.',
      },
      {
        title: 'Hydration & Electrolytes',
        subtitle: 'Water alone is not enough',
        body: 'Heavy perspiration depletes essential sodium and potassium. Drinking plain water without salt can cause water intoxication and muscle cramps. Drink ORS, nimbu pani with rock salt, coconut water, or chaas regularly.',
        stat: { value: '3-4 L', label: 'Daily fluid intake needed during heat alerts' },
        keyTakeaway: 'Add electrolytes to plain water to prevent circulatory collapse.',
      },
    ],
    quiz: [
      {
        question: 'Why is high humidity dangerous during a heatwave?',
        options: [
          'It makes the sky cloudy',
          'It stops sweat from evaporating and cooling the body',
          'It causes lightning storms',
          'It lowers your heart rate too fast',
        ],
        correctIndex: 1,
        explanation: 'Sweat evaporation is the body\'s main cooling mechanism. In saturated air, sweat cannot evaporate.',
      },
      {
        question: 'What is an Urban Heat Island primarily caused by?',
        options: [
          'More air conditioners running',
          'Dense concrete and asphalt trapping and re-radiating heat',
          'Too many streetlights',
          'Ocean breezes',
        ],
        correctIndex: 1,
        explanation: 'Concrete, tar and brick have high thermal mass, retaining heat and re-radiating it overnight.',
      },
      {
        question: 'Which fluid best prevents heat-induced cramps during heavy sweating?',
        options: [
          'Carbonated cold soda',
          'Plain chilled tap water',
          'Nimbu pani or ORS with salt and electrolytes',
          'Hot black coffee',
        ],
        correctIndex: 2,
        explanation: 'Electrolyte replenishment (sodium, potassium) is critical to balance water loss from heavy sweat.',
      },
    ],
  },

  {
    id: 'floods',
    title: 'Floods & Urban Drainage',
    tagline: 'Why modern Indian cities drown every monsoon and how to prepare.',
    readTimeMinutes: 3,
    sdgGoal: 11,
    xpReward: 30,
    badgeId: 'flood_ready',
    cards: [
      {
        title: 'Paving Over Nature',
        subtitle: 'Loss of natural retention basins',
        body: 'Historically, cities like Bengaluru, Chennai and Hyderabad possessed interconnected chains of lakes and wetlands that absorbed monsoon runoffs. Unchecked real estate development has concreted over natural floodplains.',
        stat: { value: '80%', label: 'Reduction in urban wetland sponge capacity' },
        keyTakeaway: 'Concreted soil forces 90% of rain into surface runoff instead of groundwater infiltration.',
      },
      {
        title: 'The Plastic Choke',
        subtitle: 'Solid waste meets storm drains',
        body: 'Even modern storm water drains fail when single-use plastic wrappers, thermocol, and construction debris clog culverts and underground grates. Water backs up within 20 minutes of heavy cloudbursts.',
        stat: { value: '< 30 min', label: 'Time for choked drains to flood arterial roads' },
        keyTakeaway: 'Uncollected plastic turns moderate rainfall into catastrophic street inundation.',
      },
      {
        title: 'Underpass Traps',
        subtitle: 'The deadly illusion of water depth',
        body: 'Never drive or ride a two-wheeler into waterlogged underpasses. Just 30 cm (1 foot) of moving water can float a car, and 15 cm can sweep away a pedestrian or stall an engine intake valve.',
        stat: { value: '30 cm', label: 'Water depth required to float and stall an automobile' },
        keyTakeaway: 'Turn around, do not drown. Avoid underpasses and submerged arterial roads.',
      },
      {
        title: 'Personal Deluge Readiness',
        subtitle: 'What to keep ready before the rain hits',
        body: 'Keep an emergency power bank charged. Store identification papers and prescription medicine in sealed ziplock bags above floor level. Disconnect ground-level surge protectors during rising floodwaters.',
        stat: { value: '100%', label: 'Preparedness needed for localized monsoon outages' },
        keyTakeaway: 'Keep essentials elevated and charged before heavy precipitation warnings.',
      },
    ],
    quiz: [
      {
        question: 'What depth of flowing floodwater is sufficient to float most standard cars?',
        options: [
          'Over 2 metres',
          'Approximately 30 cm (1 foot)',
          '5 metres',
          'Only ocean water can float cars',
        ],
        correctIndex: 1,
        explanation: 'Only 30 cm of water exerts tremendous buoyant force, easily lifting vehicles and causing total loss of control.',
      },
      {
        question: 'Why do urban areas flood faster than rural countryside with the same rainfall?',
        options: [
          'Cities receive twice as much rain',
          'Impermeable concrete prevents rainwater from soaking into the ground',
          'Cities are always built inside canyons',
          'Rivers flow faster through buildings',
        ],
        correctIndex: 1,
        explanation: 'Impervious concrete surfaces block infiltration, converting up to 90% of rainfall into instant surface runoff.',
      },
      {
        question: 'What is the most effective immediate action if your building drain begins overflowing?',
        options: [
          'Wash clothes immediately',
          'Clear trapped plastic bags and debris from the drain grate carefully',
          'Pour chemical bleach into the puddle',
          'Turn on the garden hose',
        ],
        correctIndex: 1,
        explanation: 'Clearing surface plastic and leaves from grates restores flow capacity before water backs up indoors.',
      },
    ],
  },

  {
    id: 'air_quality',
    title: 'Air Quality & Your Lungs',
    tagline: 'Understanding PM2.5, inversion layers, and protecting your respiratory health.',
    readTimeMinutes: 3,
    sdgGoal: 3,
    xpReward: 30,
    badgeId: 'clean_air_champion',
    cards: [
      {
        title: 'The Microscopic Invader',
        subtitle: 'What is PM2.5?',
        body: 'Particulate Matter 2.5 refers to microscopic particles less than 2.5 micrometres wide—about 30 times thinner than a human hair. Because they are tiny, they bypass nasal hairs and penetrate directly into lung alveoli and the bloodstream.',
        stat: { value: '2.5 µm', label: 'Particle diameter entering bloodstream' },
        keyTakeaway: 'PM2.5 particles enter your blood vessels, driving inflammation and cardiovascular strain.',
      },
      {
        title: 'Winter Inversion Trap',
        subtitle: 'Why pollution spikes in November–January',
        body: 'During winter nights, the ground cools rapidly, cooling the air immediately above it. A warm layer of air forms on top, acting like a lid that traps vehicular exhaust and dust close to the ground where we breathe.',
        stat: { value: '5-10x', label: 'Pollutant concentration rise during thermal inversions' },
        keyTakeaway: 'Cold air lids lock pollutants at street level, making winter smog severely hazardous.',
      },
      {
        title: 'Cloth vs Surgical vs N95',
        subtitle: 'Mask efficacy breakdown',
        body: 'Cloth bandanas and loose surgical masks only filter large dust particles and seal poorly. Only well-fitted N95 or FFP2 respirators with electrostatically charged meltblown fabric filter out 95% of sub-micron particles.',
        stat: { value: '95%', label: 'Filtration efficiency of genuine N95 respirators' },
        keyTakeaway: 'Only sealed N95 or FFP2 masks shield lungs against PM2.5 combustion exhaust.',
      },
      {
        title: 'Indoor Air Quality Strategy',
        subtitle: 'Creating clean breathing zones',
        body: 'Keep windows shut during peak morning traffic and temperature inversions. Ventilate in early afternoons when the sun disperses trapped smog. Avoid indoor incense (agarbatti) and mosquito coils, which emit extreme PM2.5 in closed rooms.',
        stat: { value: '1 Coil = 100 Cigarettes', label: 'Relative particulate emission of one mosquito coil' },
        keyTakeaway: 'Burning incense or mosquito coils indoors creates hazardous particulate concentrations.',
      },
    ],
    quiz: [
      {
        question: 'Why is PM2.5 more dangerous to health than larger dust particles?',
        options: [
          'It smells worse',
          'It is small enough to enter deep lung tissue and cross into the bloodstream',
          'It is radioactive',
          'It only affects skin',
        ],
        correctIndex: 1,
        explanation: 'PM2.5 escapes upper respiratory defenses, traveling into deep alveoli and triggering systemic inflammation.',
      },
      {
        question: 'Which mask provides certified protection against fine particulate air pollution?',
        options: [
          'Handkerchief or cotton bandana',
          'Loose blue surgical mask',
          'Tight-fitting N95 or FFP2 respirator',
          'Silk scarf',
        ],
        correctIndex: 2,
        explanation: 'Only certified N95/FFP2 masks feature electrostatic fibers capable of capturing sub-micron aerosol particles.',
      },
      {
        question: 'What is a common source of heavy indoor air pollution in Indian homes?',
        options: [
          'Water purifiers',
          'Ceiling fans running on high',
          'Burning incense sticks (agarbatti) and mosquito coils in closed rooms',
          'Refrigerator cooling coils',
        ],
        correctIndex: 2,
        explanation: 'Burning biomass, coils, and scented incense inside unventilated rooms produces extreme concentrations of indoor PM2.5.',
      },
    ],
  },

  {
    id: 'carbon_footprint',
    title: 'Carbon Footprint Basics',
    tagline: 'Deciphering greenhouse gases, CO2 equivalents, and the 2-tonne annual target.',
    readTimeMinutes: 3,
    sdgGoal: 13,
    xpReward: 30,
    badgeId: 'footprint_mapper',
    cards: [
      {
        title: 'What is CO₂e?',
        subtitle: 'Standardizing greenhouse gases',
        body: 'Carbon dioxide is not the only warming gas. Methane (from livestock and rotting landfills) traps 28x more heat, while nitrous oxide traps 265x more heat over a century. We express all gases in terms of "CO₂ equivalent" (CO₂e).',
        stat: { value: '28x', label: 'Warming potency of methane vs carbon dioxide' },
        keyTakeaway: 'CO₂e bundles all greenhouse gas emissions into a single universal metric.',
      },
      {
        title: 'The Indian Context',
        subtitle: 'Global equity and emissions',
        body: 'An average Indian emits ~1.9 tonnes of CO₂e per year, compared to ~14.7 tonnes for an American. However, affluent urban lifestyles in India often reach 6 to 10 tonnes due to frequent private driving, aviation, and excessive air-conditioning.',
        stat: { value: '1.9 t', label: 'Average annual carbon emissions per capita in India' },
        keyTakeaway: 'India averages 1.9 tonnes, but affluent urban consumption can quadruple that footprint.',
      },
      {
        title: 'The 2-Tonne Global Target',
        subtitle: 'Living within planetary boundaries',
        body: 'To cap global warming to 1.5°C under the Paris Agreement, every person on Earth must converge to a personal carbon budget of roughly 2.0 tonnes (2,000 kg) CO₂e per year by 2030.',
        stat: { value: '2.0 t', label: 'Target sustainable annual carbon budget per human' },
        keyTakeaway: '2,000 kg CO₂e per year is the benchmark for sustainable individual living.',
      },
      {
        title: 'High-Impact vs Low-Impact',
        subtitle: 'Focusing on the biggest levers',
        body: 'Turning off LED lights is helpful, but avoiding one domestic flight or switching daily commuting from a solo car to the metro cuts hundreds of times more emissions. Focus your energy on your largest footprint slice.',
        stat: { value: '80%', label: 'Emissions typically concentrated in transport and diet' },
        keyTakeaway: 'Tackle your single largest slice first: transport mode, home cooling, or diet.',
      },
    ],
    quiz: [
      {
        question: 'What does "CO₂e" (CO₂ equivalent) represent?',
        options: [
          'Carbon that has dissolved in water',
          'A unified measure that converts the warming effect of all greenhouse gases to equivalent CO₂',
          'Carbon that has turned into diamond',
          'Oxygen molecules bonded to carbon',
        ],
        correctIndex: 1,
        explanation: 'CO₂e allows us to compare different gases like methane and nitrous oxide on a common warming scale.',
      },
      {
        question: 'What is the approximate annual per-capita target budget to keep global warming under 1.5°C?',
        options: [
          '50 tonnes',
          '2.0 tonnes (2,000 kg)',
          'Zero kilograms altogether',
          '15 tonnes',
        ],
        correctIndex: 1,
        explanation: 'The Paris Agreement trajectory requires personal footprints to converge around 2.0 tonnes CO₂e/year.',
      },
      {
        question: 'Which of the following usually yields the biggest single emission cut for an urban student?',
        options: [
          'Unplugging phone chargers when not in use',
          'Switching a daily solo petrol car commute to metro or bicycle',
          'Switching from blue pens to black pens',
          'Drinking cold water instead of warm water',
        ],
        correctIndex: 1,
        explanation: 'Transport mode shifts deliver massive, kilogram-scale cuts each week compared to tiny standby loads.',
      },
    ],
  },

  {
    id: 'student_action',
    title: 'Low-Carbon Student Life',
    tagline: 'Frugal, realistic ways to shrink your impact on campus without breaking the bank.',
    readTimeMinutes: 3,
    sdgGoal: 12,
    xpReward: 30,
    badgeId: 'green_commuter',
    cards: [
      {
        title: 'The Transit Dividend',
        subtitle: 'Getting to campus sustainably',
        body: 'Indian metros and buses are among the most carbon-efficient mass transit systems in the world. Shifting your daily 10 km commute from a petrol motorbike to the metro saves over 400 kg of CO₂e every academic semester.',
        stat: { value: '400 kg', label: 'CO₂e saved per semester by riding metro or bus' },
        keyTakeaway: 'Public mass transit is the fastest way for young adults to slash personal carbon footprints.',
      },
      {
        title: 'Hostel & Room Cooling',
        subtitle: 'The 24°C sweet spot',
        body: 'Setting your room air conditioner to 24°C rather than 18°C lowers power consumption by ~36%. Pair your 24°C setting with a slow ceiling fan to achieve equal thermal comfort with a fraction of the electricity bill.',
        stat: { value: '6%', label: 'Power saved per 1°C increase on your AC thermostat' },
        keyTakeaway: 'Pairing a 24°C AC with a ceiling fan delivers superior comfort with minimal power draw.',
      },
      {
        title: 'Fast Fashion & Thrifting',
        subtitle: 'The hidden water and carbon in clothes',
        body: 'Producing one cotton t-shirt takes 2,700 litres of fresh water and emits 7 kg of CO₂e. Swap clothes with roommates, buy timeless quality over trendy synthetic garments, and mend torn seams before replacing.',
        stat: { value: '2,700 L', label: 'Water consumed to manufacture a single cotton shirt' },
        keyTakeaway: 'Wearing clothes just 9 months longer reduces product carbon footprints by 30%.',
      },
      {
        title: 'Digital Sobriety',
        subtitle: 'Invisible footprint in data centres',
        body: 'Cloud storage and video streaming run on massive server farms backed by thermal power plants. Clean out unused duplicate photos, unsubscribe from promotional emails, and download lecture notes over Wi-Fi instead of cellular data.',
        stat: { value: '50 g', label: 'CO₂e emitted per hour of high-definition cloud video streaming' },
        keyTakeaway: 'Digital hygiene reduces unnecessary data centre compute and transmission energy.',
      },
    ],
    quiz: [
      {
        question: 'Why does setting an air conditioner to 24°C save substantial energy in India?',
        options: [
          'It prevents the compressor from turning on at all',
          'Every 1°C increase reduces cooling power demand by approximately 6%',
          '24°C is freezing cold',
          'It requires less water from municipal pipes',
        ],
        correctIndex: 1,
        explanation: 'Compressor load decreases significantly as the temperature differential between outside and inside shrinks.',
      },
      {
        question: 'Approximately how much water is embedded in the production of a single new cotton t-shirt?',
        options: [
          '10 litres',
          'About 2,700 litres',
          '100,000 litres',
          'Zero litres because cotton is dry',
        ],
        correctIndex: 1,
        explanation: 'Cotton cultivation and textile dyeing are highly water-intensive, consuming roughly 2,700 litres per shirt.',
      },
      {
        question: 'What is the most carbon-friendly way to commute to campus?',
        options: [
          'Solo petrol SUV',
          'Walking, cycling, or electrified mass metro',
          'High-performance motorcycle',
          'Helicopter charter',
        ],
        correctIndex: 1,
        explanation: 'Active human mobility and high-capacity electric mass transit have the lowest emission intensity per passenger km.',
      },
    ],
  },

  {
    id: 'sdg13',
    title: 'What SDG 13 Really Means',
    tagline: 'Climate Action unpacked: mitigation, adaptation, and youth leadership in India.',
    readTimeMinutes: 3,
    sdgGoal: 13,
    xpReward: 30,
    badgeId: 'quiz_master',
    cards: [
      {
        title: 'Mitigation vs Adaptation',
        subtitle: 'Two essential sides of the climate coin',
        body: 'Mitigation means cutting emissions to stop future warming (solar panels, metro transit, plant diets). Adaptation means preparing for climate impacts already locked in (flood defenses, heatwave action plans, disaster warning systems).',
        stat: { value: 'Both', label: 'Simultaneous mitigation and adaptation are mandatory' },
        keyTakeaway: 'Mitigation prevents the unmanageable; adaptation manages the unavoidable.',
      },
      {
        title: 'SDG 13 Targets',
        subtitle: 'Strengthening resilience and policy',
        body: 'Target 13.1 strengthens resilience against climate-related hazards. Target 13.2 integrates climate measures into national policies. Target 13.3 improves human awareness, education, and early warning capacity.',
        stat: { value: 'Target 13.3', label: 'Focuses directly on climate education and early warnings' },
        keyTakeaway: 'Climate education and hyper-local early warnings directly fulfil UN SDG Target 13.3.',
      },
      {
        title: 'Interlinked Goals',
        subtitle: 'SDG 13 cannot succeed in isolation',
        body: 'Climate Action directly reinforces SDG 4 (Quality Education), SDG 11 (Sustainable Cities), and SDG 17 (Partnerships for the Goals). Youth-led urban resilience is the connective tissue across all four goals.',
        stat: { value: 'SDG 4, 11, 17', label: 'Primary sustainable development allies of ClimateX' },
        keyTakeaway: 'Local climate resilience drives safer cities, better education, and collaborative partnerships.',
      },
      {
        title: 'The Youth Advantage',
        subtitle: 'Turning awareness into sustained action',
        body: 'Young adults represent India\'s demographic dividend. With personalized data, daily habit accountability, and community leadership, grassroots youth movements turn abstract global climate treaties into real ground change.',
        stat: { value: '65%', label: 'India\'s population under the age of 35' },
        keyTakeaway: 'Grassroots youth action transforms international climate treaties into hyper-local urban impact.',
      },
    ],
    quiz: [
      {
        question: 'What is the key difference between climate mitigation and climate adaptation?',
        options: [
          'Mitigation is for animals, adaptation is for plants',
          'Mitigation reduces emissions to stop warming, adaptation prepares for impacts already occurring',
          'Mitigation costs money while adaptation is completely free',
          'There is no difference between them',
        ],
        correctIndex: 1,
        explanation: 'Mitigation tackles causes (greenhouse emissions); adaptation tackles symptoms (floods, heatwaves, sea level rise).',
      },
      {
        question: 'Which specific UN SDG Target focuses on improving education and human capacity on climate change?',
        options: [
          'Target 13.3',
          'Target 1.1',
          'Target 7.9',
          'Target 100.0',
        ],
        correctIndex: 0,
        explanation: 'SDG Target 13.3 specifically mandates improving education, awareness-raising and human capacity on climate change.',
      },
      {
        question: 'How does localized early warning (like ClimateX risk forecasts) support SDG 13?',
        options: [
          'It replaces fire departments',
          'It empowers citizens to prepare early and avoid heat, flood and air hazard exposure',
          'It stops rain clouds from forming',
          'It converts solar energy into gasoline',
        ],
        correctIndex: 1,
        explanation: 'Hyper-local actionable risk intelligence enables citizens to protect health and minimize damage before hazards strike.',
      },
    ],
  },
];
