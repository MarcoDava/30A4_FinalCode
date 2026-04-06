import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAlerts } from '@/hooks/use-alerts';
import type { FireAlert } from '@/services/apiClient';

function AlertRow({ alert }: { alert: FireAlert }) {
  const isScore = alert.type === 'FIRE_SCORE';
  return (
    <View style={[styles.row, isScore ? styles.rowScore : styles.rowVuln]}>
      <Text style={styles.icon}>{isScore ? '🔥' : '⚠️'}</Text>
      <Text style={styles.message} numberOfLines={2}>{alert.message}</Text>
    </View>
  );
}

export function AlertBanner() {
  const insets = useSafeAreaInsets();
  const alerts = useAlerts();

  if (alerts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top }]} pointerEvents="box-none">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {alerts.map((alert) => (
          <AlertRow key={alert.id} alert={alert} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 999,
    height: 56,
  },
  scroll: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    maxWidth: 280,
  },
  rowScore: {
    backgroundColor: '#c0392b',
  },
  rowVuln: {
    backgroundColor: '#e67e22',
  },
  icon: {
    fontSize: 16,
  },
  message: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    flexShrink: 1,
  },
});
