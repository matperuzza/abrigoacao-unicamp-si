import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { colors, spacing, typography } from '@/theme';
import { projects } from '@/features/projects/data';
import { ProjectCard } from '@/features/projects/ProjectCard';
import { getTeamMembers, getProfessor } from '@/features/access/people';

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

function PersonRow({ person, roleLabel }: { person: { displayName: string; academicId: string }; roleLabel: string }) {
  return (
    <View style={styles.personRow}>
      <Avatar name={person.displayName} size={44} />
      <View style={styles.personInfo}>
        <Text style={styles.personName}>{person.displayName}</Text>
        <Text style={styles.personRole}>{roleLabel}</Text>
      </View>
    </View>
  );
}

export function HomeScreen() {
  return <ScreenContainer>
    <Header title="AbrigoAção" />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
      <Notice>Protótipo acadêmico de uma ONG fictícia. Todos os dados são demonstrativos.</Notice>
      <Text style={styles.hero}>Moradia digna. Conhecimento que permanece.</Text>
      <Text style={styles.body}>Transformamos realidades por meio de moradia digna, unindo voluntários e apoiadores.</Text>
      <Button title="Conhecer projetos" onPress={() => router.push('/projects')} />
      <Button title="Apoiar mensalmente" variant="secondary" onPress={() => router.push('/donations')} />
      <Text style={styles.title}>Projetos em destaque</Text>
      {projects.slice(0, 3).map(project => <ProjectCard key={project.id} project={project} onPress={() => router.push(`/projects/${project.id}`)} />)}
      <Button title="Área dos membros" variant="ghost" onPress={() => router.push('/member/enter')} />
    </ScrollView>
  </ScreenContainer>;
}

export function AboutScreen() {
  const team = getTeamMembers();
  const professor = getProfessor();

  return <ScreenContainer>
    <Header title="Sobre" />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
      <Card><View style={styles.list}>
        <Text style={styles.title}>AbrigoAção</Text>
        <Text style={styles.body}>Organização fictícia criada para uma atividade de Sistemas de Informação do curso de Administração da Unicamp, inspirada na atuação de entidades que promovem moradia digna.</Text>
      </View></Card>

      <Text style={styles.title}>Equipe do trabalho</Text>
      <Card><View style={styles.list}>
        {team.map(person => <PersonRow key={person.displayName} person={person} roleLabel="Integrante do grupo" />)}
        {professor && <PersonRow person={professor} roleLabel="Professora orientadora" />}
      </View></Card>

      <Text style={styles.title}>Dois pilares</Text>
      <Card><View style={styles.list}>
        <Text style={styles.title}>Gestão do conhecimento</Text>
        <Text style={styles.body}>Playbook colaborativo, integração de voluntários e registros de continuidade.</Text>
      </View></Card>
      <Card><View style={styles.list}>
        <Text style={styles.title}>Sustentabilidade financeira</Text>
        <Text style={styles.body}>Doações recorrentes e proposta de parceria imobiliária.</Text>
      </View></Card>

      <Button title="Parceria proposta com a Roque Imóveis" variant="secondary" onPress={() => router.push('/about/partnership')} />
      <Button title="Área dos membros" variant="ghost" onPress={() => router.push('/member/enter')} />
      <Notice>A parceria com a Roque Imóveis é uma proposta acadêmica. Não há acordo, percentual, base de cálculo ou periodicidade de repasse confirmados.</Notice>
    </ScrollView>
  </ScreenContainer>;
}

export function PartnershipScreen() {
  return <ScreenContainer>
    <Header title="Parceria proposta" showBack onBack={() => router.canGoBack() ? router.back() : router.replace('/about')} />
    <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
      <Text style={styles.title}>Roque Imóveis</Text>
      <Text style={styles.body}>Esta é uma proposta acadêmica: a ideia é que uma porcentagem de determinadas vendas ou locações de imóveis seja destinada à instituição.</Text>
      <Notice>Não há acordo firmado, percentual, base de cálculo ou periodicidade de repasse confirmados.</Notice>
      <Text style={styles.title}>Como funcionaria (ideia)</Text>
      <Text style={styles.body}>Na proposta, imóveis elegíveis seriam definidos em conjunto e parte do valor de negócios selecionados apoiaria os projetos de moradia. Os termos dependem de negociação futura.</Text>
    </ScrollView>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  list: { gap: spacing.lg, paddingBottom: spacing.xxl },
  hero: { ...typography.h1, color: colors.primaryDark, textAlign: 'center' },
  title: { ...typography.h3, color: colors.text },
  body: { ...typography.body, color: colors.textSecondary, lineHeight: 24, textAlign: 'center' },
  avatar: {
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    ...typography.h2,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  personInfo: { gap: 2 },
  personName: { ...typography.body, color: colors.text, fontWeight: '600' },
  personRole: { ...typography.bodySmall, color: colors.textSecondary },
});