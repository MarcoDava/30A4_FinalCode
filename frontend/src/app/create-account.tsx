import { Link, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { CreateAccountPage, createHttpUserManagementClient } from '@/presentation/account';

export default function CreateAccountScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [, setTick] = useState(0);
  const notify = useCallback(() => setTick((t) => t + 1), []);

  const userManagement = useMemo(() => createHttpUserManagementClient(), []);
  const page = useMemo(() => new CreateAccountPage(userManagement, notify), [userManagement, notify]);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    page.displayPage();
  }, [page]);

  async function onSubmit() {
    const ok = await page.submit({
      username,
      email,
      phoneNumber,
      password,
      confirmPassword,
    });
    if (ok) {
      router.replace('/login');
    }
  }

  const bottomPad = insets.bottom + BottomTabInset + Spacing.three;

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + Spacing.four,
            paddingBottom: bottomPad,
            paddingHorizontal: Spacing.four,
          },
        ]}>
        <ThemedView style={styles.inner}>
          <ThemedText type="subtitle" style={styles.title}>
            Create account
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Register with username, email, phone, and password.
          </ThemedText>

          <ThemedText type="smallBold">Username</ThemedText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="username"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundElement,
                backgroundColor: theme.backgroundElement,
              },
            ]}
          />

          <ThemedText type="smallBold">Email</ThemedText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="email"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundElement,
                backgroundColor: theme.backgroundElement,
              },
            ]}
          />

          <ThemedText type="smallBold">Phone number</ThemedText>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="phone number"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundElement,
                backgroundColor: theme.backgroundElement,
              },
            ]}
          />

          <ThemedText type="smallBold">Password</ThemedText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="password"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundElement,
                backgroundColor: theme.backgroundElement,
              },
            ]}
          />

          <ThemedText type="smallBold">Confirm password</ThemedText>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="confirm password"
            placeholderTextColor={theme.textSecondary}
            style={[
              styles.input,
              {
                color: theme.text,
                borderColor: theme.backgroundElement,
                backgroundColor: theme.backgroundElement,
              },
            ]}
          />

          {page.message ? (
            <ThemedText type="small" style={styles.message}>
              {page.message}
            </ThemedText>
          ) : null}

          <Pressable
            onPress={onSubmit}
            style={({ pressed }) => [styles.primaryButton, { opacity: pressed ? 0.85 : 1 }]}>
            <ThemedText type="smallBold" style={styles.primaryButtonLabel}>
              Create account
            </ThemedText>
          </Pressable>

          <Link href="/login" asChild>
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <ThemedText type="linkPrimary">Already have an account? Sign in</ThemedText>
            </Pressable>
          </Link>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  inner: {
    gap: Spacing.two,
    width: '100%',
  },
  title: {
    marginBottom: Spacing.one,
  },
  subtitle: {
    marginBottom: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 16,
    marginBottom: Spacing.two,
  },
  message: {
    marginTop: Spacing.one,
  },
  primaryButton: {
    backgroundColor: '#3c87f7',
    paddingVertical: Spacing.three,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.two,
  },
  primaryButtonLabel: {
    color: '#ffffff',
  },
});
