import { useState } from 'react';
import { Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Notice } from '@/components/Notice';
import { MissingRecord } from '@/components/MissingRecord';
import { useDiscardDraft } from '@/hooks/useDiscardDraft';
import { colors, spacing, typography } from '@/theme';
import { categories, findEntry, type PlaybookEntry, type Category } from './data';

export default function PlaybookFormScreen({ create = false }: { create?: boolean }) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = create ? undefined : findEntry(id);
  if (!create && !entry) return <MissingRecord />;
  return <PlaybookForm key={entry?.id ?? 'new'} entry={entry} />;
}

function PlaybookForm({ entry }: { entry?: PlaybookEntry }) {
  const initialTitle = entry?.title ?? '';
  const initialContent = entry?.versions[0]?.content ?? '';
  const initialCategory = entry?.category ?? categories[0];
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [category, setCategory] = useState<Category>(initialCategory);
  useDiscardDraft(title !== initialTitle || content !== initialContent || category !== initialCategory);
  const back = () => router.canGoBack() ? router.back() : router.replace('/member/playbook');
  return <ScreenContainer>
    <Header title={entry ? 'Editar conteúdo' : 'Novo conteúdo'} showBack onBack={back} />
    <View style={{ gap: spacing.lg }}>
      <Notice>Protótipo visual: o conteúdo digitado não será salvo.</Notice>
      <Input label="Título" value={title} onChangeText={setTitle} placeholder="Título do procedimento" />
      <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Categoria</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {categories.map(item => <Button key={item} title={item} fullWidth={false} selected={category === item}
          variant={category === item ? 'primary' : 'secondary'} onPress={() => setCategory(item)} />)}
      </View>
      <Input label="Conteúdo" value={content} onChangeText={setContent} placeholder="Escreva aqui..." multiline numberOfLines={10} />
      <Button title="Salvar — disponível na próxima etapa" disabled />
      <Button title="Cancelar" variant="ghost" onPress={back} />
    </View>
  </ScreenContainer>;
}
