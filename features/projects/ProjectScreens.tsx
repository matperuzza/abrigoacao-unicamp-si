import { Text, View, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { colors, spacing, typography } from '@/theme';
import { projects, findProject } from './data';
import { ProjectCard, ProjectProgress } from './ProjectCard';

export function ProjectsScreen({ internal = false }: { internal?: boolean }) {
  return <ScreenContainer>
    <Header title={internal ? 'Projetos internos' : 'Projetos'} />
    <View style={styles.list}>
      <Notice>Projetos, responsáveis e números fictícios para demonstração acadêmica.</Notice>
      {projects.map(project => <ProjectCard key={project.id} project={project} internal={internal}
        onPress={() => router.push(internal ? `/member/projects/${project.id}` : `/projects/${project.id}`)} />)}
    </View>
  </ScreenContainer>;
}

export function ProjectDetailScreen({ internal = false }: { internal?: boolean }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const project = findProject(id);
  if (!project) return <MissingRecord title="Projeto não encontrado" />;
  return <ScreenContainer>
    <Header title={project.title} showBack onBack={() => router.canGoBack() ? router.back() : router.replace(internal ? '/member/projects' : '/projects')} />
    <View style={styles.list}>
      <Notice>Projeto fictício. Informações e progresso usados somente na demonstração.</Notice>
      <Text style={styles.title}>{project.status}</Text>
      <Text style={styles.title}>Objetivo</Text><Text style={styles.body}>{project.objective}</Text>
      <Text style={styles.title}>Descrição</Text><Text style={styles.body}>{project.description}</Text>
      <ProjectProgress project={project} />
      <Text style={styles.title}>Atualizações</Text>
      {project.updates.map(update => <Text key={update} style={styles.body}>• {update}</Text>)}
      {internal ? <>
        <Text style={styles.title}>Responsável</Text><Text style={styles.body}>{project.responsible}</Text>
        <Text style={styles.title}>Aprendizados</Text>
        {project.learnings.length ? project.learnings.map(item => <Text key={item} style={styles.body}>• {item}</Text>) : <Text style={styles.body}>Nenhum aprendizado registrado.</Text>}
        <Text style={styles.title}>Pendências</Text>
        {project.pending.length ? project.pending.map(item => <Text key={item} style={styles.body}>• {item}</Text>) : <Text style={styles.body}>Sem pendências no momento.</Text>}
        <Text style={styles.title}>Registro de transição</Text><Text style={styles.body}>{project.transition || 'Nenhuma transição registrada.'}</Text>
        <Button title="Registrar transição (protótipo)" variant="secondary" onPress={() => router.push(`/member/projects/${project.id}/transition`)} />
      </> : <Button title="Conhecer o apoio mensal" onPress={() => router.push('/donations')} />}
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  list: { gap: spacing.lg },
  title: { ...typography.h3, color: colors.text },
  body: { ...typography.body, lineHeight: 24, color: colors.textSecondary },
});
