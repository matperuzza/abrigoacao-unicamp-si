import { router } from 'expo-router';
import { ScreenContainer } from './ScreenContainer';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

export function MissingRecord({ title = 'Conteúdo não encontrado' }: { title?: string }) {
  return <ScreenContainer>
    <EmptyState title={title} description="Este endereço não corresponde a um registro do protótipo." />
    <Button title="Voltar" onPress={() => router.canGoBack() ? router.back() : router.replace('/')} />
  </ScreenContainer>;
}
