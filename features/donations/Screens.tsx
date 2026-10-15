import { useState } from 'react';
import { View, Text } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { spacing, colors, typography } from '@/theme';
import { suggestedCents, findSuggestedAmount, formatBRL } from './data';

export function DonationsScreen() {
  const [selected, setSelected] = useState(5000);
  return <ScreenContainer>
    <Header title="Apoiar mensalmente" />
    <View style={{ gap: spacing.lg }}>
      <Text style={{ ...typography.body, color: colors.textSecondary, lineHeight: 24 }}>Contribuições recorrentes podem ajudar a dar continuidade aos projetos. Explore abaixo uma intenção de apoio mensal.</Text>
      <Notice>Protótipo visual: nenhuma contribuição será registrada e nenhum pagamento será realizado. Os valores são sugestões ilustrativas.</Notice>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {suggestedCents.map(cents => <Button key={cents} title={formatBRL(cents)} fullWidth={false}
          selected={selected === cents} variant={selected === cents ? 'primary' : 'secondary'} onPress={() => setSelected(cents)} />)}
      </View>
      <Button title="Visualizar resumo" onPress={() => router.push({ pathname: '/donations/summary', params: { cents: String(selected) } })} />
    </View>
  </ScreenContainer>;
}

export function DonationSummaryScreen() {
  const { cents } = useLocalSearchParams<{ cents: string }>();
  const amount = findSuggestedAmount(cents);
  if (!amount) return <MissingRecord title="Selecione um valor na tela Apoiar" />;
  return <ScreenContainer>
    <Header title="Resumo da contribuição" showBack onBack={() => router.canGoBack() ? router.back() : router.replace('/donations')} />
    <View style={{ gap: spacing.lg }}>
      <Card><View style={{ gap: spacing.md }}>
        <Text style={{ ...typography.body, color: colors.textSecondary }}>Intenção mensal ilustrativa</Text>
        <Text style={{ ...typography.h1, color: colors.primaryDark }}>{formatBRL(amount)}</Text>
        <Text style={{ ...typography.body, color: colors.text }}>Periodicidade: mensal</Text>
      </View></Card>
      <Notice>Nenhuma contribuição foi registrada e nenhum pagamento foi realizado. Não há assinatura ativa nem recibo.</Notice>
      <Button title="Voltar para apoiar" variant="secondary" onPress={() => router.canGoBack() ? router.back() : router.replace('/donations')} />
    </View>
  </ScreenContainer>;
}
