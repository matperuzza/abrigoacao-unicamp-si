import { View, Text } from 'react-native';
import { router } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Notice } from '@/components/Notice';
import { colors, spacing, typography } from '@/theme';

export default function GuideScreen() {
  return <ScreenContainer>
    <Header title="Guia do voluntário" />
    <View style={{ gap: spacing.lg }}>
      <Text style={{ ...typography.h3, color: colors.primaryDark }}>Bem-vindo à AbrigoAção!</Text>
      <Text style={{ ...typography.body, color: colors.textSecondary, lineHeight: 24 }}>Este guia reúne os primeiros passos para contribuir com nossos projetos de moradia.</Text>
      <Notice>Guia demonstrativo de uma instituição fictícia. Os procedimentos são exemplos acadêmicos.</Notice>
      {['Leia as boas-vindas no Playbook.', 'Conheça os procedimentos de campo antes de visitar uma obra.', 'Registre suas atividades semanalmente.', 'Comunique pendências ao responsável pelo projeto.'].map((step, index) => <Text key={step} style={{ ...typography.body, color: colors.text, lineHeight: 24 }}>{index + 1}. {step}</Text>)}
      <Button title="Playbook → Boas-vindas" variant="secondary" onPress={() => router.push('/member/playbook/1')} />
      <Button title="Procedimento de visita" variant="secondary" onPress={() => router.push('/member/playbook/2')} />
      <Button title="Encerramento de projeto" variant="secondary" onPress={() => router.push('/member/playbook/3')} />
    </View>
  </ScreenContainer>;
}
