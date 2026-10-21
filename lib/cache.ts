import AsyncStorage from '@react-native-async-storage/async-storage';

export const CACHE_KEYS = {
  RISK_DATA: 'climatex_cache_risk_data',
  RISK_TIMESTAMP: 'climatex_cache_risk_ts',
  LOCATION_INFO: 'climatex_cache_location_info',
  LAST_OFFLINE_STATE: 'climatex_cache_offline_state',
};

export async function setCachedItem<T>(key: string, value: T): Promise<void> {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.warn(`[Cache] Failed to set ${key}:`, error);
  }
}

export async function getCachedItem<T>(key: string): Promise<T | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.warn(`[Cache] Failed to get ${key}:`, error);
    return null;
  }
}

export async function removeCachedItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`[Cache] Failed to remove ${key}:`, error);
  }
}
