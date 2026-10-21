import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Heading } from '../../components/Heading';
import { Card } from '../../components/Card';
import { Ring } from '../../components/Ring';
import { ActionItem } from '../../components/ActionItem';
import { OfflineBanner } from '../../components/OfflineBanner';
import { useUser } from '../../store/useUser';
import { useRisk } from '../../store/useRisk';
import { useProgress } from '../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../theme/tokens';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const { data: riskData, isLoading: riskLoading, fetchRisk } = useRisk();
  const {
    streak,
    level,
    xp,
    dailyActions,
    completedActionIds,
    toggleActionDone,
    refreshRecommendations,
    currentBreakdown,
  } = useProgress();

  useEffect(() => {
    fetchRisk(profile.lat, profile.lon, profile.city).catch(() => {});
  }, [profile.lat, profile.lon, profile.city]);

  useEffect(() => {
    if (riskData?.overallLevel) {
      refreshRecommendations(
        riskData.heat.level,
        riskData.aqi.level,
        riskData.flood.level
      );
    }
  }, [riskData?.overallLevel]);

  const onRefresh = async () => {
    await fetchRisk(profile.lat, profile.lon, profile.city, true);
    if (riskData) {
      refreshRecommendations(
        riskData.heat.level,
        riskData.aqi.level,
        riskData.flood.level
      );
    }
  };

  const top3Actions = dailyActions.slice(0, 3);
  const completedTodayCount = top3Actions.filter((a) =>
    completedActionIds.includes(a.id)
  ).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title="TODAY"
        subtitle={`${profile.city} · LVL ${level}`}
        showProfileAvatar={true}
      />

      <OfflineBanner />

      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={riskLoading}
            onRefresh={onRefresh}
            tintColor={theme.tint}
          />
        }
      >
        {/* Subtle Watermark on Hero */}
        <View style={styles.watermarkContainer} pointerEvents="none">
          <Text style={[styles.watermarkText, { color: theme.watermark }]}>
            CLIMATEX
          </Text>
        </View>

        {/* RISK SCORE HERO CARD */}
        <Card style={styles.heroCard}>
          <View style={styles.cardHeaderRow}>
            <Text style={[styles.cardTag, { color: theme.textMuted }]}>
              OVERALL CLIMATE HAZARD
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/risk')}
              style={styles.detailLink}
            >
              <Text style={[styles.detailLinkText, { color: theme.text }]}>DETAILS</Text>
              <Feather name="arrow-up-right" size={14} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.ringWrapper}>
            <Ring
              score={riskData?.overallScore ?? 45}
              label={riskData?.overallLevel ?? 'Moderate'}
              subtitle="Risk Index"
              size={150}
              strokeWidth={12}
            />
          </View>

          {/* 3 Micro Indicators Row */}
          <View style={[styles.hazardsRow, { borderTopColor: theme.rule, borderTopWidth: 1 }]}>
            <TouchableOpacity
              style={styles.hazardCol}
              onPress={() => router.push('/(tabs)/risk')}
            >
              <View style={styles.hazardLabelRow}>
                <Feather name="sun" size={12} color={riskData?.heat.color || colors.ok} />
                <Text style={[styles.hazardTitle, { color: theme.text }]}>HEAT</Text>
              </View>
              <Text style={[styles.hazardValue, { color: theme.text }]}>
                {riskData?.heat.rawValue || '32°C'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.hazardDivider, { backgroundColor: theme.rule }]} />

            <TouchableOpacity
              style={styles.hazardCol}
              onPress={() => router.push('/(tabs)/risk')}
            >
              <View style={styles.hazardLabelRow}>
                <Feather name="wind" size={12} color={riskData?.aqi.color || colors.warn} />
                <Text style={[styles.hazardTitle, { color: theme.text }]}>AIR</Text>
              </View>
              <Text style={[styles.hazardValue, { color: theme.text }]}>
                {riskData?.aqi.rawValue || 'AQI 95'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.hazardDivider, { backgroundColor: theme.rule }]} />

            <TouchableOpacity
              style={styles.hazardCol}
              onPress={() => router.push('/(tabs)/risk')}
            >
              <View style={styles.hazardLabelRow}>
                <Feather name="droplet" size={12} color={riskData?.flood.color || colors.ok} />
                <Text style={[styles.hazardTitle, { color: theme.text }]}>FLOOD</Text>
              </View>
              <Text style={[styles.hazardValue, { color: theme.text }]}>
                {riskData?.flood.rawValue || '0 mm'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* TODAY'S ACTIONS SECTION */}
        <View style={styles.sectionHeader}>
          <Heading size="subheading" color={theme.text}>
            TODAY'S ACTIONS ({completedTodayCount}/3)
          </Heading>
          <TouchableOpacity onPress={() => router.push('/(tabs)/actions')}>
            <Text style={[styles.seeAllText, { color: theme.text }]}>SEE ALL</Text>
          </TouchableOpacity>
        </View>

        {top3Actions.length > 0 ? (
          top3Actions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              isDone={completedActionIds.includes(action.id)}
              onToggle={toggleActionDone}
            />
          ))
        ) : (
          <Card>
            <Text style={[styles.emptyActions, { color: theme.textMuted }]}>
              Generating personalized actions for your location...
            </Text>
          </Card>
        )}

        {/* FOOTPRINT MINI BAR SUMMARY CARD */}
        <View style={[styles.sectionHeader, { marginTop: 14 }]}>
          <Heading size="subheading" color={theme.text}>
            THIS WEEK'S FOOTPRINT
          </Heading>
          <TouchableOpacity onPress={() => router.push('/(tabs)/footprint')}>
            <Text style={[styles.seeAllText, { color: theme.text }]}>CALCULATOR</Text>
          </TouchableOpacity>
        </View>

        <Card style={styles.footprintCard}>
          <View style={styles.footprintTop}>
            <View>
              <Text style={[styles.footprintNumber, { color: theme.text }]}>
                {currentBreakdown.totalKgWeek}{' '}
                <Text style={styles.unitText}>kg CO₂e</Text>
              </Text>
              <Text style={[styles.footprintAnnual, { color: theme.textMuted }]}>
                ≈ {currentBreakdown.totalKgYear.toLocaleString()} kg / year
              </Text>
            </View>

            <View
              style={[
                styles.comparisonPill,
                {
                  backgroundColor:
                    currentBreakdown.vsParisTargetPercent <= 0
                      ? 'rgba(42,157,143,0.15)'
                      : 'rgba(201,138,0,0.15)',
                },
              ]}
            >
              <Feather
                name={currentBreakdown.vsParisTargetPercent <= 0 ? 'check' : 'alert-circle'}
                size={12}
                color={
                  currentBreakdown.vsParisTargetPercent <= 0 ? colors.teal : colors.warn
                }
              />
              <Text
                style={[
                  styles.comparisonText,
                  {
                    color:
                      currentBreakdown.vsParisTargetPercent <= 0
                        ? colors.teal
                        : colors.warn,
                  },
                ]}
              >
                {currentBreakdown.vsParisTargetPercent <= 0 ? 'ON TARGET' : 'ABOVE TARGET'}
              </Text>
            </View>
          </View>

          {/* Mini Stacked Bar by Category */}
          <View style={styles.stackedBarTrack}>
            <View
              style={[
                styles.stackedSegment,
                {
                  flex: Math.max(1, currentBreakdown.transportKgWeek),
                  backgroundColor: colors.maroon,
                },
              ]}
            />
            <View
              style={[
                styles.stackedSegment,
                {
                  flex: Math.max(1, currentBreakdown.energyKgWeek),
                  backgroundColor: colors.warn,
                },
              ]}
            />
            <View
              style={[
                styles.stackedSegment,
                {
                  flex: Math.max(1, currentBreakdown.foodKgWeek),
                  backgroundColor: colors.ok,
                },
              ]}
            />
            <View
              style={[
                styles.stackedSegment,
                {
                  flex: Math.max(1, currentBreakdown.lifestyleKgWeek),
                  backgroundColor: colors.teal,
                },
              ]}
            />
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.maroon }]} />
              <Text style={[styles.legendLabel, { color: theme.textMuted }]}>Transit</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warn }]} />
              <Text style={[styles.legendLabel, { color: theme.textMuted }]}>Power</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.ok }]} />
              <Text style={[styles.legendLabel, { color: theme.textMuted }]}>Diet</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.teal }]} />
              <Text style={[styles.legendLabel, { color: theme.textMuted }]}>Goods</Text>
            </View>
          </View>

          <Text style={[styles.footprintInsight, { color: theme.text }]}>
            {currentBreakdown.biggestInsight}
          </Text>
        </Card>
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
    position: 'relative',
  },
  watermarkContainer: {
    position: 'absolute',
    top: 30,
    right: -40,
    opacity: 0.1,
  },
  watermarkText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 72,
    letterSpacing: -2,
  },
  heroCard: {
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 8,
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTag: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLinkText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    marginRight: 2,
    letterSpacing: 0.5,
  },
  ringWrapper: {
    paddingVertical: 10,
  },
  hazardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    marginTop: 6,
  },
  hazardCol: {
    flex: 1,
    alignItems: 'center',
  },
  hazardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  hazardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  hazardValue: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
  },
  hazardDivider: {
    width: 1,
    height: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 10,
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  seeAllText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
  },
  emptyActions: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 12,
  },
  footprintCard: {
    padding: 14,
  },
  footprintTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  footprintNumber: {
    fontFamily: 'Anton_400Regular',
    fontSize: 28,
    lineHeight: 32,
  },
  unitText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  footprintAnnual: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  comparisonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  comparisonText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  stackedBarTrack: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 2,
    overflow: 'hidden',
    marginVertical: 8,
  },
  stackedSegment: {
    height: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 1,
    marginRight: 4,
  },
  legendLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  footprintInsight: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 0, 16, 0.1)',
    paddingTop: 8,
    marginTop: 4,
  },
});
