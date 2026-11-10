import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { colors, spacing, typography } from '@/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { findProjectTransitions, type TransitionRecord } from '@/services/transitions';
import { findProject } from '@/features/projects/data';
import { Button } from '@/components/Button';

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
        <View style={styles.header}>
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

function LoadingScreen() {
  return (
    <ScreenContainer>
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.md }}>
          Carregando histórico...
        </Text>
      </View>
    </ScreenContainer>
  );
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <ScreenContainer>
      <View style={styles.error}>
        <Text style={styles.errorTitle}>Não foi possível carregar</Text>
        <Text style={styles.errorBody}>{message}</Text>
        <Button title="Tentar novamente" onPress={onRetry} />
      </View>
    </ScreenContainer>
  );
}

export function TransitionHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [records, setRecords] = useState<TransitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const project = findProject(id);
        if (mounted) {
          setProjectTitle(project?.title ?? '');
        }
        const data = await findProjectTransitions(id);
        if (mounted) {
          setRecords(data);
          setError(null);
        }
      } catch {
        if (mounted) setError('Erro ao carregar o histórico de transições.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [id]);

  const retry = () => { setLoading(true); setError(null); };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;
  if (!projectTitle) return <MissingRecord title="Projeto não encontrado" />;

  const back = () => router.canGoBack() ? router.back() : router.replace('/member/projects');

  return (
    <ScreenContainer>
      <Header title="Histórico de transições" showBack onBack={back} />
      <View style={styles.list}>
        <Text style={styles.title}>{projectTitle}</Text>
        <Notice>Registros salvos localmente no aparelho. Não compartilhados entre dispositivos.</Notice>
        {records.length === 0 ? (
          <Notice>Nenhum registro de transição ainda. Use &ldquo;Registrar transição&rdquo; para criar o primeiro.</Notice>
        ) : (
          records.map((record, index) => (
            <TransitionItem key={record.id} record={record} isLatest={index === 0} />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  title: { ...typography.h3, color: colors.text },
  loading: { alignItems: 'center', justifyContent: 'center', flex: 1, padding: spacing.xl },
  error: { alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  errorTitle: { ...typography.h3, color: colors.text },
  errorBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  item: { gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { ...typography.bodySmall, color: colors.textSecondary },
  date: { ...typography.bodySmall, color: colors.textSecondary },
  latestBadge: { marginTop: spacing.xs },
  fields: { gap: spacing.xs },
  fieldLabel: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  fieldValue: { ...typography.body, color: colors.text, lineHeight: 22 },
});