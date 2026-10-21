import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Heading } from './Heading';
import { useProgress } from '../store/useProgress';
import { useUser } from '../store/useUser';
import { colors, lightTheme, darkTheme } from '../theme/tokens';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showProfileAvatar?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showProfileAvatar = true,
}) => {
  const router = useRouter();
  const streak = useProgress((s) => s.streak);
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleColumn}>
          <Heading size="medium" color={theme.text}>
            {title}
          </Heading>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.textMuted }]}>{subtitle}</Text>
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          {/* Charcoal Pill for Streak */}
          <View style={styles.streakPill}>
            <Feather name="zap" size={12} color={colors.teal} style={styles.streakIcon} />
            <Text style={styles.streakText}>{streak}D</Text>
          </View>

          {/* Profile / Settings Avatar */}
          {showProfileAvatar ? (
            <TouchableOpacity
              style={[styles.avatarButton, { borderColor: theme.cardBorder }]}
              onPress={() => router.push('/profile')}
              accessibilityRole="button"
              accessibilityLabel="Open Profile & Settings"
            >
              <Feather name="user" size={16} color={theme.text} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Thin black rule underneath header */}
      <View style={[styles.rule, { backgroundColor: theme.rule }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleColumn: {
    flex: 1,
  },
  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink, // charcoal pill like slide number
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  streakIcon: {
    marginRight: 4,
  },
  streakText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: {
    height: 1,
    width: '100%',
    marginTop: 4,
  },
});
