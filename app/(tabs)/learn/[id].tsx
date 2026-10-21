import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Heading } from '../../../components/Heading';
import { Card } from '../../../components/Card';
import { MODULES } from '../../../data/modules';
import { useUser } from '../../../store/useUser';
import { useProgress } from '../../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../../theme/tokens';

export default function ModuleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const completeLearningModule = useProgress((s) => s.completeLearningModule);
  const completedProgress = useProgress((s) => s.completedModules[id || '']);

  const moduleData = MODULES.find((m) => m.id === id) || MODULES[0];

  // Stage: 'cards' | 'quiz' | 'result'
  const [stage, setStage] = useState<'cards' | 'quiz' | 'result'>('cards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const currentCard = moduleData.cards[currentCardIndex];
  const currentQuestion = moduleData.quiz[currentQuestionIndex];

  const handleNextCard = () => {
    if (currentCardIndex < moduleData.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setStage('quiz');
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleSelectOption = (index: number) => {
    if (hasAnsweredCurrent) return;

    const isCorrect = index === currentQuestion.correctIndex;
    const newScore = isCorrect ? quizScore + 1 : quizScore;
    setQuizScore(newScore);

    setSelectedAnswers((prev) => [...prev, index]);
    setHasAnsweredCurrent(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < moduleData.quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setHasAnsweredCurrent(false);
    } else {
      // Quiz finished
      completeLearningModule(moduleData.id, quizScore);
      setStage('result');
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setHasAnsweredCurrent(false);
    setQuizScore(0);
    setStage('quiz');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { borderColor: theme.cardBorder }]}
          accessibilityRole="button"
          accessibilityLabel="Back to modules list"
        >
          <Feather name="arrow-left" size={18} color={theme.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerSub, { color: theme.textMuted }]}>
            SDG {moduleData.sdgGoal} · MODULE
          </Text>
          <Text style={[styles.headerTitle, { color: theme.text }]} numberOfLines={1}>
            {moduleData.title}
          </Text>
        </View>

        <View style={[styles.progressPill, { backgroundColor: colors.ink }]}>
          <Text style={styles.progressPillText}>
            {stage === 'cards'
              ? `${currentCardIndex + 1}/${moduleData.cards.length}`
              : stage === 'quiz'
              ? `Q${currentQuestionIndex + 1}/3`
              : 'DONE'}
          </Text>
        </View>
      </View>

      <View style={[styles.rule, { backgroundColor: theme.rule }]} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {stage === 'cards' && (
          <View style={styles.cardView}>
            {/* Card Content */}
            <Card style={styles.mainCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.badgePill, { backgroundColor: colors.ink }]}>
                  <Text style={styles.badgePillText}>CARD {currentCardIndex + 1}</Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
                  {currentCard.subtitle.toUpperCase()}
                </Text>
              </View>

              <Heading size="small" color={theme.text} style={styles.cardTitle}>
                {currentCard.title}
              </Heading>

              <View style={[styles.miniDivider, { backgroundColor: theme.rule }]} />

              <Text style={[styles.cardBody, { color: theme.text }]}>
                {currentCard.body}
              </Text>

              {/* Stat Callout if present */}
              {currentCard.stat ? (
                <View style={[styles.statBox, { borderColor: theme.cardBorder, backgroundColor: theme.background }]}>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {currentCard.stat.value}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.textMuted }]}>
                    {currentCard.stat.label}
                  </Text>
                </View>
              ) : null}

              {/* Key Takeaway Box */}
              <View style={[styles.takeawayBox, { backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.7)', borderColor: theme.cardBorder }]}>
                <Feather name="check-circle" size={14} color={colors.teal} style={{ marginRight: 6 }} />
                <Text style={[styles.takeawayText, { color: theme.text }]}>
                  {currentCard.keyTakeaway}
                </Text>
              </View>
            </Card>

            {/* Stepper Navigation */}
            <View style={styles.cardNavRow}>
              <TouchableOpacity
                style={[
                  styles.navBtn,
                  { borderColor: theme.cardBorder },
                  currentCardIndex === 0 && { opacity: 0.4 },
                ]}
                onPress={handlePrevCard}
                disabled={currentCardIndex === 0}
              >
                <Feather name="arrow-left" size={16} color={theme.text} />
                <Text style={[styles.navBtnText, { color: theme.text }]}>PREV</Text>
              </TouchableOpacity>

              {/* Dots */}
              <View style={styles.dotsRow}>
                {moduleData.cards.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          idx === currentCardIndex
                            ? theme.text
                            : isDark
                            ? 'rgba(255,221,221,0.25)'
                            : 'rgba(107,0,16,0.25)',
                        width: idx === currentCardIndex ? 18 : 6,
                      },
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                style={[styles.nextBtn, { backgroundColor: colors.maroon }]}
                onPress={handleNextCard}
              >
                <Text style={styles.nextBtnText}>
                  {currentCardIndex === moduleData.cards.length - 1 ? 'QUIZ' : 'NEXT'}
                </Text>
                <Feather name="arrow-right" size={16} color={colors.blush} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {stage === 'quiz' && (
          <View style={styles.quizView}>
            <Card style={styles.mainCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.badgePill, { backgroundColor: colors.ink }]}>
                  <Text style={styles.badgePillText}>
                    QUESTION {currentQuestionIndex + 1} OF 3
                  </Text>
                </View>
                <Text style={[styles.cardSubtitle, { color: theme.textMuted }]}>
                  INSTANT FEEDBACK
                </Text>
              </View>

              <Text style={[styles.questionText, { color: theme.text }]}>
                {currentQuestion.question}
              </Text>

              <View style={styles.optionsList}>
                {currentQuestion.options.map((opt, oIdx) => {
                  let optBorder = theme.cardBorder;
                  let optBg = theme.cardBg;
                  let optText = theme.text;

                  if (hasAnsweredCurrent) {
                    if (oIdx === currentQuestion.correctIndex) {
                      optBorder = colors.ok;
                      optBg = isDark ? 'rgba(46,125,91,0.25)' : 'rgba(46,125,91,0.15)';
                    } else if (selectedAnswers[currentQuestionIndex] === oIdx) {
                      optBorder = colors.danger;
                      optBg = isDark ? 'rgba(179,38,30,0.25)' : 'rgba(179,38,30,0.15)';
                    }
                  }

                  return (
                    <TouchableOpacity
                      key={oIdx}
                      style={[
                        styles.quizOptionBtn,
                        { borderColor: optBorder, backgroundColor: optBg },
                      ]}
                      onPress={() => handleSelectOption(oIdx)}
                      disabled={hasAnsweredCurrent}
                    >
                      <Text style={[styles.quizOptionText, { color: optText }]}>
                        {opt}
                      </Text>
                      {hasAnsweredCurrent && oIdx === currentQuestion.correctIndex ? (
                        <Feather name="check" size={16} color={colors.ok} />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Instant explanation feedback */}
              {hasAnsweredCurrent ? (
                <View
                  style={[
                    styles.explanationBox,
                    {
                      borderColor:
                        selectedAnswers[currentQuestionIndex] === currentQuestion.correctIndex
                          ? colors.ok
                          : colors.danger,
                    },
                  ]}
                >
                  <Text style={[styles.explanationHeading, { color: theme.text }]}>
                    {selectedAnswers[currentQuestionIndex] === currentQuestion.correctIndex
                      ? 'CORRECT'
                      : 'EXPLANATION'}
                  </Text>
                  <Text style={[styles.explanationText, { color: theme.text }]}>
                    {currentQuestion.explanation}
                  </Text>
                </View>
              ) : null}
            </Card>

            {hasAnsweredCurrent ? (
              <TouchableOpacity
                style={styles.continueQuizBtn}
                onPress={handleNextQuestion}
              >
                <Text style={styles.continueQuizText}>
                  {currentQuestionIndex === moduleData.quiz.length - 1
                    ? 'SEE RESULTS'
                    : 'NEXT QUESTION'}
                </Text>
                <Feather name="arrow-right" size={16} color={colors.blush} />
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {stage === 'result' && (
          <View style={styles.resultView}>
            <Card style={styles.resultCard}>
              <View style={[styles.resultPill, { backgroundColor: colors.ink }]}>
                <Text style={styles.resultPillText}>MODULE COMPLETED</Text>
              </View>

              <Heading size="medium" color={theme.text} style={{ marginVertical: 8 }}>
                {quizScore === 3 ? 'PERFECT SCORE!' : 'GREAT EFFORT!'}
              </Heading>

              <Text style={[styles.resultScoreText, { color: colors.teal }]}>
                {quizScore} / 3 Correct
              </Text>

              <Text style={[styles.resultMsg, { color: theme.textMuted }]}>
                You earned +{moduleData.xpReward} XP and updated your climate literacy track.
              </Text>

              <View style={[styles.rewardRow, { borderColor: theme.cardBorder, backgroundColor: theme.background }]}>
                <Feather name="award" size={24} color={colors.teal} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={[styles.rewardTitle, { color: theme.text }]}>
                    Badge Progress
                  </Text>
                  <Text style={[styles.rewardSub, { color: theme.textMuted }]}>
                    Unlocked / Verified in your Progress tab
                  </Text>
                </View>
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={[styles.retakeBtn, { borderColor: theme.cardBorder }]}
                  onPress={handleRetakeQuiz}
                >
                  <Text style={[styles.retakeText, { color: theme.text }]}>RETAKE QUIZ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.doneBtn, { backgroundColor: colors.maroon }]}
                  onPress={() => router.replace('/(tabs)/learn')}
                >
                  <Text style={styles.doneText}>BACK TO MODULES</Text>
                </TouchableOpacity>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitleWrap: {
    flex: 1,
  },
  headerSub: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  headerTitle: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    letterSpacing: -0.3,
  },
  progressPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  progressPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  rule: {
    height: 1,
    width: '100%',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardView: {
    flex: 1,
  },
  mainCard: {
    padding: 16,
    minHeight: 340,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  badgePillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  cardSubtitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  cardTitle: {
    marginVertical: 4,
  },
  miniDivider: {
    height: 1,
    marginVertical: 8,
  },
  cardBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statBox: {
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    alignItems: 'center',
    marginVertical: 8,
  },
  statValue: {
    fontFamily: 'Anton_400Regular',
    fontSize: 26,
    lineHeight: 30,
  },
  statLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  takeawayBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 3,
    padding: 10,
    marginTop: 8,
  },
  takeawayText: {
    flex: 1,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
  },
  cardNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  navBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginHorizontal: 3,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
  },
  nextBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
    color: colors.blush,
    letterSpacing: 0.5,
    marginRight: 4,
  },
  quizView: {
    flex: 1,
  },
  questionText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    lineHeight: 21,
    marginVertical: 12,
  },
  optionsList: {
    marginVertical: 8,
  },
  quizOptionBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    marginVertical: 5,
  },
  quizOptionText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
    marginRight: 8,
  },
  explanationBox: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginTop: 10,
  },
  explanationHeading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  explanationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 16,
  },
  continueQuizBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: 14,
  },
  continueQuizText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.blush,
    letterSpacing: 0.5,
    marginRight: 6,
  },
  resultView: {
    flex: 1,
  },
  resultCard: {
    padding: 20,
    alignItems: 'center',
  },
  resultPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  resultPillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  resultScoreText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 32,
    lineHeight: 36,
  },
  resultMsg: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
    width: '100%',
    marginVertical: 12,
  },
  rewardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  rewardSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    gap: 8,
  },
  retakeBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  retakeText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  doneBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  doneText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 13,
    color: colors.blush,
    letterSpacing: 0.5,
  },
});
