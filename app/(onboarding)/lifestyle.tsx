import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import { Heading } from '../../components/Heading';
import { useUser } from '../../store/useUser';
import { DietType } from '../../lib/footprint';

const DIET_OPTIONS: { label: string; value: DietType }[] = [
  { label: 'Vegetarian', value: 'vegetarian' },
  { label: 'Eggetarian', value: 'eggetarian' },
  { label: 'Moderate Meat', value: 'moderateMeat' },
  { label: 'Heavy Meat', value: 'heavyMeat' },
  { label: 'Vegan', value: 'vegan' },
];

const TRANSPORT_OPTIONS = [
  { label: 'Metro / Train', value: 'metro/train' },
  { label: 'Public Bus', value: 'bus' },
  { label: 'Two-Wheeler', value: 'two-wheeler' },
  { label: 'Auto / Cab', value: 'auto' },
  { label: 'Walk / Cycle', value: 'walk/cycle' },
  { label: 'Personal Car', value: 'car' },
];

export default function LifestyleProfileScreen() {
  const router = useRouter();
  const profile = useUser((s) => s.profile);
  const setProfile = useUser((s) => s.setProfile);

  const [name, setName] = useState(profile.name || '');
  const [selectedDiet, setSelectedDiet] = useState<DietType>(profile.diet || 'vegetarian');
  const [selectedTransport, setSelectedTransport] = useState(profile.mainTransport || 'metro/bus');

  const handleContinue = () => {
    setProfile({
      name: name.trim() || 'Climate Scout',
      diet: selectedDiet,
      mainTransport: selectedTransport,
    });
    router.push('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>STEP 02</Text>
          </View>
          <Heading size="medium" color={colors.maroon} style={styles.title}>
            LIFESTYLE PROFILE
          </Heading>
          <Text style={styles.subtitle}>
            We personalize recommendations based on your habits.
          </Text>
          <View style={styles.rule} />
        </View>

        {/* Name input */}
        <View style={styles.section}>
          <Text style={styles.label}>YOUR NAME</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Maya or Arjun"
            placeholderTextColor="rgba(107, 0, 16, 0.4)"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Diet Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>PRIMARY DIET</Text>
          <View style={styles.optionsWrap}>
            {DIET_OPTIONS.map((item) => {
              const isSelected = selectedDiet === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionBtn,
                    isSelected ? styles.optionBtnActive : styles.optionBtnInactive,
                  ]}
                  onPress={() => setSelectedDiet(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? styles.optionTextActive : styles.optionTextInactive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Main Transport Selector */}
        <View style={styles.section}>
          <Text style={styles.label}>DAILY PRIMARY COMMUTE</Text>
          <View style={styles.optionsWrap}>
            {TRANSPORT_OPTIONS.map((item) => {
              const isSelected = selectedTransport === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.optionBtn,
                    isSelected ? styles.optionBtnActive : styles.optionBtnInactive,
                  ]}
                  onPress={() => setSelectedTransport(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected ? styles.optionTextActive : styles.optionTextInactive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Continue to account setup"
        >
          <Text style={styles.continueText}>NEXT: ACCOUNT ACCESS</Text>
          <Feather name="arrow-right" size={18} color={colors.blush} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.blush,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 20,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 8,
  },
  pillText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: colors.maroon,
    lineHeight: 18,
    opacity: 0.8,
  },
  rule: {
    height: 1,
    backgroundColor: colors.rule,
    width: '100%',
    marginTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Anton_400Regular',
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.maroon,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.maroon,
    backgroundColor: colors.blushSoft,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: colors.maroon,
  },
  optionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.maroon,
  },
  optionBtnActive: {
    backgroundColor: colors.maroon,
  },
  optionBtnInactive: {
    backgroundColor: colors.blushSoft,
  },
  optionText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  optionTextActive: {
    color: colors.blush,
  },
  optionTextInactive: {
    color: colors.maroon,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    marginTop: 12,
  },
  continueText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.blush,
    letterSpacing: 0.5,
    marginRight: 8,
  },
});
