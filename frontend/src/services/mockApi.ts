/**
 * mockApi.ts — HTTP service layer
 *
 * Calls the Spring Boot backend running on localhost:8080.
 *
 * To use a different backend URL (e.g. on a physical device), set:
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:8080
 * in a .env file or your environment before starting Expo.
 *
 * ENDPOINT TABLE:
 *   getLatestIncidents()  →  GET  /api/incidents/latest    →  FireScoreAgent#getLatest()
 *   getIncidentHistory()  →  GET  /api/incidents/history   →  FireScoreAgent#getHistory()
 *   getDispatchUnits()    →  GET  /api/dispatch/units      →  DispatchController#getUnits()
 *   getAreaStatus()       →  GET  /api/areas/status        →  FireVulnerabilityAgent#getStatus()
 */

// ---------------------------------------------------------------------------
// Types — kept in sync with Java models in com.example.demo
// ---------------------------------------------------------------------------

// Matches FireScore.java
export type FireScore = {
  id: string;
  sensorID: string;
  latitude: number;
  longitude: number;
  fireScore: number;   // getter getFireScore() → JSON key "fireScore"
  timestamp: string;  // ISO 8601
  status: string;     // 'high' | 'medium' | 'low'
};

// Matches DispatchUnit.java
export type DispatchUnit = {
  id: string;
  unitName: string;
  status: string;
  assignedIncidentId: string | null;
  location: string;
};

// Matches FireVulnerability.java
export type FireVulnerability = {
  id: string;
  sensorID: string;
  longitude: number;
  latitude: number;
  fireVulnerabilityScore: number; // 0–10
  lastUpdated: string; // ISO 8601
};

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8080';

// ---------------------------------------------------------------------------
// Internal helper
// ---------------------------------------------------------------------------

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(BASE_URL + path);
  if (!res.ok) {
    throw new Error(`API error ${res.status} for ${path}`);
  }
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export function getLatestIncidents(): Promise<FireScore[]> {
  return apiFetch<FireScore[]>('/api/incidents/latest');
}

export function getIncidentHistory(): Promise<FireScore[]> {
  return apiFetch<FireScore[]>('/api/incidents/history');
}

export function getDispatchUnits(): Promise<DispatchUnit[]> {
  return apiFetch<DispatchUnit[]>('/api/dispatch/units');
}

export function getAreaStatus(): Promise<FireVulnerability[]> {
  return apiFetch<FireVulnerability[]>('/api/areas/status');
}
