import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import { entries, categories, findEntry, formatDemoDate, type PlaybookVersion } from './data';

function VersionContent({ version }: { version: PlaybookVersion }) {
  return <Card><View style={styles.list}>
    <Text style={styles.meta}>Autor: {version.author} · {formatDemoDate(version.date)} · Versão {version.version}</Text>
    <Text style={styles.body}>{version.content}</Text>
  </View></Card>;
}

export function PlaybookScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const normalized = search.trim().toLocaleLowerCase('pt-BR');
  const filtered = entries.filter(entry => (category === 'Todas' || entry.category === category)
    && `${entry.title} ${entry.versions[0]?.content ?? ''}`.toLocaleLowerCase('pt-BR').includes(normalized));
  return <ScreenContainer>
    <Header title="Playbook" />
    <View style={styles.list}>
      <Notice>Conteúdos, autores e versões fictícios. Alterações não são gravadas nesta etapa.</Notice>
      <Button title="Novo conteúdo (protótipo)" onPress={() => router.push('/member/playbook/new')} />
      <Input label="Buscar" value={search} onChangeText={setSearch} placeholder="Título ou conteúdo" />
      <View style={styles.filters}>
        {['Todas', ...categories].map(item => <Button key={item} title={item} fullWidth={false}
          variant={category === item ? 'primary' : 'secondary'} selected={category === item} onPress={() => setCategory(item)} />)}
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
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = findEntry(id);
  const current = entry?.versions[0];
  if (!entry || !current) return <MissingRecord />;
  return <ScreenContainer>
    <Header title={entry.title} showBack onBack={() => router.canGoBack() ? router.back() : router.replace('/member/playbook')} />
    <View style={styles.list}>
      <Badge>{entry.category}</Badge>
      <VersionContent version={current} />
      <Button title="Editar (protótipo)" variant="secondary" onPress={() => router.push(`/member/playbook/${entry.id}/edit`)} />
      <Button title="Histórico de versões" onPress={() => router.push(`/member/playbook/${entry.id}/history`)} />
    </View>
  </ScreenContainer>;
}

export function PlaybookHistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = findEntry(id);
  if (!entry) return <MissingRecord />;
  return <ScreenContainer>
    <Header title="Histórico de versões" showBack onBack={() => router.canGoBack() ? router.back() : router.replace('/member/playbook')} />
    <View style={styles.list}>
      <Text style={styles.title}>{entry.title}</Text>
      <Notice>Histórico fictício, somente para leitura.</Notice>
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
  const entry = findEntry(id);
  const selected = entry?.versions.find(item => String(item.version) === version);
  if (!entry || !selected) return <MissingRecord title="Versão não encontrada" />;
  return <ScreenContainer>
    <Header title={`Versão ${selected.version}`} showBack onBack={() => router.canGoBack() ? router.back() : router.replace('/member/playbook')} />
    <View style={styles.list}>
      <Text style={styles.title}>{entry.title}</Text>
      <Notice>Versão demonstrativa somente para leitura.</Notice>
      <VersionContent version={selected} />
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  title: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },
  meta: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 21 },
});
