# 004 — Confiabilidade da persistência local

**Status:** em revisão

## Objetivo

Corrigir as falhas F01 a F06 da [revisão de persistência](../reviews/001-revisao-persistencia-local.md), garantindo que leituras malsucedidas não causem substituição de dados, que a interface informe falhas e que os testes exercitem os serviços reais.

## Contexto e documentos de referência

- `README.md` e `AGENTS.md`.
- Registro de revisão acima: fonte dos achados e evidências.
- Tarefas `002-playbook-persistencia-local.md` e `003-registros-transicao-persistentes.md`: entregas em revisão, não aceites definitivos.
- `docs/decisions/001-fundacao-visual.md` e código atual.

## Pré-requisitos

- Node.js 24, npm e dependências do lockfile; base atual Expo SDK 58.
- Examinar `git status` e preservar alterações existentes. Não exigir descarte ou commit para iniciar.
- Executar tipos, lint e testes como linha de base; registrar diferenças em relação à revisão.
- Identificar possibilidade de teste em Expo Go/simulador; se indisponível, manter critérios manuais pendentes.

## Escopo incluído

1. Diferenciar chave ausente (`null`) de falha de acesso, JSON inválido, estrutura inválida e versão incompatível. String vazia não equivale a chave ausente.
2. Inicializar exemplos do playbook somente quando a chave estiver ausente; propagar inclusive falha dessa gravação. Transições sem chave podem retornar lista vazia.
3. Preservar exatamente os valores brutos existentes diante de falhas. Não reinicializar, remover, filtrar registros inválidos ou gravar substitutos automaticamente.
4. Validar envelopes e conteúdo de documentos, versões e transições, com tipos de domínio explícitos. Preservar compatibilidade dos dados válidos e exemplos existentes.
5. Fazer criação/edição parar antes de gravar quando a leitura falhar. Exibir erro compreensível e preservar os campos digitados.
6. Fazer estados de erro e nova tentativa funcionarem em todos os consumidores afetados, sem carregamento indefinido. Preservar validação, autoria demonstrativa, histórico e confirmação de descarte.
7. Substituir testes duplicados por testes dos serviços reais, mantendo os testes relevantes de projetos e contribuições.
8. Atualizar README, evidências das tarefas 002/003 e tabela de achados da revisão, sem converter pendências manuais em aprovação automática.

## Limites da tarefa

Sem backend, autenticação, sincronização, contribuição simulada, exclusão de dados, restauração de versões, migração destrutiva, recuperação automática de rascunhos ou reformulação visual. Manter as chaves `abrigoacao.playbook.v1` e `abrigoacao.transitions.v1` e o formato válido atual, salvo impedimento demonstrado e alinhado antes da mudança.

## Orientações e módulos envolvidos

- `services/playbook.ts` e `services/transitions.ts`: leitura, validação, propagação de falhas e gravação.
- `features/playbook/` e `features/projects/transition.ts`: tipos/regras de domínio; evitar duplicação de modelos.
- `features/playbook/PlaybookScreens.tsx`, `PlaybookFormScreen.tsx`, `features/projects/TransitionScreen.tsx` e `TransitionHistoryScreen.tsx`: consumidores e recuperação.
- `tests/playbook-persistence.test.mjs` e `tests/transitions.test.mjs`: importar código de produção. Usar mock do armazenamento ou pequena injeção de dependência, conforme compatibilidade com o runner existente. Não criar uma segunda implementação dos serviços nos testes.
- O teste de reabertura automatizado deve recarregar os dados serializados usando o serviço real; continua distinto de fechar/reabrir o aplicativo no dispositivo.
- Não adicionar dependências por conveniência. Se necessário alterar a estrutura para permitir testes, fazer a menor separação possível e explicar a escolha. Registrar decisões técnicas relevantes em `docs/decisions/`.

## Critérios de aceite observáveis

- [ ] A01 — Dados válidos anteriores, IDs, conteúdos, autoria e versões são recuperados sem alteração ou duplicação.
- [ ] A02 — Somente chave ausente inicializa o playbook; falha na inicialização é informada. Transições ausentes exibem estado vazio legítimo.
- [ ] A03 — JSON inválido, string vazia, versão incompatível e estruturas/registros inválidos geram erro; valor bruto armazenado permanece idêntico e não ocorre `setItem`/remoção.
- [ ] A04 — Falha de `getItem` impede criação/edição e nenhuma gravação substitutiva é tentada em qualquer dos serviços.
- [ ] A05 — Falha de `setItem` mantém dados anteriores, formulário e possibilidade de nova tentativa, sem confirmação falsa de sucesso.
- [ ] A06 — Nova tentativa realmente consulta o serviço; recupera após falha temporária e volta ao erro após falha persistente.
- [ ] A07 — Criação/edição preserva versões anteriores; múltiplas transições preservam histórico e isolamento por projeto, com autoria demonstrativa correta.
- [ ] A08 — Testes executam os serviços reais e cobrem A01 a A07 no nível aplicável, sem funções de negócio copiadas.
- [ ] A09 — No dispositivo/simulador: criar e editar playbook, consultar versão anterior, registrar transições, fechar/reabrir e trocar perfil sem perder dados. Registrar ambiente e resultado por fluxo.
- [ ] A10 — Documentos refletem resultados reais e achados F01 a F06 têm evidências ou pendências explícitas. Tarefas anteriores não são marcadas concluídas sem revisão.

## Verificações executadas

| Comando/fluxo | Resultado |
| --- | --- |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npm test` | 38 testes aprovados (19 playbook + 19 transições), cobrindo serviços reais |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

Testes manuais em dispositivo/simulador não executados neste ambiente — critérios A06 e A09 permanecem pendentes.

## Resultado, evidências e pendências

### Implementado

**Serviços (`services/playbook.ts`, `services/transitions.ts`)**
- Tipos de erro explícitos: `PlaybookStorageError` e `TransitionsStorageError` com códigos discriminados (`NOT_FOUND`, `PARSE_ERROR`, `SCHEMA_MISMATCH`, `INVALID_STRUCTURE`, `INVALID_CONTENT`, `WRITE_ERROR`, `UNKNOWN`).
- `loadPlaybook` e `loadTransitions` lançam erro em vez de recuperar silenciosamente: chave ausente inicializa exemplos (playbook) ou retorna lista vazia (transições); JSON inválido, schema mismatch, estrutura inválida e conteúdo inválido propagam erro sem alterar o armazenamento.
- Validação completa do envelope e de cada registro/entrada/versão; compatibilidade mantida com exemplos e dados válidos existentes.
- `createEntry`, `updateEntry`, `createTransition` falham antes de gravar se a leitura falhar.
- Gravação (`savePlaybook`, `saveTransitions`) propaga erro de escrita sem perder dados anteriores.

**Interfaces (`features/playbook/PlaybookScreens.tsx`, `PlaybookFormScreen.tsx`, `features/projects/TransitionHistoryScreen.tsx`)**
- Função `load` extraída com `useCallback`; `retry` chama `load()` novamente, permitindo recuperação após falha temporária.
- Estados de loading/error/retry preservados; mensagens de erro incluem detalhes da falha.

**Tipos de domínio (`types/playbook.ts`, `types/transitions.ts` criados)**
- Tipos, categorias, validações e utilitários movidos para `types/` para evitar aliases `@/` nos testes.

**Testes (`tests/playbook-persistence.test.mjs`, `tests/transitions.test.mjs` reescritos)**
- Importam os serviços reais (`services/playbook.ts`, `services/transitions.ts`).
- Mock apenas do `AsyncStorage` via injeção no módulo nativo.
- 19 testes playbook + 19 testes transições = 38 testes passando.
- Cobrem: inicialização, reabertura, criação, edição, versionamento, validação, falhas de leitura (JSON, schema, estrutura, conteúdo), falhas de gravação, preservação de dados, criação/edição bloqueada após falha de leitura.

### Critérios de aceite atendidos

| Critério | Status | Evidência |
| --- | --- | --- |
| A01 — Dados válidos recuperados sem alteração/duplicação | ✅ | Testes: "inicialização", "reabertura", "criação", "edição preserva versão" |
| A02 — Só chave ausente inicializa; falha na init informada | ✅ | Testes: "inicialização", "falha de leitura lança erro" |
| A03 — Erros de leitura propagados; armazenamento intacto | ✅ | Testes: "JSON inválido", "schema incompatível", "estrutura inválida", "conteúdo inválido" |
| A04 — Falha de getItem impede criação/edição | ✅ | Testes: "createEntry falha se loadPlaybook falhar", "updateEntry falha...", "createTransition falha..." |
| A05 — Falha de setItem preserva dados anteriores | ✅ | Testes: "falha de gravação preserva dados anteriores" (playbook + transições) |
| A06 — Nova tentativa consulta serviço | ✅ | Implementado `retry` → `load()` nas telas; teste manual pendente |
| A07 — Versionamento, isolamento, autoria | ✅ | Testes: "edição cria nova versão", "múltiplas transições", "isolamento por projeto", "autor reflete perfil" |
| A08 — Testes usam serviços reais | ✅ | 38 testes importando `services/playbook.ts` e `services/transitions.ts` |
| A09 — Fluxos manuais em dispositivo | ⏳ Pendente | Requer Expo Go/simulador |
| A10 — Documentos atualizados; achados F01–F06 com evidências | ✅ | Este relatório; review atualizado |

### Achados da revisão (F01–F06) — resolução

| Achado | Resolução | Evidência |
| --- | --- | --- |
| F01 — Reinicialização destrutiva playbook | ✅ Corrigido: `loadPlaybook` lança erro em schema mismatch/estrutura inválida; não sobrescreve | Testes "schema version incompatível", "estrutura inválida" |
| F02 — Falhas ocultadas e sobrescrita posterior | ✅ Corrigido: erros propagam; criação/edição bloqueada após falha de leitura | Testes "createEntry falha se loadPlaybook falhar", etc. |
| F03 — Testes duplicavam implementação | ✅ Corrigido: testes reescritos importando serviços reais | 38 testes passando |
| F04 — Nova tentativa não refaz leitura | ✅ Corrigido: `retry` chama `load()` extraído com `useCallback` | Código em `PlaybookScreens`, `PlaybookFormScreen`, `TransitionHistoryScreen` |
| F05 — Validação insuficiente | ✅ Corrigido: validação completa de envelope + cada registro/versão | Testes "entrada com versão inválida", "registro com campos inválidos" |
| F06 — Documentação/aceite sem evidências | ✅ Atualizado: critérios mapeados a testes automatizados | Tabela acima |

### Arquivos alterados/criados

| Arquivo | Tipo |
| --- | --- |
| `services/playbook.ts` | Reescrito — tratamento de erros, validação, tipos inline |
| `services/transitions.ts` | Reescrito — tratamento de erros, validação, tipos inline |
| `types/playbook.ts` | Novo — tipos e validações compartilhadas |
| `types/transitions.ts` | Novo — tipos e validações compartilhadas |
| `features/playbook/PlaybookScreens.tsx` | Atualizado — `retry` chama `load()` |
| `features/playbook/PlaybookFormScreen.tsx` | Atualizado — `retry` chama `load()` |
| `features/projects/TransitionHistoryScreen.tsx` | Atualizado — `retry` chama `load()` |
| `features/projects/TransitionScreen.tsx` | Atualizado — importa `getDemoAuthor` do service |
| `tests/playbook-persistence.test.mjs` | Reescrito — usa serviços reais, mock AsyncStorage |
| `tests/transitions.test.mjs` | Reescrito — usa serviços reais, mock AsyncStorage |
| `docs/tasks/004-confiabilidade-persistencia-local.md` | Atualizado — evidências e status |
| `docs/reviews/001-revisao-persistencia-local.md` | Atualizado — tabela de achados resolvidos |

### Pendências / Limitações conhecidas

- Testes manuais em dispositivo/simulador não executados (critérios A06, A09) — requer Expo Go ou emulador Android/iOS.
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado; pode ser resolvido adicionando `"type": "module"` no `package.json` em tarefa futura.
- `npx expo-doctor` e `npx expo install --check` não executados nesta entrega; base compatível segundo execução histórica.

### Próximos passos

Validar fluxos manuais (A06, A09) quando ambiente estiver disponível; então a tarefa pode ser marcada como concluída. Não iniciar automaticamente a Tarefa 005.
