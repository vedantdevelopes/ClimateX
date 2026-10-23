import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ComprehensiveRiskResult,
  calculateHeatScore,
  calculateAqiScore,
  calculateFloodScore,
  calculateOverallRisk,
} from '../lib/risk';
import { fetchClimateRiskData, getMockFallbackRiskData } from '../lib/openMeteo';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes for real-time live accuracy

interface RiskState {
  data: ComprehensiveRiskResult;
  isLoading: boolean;
  isOffline: boolean;
  lastFetchedAt: number | null;
  error: string | null;

  fetchRisk: (lat: number, lon: number, cityName: string, force?: boolean) => Promise<void>;
  clearCache: () => void;
}

const INITIAL_DATA: ComprehensiveRiskResult = getMockFallbackRiskData();

export const useRisk = create<RiskState>()(
  persist(
    (set, get) => ({
      data: INITIAL_DATA,
      isLoading: false,
      isOffline: false,
      lastFetchedAt: null,
      error: null,

      fetchRisk: async (lat: number, lon: number, cityName: string, force = false) => {
        const { data, lastFetchedAt, isLoading } = get();
        const now = Date.now();

        // Check 30-minute cache validity if not forcing refresh
        if (!force && lastFetchedAt && now - lastFetchedAt < CACHE_TTL_MS && data?.overallScore !== undefined) {
          return;
        }

        if (isLoading) return;

        set({ isLoading: true, error: null });

        try {
          const freshData = await fetchClimateRiskData(lat, lon, cityName);
          set({
            data: freshData,
            isLoading: false,
            isOffline: false,
            lastFetchedAt: now,
            error: null,
          });
        } catch (err: any) {
          console.warn('[RiskStore] Fetch failed, serving cached/mock data:', err);
          set((state) => ({
            isLoading: false,
            isOffline: true,
            error: 'Network unavailable. Showing saved data.',
            data: state.data || getMockFallbackRiskData(cityName),
          }));
        }
      },

      clearCache: () => {
        set({ lastFetchedAt: null });
      },
    }),
    {
      name: 'climatex_risk_storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
