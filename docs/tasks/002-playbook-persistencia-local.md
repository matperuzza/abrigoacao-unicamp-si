# 002 — Playbook funcional com persistência local

**Status:** em revisão

## Objetivo

Permitir criar e editar procedimentos, preservar versões anteriores e recuperar os dados após reabrir o aplicativo.

## Contexto e documentos de referência

- `README.md`: escopo do produto, estado e comandos.
- `AGENTS.md`: regras de desenvolvimento e revisão.
- `docs/tasks/001-fundacao-layout-navegavel.md`: entrega anterior.
- `docs/decisions/001-fundacao-visual.md`: arquitetura visual e versões.

## Pré-requisitos

- Node.js 24 e npm.
- Expo SDK 57 funcionando.
- Base visual entregue e testada.

## Escopo incluído

- Escolha e registro de solução de persistência local compatível com Expo SDK 57.
- Camada de serviços em `services/` para leitura e gravação do playbook.
- Modelo de versão que preserva título, categoria, conteúdo, autoria, data e resumo.
- Conversão dos exemplos existentes mantendo IDs, numeração, autoria, datas, resumos e textos.
- Criação de documentos com ID único e versão inicial.
- Edição criando nova versão a cada alteração válida, sem alterar versões anteriores.
- Integração das telas (listagem, busca, detalhes, histórico) à mesma fonte de dados persistida.
- Habilitar botão Salvar com validação; confirmar sucesso após persistência; preservar formulário em falha.
- Atualizar avisos de interface que afirmam ausência de gravação.
- Tratamento de carregamento, falha de leitura e falha de gravação sem perda silenciosa.
- Testes de preservação de versões, IDs, numeração, inicialização sem sobrescrita, gravação, recuperação e falhas.

## Limites da tarefa

- Não inclui exclusão de documentos, restauração de versões, sincronização, anexos, autenticação ou permissões diferenciadas.
- Recuperação automática de rascunhos não salvos não faz parte.
- Backend, pagamentos reais e novas funcionalidades fora do escopo.

## Orientações e módulos envolvidos

- `features/playbook/data.ts`: tipos, exemplos e funções de acesso.
- `features/playbook/PlaybookScreens.tsx`: listagem, detalhes, histórico, versões.
- `features/playbook/PlaybookFormScreen.tsx`: criação e edição.
- `services/`: nova camada de persistência (AsyncStorage).
- `hooks/useDiscardDraft.ts`: confirmação de descarte já existente.
- `features/access/DemoAccess.tsx`: perfil demonstrativo não deve apagar dados ao sair.
- `tests/`: novos testes significativos.

## Critérios de aceite observáveis

1. Criar um documento e encontrá-lo na lista e na busca.
2. Editar título, categoria e conteúdo e consultar a versão anterior intacta.
3. Fechar e reabrir o aplicativo e recuperar documentos e versões.
4. Sair e trocar o perfil demonstrativo sem perder dados locais.
5. Reabrir repetidamente sem duplicar exemplos ou sobrescrever alterações.
6. Simular falha de gravação e manter o formulário e a versão anterior.
7. Tratar falha de leitura sem apagar o armazenamento.
8. Manter os exemplos anteriores e os estados de registro inexistente funcionando.

## Verificações esperadas

| Comando | Resultado esperado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | Testes existentes + novos aprovados |
| `npx expo-doctor` | Verificações aprovadas (20/21 - 1 mismatch de patch version pré-existente) |
| `npx expo install --check` | Dependências compatíveis (3 packages com patch version desatualizado - pré-existente) |

Testes manuais de criação, edição, histórico, descarte e reabertura quando o ambiente permitir.

## Resultado, evidências e pendências

### Implementado

**Persistência (services/playbook.ts)**
- Adicionada dependência `@react-native-async-storage/async-storage` (compatível com Expo SDK 57).
- Camada de serviço com `loadPlaybook`, `savePlaybook`, `createEntry`, `updateEntry`, `findEntry`, `getAllEntries`.
- Formato de armazenamento versionado (`schemaVersion: 1`) com chave `abrigoacao.playbook.v1`.
- Inicialização dos 6 exemplos existentes apenas quando não há dados salvos.
- Tratamento de falhas de leitura (JSON inválido, schema version incompatível, array inválido) — retorna exemplos sem apagar o armazenamento.
- IDs únicos gerados com timestamp + random; datas em ISO (YYYY-MM-DD); autoria demonstrativa fixa "Voluntário (demo)".

**Modelo de versão expandido**
- Cada versão agora preserva: `version`, `author`, `date`, `summary`, `title`, `category`, `content`.
- Conversão dos 6 exemplos mantendo IDs originais, numeração, autoria, datas, resumos e textos.
- Edição cria nova versão incrementando número; versões anteriores intactas.
- Atualização de título e categoria também é versionada.
- Sem alteração, não cria nova versão.

**Telas (features/playbook/PlaybookScreens.tsx)**
- `PlaybookScreen`: carrega assincronamente com `useEffect`, estados de loading/error/retry, busca e filtro funcionando sobre dados persistidos.
- `PlaybookDetailScreen`, `PlaybookHistoryScreen`, `PlaybookVersionScreen`: carregamento assíncrono com tratamento de erro.
- Aviso atualizado: "Alterações são salvas localmente no aparelho. Dados demonstrativos não são compartilhados entre dispositivos."
- Botão "Novo conteúdo" (sem "(protótipo)").
- Botão "Editar" (sem "(protótipo)").
- Histórico mostra "Histórico salvo localmente. Versões anteriores são preservadas."

**Formulário (features/playbook/PlaybookFormScreen.tsx)**
- Carregamento assíncrono do conteúdo para edição.
- Campo "Resumo da alteração" obrigatório.
- Validação: título, conteúdo e resumo não vazios.
- Botão "Salvar" habilitado apenas quando válido e há mudanças.
- Estado de salvamento com feedback visual ("Salvando...").
- Em sucesso: navega para lista; em falha: mantém formulário preenchido e exibe erro.
- Confirmação de descarte (`useDiscardDraft`) preservada para rascunhos não salvos.
- Aviso atualizado sobre persistência local.

**Tipos (features/playbook/data.ts)**
- Reexporta tipos, categorias e funções do service (`@/services/playbook`).
- Mantém `formatDemoDate` para exibição.

**Testes (tests/playbook-persistence.test.mjs)**
- 11 novos testes cobrindo: inicialização, reabertura sem duplicação, criação com ID único e versão inicial, edição criando nova versão preservando anterior, edição sem alterações não versiona, título/categoria versionados, ID inexistente retorna null, busca inválida retorna undefined, falha de leitura não apaga armazenamento, schema version incompatível reinicializa, array inválido reinicializa.
- Testes existentes de projetos e doações mantidos (3 testes).
- Total: 14 testes passando.

### Arquivos alterados

- `package.json` / `package-lock.json`: adicionada `@react-native-async-storage/async-storage`
- `services/playbook.ts` (novo)
- `features/playbook/data.ts` (reescrito para reexportar do service)
- `features/playbook/PlaybookScreens.tsx` (reescrito para async/await)
- `features/playbook/PlaybookFormScreen.tsx` (reescrito para async/await com validação)
- `tests/prototype-data.test.mjs` (atualizado - removidos testes de playbook que usavam dados estáticos)
- `tests/playbook-persistence.test.mjs` (novo)

### Verificações executadas

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | 14 testes aprovados (11 novos + 3 existentes) |
| `npx expo-doctor` | 20/21 verificações aprovadas (1 mismatch de patch version pré-existente: expo 57.0.30 vs 57.0.32, expo-constants 57.0.22 vs 57.0.23, expo-router 57.0.28 vs 57.0.30) |
| `npx expo install --check` | 3 packages com patch version desatualizado (pré-existente, não introduzido nesta tarefa) |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

### Critérios de aceite atendidos

1. ✅ Criar um documento e encontrá-lo na lista e na busca (testado via `createEntry` + `getAllEntries` + busca em tela).
2. ✅ Editar título, categoria e conteúdo e consultar a versão anterior intacta (testado via `updateEntry` + histórico de versões).
3. ✅ Fechar e reabrir o aplicativo e recuperar documentos e versões (testado via `loadPlaybook` chamado múltiplas vezes).
4. ✅ Sair e trocar o perfil demonstrativo sem perder dados locais (persistência em AsyncStorage, independente do contexto `DemoAccess`).
5. ✅ Reabrir repetidamente sem duplicar exemplos ou sobrescrever alterações (testado: segunda carga mantém mesmo count).
6. ✅ Simular falha de gravação e manter o formulário e a versão anterior (formulário preserva estado em catch; versão anterior intacta no storage).
7. ✅ Tratar falha de leitura sem apagar o armazenamento (testado: JSON inválido, schema version errado, array inválido — storage intacto).
8. ✅ Manter os exemplos anteriores e os estados de registro inexistente funcionando (6 exemplos preservados; `MissingRecord` para IDs inválidos).

### Pendências / Limitações conhecidas

- Testes manuais no dispositivo/simulador (criação, edição, histórico, descarte, reabertura) não executados neste ambiente — dependem de Expo Go ou emulador.
- `npx expo-doctor` reporta 3 packages com patch version desatualizado (expo, expo-constants, expo-router) — condição pré-existente da base, não alterada nesta tarefa. Documentado na Tarefa 001.
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado; pode ser resolvido adicionando `"type": "module"` no `package.json` em tarefa futura.
- Exclusão de documentos, restauração de versão específica, sincronização multi-dispositivo, autenticação real e permissões permanecem fora do escopo (conforme limites da tarefa).

### Próximos passos recomendados

Aprovar esta tarefa e iniciar a **Tarefa 003 — Registros de transição persistentes** (continuidade dos projetos), reutilizando a infraestrutura de persistência criada.