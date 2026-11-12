# Roteiro de Demonstração — AbrigoAção (Tarefa 007)

Para instruções de acesso e uso voltadas à avaliação, consulte o [Guia da professora](guia-professora.md).

**Versão:** 2.0  
**Data:** 2026-11-12  
**Base Git:** `HEAD` (Tarefa 007 — Identidade, acesso e consolidação da entrega final)  
**Ambiente verificado (automatizado):** Node.js 24.21.0, npm 11.19.0, Expo SDK 58  
**Plataforma de demonstração prioritária:** Android (Expo Go) — a definir pelo responsável

---

## 1. Preparação

1. **Instalar dependências**
   ```bash
   npm ci
   ```

2. **Iniciar o servidor Expo**
   ```bash
   npm start
   ```

3. **Abrir no dispositivo/simulador**
   - Escanear QR code com Expo Go (Android) ou Camera (iOS)
   - Computador e celular na mesma rede
   - Expo Go compatível com SDK 58

4. **Dados locais**
   - Não é necessário apagar dados anteriores; a demonstração funciona com dados existentes
   - Migração idempotente preserva exemplos editados e conteúdo criado pelo usuário
   - Dados são fictícios e persistem apenas no dispositivo (AsyncStorage)
   - Login demonstrativo acadêmico — não autenticação real nem autorização segura

---

## 2. Credenciais de Demonstração (16 acessos)

| Pessoa | Login Coordenação | Login Voluntário | Senha |
|--------|-------------------|------------------|-------|
| Filipe Angi | `Filipe` | `v-Filipe` | `0000` |
| João Tamosaitis | `João` | `v-João` | `0000` |
| André Luis | `André` | `v-André` | `0000` |
| Giovana Carvalho | `Giovana` | `v-Giovana` | `0000` |
| Isabela Patino | `Isabela` | `v-Isabela` | `0000` |
| Lucas Blanes | `Lucas` | `v-Lucas` | `0000` |
| Matheus Peruzza | `Matheus` | `v-Matheus` | `0000` |
| Betania | `Betania` | `v-Betania` | `0000` |

**Regras de normalização:** apara espaços, ignora caixa e acentos, colapsa espaços múltiplos.  
**Exemplos válidos:** `v-matheus`, `V-MATHEUS`, ` v-matheus ` → todos entram como `Matheus Peruzza` (Voluntário). O login usa somente o primeiro nome; nomes completos não são credenciais válidas.

---

## 3. Jornadas de Demonstração

### Jornada 1 — Visitante simula contribuição mensal (A01)
**Objetivo:** Comprovar fluxo público completo sem movimentação financeira

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | App abre na aba **Início** (área pública) | Título "AbrigoAção", missão visível |
| 2 | Navegar para aba **Projetos** | Lista com 5 projetos fictícios; busca e filtro por situação funcionam |
| 3 | Tocar em um projeto | Detalhe com andamento, metas, atualizações, botão "Conhecer o apoio mensal" |
| 4 | Voltar e ir para aba **Apoiar** | Tela "Apoiar mensalmente" com 3 valores (R$ 20/50/100) |
| 5 | Selecionar **R$ 20,00** | Botão fica destacado (primário) |
| 6 | Tocar **Visualizar resumo** | Tela "Resumo da contribuição" com valor, periodicidade, aviso de simulação |
| 7 | Ler aviso: *"Esta é uma simulação: nenhuma contribuição será registrada..."* | Aviso visível antes da confirmação |
| 8 | Tocar **Confirmar simulação** | Navega para resultado; botão desabilitado durante navegação |
| 9 | Tela **Resultado da simulação** | Valor correto, aviso *"Esta é uma simulação confirmada: ... não é um recibo"* |
| 10 | Tocar **Nova simulação** | Retorna à tela "Apoiar"; estado resetado (confirmação anterior limpa) |
| 11 | Repetir com **R$ 50,00** e **R$ 100,00** | Mesma fluidez, sem duplicação de confirmação |
| 12 | Tentar abrir `/donations/result` direto (sem confirmar) | Bloqueado com orientação para iniciar fluxo |
| 13 | Entrada alternativa: Início → "Conhecer o apoio mensal" do projeto | Mesmo fluxo funcional |
| 14 | Toques repetidos nos botões | Não duplicam navegação (proteção 300ms) |

**Evidências automatizadas:** `findSuggestedAmount` valida parâmetros; `DonationResultScreen` exige `state.confirmed && state.confirmedAmount === amount`; 6 testes de domínio passando.

---

### Jornada 2 — Login nominal, guia e playbook (A02)
**Objetivo:** Login demonstrativo nominal, guia de integração, busca no playbook, autoria individual

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Na área pública, tocar **Área dos membros** | Tela de login com orientação e credenciais |
| 2 | Entrar como `v-Matheus` / `0000` | Redireciona para `/member/(tabs)/overview`; saudação "Matheus Peruzza · Voluntário" |
| 3 | Navegar para aba **Guia** | Guia atualizado (sem registro semanal) com botões para playbook |
| 4 | Tocar **Playbook → Boas-vindas** | Detalhe com autor `Filipe Angi (Coordenação)`, data, versão 2 |
| 5 | Navegar para aba **Playbook** | Lista com 6 procedimentos enriquecidos; busca e filtro funcionam |
| 6 | Buscar por "visita" | Filtra "Procedimento de visita a obra" (autor `Pedro Lima (Voluntário)`) |
| 7 | Filtrar categoria **Procedimentos de campo** | Mostra "Procedimento de visita a obra" e "Segurança no canteiro" |
| 8 | Tocar em "Encerramento de projeto" | Detalhe com 4 versões; autor v4 `Carla Mendes (Coordenação)` |
| 9 | Tocar **Histórico de versões** → versão 1 | Visualiza versão original intacta (autor `Carla Mendes (demo)`) |

**Evidências automatizadas:** 19 testes de playbook (criação, edição, versionamento, busca, falhas, persistência, migração).

---

### Jornada 3 — Edição com autoria individual e recuperação (A03)
**Objetivo:** Edição com versionamento, autoria nominal, persistência local, troca de conta

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | No detalhe de "Boas-vindas ao voluntário", tocar **Editar** | Formulário pré-preenchido |
| 2 | Alterar conteúdo; preencher **Resumo da alteração** | Botão "Salvar" habilitado apenas se válido |
| 3 | Tocar **Salvar** | Feedback "Salvando..." → retorna à lista |
| 4 | Abrir histórico → versão nova (v3) | Resumo, autor `Matheus Peruzza (Voluntário)`, data atual |
| 5 | Abrir versão anterior (v2) | Conteúdo intacto, autor `Filipe Angi (Coordenação)` preservado |
| 6 | Fechar app (matar processo) e reabrir | Dados persistem; edição recuperada |
| 7 | **Sair** da conta → entrar como `Filipe` / `0000` (Coordenação) | Dados preservados; autoria da edição anterior visível no histórico |
| 8 | Editar mesmo procedimento como Coordenação | Nova versão v4 com autor `Filipe Angi (Coordenação)` |
| 9 | Verificar que versões v1–v3 permanecem intactas | Histórico completo preservado |

**Evidências automatizadas:** testes de criação/edição/versionamento; `loadPlaybook` só inicializa se chave ausente; migração preserva edições; erros propagam sem sobrescrever; retry funcional.

---

### Jornada 4 — Transição de projeto e continuidade (A04)
**Objetivo:** Continuidade de projetos, isolamento por projeto, autoria nominal

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Na aba **Projetos** (interna), tocar em "Casa Nova Vila Esperança" | Detalhe com responsável `Filipe Angi`, pendências, atualizações |
| 2 | Ver seção **Procedimentos relacionados** | Links para "Procedimento de visita a obra", "Encerramento de projeto", "Segurança no canteiro" |
| 3 | Tocar **Registrar transição** | Formulário com autor `Filipe Angi (Coordenação)` |
| 4 | Preencher: novo responsável `João Tamosaitis`, pendências, aprendizados | Validação: responsável + (pendências OU aprendizados) |
| 5 | Tocar **Salvar** | Redireciona para detalhe; histórico atualizado com badge "Mais recente" |
| 6 | Registrar segunda transição no mesmo projeto | Ambas listadas, isoladas de outros projetos, ordenadas por data |
| 7 | Fechar/reabrir app | Históricos preservados |
| 8 | Trocar para `v-João` / `0000` | Consulta transição anterior; autoria `Filipe Angi (Coordenação)` visível |
| 9 | Registrar nova transição como Voluntário | Nova autoria `João Tamosaitis (Voluntário)` |

**Evidências automatizadas:** 19 testes de transições (validação, múltiplas, ordenação, isolamento, falhas, persistência, migração).

---

### Jornada 5 — Painel interno (Visão geral) e navegação integrada (A05)
**Objetivo:** Dashboard útil, atalhos corretos, atualização ao retornar

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Entrar como `v-Giovana` / `0000` | Saudação nominal; perfil Voluntário |
| 2 | Ver seção **Seus projetos** | Projetos onde `Giovana Carvalho` é responsável (ex: "Jardim Solidário") |
| 3 | Ver **Procedimentos recentes** | 5 últimos procedimentos atualizados (ordenados por data) |
| 4 | Ver **Transições recentes** | 5 últimas transições de todos os projetos |
| 5 | Tocar atalho **Novo conteúdo** → criar procedimento | Retorna ao painel; novo item aparece em "Procedimentos recentes" |
| 6 | Tocar atalho **Registrar transição** → abre projeto padrão | Fluxo funcional |
| 7 | Tocar **Ver todos** em qualquer seção | Navega para lista correta (playbook/projetos) |
| 8 | Estados vazios (ex: Betania sem projeto) | `EmptyState` orientativo com link para lista geral |

**Evidências automatizadas:** `getAllEntries`, `getAllTransitions`, `getTransitionsByProject` ordenados e limitados; painel usa mesma fonte das telas.

---

### Jornada 6 — Projetos públicos com busca/filtro (A06)
**Objetivo:** Busca combinada título/descrição/objetivo + filtro por situação na área pública

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Na aba **Projetos** (pública), buscar "solar" | Filtra "Projeto Luz no Lar" |
| 2 | Filtrar **Em andamento** | Mostra apenas projetos com status "Em andamento" |
| 3 | Combinar busca "casa" + filtro **Planejamento** | Apenas "Mutirão São João" (se coincidir) |
| 4 | Buscar termo inexistente "xyz" | `EmptyState` orientativo |
| 5 | Tocar projeto → detalhe público | Sem botões internos; botão "Conhecer o apoio mensal" funcional |

**Evidências automatizadas:** `ProjectsScreen` usa `useMemo` com busca normalizada pt-BR + filtro por status.

---

### Jornada 7 — Contribuição simulada robusta (A07)
**Objetivo:** Confirmação obrigatória, navegação explícita, proteção contra duplicação

| Passo | Ação | Resultado Esperado |
|-------|------|-------------------|
| 1 | Selecionar R$ 50 → Resumo → Confirmar → Resultado | Fluxo completo |
| 2 | Tocar **Voltar ao resumo** | Abre resumo do **mesmo valor** (R$ 50) via `navigate` explícito |
| 3 | Tocar **Nova simulação** | Reseta confirmação; permite novo fluxo |
| 4 | No resumo, tocar botão de valor R$ 20 (mudar valor) | Confirmação anterior invalidada; novo fluxo permitido |
| 5 | Toques rápidos em "Confirmar simulação" | Apenas uma navegação (proteção 300ms) |
| 6 | Acesso direto `/donations/result?cents=5000` (sem confirmar) | Bloqueado com orientação |
| 7 | Reiniciar app → abrir resultado | Sessão ausente; bloqueado com orientação |

**Evidências automatizadas:** `DonationFlowContext` com `reset`/`confirm`; `handleNavigate` com `navigatingRef`; `handleBack` explícito; 6 testes de domínio.

---

## 4. Regressões e Comportamentos de Borda (A08)

| Cenário | Comportamento Esperado |
|---------|------------------------|
| Sair da área interna (voltar à pública) | `logout()` limpa sessão e redireciona para `/member/enter` |
| Trocar perfil (sair/entrar) | Dados locais preservados; autoria demonstrativa reflete nova conta |
| Projetos públicos (`/projects/[id]`) | Acessíveis sem login; sem botões de edição/transição |
| Rota inexistente (`/invalido`) | Tela `+not-found` amigável |
| Cancelar formulário (Playbook/Transição) | Confirmação de descarte de rascunho alterado (`useDiscardDraft`) |
| Estados vazios (busca, playbook, transições) | `EmptyState` / `Notice` orientativos com ações |
| Carregamento / falha / retry | Spinner → erro → botão "Tentar novamente" refaz leitura real |
| Acesso direto a `/member/playbook/999` | `MissingRecord` |
| Detalhe de transição sem `ScreenContainer` aninhado | Seção integrada no detalhe do projeto, sem rolagem dupla |

---

## 5. Falhas, Recuperação e Limitações (A09)

| Item | Status | Evidência |
|------|--------|-----------|
| Falha leitura JSON inválido | ✅ Erro propagado, armazenamento intacto | Teste "falha de leitura (JSON inválido)" |
| Schema version incompatível | ✅ Erro, não sobrescreve | Teste "schema version incompatível" |
| Estrutura inválida (entries não array) | ✅ Erro, não sobrescreve | Teste "entradas com array inválido" |
| Conteúdo inválido (campos ausentes) | ✅ Erro, validação completa | Testes "entrada/registro com campos inválidos" |
| Falha gravação (setItem falha) | ✅ Dados anteriores preservados | Testes "falha de gravação preserva dados" |
| Criação/edição após falha leitura | ✅ Bloqueada antes de gravar | Testes "createEntry/updateEntry falha se load... falhar" |
| Botão "Tentar novamente" | ✅ Chama `load()` real | `useCallback` + `retry` em 4 telas |
| Envelopes `null`/array/primitivo | ✅ Rejeitados com erro controlado | Validação `validateStored` + `validateEntry`/`validateRecord` |
| Datas/versões inválidas | ✅ Rejeitadas sem alterar bruto | `validateVersion` + `validateRecord` |
| Simulação manual não testada | ⏳ Pendente | Requer Expo Go/simulador |

**Limitações conhecidas:**
- Persistência apenas local (AsyncStorage) — não sincroniza entre dispositivos
- Login demonstrativo — não autenticação/autorização real
- Contribuição simulada — sem cobrança, provedor, backend, recibo
- Backend/login real não implementados — fora do MVP
- Testes manuais em dispositivo pendentes
- Rubrica detalhada e plataforma de demonstração a confirmar pelo responsável

---

## 6. Ambiente e Comandos (A10)

| Verificação | Comando | Resultado |
|-------------|---------|-----------|
| TypeScript | `npm run type-check` | ✅ Aprovado |
| Lint | `npm run lint` | ✅ Aprovado (0 erros/avisos) |
| Testes automatizados | `npm test` | ✅ 44/44 passando (16 playbook + 19 transições + 3 integridade + 6 doações) |
| Expo Doctor | `npx expo-doctor` | ✅ 20/20 checks |
| Dependências | `npx expo install --check` | ✅ Up to date |
| Export Android | `npx expo export --platform android` | ✅ Bundle 2.7MB (Hermes) |
| Export iOS | `npx expo export --platform ios` | ✅ Bundle 2.7MB (Hermes) |
| Git diff check | `git diff --check` | ✅ Sem problemas |

**Nota:** Exportação ≠ teste em dispositivo. Build não gera APK/IPA instalável sem EAS.

---

## 7. Roteiro Repetível (A11)

Este roteiro permite repetir a demonstração com dados fictícios. Não exige apagar dados locais.

**Persistência:** Somente local (AsyncStorage), chaves `abrigoacao.playbook.v1` e `abrigoacao.transitions.v1`. Migração idempotente na inicialização.  
**Login:** 16 credenciais demonstrativas (senha `0000`); normalização de caixa/acentos/espaços.  
**Autoria:** Nominal (`Nome (Perfil)`); versões antigas preservam autores originais.  
**Contribuição:** Simulada — estado efêmero em React Context, resetado ao iniciar nova simulação.  
**Equipe:** 7 integrantes + Professora Betania na tela Sobre; avatares com iniciais.

---

## 8. Defeitos Registrados (A12)

| ID | Descrição | Reprodução | Impacto | Prioridade | Status |
|----|-----------|------------|---------|------------|--------|
| D01 | Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` | `npm test` | Cosmético, não afeta resultado | Baixa | Documentado |
| D02 | Testes manuais não executados | — | Aceite A08/A09/A11 pendente | Alta | Pendente (requer device) |

---

## 9. Checklist de Aceite (A01–A25)

| Critério | Status | Evidência |
|----------|--------|-----------|
| A01 — 16 logins aceitam `0000`, pessoa/perfil corretos | ✅ Automatizado | `findCredential` + normalização testada |
| A02 — Normalização caixa/acentos/espaços; `v-` respeitado | ✅ Automatizado | `normalizeLogin` |
| A03 — Formulário com labels, senha mascarada/alternável, orientação | ✅ Inspeção | `LoginScreen` |
| A04 — Nome/perfil no painel; sair/troca limpa sessão; rotas internas protegidas | ✅ Inspeção | `OverviewScreen`, `AuthProvider` |
| A05 — Rascunho exige descarte; autoria estável durante gravação | ✅ Inspeção | `useDiscardDraft`, `session` capturado no save |
| A06 — Novos docs/versões/transições registram pessoa, perfil, data | ✅ Automatizado | `createEntry`/`updateEntry`/`createTransition` com `personName` |
| A07 — Conteúdos, responsáveis livres, autores históricos intactos | ✅ Automatizado | Migração preserva; testes de persistência |
| A08 — Fonte única de pessoas alimenta login/equipe/autoria; Sobre lista 7 + Betania | ✅ Inspeção | `people.ts`, `AboutScreen` |
| A09 — 5 projetos + 6 procedimentos mantêm IDs; exemplos enriquecidos, datados, fictícios | ✅ Inspeção | `projects.ts`, `getInitialEntries` |
| A10 — Instalação sem chave recebe novos; base antiga válida migra controlada | ✅ Automatizado | `loadPlaybook`/`loadTransitions` com `migrateDataIfNeeded` |
| A11 — Migração idempotente, preserva versões, falha leitura não grava | ✅ Automatizado | Testes F01–F06 + migração |
| A12 — Painel saúda, mostra projetos da pessoa, recentes, transições, atalhos | ✅ Inspeção | `OverviewScreen` |
| A13 — Busca/filtro combinam em pública/interna; zero resultados tratado; links internos corretos | ✅ Inspeção | `ProjectsScreen` (público/interno) |
| A14 — Listas/detalhe/painel atualizam ao voltar/salvar/trocar conta | ✅ Inspeção | `useEffect` + `load` callbacks; chaves de navegação |
| A15 — Histórico de transições no detalhe sem tela/rolagem aninhada | ✅ Inspeção | `TransitionHistorySection` componente |
| A16 — Guia só ações disponíveis; identidade branca/azul; avatares com iniciais | ✅ Inspeção | `GuideScreen`, `AboutScreen`, tema |
| A17 — Contribuição 3 entradas; resultado exige confirmação+valor válido | ✅ Automatizado | `DonationResultScreen` + testes |
| A18 — "Voltar ao resumo" abre valor certo; "Nova simulação" limpa; toques não duplicam | ✅ Automatizado | `handleNavigate` + `navigatingRef` |
| A19 — Reinício não restaura confirmação/sessão; avisos explícitos | ✅ Automatizado | `DonationFlowContext` + `AuthProvider` |
| A20 — Envelopes inválidos rejeitados; dados válidos legíveis | ✅ Automatizado | `validateStored`/`validateEntry`/`validateRecord` |
| A21 — Falha leitura ≠ painel vazio; falha escrita mantém formulário; retry real | ✅ Automatizado | `ErrorScreen` + `retry` + testes F01–F06 |
| A22 — Dispositivo: login, troca, teclado, voltar/descarte, rolagem, safe area, textos ampliados, vazios/erro | ⏳ Pendente | Requer Expo Go/simulador |
| A23 — Dois integrantes mesmo aparelho: cria/edita/transição → consulta versão/autoria/histórico → reabre → persiste | ⏳ Pendente | Requer execução manual |
| A24 — Tipos, lint, testes, Expo Doctor, deps, export com resultados reais | ✅ Registrado | Seção 6 |
| A25 — README, AGENTS, decisão, roteiro, revisões distinguem histórico/inspeção/teste/manual | ✅ Atualizado | Este arquivo, `docs/decisions/002`, `docs/reviews/003` |

---

## 10. Próximos Passos

1. **Validar manualmente** em dispositivo/simulador (Android prioritário) — critérios A22, A23
2. **Responsável registra aceite** da demonstração e confirma adequação aos requisitos acadêmicos
3. Caso disciplina exija backend/login real → registrar divergência e planejar tarefa delimitada
4. Corrigir D01 (adicionar `"type": "module"` no `package.json`) em tarefa futura

---

## 11. Reconciliação de Evidências Anteriores (Tarefas 004–006)

| Item | Tarefa Anterior | Correção nesta tarefa |
|------|-----------------|----------------------|
| "44 testes de persistência" | 006, README | Corrigido: **16 playbook + 19 transições + 3 integridade + 6 doações** = 44 totais |
| "Jornadas integralmente automatizadas" | 005, 006 | Esclarecido: testes cobrem domínio/serviços; jornadas manuais (teclado, navegação, reabertura) não comprovadas pela suíte |
| "Exportação histórica = execução nova" | 006 | Removido: resultados de comandos não executados ficam pendentes |
| Classificação de testes de doações | 005 | Esclarecido: 6 testes cobrem valores/formatação, não navegação/provider/confirmação |
| Marcações excessivas em documentos | 004–006 | Reconciliadas: resultados históricos identificados como tais; pendências técnicas separadas |
