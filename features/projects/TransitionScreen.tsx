import { useState } from 'react';
import { View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { useDiscardDraft } from '@/hooks/useDiscardDraft';
import { spacing } from '@/theme';
import { findProject } from './data';

export default function TransitionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = findProject(id);
  const [responsible, setResponsible] = useState('');
  const [pending, setPending] = useState('');
  const [learnings, setLearnings] = useState('');
  useDiscardDraft(!!(responsible || pending || learnings));
  if (!project) return <MissingRecord title="Projeto não encontrado" />;
  const back = () => router.canGoBack() ? router.back() : router.replace('/member/projects');
  return <ScreenContainer>
    <Header title="Registro de transição" showBack onBack={back} />
    <View style={{ gap: spacing.lg }}>
      <Notice>Protótipo visual: o conteúdo digitado não será salvo.</Notice>
      <Input label="Projeto" value={project.title} onChangeText={() => {}} disabled />
      <Input label="Novo responsável (demonstrativo)" value={responsible} onChangeText={setResponsible} placeholder="Nome do próximo responsável" />
      <Input label="Pendências" value={pending} onChangeText={setPending} multiline placeholder="Liste as pendências" />
      <Input label="Aprendizados" value={learnings} onChangeText={setLearnings} multiline placeholder="Registre os aprendizados" />
      <Button title="Salvar — disponível na próxima etapa" disabled />
      <Button title="Cancelar" variant="ghost" onPress={back} />
    </View>
  </ScreenContainer>;
}
