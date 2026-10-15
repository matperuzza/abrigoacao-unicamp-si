import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Props = {
  title: string;
  onPress?: () => void;
  variant?: Variant;
  disabled?: boolean;
  fullWidth?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  selected?: boolean;
};

export function Button({ title, onPress, variant = 'primary', disabled, fullWidth = true, loading, accessibilityLabel, style, selected }: Props) {
  const isDisabled = disabled || loading || !onPress;
  const backgroundColor = isDisabled
    ? colors.border
    : variant === 'primary'
    ? colors.primary
    : variant === 'secondary'
    ? colors.background
    : 'transparent';
  const borderColor = variant === 'secondary' ? colors.primary : 'transparent';
  const textColor = isDisabled
    ? colors.textSecondary
    : variant === 'primary'
    ? colors.background
    : colors.primary;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, borderColor, width: fullWidth ? '100%' : 'auto' },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading, selected }}
      accessibilityLabel={accessibilityLabel ?? title}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
    borderTopColor: 'transparent',
  },
});
