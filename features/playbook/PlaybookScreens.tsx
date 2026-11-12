import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Input } from '@/components/Input';
import { EmptyState } from '@/components/EmptyState';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { colors, spacing, typography } from '@/theme';
import { categories, findEntry, getAllEntries, formatDemoDate, type PlaybookVersion, type Category, type PlaybookEntry } from '@/services/playbook';
import { usePermissions } from '@/features/access/AuthContext';

function VersionContent({ version }: { version: PlaybookVersion }) {
  return <Card><View style={styles.list}>
    <Text style={styles.meta}>Autor: {version.author} · {formatDemoDate(version.date)} · Versão {version.version}</Text>
    <Text style={styles.body}>{version.content}</Text>
  </View></Card>;
}

function LoadingScreen() {
  return <ScreenContainer>
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.md }}>Carregando playbook...</Text>
    </View>
  </ScreenContainer>;
}

function ErrorScreen({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <ScreenContainer>
    <View style={styles.error}>
      <Text style={styles.errorTitle}>Não foi possível carregar</Text>
      <Text style={styles.errorBody}>{message}</Text>
      <Button title="Tentar novamente" onPress={onRetry} />
    </View>
  </ScreenContainer>;
}

export function PlaybookScreen() {
  const permissions = usePermissions();
  const [entries, setEntries] = useState<PlaybookEntry[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category | 'Todas'>('Todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllEntries();
      setEntries(data);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar o playbook. Verifique o armazenamento e tente novamente.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

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

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;

  const normalized = search.trim().toLocaleLowerCase('pt-BR');
  const filtered = entries.filter(entry => (category === 'Todas' || entry.category === category)
    && `${entry.title} ${entry.versions[0]?.content ?? ''}`.toLocaleLowerCase('pt-BR').includes(normalized));

  return <ScreenContainer>
    <Header title="Playbook" />
    <View style={styles.list}>
      <Notice>Conteúdos, autores e versões fictícios. Alterações são salvas localmente no aparelho.</Notice>
      {permissions.canWritePlaybook && (
        <Button title="Novo conteúdo" onPress={() => router.push('/member/playbook/new')} />
      )}
      <Input label="Buscar" value={search} onChangeText={setSearch} placeholder="Título ou conteúdo" />
      <View style={styles.filters}>
        {['Todas', ...categories].map(item => <Button key={item} title={item} fullWidth={false}
          variant={category === item ? 'primary' : 'secondary'} selected={category === item} onPress={() => setCategory(item as Category | 'Todas')} />)}
      </View>
      <Text style={styles.meta} accessibilityLiveRegion="polite">{filtered.length} conteúdo(s) encontrado(s)</Text>
      {filtered.map(entry => <Card key={entry.id} onPress={() => router.push(`/member/playbook/${entry.id}`)} accessibilityLabel={`Ler ${entry.title}`}>
        <View style={styles.list}>
          <Text style={styles.title}>{entry.title}</Text>
          <Badge>{entry.category}</Badge>
          <Text style={styles.meta}>{entry.versions[0]?.author} · {entry.versions[0] && formatDemoDate(entry.versions[0].date)} · v{entry.versions[0]?.version}</Text>
        </View>
      </Card>)}
      {!filtered.length && <EmptyState title="Nenhum conteúdo encontrado" description="Tente outro termo ou selecione outra categoria." />}
    </View>
  </ScreenContainer>;
}

export function PlaybookDetailScreen() {
  const permissions = usePermissions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<PlaybookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await findEntry(id);
      setEntry(data ?? null);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar o conteúdo.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;
  if (!entry || !entry.versions[0]) return <MissingRecord />;

  const current = entry.versions[0];
  const back = () => router.canGoBack() ? router.back() : router.replace('/member/playbook');

  return <ScreenContainer>
    <Header title={entry.title} showBack onBack={back} />
    <View style={styles.list}>
      <Badge>{entry.category}</Badge>
      <VersionContent version={current} />
      {permissions.canWritePlaybook && (
        <Button title="Editar" variant="secondary" onPress={() => router.push(`/member/playbook/${entry.id}/edit`)} />
      )}
      <Button title="Histórico de versões" onPress={() => router.push(`/member/playbook/${entry.id}/history`)} />
    </View>
  </ScreenContainer>;
}

export function PlaybookHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<PlaybookEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await findEntry(id);
      setEntry(data ?? null);
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar o histórico.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

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

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;
  if (!entry) return <MissingRecord />;

  const back = () => router.canGoBack() ? router.back() : router.replace('/member/playbook');

  return <ScreenContainer>
    <Header title="Histórico de versões" showBack onBack={back} />
    <View style={styles.list}>
      <Text style={styles.title}>{entry.title}</Text>
      <Notice>Histórico salvo localmente. Versões anteriores são preservadas.</Notice>
      {entry.versions.map(version => <Card key={version.version}
        onPress={() => router.push(`/member/playbook/${entry.id}/version/${version.version}`)}>
        <View style={styles.list}>
          <Text style={styles.title}>Versão {version.version}{version === entry.versions[0] ? ' · Atual' : ''}</Text>
          <Text style={styles.meta}>{version.author} · {formatDemoDate(version.date)}</Text>
          <Text style={styles.body}>{version.summary}</Text>
        </View>
      </Card>)}
    </View>
  </ScreenContainer>;
}

export function PlaybookVersionScreen() {
  const { id, version } = useLocalSearchParams<{ id: string; version: string }>();
  const [entry, setEntry] = useState<PlaybookEntry | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<PlaybookVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await findEntry(id);
      setEntry(data ?? null);
      if (data) {
        const found = data.versions.find((item: PlaybookVersion) => String(item.version) === version);
        setSelectedVersion(found ?? null);
      }
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar a versão.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id, version]);

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

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={retry} />;
  if (!entry || !selectedVersion) return <MissingRecord title="Versão não encontrada" />;

  const back = () => router.canGoBack() ? router.back() : router.replace('/member/playbook');

  return <ScreenContainer>
    <Header title={`Versão ${selectedVersion.version}`} showBack onBack={back} />
    <View style={styles.list}>
      <Text style={styles.title}>{entry.title}</Text>
      <Notice>Versão salva localmente.</Notice>
      <VersionContent version={selectedVersion} />
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  title: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  meta: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 21 },
  loading: { alignItems: 'center', justifyContent: 'center', flex: 1, padding: spacing.xl },
  error: { alignItems: 'center', padding: spacing.xl, gap: spacing.md },
  errorTitle: { ...typography.h3, color: colors.text },
  errorBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});