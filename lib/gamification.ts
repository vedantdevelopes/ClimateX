import { BADGES, BadgeDefinition } from '../data/badges';

export const XP_REWARDS = {
  ACTION_COMPLETED: 10,
  FOOTPRINT_CALCULATED: 25,
  MODULE_COMPLETED: 30,
  SEVEN_DAY_STREAK: 50,
};

export const XP_PER_LEVEL = 200;

export interface GamificationState {
  xp: number;
  level: number;
  xpInLevel: number;
  progressToNextLevel: number; // 0 to 1
  streak: number;
  longestStreak: number;
  lastActionDate: string | null; // 'YYYY-MM-DD'
  unlockedBadgeIds: string[];
}

export function getLocalDateString(timestamp = Date.now()): string {
  const d = new Date(timestamp);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(timestamp = Date.now()): string {
  const d = new Date(timestamp - 24 * 60 * 60 * 1000);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateLevelFromXp(xp: number): {
  level: number;
  xpInLevel: number;
  progressToNextLevel: number;
} {
  const safeXp = Math.max(0, xp);
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1;
  const xpInLevel = safeXp % XP_PER_LEVEL;
  const progressToNextLevel = xpInLevel / XP_PER_LEVEL;

  return {
    level,
    xpInLevel,
    progressToNextLevel,
  };
}

export function evaluateStreakOnAction(
  currentStreak: number,
  longestStreak: number,
  lastActionDate: string | null
): { newStreak: number; newLongestStreak: number; isNewStreakAward: boolean; actionDate: string } {
  const today = getLocalDateString();
  const yesterday = getYesterdayDateString();

  if (lastActionDate === today) {
    // Already did an action today, streak unchanged
    return {
      newStreak: currentStreak,
      newLongestStreak: longestStreak,
      isNewStreakAward: false,
      actionDate: today,
    };
  }

  let newStreak = 1;
  if (lastActionDate === yesterday) {
    newStreak = currentStreak + 1;
  }

  const newLongestStreak = Math.max(longestStreak, newStreak);
  const isNewStreakAward = newStreak % 7 === 0 && newStreak > 0;

  return {
    newStreak,
    newLongestStreak,
    isNewStreakAward,
    actionDate: today,
  };
}

export interface BadgeCheckContext {
  streak: number;
  totalActionsCompleted: number;
  footprintCalculatedCount: number;
  completedModuleIds: string[];
  perfectQuizzesCount: number;
  level: number;
  currentBadgeIds: string[];
}

export function checkNewBadges(context: BadgeCheckContext): string[] {
  const earned = new Set(context.currentBadgeIds);
  const newlyUnlocked: string[] = [];

  const tryUnlock = (badgeId: string) => {
    if (!earned.has(badgeId)) {
      earned.add(badgeId);
      newlyUnlocked.push(badgeId);
    }
  };

  if (context.totalActionsCompleted >= 1) tryUnlock('first_step');
  if (context.streak >= 3) tryUnlock('streak_3');
  if (context.streak >= 7) tryUnlock('streak_7');
  if (context.streak >= 30) tryUnlock('streak_30');
  if (context.footprintCalculatedCount >= 1) tryUnlock('footprint_mapper');
  if (context.completedModuleIds.includes('heatwaves')) tryUnlock('heat_smart');
  if (context.completedModuleIds.includes('air_quality')) tryUnlock('clean_air_champion');
  if (context.completedModuleIds.includes('floods')) tryUnlock('flood_ready');
  if (context.perfectQuizzesCount >= 1) tryUnlock('quiz_master');
  if (context.level >= 5) tryUnlock('eco_hero');

  return newlyUnlocked;
}
