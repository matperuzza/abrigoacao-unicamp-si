import { Text, View, StyleSheet } from 'react-native';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { colors, spacing, typography, radius } from '@/theme';
import type { Project } from './data';

export function ProjectProgress({ project }: { project: Project }) {
  return <View style={styles.progress} accessibilityLabel={`${project.progress}% concluído (fictício)`}>
    <View style={styles.track}><View style={[styles.fill, { width: `${project.progress}%` }]} /></View>
    <Text style={styles.meta}>{project.progress}% concluído · exemplo fictício</Text>
  </View>;
}

export function ProjectCard({ project, internal = false, onPress }: { project: Project; internal?: boolean; onPress: () => void }) {
  return <Card onPress={onPress} accessibilityLabel={`Abrir projeto ${project.title}`}>
    <View style={styles.content}>
      <Text style={styles.title}>{project.title}</Text>
      <Badge variant={project.status === 'Concluído' ? 'success' : project.status === 'Planejamento' ? 'warning' : 'info'}>{project.status}</Badge>
      <Text style={styles.meta}>{project.description}</Text>
      {internal && <>
        <Text style={styles.meta}>Responsável: {project.responsible}</Text>
        <Text style={styles.meta}>Pendências: {project.pending.length} · Atrasos: {project.overdue}</Text>
      </>}
      <ProjectProgress project={project} />
    </View>
  </Card>;
}

const styles = StyleSheet.create({
  content: { gap: spacing.sm, alignItems: 'flex-start' },
  title: { ...typography.h3, color: colors.text },
  meta: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 21 },
  progress: { width: '100%', gap: spacing.sm },
  track: { height: 8, width: '100%', backgroundColor: colors.primarySoft, borderRadius: radius.sm, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.primary },
});
