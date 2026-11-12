import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Notice } from '@/components/Notice';
import { Card } from '@/components/Card';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from './AuthContext';

export function MemberEnterScreen() {
  const { login, session } = useAuth();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (session) {
      const target = redirect || '/member/overview';
      router.replace(target as Parameters<typeof router.replace>[0]);
    }
  }, [session, redirect]);

  const handleSubmit = () => {
    Keyboard.dismiss();
    setError(null);
    setSubmitting(true);

    const result = login(loginInput, password);
    if (result.success) {
      const target = redirect || '/member/overview';
      router.replace(target as Parameters<typeof router.replace>[0]);
    } else {
      setError(result.error ?? 'Erro ao entrar.');
    }
    setSubmitting(false);
  };

  return <ScreenContainer>
    <Header title="Área dos membros" />
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.form}>
          <Text style={styles.title}>Acesso demonstrativo acadêmico</Text>
          <Notice>
            Informe seu primeiro nome para entrar como voluntário ou coordenação.
            Use o prefixo &ldquo;v-&rdquo; para voluntário (ex: v-Matheus).
          </Notice>

          <Input
            label="Login"
            value={loginInput}
            onChangeText={setLoginInput}
            placeholder="Nome"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Login de acesso"
          />

          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder=""
            secureTextEntry={!showPassword}
            accessibilityLabel="Senha de acesso"
          />

          <Button
            title={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            variant="ghost"
            onPress={() => setShowPassword(!showPassword)}
            fullWidth={false}
            style={styles.eyeButton}
          />

          {error && <Text style={styles.errorText} accessibilityLiveRegion="polite">{error}</Text>}

          <Button title={submitting ? 'Entrando...' : 'Entrar'} disabled={submitting} onPress={handleSubmit} />
        </View>
      </Card>

      <Button title="Voltar à área pública" variant="ghost" onPress={() => router.replace('/')} />
    </View>
  </ScreenContainer>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  card: {
    padding: spacing.lg,
  },
  form: {
    gap: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  eyeButton: {
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(29, 78, 216, 0.12)',
    borderColor: 'rgba(29, 78, 216, 0.3)',
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    textAlign: 'center',
  },
});