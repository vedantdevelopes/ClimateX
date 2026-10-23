import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../../store/useUser';
import { colors } from '../../theme/tokens';

interface TabItemConfig {
  name: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  activeColor: string;
}

const TABS: TabItemConfig[] = [
  { name: 'home', label: 'TODAY', icon: 'globe', activeColor: '#FFFFFF' },
  { name: 'risk', label: 'RISK', icon: 'cloud-lightning', activeColor: '#FFD166' },
  { name: 'footprint', label: 'CARBON', icon: 'wind', activeColor: '#A8DADC' },
  { name: 'actions', label: 'HABITS', icon: 'target', activeColor: '#FFFFFF' },
  { name: 'progress', label: 'STREAK', icon: 'zap', activeColor: colors.teal },
  { name: 'learn', label: 'LEARN', icon: 'book-open', activeColor: colors.blush },
];

function LivingEditorialTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();
  const themeMode = useUser((s: any) => s.profile.theme);
  const isDark = themeMode === 'dark';

  const bottomSpacing = Math.max(insets.bottom, Platform.OS === 'ios' ? 10 : 12);

  // Background harmonizes with the brand maroon surfaces
  const dockBg = isDark ? colors.maroonDeep : colors.maroon;

  return (
    <View style={[styles.floatingWrapper, { paddingBottom: bottomSpacing }]} pointerEvents="box-none">
      <View style={[styles.floatingDock, { backgroundColor: dockBg }]}>
        <View style={styles.dockInner}>
          {TABS.map((tab) => {
            const route = state?.routes?.find((r: any) => r.name === tab.name || r.name.startsWith(tab.name));
            const currentRoute = state?.routes?.[state?.index];
            const isFocused = currentRoute?.name === tab.name || currentRoute?.name?.startsWith(tab.name);

            const onPress = () => {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
              } catch (_) {}

              if (navigation?.emit && route?.key) {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });

                if (event?.defaultPrevented) return;
              }

              if (!isFocused) {
                if (navigation?.navigate && route?.name) {
                  navigation.navigate(route.name);
                } else {
                  router.navigate(`/(tabs)/${tab.name}` as any);
                }
              }
            };

            const tabAccent = isFocused ? tab.activeColor : 'rgba(255, 221, 221, 0.45)';

            return (
              <TouchableOpacity
                key={tab.name}
                onPress={onPress}
                activeOpacity={0.65}
                style={styles.tabItem}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={tab.label}
              >
                {/* Icon with soft circular aura — NO square borders */}
                <View
                  style={[
                    styles.iconCircle,
                    isFocused && {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    },
                  ]}
                >
                  <Feather
                    name={tab.icon}
                    size={isFocused ? 20 : 18}
                    color={tabAccent}
                  />
                </View>

                {/* Typography label */}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabTitle,
                    {
                      color: isFocused ? tabAccent : 'rgba(255, 221, 221, 0.45)',
                      fontFamily: isFocused ? 'Inter_700Bold' : 'Inter_500Medium',
                    },
                  ]}
                >
                  {tab.label}
                </Text>

                {/* Smooth micro indicator dot underneath active tab */}
                <View
                  style={[
                    styles.indicatorPill,
                    {
                      backgroundColor: isFocused ? tab.activeColor : 'transparent',
                    },
                  ]}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props: any) => <LivingEditorialTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'TODAY' }} />
      <Tabs.Screen name="risk" options={{ title: 'RISK' }} />
      <Tabs.Screen name="footprint" options={{ title: 'CARBON' }} />
      <Tabs.Screen name="actions" options={{ title: 'HABITS' }} />
      <Tabs.Screen name="progress" options={{ title: 'STREAK' }} />
      <Tabs.Screen name="learn" options={{ title: 'LEARN' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingDock: {
    width: '92%',
    maxWidth: 440,
    borderRadius: 32, // Smooth curved organic pill
    borderWidth: 1,
    borderColor: 'rgba(255, 221, 221, 0.25)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 12,
  },
  dockInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Circular press boundary, no square ripples
    paddingVertical: 2,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18, // Completely round, zero square corners
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabTitle: {
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  indicatorPill: {
    width: 12,
    height: 2.5,
    borderRadius: 1.5,
    marginTop: 3,
  },
});
