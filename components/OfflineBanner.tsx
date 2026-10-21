import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRisk } from '../store/useRisk';
import { useUser } from '../store/useUser';
import { colors, lightTheme, darkTheme } from '../theme/tokens';

export const OfflineBanner: React.FC = () => {
  const isOffline = useRisk((s) => s.isOffline);
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  if (!isOffline) return null;

  return (
    <View style={[styles.banner, { backgroundColor: isDark ? colors.maroonDeep : colors.blushSoft, borderColor: theme.cardBorder }]}>
      <Feather name="wifi-off" size={13} color={colors.warn} style={styles.icon} />
      <Text style={[styles.text, { color: theme.text }]}>
        Offline, showing saved data
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 3,
    marginHorizontal: 16,
    marginVertical: 4,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.3,
  },
});
