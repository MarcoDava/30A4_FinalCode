import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

type ReactLeafletModule = typeof import('react-leaflet');

const mapProps = {
  center: [37.78825, -122.4324],
  zoom: 12,
  style: { width: '100%', height: '100%' },
  scrollWheelZoom: true,
  borderRadius: 12,
} as any;

const tileProps = {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  borderRadius: 12,
} as any;

export function Heatmap() {
  const [leaflet, setLeaflet] = useState<ReactLeafletModule | null>(null);
  

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

      const module = await import('react-leaflet');

      if (mounted) {
        setLeaflet(module);
      }
    };

    loadMap();

    return () => {
      mounted = false;
    };
  }, []);

  if (!leaflet) {
    return <View style={styles.container} />;
  }

  const { MapContainer, TileLayer } = leaflet;

  return (
    <View style={styles.container}>
      <MapContainer {...mapProps}>
        <TileLayer {...tileProps} />
      </MapContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '200%',
    height: '50%', 
  },
  map: {
    width: '200%',
    height: '100%',
  },
});
