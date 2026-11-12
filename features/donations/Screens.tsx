import { useState, useCallback, useRef } from 'react';
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
import { useDonationFlow } from './FlowContext';

type DonationPath = '/donations' | '/donations/summary' | '/donations/result';

function navigate(pathname: DonationPath, params?: Record<string, string>) {
  router.push({ pathname, params } as Parameters<typeof router.push>[0]);
}

export function DonationsScreen() {
  const [selected, setSelected] = useState(5000);
  const { reset } = useDonationFlow();
  const navigatingRef = useRef(false);

  const handleNavigate = useCallback((pathname: DonationPath, params?: Record<string, string>) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    reset();
    navigate(pathname, params);
    setTimeout(() => { navigatingRef.current = false; }, 300);
  }, [reset]);

  return <ScreenContainer>
    <Header title="Apoiar mensalmente" />
    <View style={{ gap: spacing.lg }}>
      <Text style={{ ...typography.body, color: colors.textSecondary, lineHeight: 24 }}>Contribuições recorrentes podem ajudar a dar continuidade aos projetos. Explore abaixo uma intenção de apoio mensal.</Text>
      <Notice>Simulação: nenhuma contribuição será registrada, nenhum pagamento será realizado e não haverá assinatura ativa. Os valores são sugestões ilustrativas.</Notice>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {suggestedCents.map(cents => <Button key={cents} title={formatBRL(cents)} fullWidth={false}
          selected={selected === cents} variant={selected === cents ? 'primary' : 'secondary'} onPress={() => setSelected(cents)} />)}
      </View>
      <Button title="Visualizar resumo" onPress={() => handleNavigate('/donations/summary', { cents: String(selected) })} />
    </View>
  </ScreenContainer>;
}

export function DonationSummaryScreen() {
  const { cents } = useLocalSearchParams<{ cents: string }>();
  const { state, confirm, reset } = useDonationFlow();
  const amount = findSuggestedAmount(cents);
  const [confirming, setConfirming] = useState(false);
  const navigatingRef = useRef(false);

  const handleNavigate = useCallback((pathname: DonationPath, params?: Record<string, string>) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigate(pathname, params);
    setTimeout(() => { navigatingRef.current = false; }, 300);
  }, []);

  if (!amount) return <MissingRecord title="Selecione um valor na tela Apoiar" />;

  const handleConfirm = () => {
    if (state.confirmed) return;
    setConfirming(true);
    confirm(amount);
    handleNavigate('/donations/result', { cents: String(amount) });
  };

  const isConfirmedForThisAmount = state.confirmed && state.confirmedAmount === amount;

  const handleBack = () => {
    reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/donations');
    }
  };

  const confirmedContent = isConfirmedForThisAmount ? (
    <View style={{ gap: spacing.md }}>
      <Notice>Simulação confirmada. Use o botão abaixo para ver o resultado.</Notice>
      <Button title="Ver resultado" onPress={() => handleNavigate('/donations/result', { cents: String(amount) })} />
      <Button title="Nova simulação" variant="secondary" onPress={() => { reset(); handleNavigate('/donations'); }} />
    </View>
  ) : (
    <Button title={confirming ? 'Confirmando...' : 'Confirmar simulação'} disabled={confirming} onPress={handleConfirm} />
  );

  return <ScreenContainer>
    <Header title="Resumo da contribuição" showBack onBack={handleBack} />
    <View style={{ gap: spacing.lg }}>
      <Card><View style={{ gap: spacing.md }}>
        <Text style={{ ...typography.body, color: colors.textSecondary }}>Intenção mensal ilustrativa</Text>
        <Text style={{ ...typography.h1, color: colors.primaryDark }}>{formatBRL(amount)}</Text>
        <Text style={{ ...typography.body, color: colors.text }}>Periodicidade: mensal</Text>
      </View></Card>
      <Notice>Esta é uma simulação: nenhuma contribuição será registrada, nenhum pagamento será realizado, não há assinatura ativa e este não é um recibo.</Notice>
      {confirmedContent}
      <Button title="Voltar para apoiar" variant="secondary" onPress={handleBack} />
    </View>
  </ScreenContainer>;
}

export function DonationResultScreen() {
  const { cents } = useLocalSearchParams<{ cents: string }>();
  const { state, reset } = useDonationFlow();
  const amount = findSuggestedAmount(cents);
  const navigatingRef = useRef(false);

  const handleNavigate = useCallback((pathname: DonationPath, params?: Record<string, string>) => {
    if (navigatingRef.current) return;
    navigatingRef.current = true;
    navigate(pathname, params);
    setTimeout(() => { navigatingRef.current = false; }, 300);
  }, []);

  const handleBack = () => {
    reset();
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/donations');
    }
  };

  if (!amount || !state.confirmed || state.confirmedAmount !== amount) {
    return <ScreenContainer>
      <Header title="Resultado da simulação" showBack onBack={handleBack} />
      <View style={{ gap: spacing.lg, alignItems: 'center', padding: spacing.xl }}>
        <Notice>Acesso direto ao resultado não é permitido sem confirmação prévia.</Notice>
        <Text style={{ ...typography.body, color: colors.textSecondary, textAlign: 'center' }}>Inicie uma nova simulação na tela &ldquo;Apoiar mensalmente&rdquo;.</Text>
        <Button title="Ir para apoiar" onPress={() => { reset(); handleNavigate('/donations'); }} />
      </View>
    </ScreenContainer>;
  }

  return <ScreenContainer>
    <Header title="Resultado da simulação" showBack onBack={handleBack} />
    <View style={{ gap: spacing.lg }}>
      <Card><View style={{ gap: spacing.md, alignItems: 'center' }}>
        <Text style={{ ...typography.body, color: colors.textSecondary }}>Simulação de contribuição mensal</Text>
        <Text style={{ ...typography.h1, color: colors.primaryDark }}>{formatBRL(amount)}</Text>
        <Text style={{ ...typography.body, color: colors.text }}>Periodicidade: mensal</Text>
      </View></Card>
      <Notice>Esta é uma simulação confirmada: nenhuma contribuição foi registrada, nenhum pagamento foi realizado, não há assinatura ativa e este não é um recibo.</Notice>
      <View style={{ gap: spacing.md }}>
        <Button title="Nova simulação" onPress={() => { reset(); handleNavigate('/donations'); }} />
        <Button title="Voltar ao resumo" variant="secondary" onPress={() => handleNavigate('/donations/summary', { cents: String(amount) })} />
      </View>
    </View>
  </ScreenContainer>;
}