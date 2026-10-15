import { View, StyleSheet, Pressable, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, spacing, radius } from '@/theme';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  bordered?: boolean;
};

export function Card({ children, onPress, accessibilityLabel, style, bordered = true }: Props) {
  const baseStyle = [styles.card, bordered && styles.border, style];
  if (onPress) return (
    <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel}
      onPress={onPress} style={({ pressed }) => [baseStyle, pressed && { opacity: 0.75 }]}>
      {children}
    </Pressable>
  );
  return <View style={baseStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.lg },
  border: { borderWidth: 1, borderColor: colors.border },
});
