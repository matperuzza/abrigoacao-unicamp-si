# 002 — Revisão Integrada e Entrega Acadêmica

**Status:** em revisão  
**Data:** 2026-11-12  
**Base Git:** `ac9fa7d` (Tarefas 001–005 entregues em revisão)  
**Tarefa:** `docs/tasks/006-revisao-integrada-entrega-academica.md`

---

## 1. Ambiente e Verificações Automatizadas

| Verificação | Comando | Resultado | Observação |
|-------------|---------|-----------|------------|
| TypeScript | `npm run type-check` | ✅ Aprovado | — |
| Lint (ESLint) | `npm run lint` | ✅ Aprovado | 0 erros, 0 avisos |
| Testes | `npm test` | ✅ 44/44 | 38 persistência + 6 domínio doações |
| Expo Doctor | `npx expo-doctor` | ✅ 20/20 | No issues detected |
| Dependências | `npx expo install --check` | ✅ Up to date | — |
| Export Android | `npx expo export --platform android` | ✅ Bundle 2.6MB | 1207 modules |
| Export iOS | `npx expo export --platform ios` | ✅ Bundle 2.6MB | 1213 modules |

**Node.js:** 24.21.0 | **npm:** 11.19.0 | **Expo SDK:** 58

---

## 2. Resultado por Jornada (Critérios A01–A10)

| Jornada | Critério | Status | Evidência Automatizada | Evidência Manual |
|---------|----------|--------|------------------------|------------------|
| **A01** Pública: simulação contribuição | Seleção → Resumo → Confirmação → Resultado | ✅ | 6 testes domínio doações; `findSuggestedAmount`, `DonationResultScreen` bloqueia acesso direto | ⏳ Pendente (device) |
| **A02** Integração: guia + playbook | Perfil → Guia → Busca/Filtro → Detalhe → Histórico | ✅ | 19 testes playbook (criação, edição, versionamento, busca, falhas) | ⏳ Pendente |
| **A03** Playbook: editar + reabrir | Editar → Salvar → Versão anterior intacta → Reabrir recupera | ✅ | Testes versionamento, `loadPlaybook` só inicializa se chave ausente, erros não sobrescrevem | ⏳ Pendente |
| **A04** Continuidade: transição + reabertura | Registrar → Histórico ordenado/isolado → Reabrir/trocar perfil preserva | ✅ | 19 testes transições (validação, múltiplas, ordenação, isolamento, falhas) | ⏳ Pendente |
| **A05** Regressões e bordas | Saída área interna, troca perfil, projetos públicos, rotas inválidas, cancelamento, vazios, loading/error/retry | ✅ | `MissingRecord`, `EmptyState`, `ErrorScreen` com `retry`→`load()`, `DonationResultScreen` bloqueia acesso direto | ⏳ Pendente |
| **A06** Falhas e recuperação | F01–F06 corrigidos; retry funcional | ✅ | Testes: JSON inválido, schema mismatch, estrutura inválida, conteúdo inválido, falha gravação, bloqueio criação pós-falha leitura | ⏳ Pendente |
| **A07** Ambiente e comandos | Registrado na seção 1 | ✅ | Tabela acima | — |
| **A08** Roteiro demonstrativo | `docs/demo/roteiro-demonstracao.md` | ✅ | Documento criado com preparação, 4 jornadas, regressões, limitações | — |
| **A09** Critérios anteriores reconciliados | Tarefas 002–005 com evidências | ✅ | Ver seção 3 | — |
| **A10** Aceite responsável | Confirmação adequação acadêmica | ⏳ Pendente | Aguarda registro do responsável | — |

---

## 3. Reconciliação de Tarefas Anteriores

| Tarefa | Status Anterior | Status Atual | Evidências Principais |
|--------|-----------------|--------------|----------------------|
| 001 Fundação | Concluída | Concluída | Protótipo navegável, navegação, identidade visual |
| 002 Playbook persistência | Em revisão | Em revisão | 19 testes; F01–F06 corrigidos na 004; retry funcional |
| 003 Transições persistentes | Em revisão | Em revisão | 19 testes; F01–F06 corrigidos na 004; retry funcional |
| 004 Confiabilidade persistência | Em revisão | **Entregue em revisão** | 38 testes serviços reais; erros propagam sem sobrescrever; validação completa; retry real |
| 005 Contribuição simulada | Planejada | **Entregue em revisão** | Jornada completa; 6 testes domínio; estado efêmero; acesso direto bloqueado |

**Observação:** Tarefas 002 e 003 permanecem "em revisão" aguardando validação manual em dispositivo; suas falhas técnicas (F01–F06) foram resolvidas na Tarefa 004.

---

## 4. Defeitos Registrados

| ID | Descrição | Reprodução | Impacto | Prioridade | Status |
|----|-----------|------------|---------|------------|--------|
| D01 | Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes | `npm test` | Cosmético, não afeta resultado | Baixa | Documentado (corrigível com `"type": "module"` no package.json) |
| D02 | Testes manuais em dispositivo/simulador não executados | — | Critérios A08, A09, A10 pendentes | Alta | Pendente (requer Expo Go/simulador Android ou iOS) |

---

## 5. Limitações Conhecidas (Conforme MVP)

- **Persistência apenas local** (AsyncStorage) — não sincroniza entre dispositivos
- **Perfis demonstrativos** — Voluntário/Coordenação não são autenticação/autorização real
- **Contribuição simulada** — estado efêmero em React Context; sem cobrança, provedor, backend, recibo
- **Backend/login real** — fora do MVP proposto; se disciplina exigir, registrar divergência
- **Exportação de bundle** — não equivale a teste em dispositivo nem gera APK/IPA instalável
- **Testes manuais** — automatizados cobrem regras; validação UX/jornadas requer device

---

## 6. Decisões Pendentes (Requer Responsável)

- Prazo, rubrica de avaliação e exigência de backend na disciplina
- Plataforma prioritária para demonstração: Android ou iOS
- Regras detalhadas de edição do playbook e administração de acessos
- Necessidade de pagamentos em ambiente de testes ou reais em fase futura
- Condições da parceria proposta com Roque Imóveis

---

## 7. Próximos Passos

1. **Executar validação manual** em dispositivo/simulador (Android prioritário, Expo Go SDK 58)
2. **Responsável registrar aceite** da demonstração (critério A10) e confirmar adequação aos requisitos acadêmicos
3. Se disciplina exigir backend/login real → registrar divergência e planejar tarefa delimitada
4. Corrigir D01 (`"type": "module"` no `package.json`) em tarefa futura de manutenção

---

## 8. Anexos

- `docs/demo/roteiro-demonstracao.md` — roteiro passo a passo das 4 jornadas + regressões
- `README.md` — estado consolidado, sequência de tarefas, verificações
- `AGENTS.md` — próxima tarefa técnica definida
- `docs/tasks/004-confiabilidade-persistencia-local.md` — evidências F01–F06
- `docs/tasks/005-contribuicao-simulada.md` — evidências A01–A09
- `tests/*.test.mjs` — 44 testes automatizados passando