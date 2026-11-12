import { Alert, Platform } from 'react-native';
import { usePreventRemove } from 'expo-router/react-navigation';

// Intercepta também o gesto de retorno e o botão Voltar do Android.
export function useDiscardDraft(dirty: boolean) {
  // O Expo Router também protege fechamento/recarregamento na web.
  usePreventRemove(dirty, ({ repeat }) => {
    // Alert.alert não abre um diálogo no navegador.
    if (Platform.OS === 'web') {
      if (window.confirm('Descartar rascunho? O conteúdo digitado não será salvo.')) {
        repeat();
      }
      return;
    }
    Alert.alert('Descartar rascunho?', 'O conteúdo digitado não será salvo neste protótipo.', [
      { text: 'Continuar editando', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: repeat },
    ]);
  });
}
