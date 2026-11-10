import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { useDiscardDraft } from '@/hooks/useDiscardDraft';
import { colors, spacing, typography } from '@/theme';
import { categories, findEntry, createEntry, updateEntry, type PlaybookEntry, type Category } from '@/services/playbook';
import { useDemoAccess, usePermissions } from '@/features/access/DemoAccess';

export default function PlaybookFormScreen({ create = false }: { create?: boolean }) {
  const permissions = usePermissions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<PlaybookEntry | undefined>(create ? undefined : undefined);
  const [loading, setLoading] = useState(!create);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!permissions.canWritePlaybook) {
      router.replace('/member/playbook');
      return;
    }
    if (create) return;
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await findEntry(id);
        if (mounted) {
          setEntry(data);
          setError(null);
        }
      } catch {
        if (mounted) setError('Erro ao carregar o conteúdo para edição.');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [create, id, permissions.canWritePlaybook]);

  const retry = () => { setLoading(true); setError(null); };

  if (loading) {
    return <ScreenContainer>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, padding: spacing.xl }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.md }}>Carregando...</Text>
      </View>
    </ScreenContainer>;
  }
  if (error) {
    return <ScreenContainer>
      <View style={{ alignItems: 'center', padding: spacing.xl, gap: spacing.md }}>
        <Text style={{ ...typography.h3, color: colors.text }}>Não foi possível carregar</Text>
        <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>{error}</Text>
        <Button title="Tentar novamente" onPress={retry} />
      </View>
    </ScreenContainer>;
  }
  if (!create && !entry) return <MissingRecord />;
  if (!permissions.canWritePlaybook) return null;

  return <PlaybookForm key={entry?.id ?? 'new'} entry={entry} create={create} />;
}

function PlaybookForm({ entry, create }: { entry?: PlaybookEntry; create: boolean }) {
  const { profile } = useDemoAccess();
  const initialTitle = entry?.title ?? '';
  const initialContent = entry?.versions[0]?.content ?? '';
  const initialCategory = entry?.category ?? categories[0];
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState<Category>(initialCategory);
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const hasChanges = title !== initialTitle || content !== initialContent || category !== initialCategory;
  const isValid = title.trim().length > 0 && content.trim().length > 0 && summary.trim().length > 0;
  useDiscardDraft(hasChanges && !saved);

  const back = () => router.canGoBack() ? router.back() : router.replace('/member/playbook');

  async function handleSave() {
    if (!isValid || saving) return;
    if (!profile) {
      setSaveError('Perfil não selecionado. Volte e escolha um perfil.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      if (create) {
        await createEntry(title.trim(), category, content.trim(), summary.trim() || 'Criação inicial.', profile);
      } else if (entry) {
        const updated = await updateEntry(entry.id, title.trim(), category, content.trim(), summary.trim() || 'Atualização.', profile);
        if (!updated) {
          setSaveError('Conteúdo não encontrado. Tente novamente.');
          setSaving(false);
          return;
        }
      }
      setSaved(true);
      router.replace('/member/playbook');
    } catch {
      setSaveError('Falha ao salvar. O conteúdo digitado foi mantido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return <ScreenContainer>
    <Header title={create ? 'Novo conteúdo' : 'Editar conteúdo'} showBack onBack={back} />
    <View style={{ gap: spacing.lg }}>
      <Notice>Alterações são salvas localmente no aparelho. Dados demonstrativos não são compartilhados entre dispositivos.</Notice>
      <Input label="Título" value={title} onChangeText={setTitle} placeholder="Título do procedimento" />
      <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Categoria</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {categories.map(item => <Button key={item} title={item} fullWidth={false} selected={category === item}
          variant={category === item ? 'primary' : 'secondary'} onPress={() => setCategory(item)} />)}
      </View>
      <Input label="Conteúdo" value={content} onChangeText={setContent} placeholder="Escreva aqui..." multiline numberOfLines={10} />
      <Input label="Resumo da alteração" value={summary} onChangeText={setSummary} placeholder="Descreva brevemente o que mudou" />
      {saveError && <Notice>{saveError}</Notice>}
      <Button title={saving ? 'Salvando...' : 'Salvar'} disabled={!isValid || saving} onPress={handleSave} />
      <Button title="Cancelar" variant="ghost" onPress={back} />
    </View>
  </ScreenContainer>;
}