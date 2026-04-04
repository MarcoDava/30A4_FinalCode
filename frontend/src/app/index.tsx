import { Text, View, ScrollView } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';


export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6">
      <View className="flex flex-direction-row items-center justify-center w-full h-full" >
        <Text className="text-2xl font-bold text-center">
          Welcome to SCEMAS FireWatch
        </Text>
      </View>

    </ScrollView>
  );
}

