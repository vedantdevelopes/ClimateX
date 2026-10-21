import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import {
  calculateLevelFromXp,
  evaluateStreakOnAction,
  checkNewBadges,
  XP_REWARDS,
  getLocalDateString,
} from '../lib/gamification';
import {
  FootprintInputs,
  FootprintBreakdown,
  calculateFootprint,
  DEFAULT_FOOTPRINT_INPUTS,
} from '../lib/footprint';
import { ActionDefinition } from '../data/actions';
import { recommendActions } from '../lib/recommend';
import { RiskLevel } from '../lib/risk';

export interface CompletedActionLog {
  id: string;
  actionId: string;
  title: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  kgSaved: number;
  category: string;
}

export interface FootprintLog {
  id: string;
  date: string;
  timestamp: number;
  totalKgWeek: number;
  totalKgYear: number;
  breakdown: FootprintBreakdown;
  inputs: FootprintInputs;
}

export interface ModuleProgress {
  moduleId: string;
  completedAt: number;
  quizScore: number; // 0 - 3
}

interface ProgressState {
  // Gamification
  xp: number;
  level: number;
  xpInLevel: number;
  progressToNextLevel: number;
  streak: number;
  longestStreak: number;
  lastActionDate: string | null;
  unlockedBadgeIds: string[];

  // Footprint
  currentFootprintInputs: FootprintInputs;
  currentBreakdown: FootprintBreakdown;
  footprintHistory: FootprintLog[];

  // Actions
  dailyActions: ActionDefinition[];
  weeklyActions: ActionDefinition[];
  completedActionIds: string[]; // for today's toggled state
  completedActionLogs: CompletedActionLog[];

  // Learning
  completedModules: Record<string, ModuleProgress>;

  // Notification / Feedback banner
  latestAward: string | null;

  // Actions
  toggleActionDone: (action: ActionDefinition) => void;
  saveFootprintCalculation: (inputs: FootprintInputs) => void;
  completeLearningModule: (moduleId: string, score: number) => void;
  refreshRecommendations: (heat: RiskLevel, aqi: RiskLevel, flood: RiskLevel) => void;
  dismissAward: () => void;
  resetProgress: () => void;
}

const initialBreakdown = calculateFootprint(DEFAULT_FOOTPRINT_INPUTS);

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 40, // starter XP for signing in / getting started
      level: 1,
      xpInLevel: 40,
      progressToNextLevel: 40 / 200,
      streak: 1,
      longestStreak: 1,
      lastActionDate: null,
      unlockedBadgeIds: ['first_step'],

      currentFootprintInputs: DEFAULT_FOOTPRINT_INPUTS,
      currentBreakdown: initialBreakdown,
      footprintHistory: [
        {
          id: 'log_initial',
          date: getLocalDateString(Date.now() - 7 * 86400000),
          timestamp: Date.now() - 7 * 86400000,
          totalKgWeek: initialBreakdown.totalKgWeek,
          totalKgYear: initialBreakdown.totalKgYear,
          breakdown: initialBreakdown,
          inputs: DEFAULT_FOOTPRINT_INPUTS,
        },
      ],

      dailyActions: [],
      weeklyActions: [],
      completedActionIds: [],
      completedActionLogs: [],

      completedModules: {},
      latestAward: null,

      toggleActionDone: (action: ActionDefinition) => {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (_) {}

        const state = get();
        const isAlreadyDone = state.completedActionIds.includes(action.id);

        if (isAlreadyDone) {
          // Untoggle
          set({
            completedActionIds: state.completedActionIds.filter((id) => id !== action.id),
          });
          return;
        }

        // Complete action
        const streakResult = evaluateStreakOnAction(
          state.streak,
          state.longestStreak,
          state.lastActionDate
        );

        let addedXp = XP_REWARDS.ACTION_COMPLETED;
        if (streakResult.isNewStreakAward) {
          addedXp += XP_REWARDS.SEVEN_DAY_STREAK;
        }

        const newXp = state.xp + addedXp;
        const levelCalc = calculateLevelFromXp(newXp);

        const newLog: CompletedActionLog = {
          id: 'act_' + Date.now(),
          actionId: action.id,
          title: action.title,
          date: streakResult.actionDate,
          timestamp: Date.now(),
          kgSaved: action.kgSaved,
          category: action.category,
        };

        const updatedCompletedLogs = [newLog, ...state.completedActionLogs];

        // Check for new badges
        const newBadges = checkNewBadges({
          streak: streakResult.newStreak,
          totalActionsCompleted: updatedCompletedLogs.length,
          footprintCalculatedCount: state.footprintHistory.length,
          completedModuleIds: Object.keys(state.completedModules),
          perfectQuizzesCount: Object.values(state.completedModules).filter((m) => m.quizScore === 3).length,
          level: levelCalc.level,
          currentBadgeIds: state.unlockedBadgeIds,
        });

        const updatedBadgeIds = [...state.unlockedBadgeIds, ...newBadges];
        const awardMsg = newBadges.length > 0 ? `Unlocked ${newBadges.length} new badge!` : `+${addedXp} XP earned!`;

        set({
          xp: newXp,
          level: levelCalc.level,
          xpInLevel: levelCalc.xpInLevel,
          progressToNextLevel: levelCalc.progressToNextLevel,
          streak: streakResult.newStreak,
          longestStreak: streakResult.newLongestStreak,
          lastActionDate: streakResult.actionDate,
          completedActionIds: [...state.completedActionIds, action.id],
          completedActionLogs: updatedCompletedLogs,
          unlockedBadgeIds: updatedBadgeIds,
          latestAward: awardMsg,
        });
      },

      saveFootprintCalculation: (inputs: FootprintInputs) => {
        try {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } catch (_) {}

        const state = get();
        const breakdown = calculateFootprint(inputs);
        const newLog: FootprintLog = {
          id: 'foot_' + Date.now(),
          date: getLocalDateString(),
          timestamp: Date.now(),
          totalKgWeek: breakdown.totalKgWeek,
          totalKgYear: breakdown.totalKgYear,
          breakdown,
          inputs,
        };

        const addedXp = XP_REWARDS.FOOTPRINT_CALCULATED;
        const newXp = state.xp + addedXp;
        const levelCalc = calculateLevelFromXp(newXp);
        const updatedLogs = [newLog, ...state.footprintHistory];

        const newBadges = checkNewBadges({
          streak: state.streak,
          totalActionsCompleted: state.completedActionLogs.length,
          footprintCalculatedCount: updatedLogs.length,
          completedModuleIds: Object.keys(state.completedModules),
          perfectQuizzesCount: Object.values(state.completedModules).filter((m) => m.quizScore === 3).length,
          level: levelCalc.level,
          currentBadgeIds: state.unlockedBadgeIds,
        });

        set({
          currentFootprintInputs: inputs,
          currentBreakdown: breakdown,
          footprintHistory: updatedLogs,
          xp: newXp,
          level: levelCalc.level,
          xpInLevel: levelCalc.xpInLevel,
          progressToNextLevel: levelCalc.progressToNextLevel,
          unlockedBadgeIds: [...state.unlockedBadgeIds, ...newBadges],
          latestAward: `+${addedXp} XP! Footprint saved.`,
        });
      },

      completeLearningModule: (moduleId: string, score: number) => {
        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } catch (_) {}

        const state = get();
        const isFirstTime = !state.completedModules[moduleId];
        const addedXp = isFirstTime ? XP_REWARDS.MODULE_COMPLETED : 5;
        const newXp = state.xp + addedXp;
        const levelCalc = calculateLevelFromXp(newXp);

        const updatedModules = {
          ...state.completedModules,
          [moduleId]: {
            moduleId,
            completedAt: Date.now(),
            quizScore: score,
          },
        };

        const newBadges = checkNewBadges({
          streak: state.streak,
          totalActionsCompleted: state.completedActionLogs.length,
          footprintCalculatedCount: state.footprintHistory.length,
          completedModuleIds: Object.keys(updatedModules),
          perfectQuizzesCount: Object.values(updatedModules).filter((m) => m.quizScore === 3).length,
          level: levelCalc.level,
          currentBadgeIds: state.unlockedBadgeIds,
        });

        set({
          xp: newXp,
          level: levelCalc.level,
          xpInLevel: levelCalc.xpInLevel,
          progressToNextLevel: levelCalc.progressToNextLevel,
          completedModules: updatedModules,
          unlockedBadgeIds: [...state.unlockedBadgeIds, ...newBadges],
          latestAward: `+${addedXp} XP! Module completed.`,
        });
      },

      refreshRecommendations: (heat: RiskLevel, aqi: RiskLevel, flood: RiskLevel) => {
        const state = get();
        const recentCompleted = state.completedActionLogs.map((c) => ({
          id: c.actionId,
          timestamp: c.timestamp,
        }));

        const result = recommendActions({
          heatLevel: heat,
          aqiLevel: aqi,
          floodLevel: flood,
          biggestFootprintCategory: state.currentBreakdown.biggestCategory,
          recentCompletedIds: recentCompleted,
        });

        set({
          dailyActions: result.daily,
          weeklyActions: result.weekly,
        });
      },

      dismissAward: () => {
        set({ latestAward: null });
      },

      resetProgress: () => {
        const initial = calculateFootprint(DEFAULT_FOOTPRINT_INPUTS);
        set({
          xp: 40,
          level: 1,
          xpInLevel: 40,
          progressToNextLevel: 40 / 200,
          streak: 1,
          longestStreak: 1,
          lastActionDate: null,
          unlockedBadgeIds: ['first_step'],
          currentFootprintInputs: DEFAULT_FOOTPRINT_INPUTS,
          currentBreakdown: initial,
          footprintHistory: [],
          dailyActions: [],
          weeklyActions: [],
          completedActionIds: [],
          completedActionLogs: [],
          completedModules: {},
          latestAward: null,
        });
      },
    }),
    {
      name: 'climatex_progress_storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
