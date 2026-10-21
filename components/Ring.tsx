import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme, colors } from '../theme/tokens';

interface RingProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  progressColor?: string;
  label?: string;
  subtitle?: string;
}

export const Ring: React.FC<RingProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  progressColor,
  label,
  subtitle,
}) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let activeColor = progressColor;
  if (!activeColor) {
    if (clamped < 30) activeColor = colors.ok;
    else if (clamped < 60) activeColor = colors.warn;
    else activeColor = colors.danger;
  }

  const trackColor = isDark ? 'rgba(255, 221, 221, 0.15)' : 'rgba(107, 0, 16, 0.12)';

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress stroke */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={activeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      <View style={styles.centerContent} pointerEvents="none">
        <Text style={[styles.scoreText, { color: theme.text }]}>{clamped}</Text>
        {label ? (
          <Text style={[styles.labelText, { color: activeColor }]}>{label.toUpperCase()}</Text>
        ) : null}
        {subtitle ? (
          <Text style={[styles.subtitleText, { color: theme.textMuted }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -1,
  },
  labelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: 2,
  },
  subtitleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 1,
  },
});
