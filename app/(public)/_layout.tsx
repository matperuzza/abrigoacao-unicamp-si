import { Stack } from 'expo-router/stack';
import { DonationFlowProvider } from '@/features/donations/FlowContext';

export const unstable_settings = { initialRouteName: '(tabs)' };
export default function PublicLayout() {
  return (
    <DonationFlowProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DonationFlowProvider>
  );
}
