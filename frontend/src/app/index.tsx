import { Text, View, ScrollView } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';


export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 bg-[#303030]">
      <View className="flex flex-direction-row items-center justify-center w-full h-full" >
        <Text className="text-3xl font-bold text-center text-white">
          Welcome to <Text className="text-yellow-400">SCEMAS : FireWatch</Text>
        </Text>
        <Text className="text-base text-center mt-2 text-[#8E8E93]">
          Monitor and track fire risks across the city of Hamilton.
        </Text>
      </View>
    </ScrollView>
  );
}

