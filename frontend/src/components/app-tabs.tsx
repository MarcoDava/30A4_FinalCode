
import { Tabs } from 'expo-router';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAlerts } from '@/hooks/use-alerts';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];
  const alerts = useAlerts();
  const alertCount = alerts.length;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.text,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={colors.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'map' : 'map-outline'}
              size={24}
              color={colors.text}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarBadge: alertCount > 0 ? alertCount : undefined,
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={24}
              color={colors.text}
            />
          ),
        }}
      />
    </Tabs>
  );
}
