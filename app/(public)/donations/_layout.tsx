import { Stack } from 'expo-router/stack';
import { DonationFlowProvider } from '@/features/donations/FlowContext';

export default function DonationsLayout() {
  return (
    <DonationFlowProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DonationFlowProvider>
  );
}