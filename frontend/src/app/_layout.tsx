import '@/global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';

function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (!isAuthenticated) {
    return (
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }} />
        <Redirect href="/signin" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={theme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
