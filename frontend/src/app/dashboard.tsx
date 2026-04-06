import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  type FireScore,
  type FireVulnerability,
  type DispatchUnit,
  getAreaStatus,
  getDispatchUnits,
  getIncidentHistory,
  getLatestIncidents,
} from '../services/apiClient';
import { useAlerts } from '@/hooks/use-alerts';

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

type TabKey = 'latestIncidents' | 'history' | 'dispatch' | 'areaStatus';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'latestIncidents', label: 'Latest Incidents' },
  { key: 'history',         label: 'History' },
  { key: 'dispatch',        label: 'Dispatch' },
  { key: 'areaStatus',      label: 'Area Status' },
];

// ---------------------------------------------------------------------------
// Colour helpers
// ---------------------------------------------------------------------------

function fireScoreStatusColor(status: string): string {
  switch (status) {
    case 'high':   return '#E74C3C';
    case 'medium': return '#E67E22';
    case 'low':    return '#2ECC71';
    default:       return '#8E8E93';
  }
}

function vulnerabilityScoreColor(score: number): string {
  if (score >= 8)  return '#E74C3C'; // critical
  if (score >= 6)  return '#E67E22'; // high
  if (score >= 4)  return '#F1C40F'; // medium
  return '#2ECC71';                  // low
}

function dispatchStatusColor(status: string): string {
  switch (status) {
    case 'on-scene':   return '#E74C3C';
    case 'dispatched': return '#E67E22';
    case 'returning':  return '#F1C40F';
    case 'available':  return '#2ECC71';
    default:           return '#8E8E93';
  }
}

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ---------------------------------------------------------------------------
// Per-tab content components
// ---------------------------------------------------------------------------

function FireScoreCard({ item }: { item: FireScore }) {
  const color = fireScoreStatusColor(item.status);
  return (
    <View
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
      className="bg-white rounded-lg p-3 mb-3"
    >
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-xs font-bold uppercase" style={{ color }}>
          {item.status}
        </Text>
        <View className="rounded px-2 py-0.5" style={{ backgroundColor: color }}>
          <Text className="text-white text-xs font-semibold">
            Score: {item.fireScore}
          </Text>
        </View>
      </View>
      <Text className="text-sm font-semibold text-gray-800">Sensor: {item.sensorID}</Text>
      <Text className="text-xs text-gray-600 mt-0.5">
        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
      </Text>
      <Text className="text-xs text-gray-400 mt-1">{formatTimestamp(item.timestamp)}</Text>
    </View>
  );
}

function DispatchCard({ item }: { item: DispatchUnit }) {
  const statusColor = dispatchStatusColor(item.status);
  return (
    <View className="bg-white rounded-lg p-3 mb-3">
      <View className="flex-row items-center justify-between mb-0.5">
        <Text className="text-sm font-semibold text-gray-800">{item.unitName}</Text>
        <View className="rounded px-2 py-0.5" style={{ backgroundColor: statusColor }}>
          <Text className="text-white text-xs font-semibold uppercase">{item.status}</Text>
        </View>
      </View>
      <Text className="text-xs text-gray-600">{item.location}</Text>
      {item.assignedIncidentId && (
        <Text className="text-xs text-gray-400 mt-0.5">
          Incident: {item.assignedIncidentId}
        </Text>
      )}
    </View>
  );
}

function VulnerabilityCard({ item }: { item: FireVulnerability }) {
  const color = vulnerabilityScoreColor(item.fireVulnerabilityScore);
  return (
    <View className="bg-white rounded-lg p-3 mb-3 flex-1" style={{ margin: 4 }}>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-sm font-bold text-gray-800">{item.areaName}</Text>
        <View className="rounded px-2 py-0.5" style={{ backgroundColor: color }}>
          <Text className="text-white text-xs font-semibold">
            Score: {item.fireVulnerabilityScore.toFixed(1)}
          </Text>
        </View>
      </View>
      <Text className="text-xs text-gray-600">
        {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
      </Text>
      <Text className="text-xs text-gray-400 mt-1">
        Updated {formatTimestamp(item.lastUpdated)}
      </Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function DashboardScreen() {
  const alerts = useAlerts();
  const [activeTab, setActiveTab] = useState<TabKey>('latestIncidents');
  const [incidents, setIncidents] = useState<FireScore[]>([]);
  const [history, setHistory] = useState<FireScore[]>([]);
  const [dispatch, setDispatch] = useState<DispatchUnit[]>([]);
  const [areas, setAreas] = useState<FireVulnerability[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const load = async () => {
      if (activeTab === 'latestIncidents') {
        const data = await getLatestIncidents();
        if (!cancelled) setIncidents(data);
      } else if (activeTab === 'history') {
        const data = await getIncidentHistory();
        if (!cancelled) setHistory(data);
      } else if (activeTab === 'dispatch') {
        const data = await getDispatchUnits();
        if (!cancelled) setDispatch(data);
      } else if (activeTab === 'areaStatus') {
        const data = await getAreaStatus();
        if (!cancelled) setAreas(data);
      }
      if (!cancelled) setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-10">
          <ActivityIndicator size="large" color="#D35400" />
        </View>
      );
    }

    if (activeTab === 'latestIncidents') {
      return incidents.map((item) => <FireScoreCard key={item.id} item={item} />);
    }
    if (activeTab === 'history') {
      return history.map((item) => <FireScoreCard key={item.id} item={item} />);
    }
    if (activeTab === 'dispatch') {
      return dispatch.map((item) => <DispatchCard key={item.id} item={item} />);
    }
    if (activeTab === 'areaStatus') {
      const rows: FireVulnerability[][] = [];
      for (let i = 0; i < areas.length; i += 2) {
        rows.push(areas.slice(i, i + 2));
      }
      return rows.map((row, rowIdx) => (
        <View key={rowIdx} className="flex-row">
          {row.map((item) => <VulnerabilityCard key={item.id} item={item} />)}
          {row.length === 1 && <View className="flex-1" style={{ margin: 4 }} />}
        </View>
      ));
    }
    return null;
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="bg-[#303030] px-[4vw] pt-24 pb-4">
        <Text className="text-2xl font-bold text-white">Dashboard</Text>
      </View>

      {/* Active alerts */}
      {alerts.length > 0 && (
        <View style={{ backgroundColor: '#1a1a1a', paddingHorizontal: 12, paddingVertical: 8, gap: 6 }}>
          {alerts.map((alert) => (
            <View
              key={alert.id}
              style={{
                backgroundColor: alert.type === 'FIRE_SCORE' ? '#c0392b' : '#e67e22',
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Text style={{ fontSize: 14 }}>{alert.type === 'FIRE_SCORE' ? '🔥' : '⚠️'}</Text>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', flexShrink: 1 }}>
                {alert.message}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View className="flex-1 flex-row">
        {/* Sidebar */}
        <View className="bg-[#303030] w-24 pt-4 px-1">
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setActiveTab(key)}
                className="mb-2 rounded-lg px-2 py-3"
                style={{ backgroundColor: isActive ? '#D35400' : 'transparent' }}
                activeOpacity={0.7}
              >
                <Text
                  className="text-xs font-semibold text-center text-white"
                  style={{ opacity: isActive ? 1 : 0.75 }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Main content */}
        <ScrollView
          className="flex-1 px-3 pt-4"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-base font-bold text-gray-700 mb-3">
            {TABS.find((t) => t.key === activeTab)?.label}
          </Text>

          {renderContent()}
        </ScrollView>
      </View>
    </View>
  );
}
