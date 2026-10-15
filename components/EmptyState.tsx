import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/theme';

type Props = {
  title: string;
  description?: string;
  illustration?: React.ReactNode;
};

export function EmptyState({ title, description, illustration }: Props) {
  return (
    <View style={styles.container}>
      {illustration}
      <Text style={styles.title}>{title}</Text>
      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  title: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});