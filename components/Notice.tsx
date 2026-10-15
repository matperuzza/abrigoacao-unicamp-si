import { Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography } from '@/theme';

export function Notice({ children }: { children: string }) {
  return <Card style={styles.card}><Text style={styles.text}>{children}</Text></Card>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.primarySoft },
  text: { ...typography.bodySmall, color: colors.primaryDark, lineHeight: 21 },
});
