import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { useDiscardDraft } from '@/hooks/useDiscardDraft';
import { spacing, colors, typography } from '@/theme';
import { findProject } from '@/features/projects/data';
import { usePermissions, useAuth } from '@/features/access/AuthContext';
import { createTransition, validateTransitionInput } from '@/services/transitions';

export default function TransitionScreen() {
  const permissions = usePermissions();
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = findProject(id);
  const [responsible, setResponsible] = useState('');
  const [pending, setPending] = useState('');
  const [learnings, setLearnings] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useDiscardDraft(!!(responsible || pending || learnings) && !saved);

  useEffect(() => {
    if (!permissions.canWriteTransitions || !session) {
      router.replace('/member/projects');
    }
  }, [permissions.canWriteTransitions, session]);

  if (!project) return <MissingRecord title="Projeto não encontrado" />;
  if (!permissions.canWriteTransitions || !session) return null;

  const back = () => router.canGoBack() ? router.back() : router.replace('/member/projects');

  async function handleSave() {
    if (saving) return;
    if (!session) {
      setSaveError('Sessão não encontrada. Volte e entre novamente.');
      return;
    }
    const validation = validateTransitionInput(id, responsible, pending, learnings);
    if (!validation.valid) {
      setSaveError(validation.error ?? 'Erro de validação.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await createTransition(id, responsible, pending, learnings, session.profile, session.person.displayName);
      setSaved(true);
      router.replace(`/member/projects/${id}`);
    } catch {
      setSaveError('Falha ao salvar. O conteúdo digitado foi mantido. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScreenContainer>
      <Header title="Registro de transição" showBack onBack={back} />
      <View style={{ gap: spacing.lg }}>
        <Notice>Alterações são salvas localmente no aparelho. Dados não compartilhados entre dispositivos.</Notice>
        <Input label="Projeto" value={project.title} onChangeText={() => {}} disabled />
        <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Autor do registro: {session.person.displayName} ({session.profile})</Text>
        <Input label="Novo responsável (demonstrativo)" value={responsible} onChangeText={setResponsible} placeholder="Nome do próximo responsável" />
        <Input label="Pendências" value={pending} onChangeText={setPending} multiline placeholder="Liste as pendências" />
        <Input label="Aprendizados" value={learnings} onChangeText={setLearnings} multiline placeholder="Registre os aprendizados" />
        {saveError && <Notice>{saveError}</Notice>}
        <Button title={saving ? 'Salvando...' : 'Salvar'} disabled={saving} onPress={handleSave} />
        <Button title="Cancelar" variant="ghost" onPress={back} />
      </View>
    </ScreenContainer>
  );
}