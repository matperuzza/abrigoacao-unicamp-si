import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';

type Props = {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
};

export function Badge({ children, variant = 'info', style }: Props) {
  const bg = {
    info: colors.primarySoft,
    success: '#DCFCE7',
    warning: '#FEF3C7',
    error: '#FEE2E2',
  }[variant];
  const textColor = {
    info: colors.primary,
    success: '#166534',
    warning: '#92400E',
    error: '#991B1B',
  }[variant];

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.text, { color: textColor }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  text: {
    ...typography.caption,
    fontWeight: '600',
  },
});