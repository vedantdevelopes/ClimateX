import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Heading } from '../../components/Heading';
import { Card } from '../../components/Card';
import { ActionItem } from '../../components/ActionItem';
import { useUser } from '../../store/useUser';
import { useProgress } from '../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../theme/tokens';

export default function ActionsScreen() {
  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const {
    dailyActions,
    weeklyActions,
    completedActionIds,
    toggleActionDone,
    completedActionLogs,
    latestAward,
    dismissAward,
  } = useProgress();

  const [filter, setFilter] = useState<'all' | 'daily' | 'weekly'>('all');

  const totalKgSaved = completedActionLogs
    .reduce((acc, curr) => acc + (curr.kgSaved || 0), 0);

  const shownActions =
    filter === 'all'
      ? [...dailyActions, ...weeklyActions]
      : filter === 'daily'
      ? dailyActions
      : weeklyActions;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="ACTION PLAN" subtitle="DAILY & WEEKLY HABITS" />

      {/* Award Banner Toast */}
      {latestAward ? (
        <View style={[styles.awardBanner, { backgroundColor: colors.ink }]}>
          <Feather name="award" size={16} color={colors.teal} style={{ marginRight: 8 }} />
          <Text style={styles.awardText}>{latestAward}</Text>
          <TouchableOpacity onPress={dismissAward} style={{ marginLeft: 'auto' }}>
            <Feather name="x" size={16} color={colors.blush} />
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* IMPACT SUMMARY CARD */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryVal, { color: theme.text }]}>
                {completedActionIds.length}
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
                ACTIONS DONE TODAY
              </Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: theme.rule }]} />
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryVal, { color: colors.teal }]}>
                {Math.round(totalKgSaved * 10) / 10} kg
              </Text>
              <Text style={[styles.summaryLabel, { color: theme.textMuted }]}>
                LIFETIME CO₂e REDUCED
              </Text>
            </View>
          </View>
        </Card>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {(['all', 'daily', 'weekly'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.filterPill,
                {
                  borderColor: theme.cardBorder,
                  backgroundColor: filter === mode ? theme.cardBorder : 'transparent',
                },
              ]}
              onPress={() => setFilter(mode)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === mode ? theme.background : theme.text },
                ]}
              >
                {mode.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ACTION ITEMS LIST */}
        {shownActions.length > 0 ? (
          shownActions.map((action) => (
            <ActionItem
              key={action.id}
              action={action}
              isDone={completedActionIds.includes(action.id)}
              onToggle={toggleActionDone}
            />
          ))
        ) : (
          <Card>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              No actions in this category. Check your risk dashboard to refresh!
            </Text>
          </Card>
        )}
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
  awardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  awardText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.blush,
  },
  summaryCard: {
    marginVertical: 8,
    paddingVertical: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontFamily: 'Anton_400Regular',
    fontSize: 26,
    lineHeight: 30,
  },
  summaryLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 32,
  },
  filterRow: {
    flexDirection: 'row',
    marginVertical: 10,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 3,
  },
  filterText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
