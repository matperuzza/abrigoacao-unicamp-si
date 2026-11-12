import { Stack } from 'expo-router/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/features/access/AuthContext';

export const unstable_settings = { initialRouteName: '(public)' };

export default function RootLayout() {
  return <SafeAreaProvider>
    <StatusBar style="dark" />
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(public)" />
        <Stack.Screen name="member" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </AuthProvider>
  </SafeAreaProvider>;
}