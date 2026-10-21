import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/tokens';
import { Heading } from '../../components/Heading';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    number: '01',
    heading: 'PROBLEM',
    subheading: 'UNSEEN LOCAL RISK',
    body: 'Heatwaves, flash floods, and toxic air are intensifying across Indian cities. Yet most students lack hyper-local intelligence to protect themselves.',
    objective: 'Traditional climate news causes anxiety without giving actionable survival steps.',
  },
  {
    number: '02',
    heading: 'SOLUTION',
    subheading: 'LOCAL RISK + LIFESTYLE',
    body: 'ClimateX unifies real-time environmental hazards with personal carbon footprint metrics, converting complex data into clear daily guidance.',
    objective: 'Free, offline-ready climate risk monitoring powered by Open-Meteo.',
  },
  {
    number: '03',
    heading: 'ACTION',
    subheading: 'HABITS & GAMIFICATION',
    body: 'Complete tailored daily actions, maintain your streak, earn badges, and master bite-sized learning modules supporting UN SDG 13.',
    objective: 'Small consistent actions scale into resilient communities.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentSlide = SLIDES[currentIndex];

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      router.push('/(onboarding)/location');
    }
  };

  const handleSkip = () => {
    router.push('/(onboarding)/location');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top bar with slide pill & Skip */}
        <View style={styles.topBar}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{currentSlide.number} / 03</Text>
          </View>
          <TouchableOpacity onPress={handleSkip} accessibilityRole="button">
            <Text style={styles.skipText}>SKIP</Text>
          </TouchableOpacity>
        </View>

        {/* Slide Content */}
        <View style={styles.slideBody}>
          {/* Square box with bold number (matches reference deck objectives 1-5) */}
          <View style={styles.numberBox}>
            <Text style={styles.numberText}>{currentIndex + 1}</Text>
          </View>

          <Heading size="large" color={colors.maroon} style={styles.heading}>
            {currentSlide.heading}
          </Heading>

          <Text style={styles.subheading}>{currentSlide.subheading}</Text>

          {/* Thin black rule */}
          <View style={styles.rule} />

          <Text style={styles.bodyText}>{currentSlide.body}</Text>

          {/* Callout box */}
          <View style={styles.calloutCard}>
            <Feather name="info" size={16} color={colors.maroon} style={styles.calloutIcon} />
            <Text style={styles.calloutText}>{currentSlide.objective}</Text>
          </View>
        </View>

        {/* Footer with pagination dots and Action button */}
        <View style={styles.footer}>
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === currentIndex ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handleNext}
            accessibilityRole="button"
            accessibilityLabel={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          >
            <Text style={styles.actionBtnText}>
              {currentIndex === SLIDES.length - 1 ? 'GET STARTED' : 'CONTINUE'}
            </Text>
            <Feather name="arrow-right" size={18} color={colors.blush} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.blush,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    backgroundColor: colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  skipText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    color: colors.maroon,
    letterSpacing: 0.5,
  },
  slideBody: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  numberBox: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderColor: colors.maroon,
    backgroundColor: colors.blushSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  numberText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 22,
    color: colors.maroon,
  },
  heading: {
    marginBottom: 2,
  },
  subheading: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    color: colors.maroon,
    letterSpacing: 0.5,
    opacity: 0.75,
    marginBottom: 12,
  },
  rule: {
    height: 1,
    backgroundColor: colors.rule,
    width: '100%',
    marginBottom: 16,
  },
  bodyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.maroon,
    marginBottom: 20,
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.maroon,
    backgroundColor: colors.blushSoft,
    padding: 12,
    borderRadius: 4,
  },
  calloutIcon: {
    marginRight: 10,
  },
  calloutText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
    color: colors.maroon,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.maroon,
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(107, 0, 16, 0.25)',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  actionBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    color: colors.blush,
    letterSpacing: 0.5,
    marginRight: 8,
  },
});
