export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  iconName: string; // Feather icon name
  category: 'streak' | 'risk' | 'footprint' | 'learn' | 'action';
  xpRequired?: number;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Completed your very first climate action.',
    iconName: 'check-circle',
    category: 'action',
  },
  {
    id: 'streak_3',
    title: '3-Day Streak',
    description: 'Maintained active daily habits for 3 consecutive days.',
    iconName: 'zap',
    category: 'streak',
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'A full week of sustained climate awareness & action.',
    iconName: 'award',
    category: 'streak',
  },
  {
    id: 'streak_30',
    title: '30-Day Master',
    description: 'A full month of unbroken climate resilience habits.',
    iconName: 'star',
    category: 'streak',
  },
  {
    id: 'footprint_mapper',
    title: 'Footprint Mapper',
    description: 'Calculated your lifestyle carbon breakdown.',
    iconName: 'pie-chart',
    category: 'footprint',
  },
  {
    id: 'heat_smart',
    title: 'Heat Smart',
    description: 'Completed the Heatwaves & Safety learning module.',
    iconName: 'sun',
    category: 'risk',
  },
  {
    id: 'clean_air_champion',
    title: 'Clean Air Champion',
    description: 'Mastered the Air Quality & Lungs module & actions.',
    iconName: 'wind',
    category: 'risk',
  },
  {
    id: 'flood_ready',
    title: 'Flood Ready',
    description: 'Completed the Floods & Drainage module & tips.',
    iconName: 'droplet',
    category: 'risk',
  },
  {
    id: 'quiz_master',
    title: 'Quiz Master',
    description: 'Scored 100% on a climate module quiz.',
    iconName: 'help-circle',
    category: 'learn',
  },
  {
    id: 'green_commuter',
    title: 'Green Commuter',
    description: 'Logged low-carbon mass transit or active mobility.',
    iconName: 'compass',
    category: 'action',
  },
  {
    id: 'energy_saver',
    title: 'Energy Saver',
    description: 'Optimized cooling or trimmed household vampire loads.',
    iconName: 'power',
    category: 'action',
  },
  {
    id: 'eco_hero',
    title: 'Eco Hero',
    description: 'Reached Level 5 and accumulated over 1000 XP.',
    iconName: 'shield',
    category: 'streak',
  },
];
