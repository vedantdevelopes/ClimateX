import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { Heading } from '../../../components/Heading';
import { Card } from '../../../components/Card';
import { MODULES } from '../../../data/modules';
import { useUser } from '../../../store/useUser';
import { useProgress } from '../../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../../theme/tokens';

export default function LearnIndexScreen() {
  const router = useRouter();
  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const completedModules = useProgress((s) => s.completedModules);
  const completedCount = Object.keys(completedModules).length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header
        title="LEARN"
        subtitle={`SDG 13 EDUCATION · ${completedCount}/${MODULES.length} MASTERED`}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Editorial Intro Banner */}
        <Card style={styles.bannerCard}>
          <View style={styles.bannerPill}>
            <Text style={styles.bannerPillText}>TARGET 13.3 · KNOWLEDGE FOR ACTION</Text>
          </View>
          <Text style={[styles.bannerTitle, { color: theme.text }]}>
            Bite-Sized Climate Literacy
          </Text>
          <Text style={[styles.bannerBody, { color: theme.textMuted }]}>
            Each module takes under 3 minutes. Complete interactive cards and a 3-question quiz to earn +30 XP and achievement badges. Works 100% offline.
          </Text>
        </Card>

        {/* MODULE CARDS LIST */}
        {MODULES.map((mod, index) => {
          const isCompleted = Boolean(completedModules[mod.id]);

          return (
            <TouchableOpacity
              key={mod.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/(tabs)/learn/${mod.id}` as any)}
              accessibilityRole="button"
              accessibilityLabel={`Open module ${mod.title}`}
            >
              <Card style={styles.moduleCard}>
                <View style={styles.cardTopRow}>
                  {/* Number square box */}
                  <View style={[styles.numberSquare, { borderColor: theme.cardBorder, backgroundColor: theme.background }]}>
                    <Text style={[styles.numberSquareText, { color: theme.text }]}>
                      {index + 1}
                    </Text>
                  </View>

                  <View style={styles.moduleMeta}>
                    <View style={styles.tagsRow}>
                      <View style={[styles.sdgTag, { backgroundColor: colors.ink }]}>
                        <Text style={styles.sdgTagText}>SDG {mod.sdgGoal}</Text>
                      </View>
                      <Text style={[styles.readTime, { color: theme.textMuted }]}>
                        {mod.readTimeMinutes} MIN READ
                      </Text>
                    </View>

                    <Text style={[styles.moduleTitle, { color: theme.text }]}>
                      {mod.title}
                    </Text>
                  </View>

                  {/* Completion status */}
                  <View style={styles.statusCol}>
                    {isCompleted ? (
                      <View style={[styles.completedPill, { backgroundColor: colors.teal }]}>
                        <Feather name="check" size={13} color="#FFFFFF" />
                      </View>
                    ) : (
                      <View style={[styles.xpPill, { borderColor: theme.cardBorder }]}>
                        <Text style={[styles.xpPillText, { color: theme.text }]}>
                          +{mod.xpReward} XP
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Subtitle / Tagline */}
                <Text style={[styles.tagline, { color: theme.textMuted }]} numberOfLines={2}>
                  {mod.tagline}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={[styles.startPrompt, { color: theme.text }]}>
                    {isCompleted ? 'REVIEW MODULE' : 'START MODULE'}
                  </Text>
                  <Feather name="arrow-right" size={14} color={theme.text} />
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
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
  bannerCard: {
    marginVertical: 6,
    padding: 14,
  },
  bannerPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 6,
  },
  bannerPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  bannerTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 20,
    marginBottom: 4,
  },
  bannerBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 17,
  },
  moduleCard: {
    marginVertical: 5,
    padding: 14,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  numberSquare: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  numberSquareText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
  },
  moduleMeta: {
    flex: 1,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sdgTag: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
    marginRight: 6,
  },
  sdgTagText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 8,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  readTime: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
  },
  moduleTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    lineHeight: 18,
  },
  statusCol: {
    marginLeft: 8,
  },
  completedPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  xpPill: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  xpPillText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 11,
  },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  startPrompt: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginRight: 4,
  },
});
