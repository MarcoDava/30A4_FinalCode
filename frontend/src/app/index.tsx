import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';



export default function HomeScreen() {
  return (
    <ThemedView className="flex-1 items-center justify-center w-screen h-screen">
      <SafeAreaView className="flex-1 items-center justify-center gap-4 px-4" style={{ maxWidth: MaxContentWidth, paddingBottom: BottomTabInset + Spacing.three }}>
        <ThemedView className="" >
          
          <ThemedText type="title" className="flex-1 justify-center align-center w-full text-center">
            Welcome to&nbsp;SCEMAS FireWatch
          </ThemedText>
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

