import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Notice } from '@/components/Notice';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { findProjectTransitions, type TransitionRecord } from '@/services/transitions';
import { findProject } from './data';

interface TransitionItemProps {
  record: TransitionRecord;
  isLatest: boolean;
}

function TransitionItem({ record, isLatest }: TransitionItemProps) {
  const date = new Date(record.createdAt);
  const formattedDate = date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card>
      <View style={styles.item}>
        <View style={styles.itemHeader}>
          <Text style={styles.author}>{record.author}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        {isLatest && <Badge variant="info" style={styles.latestBadge}>Mais recente</Badge>}
        <View style={styles.fields}>
          <Text style={styles.fieldLabel}>Responsável</Text>
          <Text style={styles.fieldValue}>{record.responsible}</Text>
          {record.pending && (
            <>
              <Text style={styles.fieldLabel}>Pendências</Text>
              <Text style={styles.fieldValue}>{record.pending}</Text>
            </>
          )}
          {record.learnings && (
            <>
              <Text style={styles.fieldLabel}>Aprendizados</Text>
              <Text style={styles.fieldValue}>{record.learnings}</Text>
            </>
          )}
        </View>
      </View>
    </Card>
  );
}

function LoadingState() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.md }}>
        Carregando histórico...
      </Text>
    </View>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.error}>
      <Text style={styles.errorTitle}>Não foi possível carregar</Text>
      <Text style={styles.errorBody}>{message}</Text>
      <Button title="Tentar novamente" onPress={onRetry} />
    </View>
  );
}

interface TransitionHistorySectionProps {
  projectId: string;
}

export function TransitionHistorySection({ projectId }: TransitionHistorySectionProps) {
  const [records, setRecords] = useState<TransitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const project = findProject(projectId);
      setProjectTitle(project?.title ?? '');
      const data = await findProjectTransitions(projectId);
      setRecords(data);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar o histórico de transições.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await load();
      if (!mounted) return;
    })();
    return () => { mounted = false; };
  }, [load]);

  const retry = () => {
    load();
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={retry} />;
  if (!projectTitle) return <Notice>Projeto não encontrado</Notice>;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Histórico de transições</Text>
      </View>
      <Notice>Registros salvos localmente no aparelho. Não compartilhados entre dispositivos.</Notice>
      {records.length === 0 ? (
        <Notice>Nenhum registro de transição ainda. Use &ldquo;Registrar transição&rdquo; para criar o primeiro.</Notice>
      ) : (
        records.map((record, index) => (
          <TransitionItem key={record.id} record={record} isLatest={index === 0} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  title: { ...typography.h3, color: colors.text },
  loading: { alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  error: { alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  errorTitle: { ...typography.h3, color: colors.text },
  errorBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  item: { gap: spacing.md },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { ...typography.bodySmall, color: colors.textSecondary },
  date: { ...typography.bodySmall, color: colors.textSecondary },
  latestBadge: { marginTop: spacing.xs },
  fields: { gap: spacing.xs },
  fieldLabel: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  fieldValue: { ...typography.body, color: colors.text, lineHeight: 22 },
});