# 002 — Identidade, dados demonstrativos e migração segura

**Status:** decidida — implementada na Tarefa 007.

## Contexto

A Tarefa 007 introduz login demonstrativo nominal com 16 acessos (8 pessoas × 2 perfis), autoria individual, dados enriquecidos de playbook e projetos, e painel interno. Isso exige:

1. Fonte única de pessoas (`features/access/people.ts`) com IDs estáveis.
2. Credenciais fixas: senha `0000`, prefixo `v-` para Voluntário, sem prefixo para Coordenação.
3. Autoria de playbook/transições usando `displayName` + perfil (ex: `Filipe Angi (Coordenação)`).
4. Atualização idempotente dos exemplos já persistidos no AsyncStorage, preservando conteúdo criado pelo usuário.

## Decisão

### Cadastro de pessoas e credenciais

- Arquivo `features/access/people.ts` exporta `people` (8 pessoas) e `credentials` (16 acessos).
- `normalizeLogin`: apara espaços, ignora caixa e acentos, colapsa espaços múltiplos.
- `findCredential`: exige senha exata `0000` e login normalizado igual ao cadastrado.
- Dois logins da mesma pessoa compartilham `personId`; perfil deriva do prefixo `v-`.

### Autoria individual

- `getDemoAuthor(profile, personName?)` em `services/playbook.ts` e `services/transitions.ts`:
  - Se `personName` fornecido: `"Nome (Perfil)"`.
  - Fallback (dados legados): `"Perfil (demo)"`.
- `createEntry`/`updateEntry` e `createTransition` recebem `personName` da sessão ativa.
- Autor e responsável permanecem campos distintos; responsáveis livres não são restringidos.

### Migração de dados demonstrativos (playbook e transições)

**Princípios:**
- Chave ausente → recebe exemplos novos (versão `DATA_VERSION`).
- Base antiga válida → reconhece exemplos por **ID + conteúdo/versão conhecidos**, não apenas ID.
- Exemplos intactos (conteúdo idêntico ao seed original) → substituídos pela versão enriquecida do seed atual.
- Exemplos editados pelo usuário (conteúdo diverge do seed) → **preservados integralmente**, incluindo versões anteriores.
- Conteúdo criado pelo usuário (IDs não presentes no seed) → preservado.
- Reexecução não duplica exemplos, versões nem transições.
- Falha de leitura/validação **não autoriza gravação**; falha de escrita mantém dados anteriores e permite retry.

**Implementação:**
- `STORED_PLAYBOOK` e `STORED_TRANSITIONS` ganham campo `dataVersion`.
- `migrateDataIfNeeded` (playbook) e `migrateTransitionsIfNeeded` (transições) comparam `dataVersion` e, se desatualizado:
  - Carregam seed enriquecido atual (`getInitialEntries`).
  - Para cada entrada do seed: se existe entrada persistida com mesmo ID **e** conteúdo da versão atual idêntico ao seed antigo, substitui pela entrada do seed novo (com versões expandidas).
  - Caso contrário, mantém a entrada persistida (editada ou criada pelo usuário).
  - Adiciona entradas do seed novo que não existiam no armazenamento.
- Gravação atômica via `savePlaybook`/`saveTransitions` apenas se houver mudança real (comparação JSON).
- Erros de validação/leitura propagam exceção sem tocar no armazenamento; erros de escrita preservam dados originais.

### Compatibilidade com versões anteriores

- Seed v1 (Tarefas 002/003): autores no formato `"Voluntário (demo)"` / `"Coordenação (demo)"`. Migração mantém esses autores nas versões antigas; novas versões usam `"Nome (Perfil)"`.
- Versão 2 sem versão 1 (ex: procedimento "Segurança no canteiro") continua legível; validação não exige histórico artificialmente completo.
- `null`, arrays, primitivos, datas e versões inválidas são rejeitados com códigos de erro discrimináveis (`PARSE_ERROR`, `SCHEMA_MISMATCH`, `INVALID_STRUCTURE`, `INVALID_CONTENT`, `WRITE_ERROR`).

## Consequências

- Usuários que já editaram exemplos não perdem seu trabalho.
- Autoria histórica permanece rastreável (versões antigas mantêm autores originais).
- Nova autoria é nominal e individual, facilitando demonstração de contribuição de cada integrante.
- Migração é idempotente e segura para reexecução.
- Documentação no roteiro de demonstração inclui credenciais e fluxo de migração.

## Alternativas consideradas

- **Reset total do AsyncStorage** (limpar chave): descartado por perder trabalho do usuário.
- **Migração apenas por ID** (sem comparar conteúdo): descartado por sobrescrever edições legítimas.
- **Versionamento de schema (SCHEMA_VERSION > 1)**: mantido em 1; `dataVersion` controla apenas conteúdo de seed.