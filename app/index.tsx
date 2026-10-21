import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../store/useUser';
import { colors } from '../theme/tokens';
import { Heading } from '../components/Heading';

const { width } = Dimensions.get('window');

export default function SplashScreenComponent() {
  const router = useRouter();
  const hasCompletedOnboarding = useUser((s) => s.profile.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/(onboarding)/onboarding');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding, router]);

  return (
    <View style={styles.container}>
      {/* Giant faint repeated watermark in maroonDeep */}
      <View style={styles.watermarkContainer} pointerEvents="none">
        <Text style={styles.watermarkText}>CLIMATEX</Text>
        <Text style={styles.watermarkText}>CLIMATEX</Text>
        <Text style={styles.watermarkText}>CLIMATEX</Text>
        <Text style={styles.watermarkText}>CLIMATEX</Text>
      </View>

      {/* Main Brand Hero */}
      <View style={styles.content}>
        <View style={styles.badgePill}>
          <Text style={styles.pillText}>SDG 13 · CLIMATE ACTION</Text>
        </View>

        <Heading size="large" color={colors.blush} style={styles.title}>
          CLIMATEX
        </Heading>

        <View style={styles.rule} />

        <Text style={styles.tagline}>
          Personalized Climate Risk & Action Planning
        </Text>
      </View>

      {/* Bottom attribution */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>BUILT FOR URBAN & CAMPUS RESILIENCE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.maroon,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  watermarkContainer: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    justifyContent: 'space-around',
    opacity: 0.18,
  },
  watermarkText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 90,
    lineHeight: 96,
    color: colors.maroonDeep,
    letterSpacing: -2,
    textTransform: 'uppercase',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
    width: '100%',
  },
  badgePill: {
    backgroundColor: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 16,
  },
  pillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.blush,
    letterSpacing: 1,
  },
  title: {
    fontSize: 58,
    lineHeight: 62,
    textAlign: 'center',
  },
  rule: {
    height: 1.5,
    backgroundColor: colors.blush,
    width: '60%',
    marginVertical: 14,
    opacity: 0.8,
  },
  tagline: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.blush,
    textAlign: 'center',
    letterSpacing: 0.3,
    maxWidth: 280,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: 'rgba(255, 221, 221, 0.5)',
    letterSpacing: 1,
  },
});
