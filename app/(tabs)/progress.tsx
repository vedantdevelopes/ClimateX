import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Heading } from '../../components/Heading';
import { Card } from '../../components/Card';
import { OutlineNumber } from '../../components/OutlineNumber';
import { BarChart, BarDatum } from '../../components/BarChart';
import { LineChart, LinePoint } from '../../components/LineChart';
import { BadgeTile } from '../../components/BadgeTile';
import { BADGES } from '../../data/badges';
import { useUser } from '../../store/useUser';
import { useProgress } from '../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../theme/tokens';
import { XP_PER_LEVEL } from '../../lib/gamification';

export default function ProgressScreen() {
  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const {
    streak,
    longestStreak,
    xp,
    level,
    xpInLevel,
    progressToNextLevel,
    unlockedBadgeIds,
    footprintHistory,
    completedActionLogs,
  } = useProgress();

  // 7-day action bar chart data
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const past7DaysData: BarDatum[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;
    const dayLabel = daysOfWeek[d.getDay()];

    const count = completedActionLogs.filter((log) => log.date === dateStr).length;
    past7DaysData.push({
      label: dayLabel,
      value: count,
      color: count > 0 ? colors.teal : isDark ? 'rgba(255,221,221,0.2)' : 'rgba(107,0,16,0.15)',
    });
  }

  // Footprint trend line points (past 5 logs)
  const footprintTrendPoints: LinePoint[] = footprintHistory
    .slice(0, 5)
    .reverse()
    .map((log, idx) => ({
      label: `W${idx + 1}`,
      value: Math.round(log.totalKgWeek),
    }));

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="PROGRESS" subtitle={`LEVEL ${level} · ${xp} XP`} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* STREAK HERO CARD WITH OUTLINE NUMBER */}
        <Card style={styles.streakCard}>
          <Text style={[styles.streakLabel, { color: theme.textMuted }]}>
            CURRENT ACTIVE STREAK
          </Text>

          <View style={styles.streakDisplayRow}>
            {/* Outlined numeral */}
            <OutlineNumber value={streak} size={70} color={theme.text} strokeWidth={2} />
            <View style={styles.streakMeta}>
              <View style={styles.streakFlamePill}>
                <Feather name="zap" size={14} color={colors.teal} style={{ marginRight: 4 }} />
                <Text style={styles.streakFlameText}>DAYS ACTIVE</Text>
              </View>
              <Text style={[styles.longestStreakText, { color: theme.textMuted }]}>
                Best Record: {longestStreak} Days
              </Text>
            </View>
          </View>

          {/* XP Progress Bar */}
          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Text style={[styles.xpText, { color: theme.text }]}>
                Level {level}
              </Text>
              <Text style={[styles.xpSub, { color: theme.textMuted }]}>
                {xpInLevel} / {XP_PER_LEVEL} XP to Level {level + 1}
              </Text>
            </View>
            <View style={[styles.xpTrack, { backgroundColor: isDark ? 'rgba(255,221,221,0.15)' : 'rgba(107,0,16,0.1)' }]}>
              <View
                style={[
                  styles.xpFill,
                  {
                    width: `${Math.round(progressToNextLevel * 100)}%`,
                    backgroundColor: colors.teal,
                  },
                ]}
              />
            </View>
          </View>
        </Card>

        {/* WEEKLY CHALLENGE CARD */}
        <Card style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <View style={[styles.challengePill, { backgroundColor: colors.ink }]}>
              <Text style={styles.challengePillText}>WEEKLY CHALLENGE</Text>
            </View>
            <Text style={[styles.challengeXp, { color: colors.teal }]}>+50 XP</Text>
          </View>
          <Text style={[styles.challengeTitle, { color: theme.text }]}>
            Complete 5 Low-Carbon Commutes
          </Text>
          <Text style={[styles.challengeSub, { color: theme.textMuted }]}>
            Use metro, bus, bicycle, or walk for your campus trips this week.
          </Text>
          <View style={[styles.challengeTrack, { backgroundColor: isDark ? 'rgba(255,221,221,0.15)' : 'rgba(107,0,16,0.1)' }]}>
            <View style={[styles.challengeFill, { width: '60%', backgroundColor: colors.maroon }]} />
          </View>
          <Text style={[styles.challengeProgressText, { color: theme.text }]}>3 / 5 Trips Completed</Text>
        </Card>

        {/* 7-DAY ACTIVITY BAR CHART */}
        <Card style={styles.chartCard}>
          <Heading size="subheading" color={theme.text} style={{ marginBottom: 6 }}>
            7-DAY ACTION COMPLETIONS
          </Heading>
          <BarChart data={past7DaysData} orientation="vertical" height={130} />
        </Card>

        {/* FOOTPRINT TREND LINE CHART */}
        <Card style={styles.chartCard}>
          <Heading size="subheading" color={theme.text} style={{ marginBottom: 6 }}>
            FOOTPRINT TREND (KG CO₂e/WK)
          </Heading>
          <LineChart data={footprintTrendPoints} unit="kg" height={120} />
        </Card>

        {/* BADGES GRID */}
        <View style={styles.badgesSection}>
          <Heading size="subheading" color={theme.text} style={styles.badgesHeading}>
            ACHIEVEMENT BADGES ({unlockedBadgeIds.length}/{BADGES.length})
          </Heading>

          <View style={styles.badgeGrid}>
            {BADGES.map((badge) => (
              <BadgeTile
                key={badge.id}
                badge={badge}
                isUnlocked={unlockedBadgeIds.includes(badge.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 96,
  },
  streakCard: {
    marginVertical: 6,
    padding: 16,
  },
  streakLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  streakDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  streakMeta: {
    marginLeft: 14,
  },
  streakFlamePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  streakFlameText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  longestStreakText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  xpSection: {
    marginTop: 10,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  xpText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
  },
  xpSub: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  xpTrack: {
    height: 7,
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 2,
  },
  challengeCard: {
    marginVertical: 6,
    padding: 14,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  challengePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  challengePillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  challengeXp: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
  },
  challengeTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    marginBottom: 2,
  },
  challengeSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  challengeTrack: {
    height: 6,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 4,
  },
  challengeFill: {
    height: '100%',
  },
  challengeProgressText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    marginTop: 2,
  },
  chartCard: {
    marginVertical: 6,
    padding: 14,
  },
  badgesSection: {
    marginTop: 14,
  },
  badgesHeading: {
    marginBottom: 8,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
