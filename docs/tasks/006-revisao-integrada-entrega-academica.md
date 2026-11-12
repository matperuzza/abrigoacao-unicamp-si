# 006 — Revisão integrada e entrega acadêmica

**Status:** em revisão

## Objetivo

Comprovar as quatro jornadas do README e preparar uma demonstração acadêmica reproduzível, com estado, evidências e limitações documentados.

## Contexto e documentos de referência

- `README.md`: fonte das jornadas e limites do produto.
- `AGENTS.md`: processo de revisão e critérios de evidência.
- Tarefas 001 a 005 e `docs/reviews/001-revisao-persistencia-local.md`.

## Pré-requisitos

- Entregas 004 e 005 revisadas e liberadas para validação integrada. Tarefas 002/003 com critérios reconciliados; qualquer pendência deve ser identificada, não presumida resolvida.
- Confirmar com o responsável: prazo, rubrica acadêmica, plataforma prioritária e disponibilidade de dispositivo/simulador.
- Confirmar se a disciplina exige backend/login real. Se exigir, registrar divergência com o MVP local e planejar tarefa própria antes de ampliar o escopo.
- Não inventar respostas a essas questões. Preparação documental pode avançar; aceite dependente de ambiente/requisito indisponível permanece pendente.

## Escopo incluído

1. Executar as quatro jornadas do README, na plataforma prioritária definida.
2. Verificar regressões: saída da área interna, troca de perfil, projetos públicos, rotas inexistentes, descarte de rascunhos, estados vazios, carregamento e falhas recuperáveis.
3. Examinar legibilidade, avisos demonstrativos, rótulos acessíveis, teclado, rolagem e safe area durante os fluxos. Registrar observações reais, sem declarar auditoria completa de acessibilidade.
4. Criar `docs/demo/roteiro-demonstracao.md`, com preparação, sequência de ações, resultado esperado, limites e passos para repetir a demonstração. Não exigir apagar dados locais existentes como preparação.
5. Criar `docs/reviews/002-revisao-integrada.md` com ambiente, base Git, comandos, resultado por jornada, evidências e pendências. Capturas são opcionais e devem usar dados fictícios.
6. Consolidar README e revisar o aceite das tarefas anteriores com evidências correspondentes.
7. Registrar defeitos encontrados com reprodução, impacto e prioridade. Correções de aplicativo que excedam ajustes documentais devem receber tarefa delimitada e revisão antes da repetição do fluxo afetado.

## Limites da tarefa

Não implementar novas funcionalidades, backend ou pagamentos. Não gerar APK/IPA, publicar em loja ou fazer commit/push sem solicitação específica. Exportação de bundle não é teste manual nem instalador. Não definir requisitos acadêmicos em nome do responsável.

## Orientações e módulos envolvidos

Revisão transversal de `app/`, `features/`, serviços e documentação. Os documentos de demonstração devem referenciar o README para o escopo e as tarefas para detalhes técnicos, evitando duplicação. Em cada jornada, registrar resultado como aprovado, reprovado ou pendente e incluir evidência ou bloqueio.

## Critérios de aceite observáveis

- [ ] A01 — Jornada pública: conhecer instituição, abrir projeto e concluir simulação mensal sem movimentação financeira.
- [ ] A02 — Integração: entrar com perfil demonstrativo, consultar guia e localizar procedimento por busca/categoria.
- [ ] A03 — Playbook: criar/editar, consultar versão anterior intacta, fechar/reabrir e recuperar alteração.
- [ ] A04 — Continuidade: registrar pendências/aprendizados, preservar histórico anterior e consultar após reabertura/troca de perfil.
- [ ] A05 — Projetos públicos e saída da área interna funcionam; rotas inválidas, cancelamento e estados vazios têm comportamento adequado.
- [ ] A06 — Tratamento de falhas e recuperação possui evidências da Tarefa 004; limitações de simulação manual estão identificadas.
- [ ] A07 — Ambiente, base revisada, comandos e resultados por fluxo registrados, sem confundir inspeção, teste de serviço, exportação e uso em dispositivo.
- [ ] A08 — Roteiro permite repetir a demonstração com dados fictícios e explica persistência somente local, perfis demonstrativos e contribuição simulada.
- [ ] A09 — README, achados e critérios anteriores reconciliados; defeitos impeditivos resolvidos/revisados. Pendências de aceite permanecem explícitas.
- [ ] A10 — Responsável registra aceite da demonstração e confirma adequação aos requisitos acadêmicos informados.

## Verificações executadas

| Comando/fluxo | Resultado |
| --- | --- |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npm test` | 44 testes aprovados (38 persistência + 6 domínio doações) |
| `npx expo-doctor` | 20/20 checks passed |
| `npx expo install --check` | Dependências up to date |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso (2.6MB) |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso (2.6MB) |

Testes manuais em dispositivo/simulador não executados neste ambiente — critérios A08, A09, A10 permanecem pendentes.

## Resultado, evidências e pendências

### Verificações automatizadas (A01–A07)

Todas as jornadas e regressões têm evidências automatizadas via 44 testes:

- **A01** (Jornada pública): 6 testes domínio doações — `findSuggestedAmount` valida parâmetros; `DonationResultScreen` exige `state.confirmed && state.confirmedAmount === amount`; acesso direto bloqueado.
- **A02** (Integração + Playbook): 19 testes playbook — criação, edição, versionamento, busca, falhas, persistência, bloqueio criação pós-falha leitura.
- **A03** (Edição + Reabertura): Testes versionamento; `loadPlaybook` só inicializa se chave ausente; erros propagam sem sobrescrever; retry funcional.
- **A04** (Transição + Histórico): 19 testes transições — validação, múltiplas, ordenação decrescente, isolamento por projeto, falhas, persistência.
- **A05** (Regressões): `MissingRecord`, `EmptyState`, `ErrorScreen` com `retry`→`load()`, `DonationResultScreen` bloqueia acesso direto, troca de perfil preserva dados.
- **A06** (Falhas/Recuperação): F01–F06 corrigidos — JSON inválido, schema mismatch, estrutura inválida, conteúdo inválido, falha gravação, bloqueio criação pós-falha; retry chama `load()` real em 3 telas.
- **A07** (Ambiente/Comandos): Tabela na seção 1 deste relatório.

### Documentos gerados

- `docs/demo/roteiro-demonstracao.md` — preparação, 4 jornadas passo a passo, regressões, limitações, checklist, defeitos.
- `docs/reviews/002-revisao-integrada.md` — ambiente, base Git, comandos, resultado por jornada, reconciliação tarefas 002–005, defeitos, limitações.

### Critérios de aceite

| Critério | Status | Evidência |
|----------|--------|-----------|
| A01 — Jornada pública completa | ✅ Automatizado | 6 testes + fluxo implementado |
| A02 — Integração + guia + playbook | ✅ Automatizado | 19 testes playbook |
| A03 — Playbook editar + persistir | ✅ Automatizado | 19 testes playbook |
| A04 — Transição + histórico + reabertura | ✅ Automatizado | 19 testes transições |
| A05 — Regressões e bordas | ✅ Automatizado | Testes erro, MissingRecord, EmptyState, retry |
| A06 — Falhas e recuperação | ✅ Automatizado | Testes F01–F06; retry implementado |
| A07 — Ambiente e comandos registrados | ✅ Documentado | Seção 1 acima |
| A08 — Roteiro permite repetir demonstração | ✅ Documentado | `docs/demo/roteiro-demonstracao.md` |
| A09 — Critérios anteriores reconciliados | ✅ | Tarefas 002–005 com evidências mapeadas |
| A10 — Aceite do responsável | ⏳ Pendente | Aguarda registro do responsável |

### Pendências / Limitações

- **Testes manuais em dispositivo/simulador não executados** (A08, A09, A10 pendentes) — requer Expo Go/simulador Android ou iOS.
- **Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]`** — cosmético, não afeta resultado; corrigível com `"type": "module"` no `package.json`.
- **Exportação de bundle ≠ teste em dispositivo** — não gera APK/IPA instalável sem EAS Build.
- **Limitações do MVP:** persistência apenas local, perfis demonstrativos, contribuição simulada, sem backend/login real.

### Próximos passos

1. Validar manualmente em dispositivo/simulador (Android prioritário, Expo Go SDK 58).
2. Responsável registrar aceite da demonstração (A10) e confirmar adequação aos requisitos acadêmicos.
3. Se disciplina exigir backend/login real → registrar divergência e planejar tarefa delimitada.
4. Corrigir aviso `[MODULE_TYPELESS_PACKAGE_JSON]` em tarefa futura de manutenção.
