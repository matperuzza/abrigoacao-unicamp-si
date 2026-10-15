import { Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import { usePreventRemove } from 'expo-router/react-navigation';

// Intercepta também o gesto de retorno e o botão Voltar do Android.
export function useDiscardDraft(dirty: boolean) {
  const navigation = useNavigation();
  usePreventRemove(dirty, ({ data }) => {
    Alert.alert('Descartar rascunho?', 'O conteúdo digitado não será salvo neste protótipo.', [
      { text: 'Continuar editando', style: 'cancel' },
      { text: 'Descartar', style: 'destructive', onPress: () => navigation.dispatch(data.action) },
    ]);
  });
}
