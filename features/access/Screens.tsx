import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Notice } from '@/components/Notice';
import { EmptyState } from '@/components/EmptyState';
import { colors, spacing, typography } from '@/theme';
import { projects, findProject, type Project } from '@/features/projects/data';
import { getAllEntries, type PlaybookEntry } from '@/services/playbook';
import { getAllTransitions, type TransitionRecord } from '@/services/transitions';
import { useAuth, useSession } from './AuthContext';
import { getPersonById } from './people';

function LoadingScreen() {
  return <ScreenContainer>
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.md }}>Carregando painel...</Text>
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

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <View style={[styles.avatar, { width: size, height: size }]}>
      <Text style={[styles.avatarText, { fontSize: size * 0.35 }]}>{initials}</Text>
    </View>
  );
}

function SectionTitle({ title, onPress, linkText }: { title: string; onPress?: () => void; linkText?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {onPress && linkText && (
        <Button title={linkText} variant="ghost" fullWidth={false} onPress={onPress} style={styles.linkButton} />
      )}
    </View>
  );
}

function ProjectListItem({ project }: { project: Project }) {
  return (
    <Card onPress={() => router.push(`/member/projects/${project.id}`)} accessibilityLabel={`Abrir projeto ${project.title}`}>
      <View style={styles.listItem}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <View style={styles.projectMeta}>
            <Badge>{project.status}</Badge>
            <Text style={styles.metaText}>Responsável: {project.responsible}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>{project.progress}%</Text>
        </View>
      </View>
    </Card>
  );
}

function PlaybookListItem({ entry }: { entry: PlaybookEntry }) {
  const current = entry.versions[0];
  return (
    <Card onPress={() => router.push(`/member/playbook/${entry.id}`)} accessibilityLabel={`Ler ${entry.title}`}>
      <View style={styles.listItem}>
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{entry.title}</Text>
          <View style={styles.contentMeta}>
            <Badge>{entry.category}</Badge>
            <Text style={styles.metaText}>{current.author} · {current.date.split('-').reverse().join('/')} · v{current.version}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

function TransitionListItem({ transition }: { transition: TransitionRecord }) {
  const project = findProject(transition.projectId);
  const date = new Date(transition.createdAt);
  const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <Card onPress={() => router.push(`/member/projects/${transition.projectId}`)} accessibilityLabel={`Ver transição do projeto ${project?.title ?? 'desconhecido'}`}>
      <View style={styles.listItem}>
        <View style={styles.contentInfo}>
          <Text style={styles.contentTitle}>{project?.title ?? 'Projeto não encontrado'}</Text>
          <View style={styles.contentMeta}>
            <Text style={styles.metaText}>{transition.author} · {formattedDate} {formattedTime}</Text>
            <Text style={styles.metaText}>Responsável: {transition.responsible}</Text>
          </View>
          {(transition.pending || transition.learnings) && (
            <Text style={styles.previewText} numberOfLines={2}>
              {transition.pending ? `Pendência: ${transition.pending}` : ''}
              {transition.pending && transition.learnings ? ' · ' : ''}
              {transition.learnings ? `Aprendizado: ${transition.learnings}` : ''}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
}

export function OverviewScreen() {
  const session = useSession();
  const { logout } = useAuth();
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [recentPlaybook, setRecentPlaybook] = useState<PlaybookEntry[]>([]);
  const [recentTransitions, setRecentTransitions] = useState<TransitionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [playbookEntries, transitions] = await Promise.all([
        getAllEntries(),
        getAllTransitions(),
      ]);

      if (!session) return;

      const person = getPersonById(session.person.id);
      if (!person) {
        setMyProjects([]);
      } else {
        const personProjects = projects.filter(p => p.responsible === person.displayName);
        setMyProjects(personProjects);
      }

      const sortedPlaybook = [...playbookEntries].sort((a, b) => {
        const dateA = new Date(a.versions[0].date).getTime();
        const dateB = new Date(b.versions[0].date).getTime();
        return dateB - dateA;
      });
      setRecentPlaybook(sortedPlaybook.slice(0, 5));

      setRecentTransitions(transitions.slice(0, 5));
      setError(null);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro ao carregar o painel.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [session]);

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
  if (!session) return null;

  const hasProjects = myProjects.length > 0;
  const hasPlaybook = recentPlaybook.length > 0;
  const hasTransitions = recentTransitions.length > 0;

  const goToPublic = () => {
    router.replace('/');
  };

  return <ScreenContainer>
    <Header title="Visão geral" />
    <View style={styles.container}>
      <View style={styles.welcome}>
        <Avatar name={session.person.displayName} size={56} />
        <View style={styles.welcomeText}>
          <Text style={styles.welcomeName}>{session.person.displayName}</Text>
          <View style={styles.profileBadge}>
            <Badge style={session.profile === 'Coordenação' ? styles.coordenacaoBadge : styles.voluntarioBadge}>
              {session.profile}
            </Badge>
          </View>
        </View>
      </View>

      <Notice>Alterações são salvas localmente no aparelho. Dados não são compartilhados entre dispositivos.</Notice>

      <SectionTitle title="Seus projetos" linkText="Ver todos" onPress={() => router.push('/member/projects')} />
      {hasProjects ? (
        <View style={styles.list}>{myProjects.map(project => <ProjectListItem key={project.id} project={project} />)}</View>
      ) : (
        <EmptyState
          title="Nenhum projeto atribuído"
          description="Você não tem projetos como responsável. Acesse a lista geral para consultar todos os projetos."
          actionLabel="Ver projetos"
          onAction={() => router.push('/member/projects')}
        />
      )}

      <SectionTitle title="Procedimentos recentes" linkText="Ver playbook" onPress={() => router.push('/member/playbook')} />
      {hasPlaybook ? (
        <View style={styles.list}>{recentPlaybook.map(entry => <PlaybookListItem key={entry.id} entry={entry} />)}</View>
      ) : (
        <EmptyState
          title="Nenhum conteúdo recente"
          description="O playbook será preenchido conforme a equipe criar e editar procedimentos."
          actionLabel="Novo conteúdo"
          onAction={() => router.push('/member/playbook/new')}
        />
      )}

      <SectionTitle title="Transições recentes" linkText="Ver projetos" onPress={() => router.push('/member/projects')} />
      {hasTransitions ? (
        <View style={styles.list}>{recentTransitions.map(t => <TransitionListItem key={t.id} transition={t} />)}</View>
      ) : (
        <EmptyState
          title="Nenhuma transição registrada"
          description="Registre transições ao assumir ou passar a responsabilidade de um projeto."
          actionLabel="Registrar transição"
          onAction={() => {
            const firstProject = projects[0];
            if (firstProject) router.push(`/member/projects/${firstProject.id}/transition`);
          }}
        />
      )}

      <View style={styles.shortcuts}>
        <Text style={styles.shortcutsTitle}>Atalhos</Text>
        <View style={styles.shortcutsGrid}>
          <Button title="Novo conteúdo" variant="secondary" onPress={() => router.push('/member/playbook/new')} fullWidth={false} />
          <Button title="Registrar transição" variant="secondary" onPress={() => {
            const firstProject = projects[0];
            if (firstProject) router.push(`/member/projects/${firstProject.id}/transition`);
          }} fullWidth={false} />
          <Button title="Guia do voluntário" onPress={() => router.push('/member/guide')} fullWidth={false} />
          <Button title="Playbook" variant="secondary" onPress={() => router.push('/member/playbook')} fullWidth={false} />
        </View>
      </View>

      <Button title="Sair da conta" variant="ghost" onPress={logout} />
      <Button title="Voltar à área pública" variant="ghost" onPress={goToPublic} />
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    padding: spacing.xl,
  },
  error: {
    alignItems: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorTitle: { ...typography.h3, color: colors.text },
  errorBody: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  welcome: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  avatar: {
    borderRadius: 28,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  welcomeText: {
    flex: 1,
    gap: spacing.xs,
  },
  welcomeName: {
    ...typography.h2,
    color: colors.text,
  },
  profileBadge: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  voluntarioBadge: {
    backgroundColor: colors.primarySoft,
  },
  coordenacaoBadge: {
    backgroundColor: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
  },
  linkButton: {
    marginBottom: 0,
  },
  list: {
    gap: spacing.md,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  contentInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  projectTitle: {
    ...typography.h3,
    color: colors.text,
  },
  contentTitle: {
    ...typography.h3,
    color: colors.text,
  },
  projectMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  contentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'center',
  },
  metaText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...typography.h3,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  previewText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  shortcuts: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  shortcutsTitle: {
    ...typography.h3,
    color: colors.text,
  },
  shortcutsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});