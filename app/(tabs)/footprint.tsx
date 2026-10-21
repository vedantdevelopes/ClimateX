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
import { Feather } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { Heading } from '../../components/Heading';
import { Card } from '../../components/Card';
import { BarChart } from '../../components/BarChart';
import { useUser } from '../../store/useUser';
import { useProgress } from '../../store/useProgress';
import { lightTheme, darkTheme, colors } from '../../theme/tokens';
import {
  FootprintInputs,
  DietType,
  LifestyleLevel,
} from '../../lib/footprint';

export default function FootprintScreen() {
  const profile = useUser((s) => s.profile);
  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const currentInputs = useProgress((s) => s.currentFootprintInputs);
  const currentBreakdown = useProgress((s) => s.currentBreakdown);
  const saveFootprintCalculation = useProgress((s) => s.saveFootprintCalculation);

  // Form state
  const [inputs, setInputs] = useState<FootprintInputs>(currentInputs);
  const [activeTab, setActiveTab] = useState<'calculator' | 'breakdown'>('calculator');

  const updateNumberField = (field: keyof FootprintInputs, delta: number, min = 0) => {
    setInputs((prev) => {
      const currentVal = Number(prev[field]) || 0;
      const nextVal = Math.max(min, currentVal + delta);
      return { ...prev, [field]: nextVal };
    });
  };

  const handleSaveCalculation = () => {
    saveFootprintCalculation(inputs);
    setActiveTab('breakdown');
    Alert.alert('Calculation Saved', 'Your carbon footprint has been logged and XP awarded!');
  };

  const chartData = [
    {
      label: 'Transport',
      value: currentBreakdown.transportKgWeek,
      color: colors.maroon,
    },
    {
      label: 'Home Energy',
      value: currentBreakdown.energyKgWeek,
      color: colors.warn,
    },
    {
      label: 'Diet',
      value: currentBreakdown.foodKgWeek,
      color: colors.ok,
    },
    {
      label: 'Lifestyle / Flights',
      value: currentBreakdown.lifestyleKgWeek,
      color: colors.teal,
    },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <Header title="CARBON FOOTPRINT" subtitle="LIFESTYLE CALCULATOR" />

      {/* Switcher Tab between Calculator & Breakdown */}
      <View style={[styles.tabSwitcher, { borderColor: theme.cardBorder, backgroundColor: theme.cardBg }]}>
        <TouchableOpacity
          style={[
            styles.switchBtn,
            activeTab === 'calculator' && { backgroundColor: theme.cardBorder },
          ]}
          onPress={() => setActiveTab('calculator')}
        >
          <Text
            style={[
              styles.switchText,
              { color: activeTab === 'calculator' ? theme.background : theme.text },
            ]}
          >
            ADJUST INPUTS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.switchBtn,
            activeTab === 'breakdown' && { backgroundColor: theme.cardBorder },
          ]}
          onPress={() => setActiveTab('breakdown')}
        >
          <Text
            style={[
              styles.switchText,
              { color: activeTab === 'breakdown' ? theme.background : theme.text },
            ]}
          >
            INSIGHTS & BENCHMARKS
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {activeTab === 'calculator' ? (
          <>
            {/* 1. TRANSPORT STEPPERS */}
            <Card style={styles.card}>
              <View style={styles.cardHeadingRow}>
                <Feather name="navigation" size={16} color={theme.text} />
                <Heading size="subheading" color={theme.text} style={styles.cardHeading}>
                  1. WEEKLY COMMUTE (KM)
                </Heading>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Metro / Local Train</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>0.04 kg/km</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmMetroTrain', -5)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>{inputs.kmMetroTrain} km</Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmMetroTrain', 5)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Two-Wheeler (Petrol)</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>0.10 kg/km</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmTwoWheeler', -5)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>{inputs.kmTwoWheeler} km</Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmTwoWheeler', 5)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Public Bus / Auto</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>0.09–0.11 kg/km</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmBus', -5)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>{inputs.kmBus} km</Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmBus', 5)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Personal Petrol Car</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>0.17 kg/km</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmCar', -5)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>{inputs.kmCar} km</Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('kmCar', 5)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* 2. ENERGY STEPPERS */}
            <Card style={styles.card}>
              <View style={styles.cardHeadingRow}>
                <Feather name="zap" size={16} color={theme.text} />
                <Heading size="subheading" color={theme.text} style={styles.cardHeading}>
                  2. MONTHLY RESIDENTIAL ENERGY
                </Heading>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Electricity Units</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>~0.70 kg/kWh (India grid)</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('monthlyElectricityUnits', -10)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>
                    {inputs.monthlyElectricityUnits} kWh
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('monthlyElectricityUnits', 10)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.counterRow}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>LPG Cylinders / Month</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>42.3 kg CO₂e / cylinder</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('monthlyLpgCylinders', -0.5)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>
                    {inputs.monthlyLpgCylinders}
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('monthlyLpgCylinders', 0.5)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* 3. DIET & FLIGHTS */}
            <Card style={styles.card}>
              <View style={styles.cardHeadingRow}>
                <Feather name="coffee" size={16} color={theme.text} />
                <Heading size="subheading" color={theme.text} style={styles.cardHeading}>
                  3. DIET & FLIGHTS
                </Heading>
              </View>

              <Text style={[styles.subLabel, { color: theme.text }]}>DAILY DIET PATTERN</Text>
              <View style={styles.chipsRow}>
                {(['vegan', 'vegetarian', 'eggetarian', 'moderateMeat', 'heavyMeat'] as DietType[]).map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.chip,
                      {
                        borderColor: theme.cardBorder,
                        backgroundColor: inputs.diet === d ? theme.cardBorder : 'transparent',
                      },
                    ]}
                    onPress={() => setInputs((prev) => ({ ...prev, diet: d }))}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: inputs.diet === d ? theme.background : theme.text },
                      ]}
                    >
                      {d.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.counterRow, { marginTop: 12 }]}>
                <View style={styles.counterInfo}>
                  <Text style={[styles.counterTitle, { color: theme.text }]}>Domestic Flights / Year</Text>
                  <Text style={[styles.counterFactor, { color: theme.textMuted }]}>~180 kg CO₂e / flight</Text>
                </View>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('flightsPerYear', -1)}
                  >
                    <Feather name="minus" size={14} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={[styles.stepValue, { color: theme.text }]}>
                    {inputs.flightsPerYear}
                  </Text>
                  <TouchableOpacity
                    style={[styles.stepBtn, { borderColor: theme.cardBorder }]}
                    onPress={() => updateNumberField('flightsPerYear', 1)}
                  >
                    <Feather name="plus" size={14} color={theme.text} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>

            {/* Save & Calculate Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSaveCalculation}
              accessibilityRole="button"
            >
              <Feather name="check" size={18} color={colors.blush} style={{ marginRight: 6 }} />
              <Text style={styles.saveBtnText}>CALCULATE & LOG PROGRESS (+25 XP)</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* BREAKDOWN & BENCHMARK VIEW */}
            <Card style={styles.totalHeroCard}>
              <Text style={[styles.estimateTag, { color: theme.textMuted }]}>
                ESTIMATE (IPCC / DEFRA / CEA INDIA FACTORS)
              </Text>
              <Text style={[styles.totalNumber, { color: theme.text }]}>
                {currentBreakdown.totalKgWeek}{' '}
                <Text style={styles.totalUnit}>kg CO₂e / week</Text>
              </Text>
              <Text style={[styles.annualNumber, { color: theme.textMuted }]}>
                ≈ {currentBreakdown.totalKgYear.toLocaleString()} kg CO₂e / year
              </Text>

              {/* Callout Box */}
              <View style={[styles.highlightBox, { borderColor: theme.cardBorder, backgroundColor: theme.background }]}>
                <Feather name="target" size={16} color={theme.text} style={{ marginRight: 8 }} />
                <Text style={[styles.highlightText, { color: theme.text }]}>
                  {currentBreakdown.biggestInsight}
                </Text>
              </View>
            </Card>

            {/* CATEGORY BREAKDOWN BARS */}
            <Card style={styles.card}>
              <Heading size="subheading" color={theme.text} style={{ marginBottom: 8 }}>
                CATEGORY BREAKDOWN (KG/WEEK)
              </Heading>
              <BarChart data={chartData} unit="kg" />
            </Card>

            {/* COMPARISON BENCHMARKS */}
            <Card style={styles.card}>
              <Heading size="subheading" color={theme.text} style={{ marginBottom: 12 }}>
                GLOBAL & NATIONAL BENCHMARKS
              </Heading>

              <View style={styles.benchmarkItem}>
                <View style={styles.benchmarkLabelCol}>
                  <Text style={[styles.benchmarkTitle, { color: theme.text }]}>Paris 1.5°C Target</Text>
                  <Text style={[styles.benchmarkSub, { color: theme.textMuted }]}>2,000 kg / year per capita</Text>
                </View>
                <View
                  style={[
                    styles.benchmarkBadge,
                    {
                      backgroundColor:
                        currentBreakdown.vsParisTargetPercent <= 0
                          ? colors.ok
                          : colors.danger,
                    },
                  ]}
                >
                  <Text style={styles.benchmarkBadgeText}>
                    {currentBreakdown.vsParisTargetPercent <= 0 ? '' : '+'}
                    {currentBreakdown.vsParisTargetPercent}%
                  </Text>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.rule }]} />

              <View style={styles.benchmarkItem}>
                <View style={styles.benchmarkLabelCol}>
                  <Text style={[styles.benchmarkTitle, { color: theme.text }]}>India National Average</Text>
                  <Text style={[styles.benchmarkSub, { color: theme.textMuted }]}>1,900 kg / year per capita</Text>
                </View>
                <View
                  style={[
                    styles.benchmarkBadge,
                    {
                      backgroundColor:
                        currentBreakdown.vsIndiaAvgPercent <= 0
                          ? colors.ok
                          : colors.warn,
                    },
                  ]}
                >
                  <Text style={styles.benchmarkBadgeText}>
                    {currentBreakdown.vsIndiaAvgPercent <= 0 ? '' : '+'}
                    {currentBreakdown.vsIndiaAvgPercent}%
                  </Text>
                </View>
              </View>
            </Card>
          </>
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
  tabSwitcher: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 4,
    padding: 3,
  },
  switchBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 3,
  },
  switchText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  card: {
    marginVertical: 6,
    padding: 14,
  },
  cardHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeading: {
    marginLeft: 8,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 0, 16, 0.08)',
  },
  counterInfo: {
    flex: 1,
  },
  counterTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  counterFactor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 1,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    width: 68,
    textAlign: 'center',
  },
  subLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
    marginVertical: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 3,
  },
  chipText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.3,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    marginVertical: 14,
  },
  saveBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  totalHeroCard: {
    padding: 16,
    marginVertical: 6,
  },
  estimateTag: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  totalNumber: {
    fontFamily: 'Anton_400Regular',
    fontSize: 34,
    lineHeight: 38,
  },
  totalUnit: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  annualNumber: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    marginTop: 2,
    marginBottom: 10,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
  },
  highlightText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
  },
  benchmarkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  benchmarkLabelCol: {
    flex: 1,
  },
  benchmarkTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  benchmarkSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    marginTop: 2,
  },
  benchmarkBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },
  benchmarkBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
});
