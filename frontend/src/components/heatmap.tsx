import { StyleSheet, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

export function Heatmap() {
  return (
    <View style={styles.container}>
        <MapView
            style={styles.map}
            provider={apiKey ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: 43.2557,
              longitude: -79.8711,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
