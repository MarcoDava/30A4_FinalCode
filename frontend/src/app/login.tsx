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
import { LoginPage, createStubUserManagementClient } from '@/presentation/account';

export default function LoginScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [, setTick] = useState(0);
  const notify = useCallback(() => setTick((t) => t + 1), []);

  const userManagement = useMemo(() => createStubUserManagementClient(), []);
  const page = useMemo(() => new LoginPage(userManagement, notify), [userManagement, notify]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    page.displayPage();
  }, [page]);

  async function onLogin() {
    const ok = await page.submit(username, password);
    if (ok) {
      router.replace('/');
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
            Sign in
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Enter your username or email and password.
          </ThemedText>

          <ThemedText type="smallBold">Username or email</ThemedText>
          <TextInput
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="username or email"
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

          {page.message ? (
            <ThemedText type="small" style={styles.message}>
              {page.message}
            </ThemedText>
          ) : null}

          <Pressable
            onPress={onLogin}
            style={({ pressed }) => [styles.primaryButton, { opacity: pressed ? 0.85 : 1 }]}>
            <ThemedText type="smallBold" style={styles.primaryButtonLabel}>
              Log in
            </ThemedText>
          </Pressable>

          <Link href="/create-account" asChild>
            <Pressable style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <ThemedText type="linkPrimary">Create an account</ThemedText>
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
