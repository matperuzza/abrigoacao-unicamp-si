import { Stack } from 'expo-router/stack';
import { DemoAccessProvider, useDemoAccess } from '@/features/access/DemoAccess';

export default function MemberLayout() {
  return <DemoAccessProvider><MemberStack /></DemoAccessProvider>;
}

function MemberStack() {
  const { profile } = useDemoAccess();
  return <Stack screenOptions={{ headerShown: false, headerBackButtonMenuEnabled: false }}>
    <Stack.Screen name="enter" />
    <Stack.Protected guard={profile !== null}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="projects/[id]" />
      <Stack.Screen name="projects/[id]/transition" />
      <Stack.Screen name="playbook/new" />
      <Stack.Screen name="playbook/[id]" />
      <Stack.Screen name="playbook/[id]/edit" />
      <Stack.Screen name="playbook/[id]/history" />
      <Stack.Screen name="playbook/[id]/version/[version]" />
    </Stack.Protected>
  </Stack>;
}
