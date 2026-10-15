import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export const unstable_settings = { initialRouteName: '(public)' };

export default function RootLayout() {
  return <SafeAreaProvider>
    <StatusBar style="dark" />
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="member" />
      <Stack.Screen name="+not-found" />
    </Stack>
  </SafeAreaProvider>;
}
