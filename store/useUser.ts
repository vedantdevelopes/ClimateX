import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DietType } from '../lib/footprint';
import { ThemeMode } from '../theme/tokens';
import { auth, db, isFirebaseConfigured } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  name: string;
  email: string | null;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;

  // Location
  city: string;
  lat: number;
  lon: number;

  // Lifestyle preferences
  diet: DietType;
  mainTransport: string;

  // App settings
  notifyTime: string; // '08:30'
  theme: ThemeMode;
  notificationsEnabled: boolean;

  createdAt: number;
}

interface UserState {
  profile: UserProfile;
  isLoading: boolean;
  setProfile: (partial: Partial<UserProfile>) => void;
  setLocation: (city: string, lat: number, lon: number) => void;
  completeOnboarding: (name: string, city: string, lat: number, lon: number, diet: DietType, mainTransport: string) => void;
  setTheme: (theme: ThemeMode) => void;
  syncWithFirestore: () => Promise<void>;
  resetUser: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  uid: 'guest_' + Math.random().toString(36).substring(2, 9),
  name: 'Climate Scout',
  email: null,
  isGuest: true,
  hasCompletedOnboarding: false,
  city: 'Hyderabad, India',
  lat: 17.385,
  lon: 78.4867,
  diet: 'vegetarian',
  mainTransport: 'metro/bus',
  notifyTime: '08:30',
  theme: 'system',
  notificationsEnabled: true,
  createdAt: Date.now(),
};

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      profile: DEFAULT_PROFILE,
      isLoading: false,

      setProfile: (partial) => {
        set((state) => {
          const updated = { ...state.profile, ...partial };
          return { profile: updated };
        });
        get().syncWithFirestore();
      },

      setLocation: (city, lat, lon) => {
        set((state) => ({
          profile: {
            ...state.profile,
            city,
            lat,
            lon,
          },
        }));
        get().syncWithFirestore();
      },

      completeOnboarding: (name, city, lat, lon, diet, mainTransport) => {
        set((state) => ({
          profile: {
            ...state.profile,
            name: name.trim() || 'Climate Scout',
            city,
            lat,
            lon,
            diet,
            mainTransport,
            hasCompletedOnboarding: true,
          },
        }));
        get().syncWithFirestore();
      },

      setTheme: (theme) => {
        set((state) => ({
          profile: { ...state.profile, theme },
        }));
      },

      syncWithFirestore: async () => {
        const { profile } = get();
        if (!isFirebaseConfigured || profile.isGuest || !profile.uid || !db?.type) {
          return;
        }
        try {
          const userDocRef = doc(db, 'users', profile.uid);
          await setDoc(
            userDocRef,
            {
              name: profile.name,
              city: profile.city,
              lat: profile.lat,
              lon: profile.lon,
              diet: profile.diet,
              mainTransport: profile.mainTransport,
              notifyTime: profile.notifyTime,
              theme: profile.theme,
              updatedAt: Date.now(),
            },
            { merge: true }
          );
        } catch (err) {
          console.warn('[Sync] Firestore user sync failed:', err);
        }
      },

      resetUser: () => {
        set({
          profile: {
            ...DEFAULT_PROFILE,
            uid: 'guest_' + Math.random().toString(36).substring(2, 9),
            createdAt: Date.now(),
          },
        });
      },
    }),
    {
      name: 'climatex_user_storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
