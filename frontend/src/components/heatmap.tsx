import { StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };


// { href, ...rest }: Props // this goes in the function parameters to add props. 
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
export function Heatmap() {
  return (
    <View style={styles.container}>
        <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE} // Use Google Maps instead of native Apple Maps on iOS
            initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
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
