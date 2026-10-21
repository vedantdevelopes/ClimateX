import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Heading } from '../components/Heading';
import { Card } from '../components/Card';
import { useUser } from '../store/useUser';
import { useProgress } from '../store/useProgress';
import { useRisk } from '../store/useRisk';
import { lightTheme, darkTheme, colors, ThemeMode } from '../theme/tokens';
import { DietType } from '../lib/footprint';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, setProfile, setTheme, resetUser } = useUser();
  const { resetProgress, footprintHistory, completedActionLogs, xp, level, streak, unlockedBadgeIds } = useProgress();

  const themeMode = profile.theme;
  const isDark = themeMode === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const [name, setName] = useState(profile.name);
  const [notifyTime, setNotifyTime] = useState(profile.notifyTime || '08:30');

  const handleSaveProfile = () => {
    setProfile({
      name: name.trim() || 'Climate Scout',
      notifyTime,
    });
    Alert.alert('Saved', 'Profile preferences updated.');
  };

  const handleExportData = async () => {
    try {
      const exportObject = {
        app: 'ClimateX',
        exportDate: new Date().toISOString(),
        user: profile,
        stats: { xp, level, streak, badges: unlockedBadgeIds },
        footprintLogs: footprintHistory,
        actionLogs: completedActionLogs,
      };

      const result = await Share.share({
        message: JSON.stringify(exportObject, null, 2),
        title: 'ClimateX Data Export',
      });
    } catch (error: any) {
      Alert.alert('Export Failed', error.message);
    }
  };

  const handleDeleteData = () => {
    Alert.alert(
      'Reset All Data',
      'This will erase your locally saved footprints, streaks, and progress. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetUser();
            resetProgress();
            router.replace('/(onboarding)/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <Heading size="small" color={theme.text}>
          PROFILE & SETTINGS
        </Heading>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.closeBtn, { borderColor: theme.cardBorder }]}
          accessibilityRole="button"
          accessibilityLabel="Close"
        >
          <Feather name="x" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={[styles.rule, { backgroundColor: theme.rule }]} />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* USER INFO CARD */}
        <Card style={styles.card}>
          <View style={styles.userBadgeRow}>
            <View style={[styles.avatarBox, { borderColor: theme.cardBorder }]}>
              <Feather name="user" size={24} color={theme.text} />
            </View>
            <View style={styles.userMeta}>
              <Text style={[styles.userName, { color: theme.text }]}>{profile.name}</Text>
              <Text style={[styles.userStatus, { color: theme.textMuted }]}>
                {profile.isGuest ? 'Guest Mode (Offline-first)' : profile.email}
              </Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>DISPLAY NAME</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.cardBorder, color: theme.text, backgroundColor: theme.cardBg }]}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>DAILY NOTIFICATION TIME</Text>
            <TextInput
              style={[styles.input, { borderColor: theme.cardBorder, color: theme.text, backgroundColor: theme.cardBg }]}
              value={notifyTime}
              onChangeText={setNotifyTime}
              placeholder="08:30"
              placeholderTextColor={theme.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.maroon }]}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveBtnText}>SAVE SETTINGS</Text>
          </TouchableOpacity>
        </Card>

        {/* THEME SELECTOR */}
        <Card style={styles.card}>
          <Heading size="subheading" color={theme.text} style={{ marginBottom: 10 }}>
            APPEARANCE (THEME)
          </Heading>
          <View style={styles.themeOptionsRow}>
            {(['system', 'light', 'dark'] as ThemeMode[]).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.themeBtn,
                  {
                    borderColor: theme.cardBorder,
                    backgroundColor: profile.theme === mode ? theme.cardBorder : 'transparent',
                  },
                ]}
                onPress={() => setTheme(mode)}
              >
                <Text
                  style={[
                    styles.themeBtnText,
                    { color: profile.theme === mode ? theme.background : theme.text },
                  ]}
                >
                  {mode.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* DATA MANAGEMENT */}
        <Card style={styles.card}>
          <Heading size="subheading" color={theme.text} style={{ marginBottom: 10 }}>
            DATA & PRIVACY
          </Heading>

          <TouchableOpacity
            style={[styles.actionRowBtn, { borderColor: theme.cardBorder }]}
            onPress={handleExportData}
          >
            <Feather name="share-2" size={16} color={theme.text} style={{ marginRight: 8 }} />
            <Text style={[styles.actionRowText, { color: theme.text }]}>Export My Data (JSON)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRowBtn, { borderColor: colors.danger, marginTop: 8 }]}
            onPress={handleDeleteData}
          >
            <Feather name="trash-2" size={16} color={colors.danger} style={{ marginRight: 8 }} />
            <Text style={[styles.actionRowText, { color: colors.danger }]}>
              Reset Account & Clear Data
            </Text>
          </TouchableOpacity>
        </Card>

        {/* ABOUT & ACADEMIC CREDITS */}
        <Card style={styles.card}>
          <Heading size="subheading" color={theme.text} style={{ marginBottom: 6 }}>
            ABOUT CLIMATEX
          </Heading>
          <Text style={[styles.aboutText, { color: theme.text }]}>
            An Interactive Mobile App for Personalized Climate Risk Assessment and Action Planning.
          </Text>

          <View style={[styles.aboutItem, { borderTopColor: theme.rule, borderTopWidth: 1 }]}>
            <Text style={[styles.aboutLabel, { color: theme.textMuted }]}>PRIMARY SDG</Text>
            <Text style={[styles.aboutVal, { color: theme.text }]}>
              SDG 13 (Climate Action) · Also SDG 4, 11, 17
            </Text>
          </View>

          <View style={[styles.aboutItem, { borderTopColor: theme.rule, borderTopWidth: 1 }]}>
            <Text style={[styles.aboutLabel, { color: theme.textMuted }]}>PROJECT TEAM</Text>
            <Text style={[styles.aboutVal, { color: theme.text }]}>
              Team Phoenix
            </Text>
          </View>

          <View style={[styles.aboutItem, { borderTopColor: theme.rule, borderTopWidth: 1 }]}>
            <Text style={[styles.aboutLabel, { color: theme.textMuted }]}>INSTITUTION</Text>
            <Text style={[styles.aboutVal, { color: theme.text }]}>
              Woxsen University
            </Text>
          </View>

          <View style={[styles.aboutItem, { borderTopColor: theme.rule, borderTopWidth: 1 }]}>
            <Text style={[styles.aboutLabel, { color: theme.textMuted }]}>DATA SOURCES</Text>
            <Text style={[styles.aboutVal, { color: theme.text }]}>
              Open-Meteo APIs (Forecast, Air Quality, Flood), IPCC, DEFRA, CEA India grid
            </Text>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rule: {
    height: 1,
    width: '100%',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  card: {
    marginVertical: 6,
    padding: 16,
  },
  userBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderWidth: 1.5,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  userMeta: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Anton_400Regular',
    fontSize: 18,
  },
  userStatus: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  inputGroup: {
    marginVertical: 6,
  },
  inputLabel: {
    fontFamily: 'Anton_400Regular',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  saveBtn: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 14,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 10,
    alignItems: 'center',
  },
  themeBtnText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    padding: 12,
  },
  actionRowText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
  aboutText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  aboutItem: {
    paddingVertical: 8,
  },
  aboutLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  aboutVal: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginTop: 2,
  },
});
