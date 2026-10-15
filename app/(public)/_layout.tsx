import { Stack } from 'expo-router/stack';
export const unstable_settings = { initialRouteName: '(tabs)' };
export default function PublicLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
