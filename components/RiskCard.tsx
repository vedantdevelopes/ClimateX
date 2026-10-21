import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SingleRiskScore } from '../lib/risk';
import { useUser } from '../store/useUser';
import { lightTheme, darkTheme } from '../theme/tokens';
import { Card } from './Card';

interface RiskCardProps {
  title: string;
  hazardType: 'heat' | 'flood' | 'aqi';
  data: SingleRiskScore;
}

export const RiskCard: React.FC<RiskCardProps> = ({ title, hazardType, data }) => {
  const themeMode = useUser((s) => s.profile.theme);
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  let iconName: 'sun' | 'droplet' | 'wind' = 'sun';
  if (hazardType === 'flood') iconName = 'droplet';
  if (hazardType === 'aqi') iconName = 'wind';

  return (
    <Card style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <View style={[styles.iconBox, { borderColor: theme.cardBorder }]}>
            <Feather name={iconName} size={18} color={data.color} />
          </View>
          <View style={styles.titleTexts}>
            <Text style={[styles.title, { color: theme.text }]}>{title.toUpperCase()}</Text>
            <Text style={[styles.rawValue, { color: theme.textMuted }]}>{data.rawValue}</Text>
          </View>
        </View>

        {/* Level badge */}
        <View style={[styles.levelBadge, { backgroundColor: data.color }]}>
          <Text style={styles.levelText}>{data.level.toUpperCase()}</Text>
          <Text style={styles.scoreNumber}>{data.score}</Text>
        </View>
      </View>

      {/* Progress meter */}
      <View style={[styles.meterTrack, { backgroundColor: isDark ? 'rgba(255,221,221,0.1)' : 'rgba(107,0,16,0.08)' }]}>
        <View style={[styles.meterFill, { width: `${data.score}%`, backgroundColor: data.color }]} />
      </View>

      {/* Explanation */}
      <Text style={[styles.explanation, { color: theme.text }]}>{data.explanation}</Text>

      {/* Do this now Tip Box */}
      <View style={[styles.tipBox, { borderColor: theme.cardBorder, backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)' }]}>
        <View style={styles.tipHeader}>
          <Feather name="zap" size={13} color={theme.text} />
          <Text style={[styles.tipHeading, { color: theme.text }]}>ACTION TIP</Text>
        </View>
        <Text style={[styles.tipBody, { color: theme.text }]}>{data.tip}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  titleTexts: {
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Anton_400Regular',
    fontSize: 18,
    lineHeight: 22,
    letterSpacing: -0.5,
  },
  rawValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  levelText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginRight: 6,
  },
  scoreNumber: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
    color: '#FFFFFF',
  },
  meterTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
    marginVertical: 6,
  },
  meterFill: {
    height: '100%',
    borderRadius: 2,
  },
  explanation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 8,
  },
  tipBox: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 8,
    marginTop: 2,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  tipHeading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  tipBody: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
});
