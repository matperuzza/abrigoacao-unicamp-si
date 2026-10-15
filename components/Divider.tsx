import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, spacing } from '@/theme';

type Props = {
  style?: StyleProp<ViewStyle>;
  vertical?: boolean;
};

export function Divider({ style, vertical }: Props) {
  if (vertical) {
    return <View style={[styles.vertical, style]} />;
  }
  return <View style={[styles.horizontal, style]} />;
}

const styles = StyleSheet.create({
  horizontal: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  vertical: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
});
