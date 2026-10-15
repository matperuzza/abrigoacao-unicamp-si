import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { spacing, typography, colors } from '@/theme';
import { projects } from '@/features/projects/data';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { useDemoAccess, type DemoProfile } from './DemoAccess';

export function MemberEnterScreen() {
  const { selectProfile } = useDemoAccess();
  const enter = (profile: DemoProfile) => {
    selectProfile(profile);
    router.replace('/member/overview');
  };
  return <ScreenContainer>
    <Header title="Área dos membros" />
    <View style={{ gap: spacing.lg }}>
      <Notice>Modo demonstrativo: explore como voluntário ou coordenação. Não há autenticação real nem autorização segura.</Notice>
      <Button title="Explorar como voluntário" onPress={() => enter('Voluntário')} />
      <Button title="Explorar como coordenação" variant="secondary" onPress={() => enter('Coordenação')} />
      <Button title="Voltar à área pública" variant="ghost" onPress={() => { selectProfile(null); router.replace('/'); }} />
    </View>
  </ScreenContainer>;
}

export function OverviewScreen() {
  const { profile, selectProfile } = useDemoAccess();
  return <ScreenContainer>
    <Header title="Visão geral" />
    <View style={{ gap: spacing.lg }}>
      <Button title="Voltar à área pública" variant="secondary" onPress={() => { selectProfile(null); router.replace('/'); }} />
      <Notice>{`Perfil demonstrativo: ${profile ?? ''}. Dados fictícios e alterações sem gravação.`}</Notice>
      <Button title="Trocar perfil" variant="ghost" onPress={() => { selectProfile(null); router.replace('/member/enter'); }} />
      <Text style={{ ...typography.h3, color: colors.text }}>Atalhos</Text>
      <Button title="Guia do voluntário" variant="secondary" onPress={() => router.push('/member/guide')} />
      <Button title="Playbook" onPress={() => router.push('/member/playbook')} />
      <Text style={{ ...typography.h3, color: colors.text }}>Projetos com pendências</Text>
      {projects.filter(project => project.pending.length > 0).map(project => <ProjectCard key={project.id} project={project} internal onPress={() => router.push(`/member/projects/${project.id}`)} />)}
    </View>
  </ScreenContainer>;
}
