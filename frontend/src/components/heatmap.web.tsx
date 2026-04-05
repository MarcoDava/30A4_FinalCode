import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { getAreaStatus } from '../services/apiClient';

type HeatPoint = [number, number, number]; // [lat, lng, intensity]

type LeafletModule = typeof import('leaflet');
type ReactLeafletModule = typeof import('react-leaflet');
type LoadedModules = ReactLeafletModule & {
  HeatLayer: React.ComponentType<{ points: HeatPoint[] }>;
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

export function Heatmap() {
  const [modules, setModules] = useState<LoadedModules | null>(null);
  const [heatPoints, setHeatPoints] = useState<HeatPoint[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadMap = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      // Inject Leaflet CSS dynamically so it only runs in the browser
      if (!document.querySelector('link[data-leaflet-css]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.setAttribute('data-leaflet-css', '');
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Load Leaflet and expose as window.L before importing leaflet.heat.
      // leaflet.heat is a legacy plugin that only patches window.L — it won't
      // auto-patch an ES module import without this.
      const leafletModule = await import('leaflet');
      const L = ((leafletModule as any).default ?? leafletModule) as LeafletModule;
      (window as any).L = L;
      await import('leaflet.heat');

      const rl: ReactLeafletModule = await import('react-leaflet');

      // Fetch heatmap data from backend
      try {
        const data = await getAreaStatus();
        if (mounted) {
          setHeatPoints(
            data.map((d) => [d.latitude, d.longitude, d.fireVulnerabilityScore / 10])
          );
        }
      } catch {
        // backend unavailable — render map without heatmap
      }

      // HeatLayer is defined here as a closure over L and rl so useMap() is available
      function HeatLayer({ points }: { points: HeatPoint[] }) {
        const map = rl.useMap();
        const layerRef = useRef<any>(null);

        useEffect(() => {
          layerRef.current = (L as any).heatLayer(points, {
            radius: 35,
            blur: 20,
            maxZoom:1000,
            gradient: { 0.0: '#ffcccc', 0.4: '#ff6666', 0.7: '#ff0000', 1.0: '#990000' },
          });
          layerRef.current.addTo(map);
          return () => {
            layerRef.current?.remove();
          };
        }, [map, points]);

        return null;
      }

      if (mounted) {
        setModules({ ...rl, HeatLayer });
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

  const { MapContainer, TileLayer, HeatLayer } = modules;

  return (
    <View style={styles.container}>
      <MapContainer {...mapProps}>
        <TileLayer {...tileProps} />
        <HeatLayer points={heatPoints} />
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
