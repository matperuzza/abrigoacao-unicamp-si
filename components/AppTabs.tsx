import { Tabs } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { colors } from '@/theme';

type Tab = { name: string; title: string; icon: ComponentProps<typeof Ionicons>['name'] };
export function AppTabs({ tabs }: { tabs: Tab[] }) {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary, tabBarHideOnKeyboard: true,
    tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border } }}>
    {tabs.map(tab => <Tabs.Screen key={tab.name} name={tab.name} options={{ title: tab.title,
      tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} color={color} size={size} /> }} />)}
  </Tabs>;
}
