import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BadgeDefinition } from '../data/badges';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme, colors } from '../theme/tokens';

interface BadgeTileProps {
  badge: BadgeDefinition;
  isUnlocked: boolean;
}

export const BadgeTile: React.FC<BadgeTileProps> = ({ badge, isUnlocked }) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const activeColor = isUnlocked ? colors.teal : theme.textMuted;

  return (
    <View
      style={[
        styles.tile,
        {
          borderColor: isUnlocked ? colors.teal : isDark ? 'rgba(255,221,221,0.2)' : 'rgba(107,0,16,0.2)',
          backgroundColor: isUnlocked
            ? isDark
              ? 'rgba(42,157,143,0.15)'
              : 'rgba(42,157,143,0.1)'
            : 'transparent',
          opacity: isUnlocked ? 1 : 0.45,
        },
      ]}
      accessible
      accessibilityLabel={`${badge.title} badge: ${isUnlocked ? 'Unlocked' : 'Locked'}`}
    >
      <View
        style={[
          styles.iconCircle,
          {
            borderColor: activeColor,
            backgroundColor: isUnlocked ? activeColor : 'transparent',
          },
        ]}
      >
        <Feather
          name={badge.iconName as any}
          size={18}
          color={isUnlocked ? '#FFFFFF' : theme.textMuted}
        />
      </View>

      <Text
        style={[
          styles.title,
          {
            color: isUnlocked ? theme.text : theme.textMuted,
          },
        ]}
        numberOfLines={1}
      >
        {badge.title}
      </Text>

      <Text
        style={[styles.description, { color: theme.textMuted }]}
        numberOfLines={2}
      >
        {badge.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginVertical: 4,
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.3,
    textAlign: 'center',
    marginBottom: 2,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    lineHeight: 13,
    textAlign: 'center',
  },
});
