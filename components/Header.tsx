import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
};

export function Header({ title, onBack, showBack = false }: Props) {
  return (
    <View style={styles.container}>
      {showBack && onBack && (
        <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Voltar">
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
      )}
      <Text accessibilityRole="header" style={[styles.title, { marginLeft: showBack ? spacing.sm : 0 }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 24,
    color: colors.primary,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    flex: 1,
  },
});
