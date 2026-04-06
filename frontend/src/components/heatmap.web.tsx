import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getAreaStatus, getLatestIncidents, type FireVulnerability, type FireScore } from '../services/apiClient';

type HeatPoint = [number, number, number]; // [lat, lng, intensity]

type LeafletModule = typeof import('leaflet');
type ReactLeafletModule = typeof import('react-leaflet');
type LoadedModules = ReactLeafletModule & {
  HeatLayer: React.ComponentType<{ vulnPoints: HeatPoint[]; scorePoints: HeatPoint[]; combinedPoints: HeatPoint[] }>;
  MapClickHandler: React.ComponentType<{ areas: FireVulnerability[]; incidents: FireScore[] }>;
};


const mapProps = {
  center: [43.2557, -79.8711] as [number, number], // Hamilton, ON
  zoom: 12,
  style: { width: '100%', height: '100%' },
  scrollWheelZoom: true,
} as any;

const tileProps = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
} as any;

// Haversine distance in km between two lat/lng points
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const OVERLAP_KM = 1.5;

const HEAT_CONFIG = {
  radius: 25,
  blur: 10,
  minOpacity: 0.6,
  maxZoom: 1000,
};

const VULN_GRADIENT = { 0.0: '#ffffb2', 0.4: '#fecc5c', 0.7: '#fd8d3c', 1.0: '#e31a1c' };
const SCORE_GRADIENT = { 0.0: '#c6dbef', 0.4: '#6baed6', 0.7: '#2171b5', 1.0: '#08306b' };
const COMBINED_GRADIENT = { 0.0: '#dadaeb', 0.4: '#9e9ac8', 0.7: '#6a51a3', 1.0: '#4a1486' };

export function Heatmap() {
  const [modules, setModules] = useState<LoadedModules | null>(null);
  const [vulnPoints, setVulnPoints] = useState<HeatPoint[]>([]);
  const [scorePoints, setScorePoints] = useState<HeatPoint[]>([]);
  const [combinedPoints, setCombinedPoints] = useState<HeatPoint[]>([]);
  const [areas, setAreas] = useState<FireVulnerability[]>([]);
  const [incidents, setIncidents] = useState<FireScore[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      if (!document.querySelector('link[data-leaflet-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-leaflet-css', '');
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      const leafletModule = await import('leaflet');
      const L = ((leafletModule as any).default ?? leafletModule) as LeafletModule;
      (window as any).L = L;
      await import('leaflet.heat');

      const rl: ReactLeafletModule = await import('react-leaflet');

      try {
        const [areaData, incidentData] = await Promise.all([getAreaStatus(), getLatestIncidents()]);
        if (mounted) {
          setAreas(areaData);
          setIncidents(incidentData);

          // Classify each area point: combined if a matching incident is nearby, else vuln-only
          const vulnOnly: HeatPoint[] = [];
          const combined: HeatPoint[] = [];

          for (const area of areaData) {
            const hasMatch = incidentData.some(
              (inc) => distanceKm(area.latitude, area.longitude, inc.latitude, inc.longitude) <= OVERLAP_KM
            );
            const pt: HeatPoint = [area.latitude, area.longitude, area.fireVulnerabilityScore / 10];
            if (hasMatch) {
              combined.push(pt);
            } else {
              vulnOnly.push(pt);
            }
          }

          // Score-only: incidents that don't overlap with any area
          const scoreOnly: HeatPoint[] = incidentData
            .filter(
              (inc) =>
                !areaData.some(
                  (area) => distanceKm(inc.latitude, inc.longitude, area.latitude, area.longitude) <= OVERLAP_KM
                )
            )
            .map((inc) => [inc.latitude, inc.longitude, Math.min(inc.fireScore / 10, 1)] as HeatPoint);

          setVulnPoints(vulnOnly);
          setScorePoints(scoreOnly);
          setCombinedPoints(combined);
        }
      } catch {
        // backend unavailable — render map without heatmap
      }

      function HeatLayer({
        vulnPoints: vp,
        scorePoints: sp,
        combinedPoints: cp,
      }: {
        vulnPoints: HeatPoint[];
        scorePoints: HeatPoint[];
        combinedPoints: HeatPoint[];
      }) {
        const map = rl.useMap();
        const vulnRef = useRef<any>(null);
        const scoreRef = useRef<any>(null);
        const combinedRef = useRef<any>(null);

        useEffect(() => {
          vulnRef.current = (L as any).heatLayer(vp, { ...HEAT_CONFIG, gradient: VULN_GRADIENT }).addTo(map);
          scoreRef.current = (L as any).heatLayer(sp, { ...HEAT_CONFIG, gradient: SCORE_GRADIENT }).addTo(map);
          combinedRef.current = (L as any).heatLayer(cp, { ...HEAT_CONFIG, gradient: COMBINED_GRADIENT }).addTo(map);
          return () => {
            vulnRef.current?.remove();
            scoreRef.current?.remove();
            combinedRef.current?.remove();
          };
        }, [map, vp, sp, cp]);

        useEffect(() => {
          const legend = (L as any).control({ position: 'bottomright' });
          legend.onAdd = () => {
            const div = document.createElement('div');
            div.style.cssText =
              'background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:8px;font-size:13px;line-height:1.8;box-shadow:0 1px 4px rgba(0,0,0,0.3);';
            div.innerHTML = `
              <b style="display:block;margin-bottom:4px;">Legend</b>
              <span style="display:inline-block;width:14px;height:14px;background:#fd8d3c;border-radius:3px;margin-right:6px;vertical-align:middle;"></span>Fire Vulnerability<br/>
              <span style="display:inline-block;width:14px;height:14px;background:#2171b5;border-radius:3px;margin-right:6px;vertical-align:middle;"></span>Fire Score<br/>
              <span style="display:inline-block;width:14px;height:14px;background:#6a51a3;border-radius:3px;margin-right:6px;vertical-align:middle;"></span>Both
            `;
            return div;
          };
          legend.addTo(map);
          return () => { legend.remove(); };
        }, [map]);

        return null;
      }

      function MapClickHandler({
        areas: areaList,
        incidents: incidentList,
      }: {
        areas: FireVulnerability[];
        incidents: FireScore[];
      }) {
        const map = rl.useMap();

        useEffect(() => {
          const onClick = (e: any) => {
            const { lat, lng } = e.latlng;
            const THRESHOLD_KM = 2;

            let nearestArea: FireVulnerability | null = null;
            let nearestAreaDist = Infinity;
            for (const area of areaList) {
              const d = distanceKm(lat, lng, area.latitude, area.longitude);
              if (d < nearestAreaDist) { nearestAreaDist = d; nearestArea = area; }
            }

            let nearestIncident: FireScore | null = null;
            let nearestIncidentDist = Infinity;
            for (const inc of incidentList) {
              const d = distanceKm(lat, lng, inc.latitude, inc.longitude);
              if (d < nearestIncidentDist) { nearestIncidentDist = d; nearestIncident = inc; }
            }

            const hasArea = nearestArea && nearestAreaDist <= THRESHOLD_KM;
            const hasIncident = nearestIncident && nearestIncidentDist <= THRESHOLD_KM;

            let content: string;
            if (!hasArea && !hasIncident) {
              content = '<b>No data available for this area</b>';
            } else {
              const lines: string[] = [];
              if (hasArea) {
                lines.push(`<b>${nearestArea!.areaName}</b>`);
                lines.push(`Fire Vulnerability Score: <b>${nearestArea!.fireVulnerabilityScore.toFixed(1)} / 10</b>`);
              }
              if (hasIncident) {
                lines.push(`Fire Score: <b>${nearestIncident!.fireScore.toFixed(1)}</b>`);
                lines.push(`Status: <b>${nearestIncident!.status}</b>`);
              }
              content = lines.join('<br/>');
            }

            (L as any).popup()
              .setLatLng(e.latlng)
              .setContent(content)
              .openOn(map);
          };

          map.on('click', onClick);
          return () => { map.off('click', onClick); };
        }, [map, areaList, incidentList]);

        return null;
      }

      if (mounted) {
        setModules({ ...rl, HeatLayer, MapClickHandler });
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  if (!modules) {
    return <View style={styles.container} />;
  }

  const { MapContainer, TileLayer, HeatLayer, MapClickHandler } = modules;

  return (
    <View style={styles.container}>
      <MapContainer {...mapProps}>
        <TileLayer {...tileProps} />
        <HeatLayer vulnPoints={vulnPoints} scorePoints={scorePoints} combinedPoints={combinedPoints} />
        <MapClickHandler areas={areas} incidents={incidents} />
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '50%',
  },
});
