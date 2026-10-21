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
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const router = useRouter();
  const setProfile = useUser((s) => s.setProfile);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      Alert.alert('Missing Fields', 'Please enter your email and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 100) {
      Alert.alert('Invalid Email', 'Please enter a valid email address (max 100 characters).');
      return;
    }

    if (password.length > 128) {
      Alert.alert('Invalid Password', 'Password exceeds maximum length allowed.');
      return;
    }

    if (!isFirebaseConfigured || !auth) {
      // Local fallback mode
      setProfile({
        email: cleanEmail,
        name: cleanEmail.split('@')[0],
        isGuest: false,
        hasCompletedOnboarding: true,
      });
      router.replace('/(tabs)/home');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      setProfile({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || cleanEmail.split('@')[0],
        isGuest: false,
        hasCompletedOnboarding: true,
      });
      router.replace('/(tabs)/home');
    } catch (error: any) {
      console.warn('[Auth] Login error:', error);
      Alert.alert('Login Failed', error.message || 'Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      setProfile({
        uid: 'google-' + Date.now(),
        name: 'Climate Student',
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

  const handleContinueAsGuest = () => {
    setProfile({
      isGuest: true,
      hasCompletedOnboarding: true,
    });
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>ACCESS</Text>
          </View>
          <Heading size="medium" color={colors.maroon} style={styles.title}>
            SIGN IN
          </Heading>
          <Text style={styles.subtitle}>
            Sync your climate risk logs and badges across devices.
          </Text>
          <View style={styles.rule} />
        </View>

        {/* Inputs */}
        <View style={styles.form}>
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
              placeholder="••••••••"
              placeholderTextColor="rgba(107, 0, 16, 0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={128}
            />
          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            disabled={isLoading}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.blush} size="small" />
            ) : (
              <Text style={styles.loginBtnText}>SIGN IN</Text>
            )}
          </TouchableOpacity>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR CONTINUE WITH</Text>
            <View style={styles.orLine} />
          </View>

          {/* Google Sign In */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
          >
            <Feather name="globe" size={16} color={colors.maroon} style={styles.socialIcon} />
            <Text style={styles.googleBtnText}>GOOGLE ACCOUNT</Text>
          </TouchableOpacity>

          {/* Guest Button */}
          <TouchableOpacity
            style={styles.guestBtn}
            onPress={handleContinueAsGuest}
            accessibilityRole="button"
            accessibilityLabel="Continue as guest without creating an account"
          >
            <Feather name="user-check" size={16} color={colors.maroon} style={styles.socialIcon} />
            <Text style={styles.guestBtnText}>CONTINUE AS GUEST</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerPrompt}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupLink}>CREATE ONE</Text>
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
  loginBtn: {
    backgroundColor: colors.maroon,
    paddingVertical: 14,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 16,
    color: colors.blush,
    letterSpacing: 0.5,
  },
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
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
    marginBottom: 10,
  },
  googleBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.maroon,
    letterSpacing: 0.5,
  },
  guestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.maroon,
    backgroundColor: colors.blushSoft,
    paddingVertical: 13,
    borderRadius: 4,
  },
  socialIcon: {
    marginRight: 8,
  },
  guestBtnText: {
    fontFamily: 'Anton_400Regular',
    fontSize: 15,
    color: colors.maroon,
    letterSpacing: 0.5,
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
  signupLink: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: colors.maroon,
    textDecorationLine: 'underline',
  },
});
