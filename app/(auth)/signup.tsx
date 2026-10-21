import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import { Heading } from '../../components/Heading';
import { useUser } from '../../store/useUser';
import { auth, db, isFirebaseConfigured } from '../../lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function SignupScreen() {
  const router = useRouter();
  const profile = useUser((s) => s.profile);
  const setProfile = useUser((s) => s.setProfile);

  const [name, setName] = useState(profile.name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      Alert.alert('Missing Details', 'Please complete all fields.');
      return;
    }

    if (cleanName.length > 80) {
      Alert.alert('Name Too Long', 'Full name must be under 80 characters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (max 100 characters).');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }

    if (password.length > 128) {
      Alert.alert('Password Too Long', 'Password must not exceed 128 characters.');
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      // Local fallback mode
      setProfile({
        name: cleanName,
        email: cleanEmail,
        isGuest: false,
        hasCompletedOnboarding: true,
      });
      router.replace('/(tabs)/home');
      return;
    }

    setIsLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      await updateProfile(userCred.user, { displayName: cleanName });

      // Migrate / save profile to Firestore
      if (db?.type) {
        try {
          await setDoc(doc(db, 'users', userCred.user.uid), {
            name: cleanName,
            email: cleanEmail,
            city: profile.city || 'Local Area',
            lat: profile.lat || 0,
            lon: profile.lon || 0,
            diet: profile.diet || 'omnivore',
            mainTransport: profile.mainTransport || 'public_transit',
            notifyTime: profile.notifyTime || '08:00',
            theme: profile.theme || 'system',
            createdAt: Date.now(),
          });
        } catch (dbErr) {
          console.warn('[Firestore] Migration error:', dbErr);
        }
      }

      setProfile({
        uid: userCred.user.uid,
        name: cleanName,
        email: cleanEmail,
        isGuest: false,
        hasCompletedOnboarding: true,
      });

      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.warn('[Auth] Signup failed:', error);
      Alert.alert('Registration Failed', error.message || 'Unable to register account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      setProfile({
        uid: 'google-' + Date.now(),
        name: name.trim() || 'Climate Student',
        email: 'climate.student@gmail.com',
        isGuest: false,
        hasCompletedOnboarding: true,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.warn('[Auth] Google sign in error:', error);
      Alert.alert('Sign In Error', 'Unable to complete Google Sign In.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>ACCOUNT</Text>
          </View>
          <Heading size="medium" color={colors.maroon} style={styles.title}>
            CREATE ACCOUNT
          </Heading>
          <Text style={styles.subtitle}>
            Join the urban climate resilience movement.
          </Text>
          <View style={styles.rule} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Maya Patel"
              placeholderTextColor="rgba(107, 0, 16, 0.4)"
              value={name}
              onChangeText={setName}
              maxLength={80}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="name@university.edu"
              placeholderTextColor="rgba(107, 0, 16, 0.4)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor="rgba(107, 0, 16, 0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={128}
            />
          </View>

          <TouchableOpacity
            style={styles.signupBtn}
            onPress={handleSignup}
            disabled={isLoading}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.blush} size="small" />
            ) : (
              <Text style={styles.signupBtnText}>START YOUR JOURNEY</Text>
            )}
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR CONTINUE WITH</Text>
            <View style={styles.orLine} />
          </View>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign up with Google"
          >
            <Feather name="globe" size={16} color={colors.maroon} style={styles.socialIcon} />
            <Text style={styles.googleBtnText}>GOOGLE ACCOUNT</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginLink}>SIGN IN</Text>
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
    paddingBottom: 24,
    justifyContent: 'space-between',
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
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Anton_400Regular',
    fontSize: 13,
    letterSpacing: 0.5,
    color: colors.maroon,
    marginBottom: 6,
  },
  input: {
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
  signupBtn: {
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  signupBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(107, 0, 16, 0.2)',
  },
  orText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: colors.maroon,
    paddingHorizontal: 10,
    opacity: 0.6,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.maroon,
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 4,
  },
  googleBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.maroon,
    letterSpacing: 0.5,
  },
  socialIcon: {
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerPrompt: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: colors.maroon,
    marginRight: 6,
  },
  loginLink: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: colors.maroon,
    textDecorationLine: 'underline',
  },
});
