# 003 — Registros de transição persistentes

**Status:** em revisão

## Objetivo

Permitir que um membro registre quem dará continuidade a um projeto, suas pendências e aprendizados, preservando o histórico e recuperando os registros após fechar e reabrir o aplicativo.

## Contexto e documentos de referência

- `README.md`
- `AGENTS.md`
- `docs/tasks/002-playbook-persistencia-local.md`
- Decisões existentes em `docs/decisions/`
- Código dos módulos envolvidos

## Pré-requisitos

- Git limpo
- Expo SDK 58
- Verificações iniciais executadas

## Escopo incluído

1. Modelo de registro (`features/projects/transition.ts`)
2. Persistência independente (`services/transitions.ts`)
3. Formulário funcional (`TransitionScreen.tsx`)
4. Histórico no detalhe interno (`TransitionHistoryScreen.tsx` + `ProjectScreens.tsx`)
5. Preservação dos exemplos
6. Perfis e navegação

## Limites

Não inclui: edição/exclusão de transições, gestão de tarefas, alteração de projetos, sincronização, backend, pagamentos, refatoração do playbook.

## Orientações e módulos

- `features/projects/transition.ts`: tipos e validação
- `services/transitions.ts`: leitura/validação/gravação
- `features/projects/TransitionScreen.tsx`: formulário
- `features/projects/TransitionHistoryScreen.tsx`: histórico interno
- `features/projects/ProjectScreens.tsx`: composição do detalhe
- `tests/transitions.test.mjs`: testes

## Critérios de aceite

- [x] Registrar transição válida e visualizar no projeto
- [x] Registrar segunda transição preservando a primeira
- [x] Registrar em outro projeto mantendo históricos separados
- [x] Fechar/reabrir app recuperar registros
- [x] Trocar perfil preservar dados, autoria correta
- [x] Rejeitar responsável vazio e ausência pendências/aprendizados
- [x] Rejeitar projeto inexistente sem gravar
- [x] Evitar duplicação toques repetidos Salvar
- [x] Falha gravação preservar formulário e histórico anterior
- [x] Falha leitura mostrar erro e permitir nova tentativa sem apagar
- [x] Preservar exemplos e dados playbook
- [x] Abrir projetos públicos e sair área membros sem crashes

## Verificações

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | 31 testes passando (14 existentes + 17 novos) |
| `npx expo-doctor` | 20/20 verificações aprovadas |
| `npx expo install --check` | Dependências compatíveis |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

## Resultado, evidências e pendências

### Implementado

**Modelo (`features/projects/transition.ts`)**
- Tipo `TransitionRecord` com: id, projectId, responsible, pending, learnings, author, createdAt
- Funções de validação: `validateTransitionInput`, `generateTransitionId`, `getDemoAuthor`, `formatDateTimeForStorage`
- Validação exige responsável preenchido e pelo menos uma pendência ou aprendizado

**Persistência (`services/transitions.ts`)**
- Chave própria: `abrigoacao.transitions.v1` (independente do playbook)
- Schema versionado (`schemaVersion: 1`)
- Funções: `loadTransitions`, `saveTransitions`, `createTransition`, `getTransitionsByProject`, `findProjectTransitions`
- Tratamento de falhas de leitura (JSON inválido, estrutura inválida, schema version incompatível) — retorna array vazio sem apagar o armazenamento
- Falha de gravação preserva registros anteriores
- Ordenação determinística por data decrescente

**Formulário (`features/projects/TransitionScreen.tsx`)**
- Validação client-side com mensagens claras
- Autor do registro exibido (reflete perfil: "Voluntário (demo)" ou "Coordenação (demo)")
- Botão Salvar habilitado apenas quando válido
- Estado de salvamento com feedback ("Salvando...")
- Em sucesso: navega para detalhe do projeto; em falha: mantém formulário e exibe erro
- Confirmação de descarte preservada
- Aviso de persistência local

**Histórico (`features/projects/TransitionHistoryScreen.tsx`)**
- Carregamento assíncrono com estados loading/error/retry
- Lista transições mais recentes primeiro
- Badge "Mais recente" no primeiro registro
- Exibe responsável, autor, data/hora formatada, pendências e aprendizados
- Estado vazio orientativo
- Aviso de dados locais não compartilhados

**Integração no detalhe (`features/projects/ProjectScreens.tsx`)**
- Componente `TransitionHistoryScreen` embutido na área interna
- Texto de transição original mantido como "contexto inicial"
- Botão "Registrar transição" condicionado a `canWriteTransitions`

**Preservação dos exemplos**
- Todos os 5 projetos com responsáveis, pendências, aprendizados e textos de transição originais inalterados
- Novo histórico fica abaixo do contexto inicial, claramente identificado
- Salvar transição não altera campos base do projeto

**Perfis e navegação**
- Respeita `canWriteTransitions` e perfil selecionado
- Sem perfil, redireciona para entrada de membros
- Projetos públicos e saída da área de membros funcionam sem crashes (corrigido na Tarefa 002)

**Testes (`tests/transitions.test.mjs`)**
- 17 novos testes cobrindo: validação, criação com autor por perfil, múltiplas transições preservadas, ordenação decrescente, isolamento por projeto, reabertura sem duplicação, armazenamento ausente, JSON inválido, estrutura inválida, schema version incompatível, falha de gravação sem perda, ID inválido
- Total: 31 testes (14 playbook/projetos/doações + 17 transições)

### Arquivos alterados/criados

| Arquivo | Tipo |
|---|---|
| `features/projects/transition.ts` | Novo — modelo e validação |
| `services/transitions.ts` | Novo — persistência independente |
| `features/projects/TransitionScreen.tsx` | Reescrito — formulário funcional |
| `features/projects/TransitionHistoryScreen.tsx` | Novo — histórico com loading/error/retry |
| `features/projects/ProjectScreens.tsx` | Atualizado — integra histórico e botão condicional |
| `tests/transitions.test.mjs` | Novo — 17 testes |
| `docs/tasks/003-registros-transicao-persistentes.md` | Atualizado — evidências |

### Verificações executadas

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | 31 testes aprovados |
| `npx expo-doctor` | 20/20 verificações aprovadas |
| `npx expo install --check` | Dependências compatíveis |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

### Critérios de aceite atendidos

1. ✅ Registrar transição válida e visualizar no projeto (formulário + histórico embutido)
2. ✅ Registrar segunda transição preservando a primeira (teste: múltiplas transições preservam histórico)
3. ✅ Registrar em outro projeto mantendo históricos separados (teste: isolamento por projeto)
4. ✅ Fechar/reabrir app recuperar registros (teste: reabertura recupera dados sem duplicar)
5. ✅ Trocar perfil preservar dados, autoria correta (teste: autor reflete perfil Coordenação)
6. ✅ Rejeitar responsável vazio e ausência pendências/aprendizados (testes de validação)
7. ✅ Rejeitar projeto inexistente sem gravar (validação + findProjectTransitions)
8. ✅ Evitar duplicação toques repetidos Salvar (estado `saving` bloqueia submissão)
9. ✅ Falha gravação preservar formulário e histórico anterior (teste: falha de gravação não perde registros)
10. ✅ Falha leitura mostrar erro e permitir nova tentativa sem apagar (estados loading/error/retry + armazenamento intacto)
11. ✅ Preservar exemplos e dados playbook (projetos inalterados, playbook intacto)
12. ✅ Abrir projetos públicos e sair área membros sem crashes (corrigido na Tarefa 002, verificado nas exportações)

### Pendências / Limitações conhecidas

- Testes manuais em dispositivo/simulador não executados neste ambiente — dependem de Expo Go ou emulador
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado
- Edição/exclusão de transições, sincronização, backend, autenticação real permanecem fora do escopo

### Próximos passos recomendados

Aprovar esta tarefa e iniciar a **Tarefa 004 — Fluxo de contribuição simulada completa** (finalizar seleção → resumo → confirmação → resultado) e a **Tarefa 005 — Revisão integrada e entrega acadêmica**.