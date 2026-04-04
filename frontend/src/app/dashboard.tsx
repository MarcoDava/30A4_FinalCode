import { ScrollView, Text, View, Button } from 'react-native';

function handleButtonPress() {
  // Handle button press logic here
  console.log('Button pressed!');
}

export default function DashboardScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1 px-6 gap-6 items-center justify-start" >
      <View className="flex flex-direction-row items-center justify-center w-[80vw] bg-[#B3B3B3] rounded-lg mt-[10vh] mb-6 py-5" >
        <View className="flex items-center justify-center w-[75vw] h-full" >
            <Text className="w-full text-2xl font-bold text-left text-white">
            Dashboard
            </Text>
        </View>
      </View>
      <View className="flex items-center justify-between w-[80vw] h-full flex-row"  >
        <View className="flex flex-direction-row items-center justify-start w-[10vw] h-full bg-[#B3B3B3] rounded-lg " >
            <View className="mt-5 w-[6vw] h-[3vh]" >
                <Button title="Latest Incidents" color="transparent" onPress={() => handleButtonPress()} />            
            </View>
            <View className="mt-5 w-[6vw] h-[3vh]" >
                <Button title="History" color="transparent" onPress={() => handleButtonPress()} />            
            </View>
            <View className="mt-5 w-[6vw] h-[3vh]" >
                <Button title="Dispatch" color="transparent" onPress={() => handleButtonPress()} />            
            </View>
            <View className="mt-5 w-[6vw] h-[3vh]" >
                <Button title="Area Status" color="transparent" onPress={() => handleButtonPress()} />            
            </View>
        </View>
        <View className="flex flex-direction-row items-center justify-center w-[69vw] h-full bg-[#B3B3B3] rounded-lg" >

        </View>
      </View>
      
    </ScrollView>
  );
}

