import { StyleSheet, Text, View } from 'react-native';

export function Heatmap() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Map preview is available on iOS and Android.</Text>
      <Text style={styles.subtitle}>The web build uses this fallback to avoid loading native map modules.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
