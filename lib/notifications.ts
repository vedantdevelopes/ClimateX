import { Platform } from 'react-native';

// Safely require expo-notifications so Expo Go on Android doesn't crash on missing native modules
let Notifications: any = null;
try {
  Notifications = require('expo-notifications');
  if (Notifications?.setNotificationHandler) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }
} catch (err) {
  // Graceful fallback for Expo Go Android
  console.warn('[Notifications] Native notification module unavailable in Expo Go, operating in mock mode.');
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web' || !Notifications?.getPermissionsAsync) return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch (error) {
    console.warn('[Notifications] Permission request error:', error);
    return false;
  }
}

export async function scheduleDailyClimateTip(timeStr: string = '08:30'): Promise<void> {
  if (Platform.OS === 'web' || !Notifications?.scheduleNotificationAsync) return;
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.cancelAllScheduledNotificationsAsync?.();

    const [hoursStr, minutesStr] = timeStr.split(':');
    const hour = parseInt(hoursStr || '8', 10);
    const minute = parseInt(minutesStr || '30', 10);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'ClimateX Daily Briefing',
        body: "Check today's local heat and air quality risk before heading out!",
        data: { screen: 'home' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes?.DAILY || 'daily',
        hour,
        minute,
      },
    });
  } catch (error) {
    console.warn('[Notifications] Scheduling daily briefing failed:', error);
  }
}

export async function sendHighRiskAlert(hazardType: string, level: string, tip: string): Promise<void> {
  if (Platform.OS === 'web' || !Notifications?.scheduleNotificationAsync) return;
  try {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `CLIMATEX ALERT: ${level.toUpperCase()} ${hazardType.toUpperCase()} RISK`,
        body: tip,
        data: { screen: 'risk' },
      },
      trigger: null,
    });
  } catch (error) {
    console.warn('[Notifications] High risk alert notification error:', error);
  }
}
