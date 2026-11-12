# 005 — Contribuição simulada completa

**Status:** em revisão

## Objetivo

Completar a jornada pública de apoio mensal: seleção → resumo → confirmação explícita da simulação → resultado, sem movimentação financeira.

## Contexto e documentos de referência

- `README.md`: pilar financeiro, área pública e primeira jornada da demonstração.
- `AGENTS.md`: regras financeiras, arquitetura e entrega.
- `004-confiabilidade-persistencia-local.md`: pré-requisito.
- `features/donations/Screens.tsx` e `data.ts`: seleção e resumo existentes.

## Pré-requisitos

- Revisão da Tarefa 004 registrada; pendências que afetem esta etapa resolvidas ou explicitamente alinhadas com o responsável.
- Liberação para iniciar esta tarefa; examinar Git e documentação atualizada.
- Executar tipos, lint e testes como linha de base; manter stack e tokens atuais.

## Escopo incluído

1. Manter sugestões existentes de R$ 20, R$ 50 e R$ 100, armazenadas/calculadas em centavos inteiros e exibidas em BRL.
2. Manter o valor selecionado no resumo e permitir voltar para alterá-lo.
3. Incluir ação explícita “Confirmar simulação” após aviso claro de ausência de cobrança, assinatura ativa e pagamento recebido. A confirmação pode ocorrer no próprio resumo; não exige tela extra.
4. Exibir resultado identificado como simulação, com valor mensal ilustrativo e aviso de que não é recibo nem contribuição recebida.
5. Validar parâmetros e estado de navegação. Acesso direto a resultado, sem confirmação na sessão, deve orientar a iniciar/retomar o fluxo, sem apresentar sucesso fictício.
6. Permitir nova simulação e retorno à área pública, sem duplicação de confirmações por toques repetidos ou reutilização indevida de resultado anterior.
7. Usar estado efêmero local à jornada; ao reiniciar o aplicativo, não apresentar simulação anterior como confirmação atual.
8. Atualizar textos que ainda descrevam o fluxo apenas como protótipo visual e documentar os limites.

## Limites da tarefa

Sem cobrança, provedor, backend, cadastro, coleta de dados pessoais/bancários, cartão, assinatura real, recibo, persistência de simulações, totais de arrecadação, painel financeiro ou novos valores personalizados. Não alterar os termos da parceria proposta nem calcular repasses. Sem integração externa ou nova dependência sem justificativa e alinhamento.

## Orientações e módulos envolvidos

- `features/donations/`: telas, tipos e regras específicas. Separar regras relevantes da apresentação.
- `app/(public)/donations/` e layout público: rotas enxutas e navegação de resumo/resultado.
- `components/` e `theme/`: reaproveitar componentes e tokens existentes.
- `tests/prototype-data.test.mjs` e testes específicos, se necessários: importar regras reais; verificar valores inválidos e transições de estado relevantes, sem duplicar implementação.
- Parâmetro de URL isolado como `confirmed=true` não comprova a ação de confirmação na sessão. Esta proteção é coerência da demonstração, não autorização segura.
- Repetir a jornada não deve gerar registros financeiros. Não mostrar “pagamento aprovado”, “doação recebida” ou “assinatura ativa”.

## Critérios de aceite observáveis

- [ ] A01 — Cada um dos três valores percorre seleção, resumo, confirmação e resultado sem alteração monetária.
- [ ] A02 — Avisos de simulação aparecem antes da confirmação e no resultado, que não é apresentado como recibo ou pagamento.
- [ ] A03 — Valores arbitrários, ausentes, malformados ou parâmetros múltiplos inesperados não geram confirmação.
- [ ] A04 — Abrir o resultado diretamente ou reiniciar a sessão sem confirmação não exibe sucesso anterior/inexistente.
- [ ] A05 — Voltar e alterar valor atualiza o resumo; confirmar e começar nova simulação não reutiliza confirmação antiga.
- [ ] A06 — Toques repetidos e navegação de retorno não produzem resultados duplicados ou confirmação de outro valor.
- [ ] A07 — Não há dados pessoais/bancários coletados, persistência de simulações, cobrança ou soma de intenções como receita.
- [ ] A08 — Jornada manual validada na plataforma escolhida, com botões, voltar, avisos e formatação em pt-BR legíveis.
- [ ] A09 — README e evidências atualizados, com pendências manuais explícitas quando houver.

## Verificações executadas

| Comando/fluxo | Resultado |
| --- | --- |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npm test` | 44 testes aprovados (38 persistência + 6 doações) |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

Testes manuais em dispositivo/simulador não executados neste ambiente — critérios A08 permanece pendente.

## Resultado, evidências e pendências

### Implementado

**Contexto de fluxo (`features/donations/FlowContext.tsx`)**
- Estado efêmero por sessão: `confirmed` (boolean) e `confirmedAmount` (number | null).
- `confirm(amount)` marca a simulação como confirmada para aquele valor.
- `reset()` limpa o estado ao iniciar nova simulação ou voltar ao início.
- Provider envolve rotas `/donations/*` via layout dedicado (`app/(public)/donations/_layout.tsx`).

**Regras de domínio (`features/donations/data.ts` inalterado)**
- `suggestedCents = [2000, 5000, 10000]` (R$ 20, R$ 50, R$ 100 em centavos).
- `findSuggestedAmount` valida parâmetro de rota contra lista permitida.
- `formatBRL` formata centavos em BRL via `Intl.NumberFormat('pt-BR')`.

**Telas (`features/donations/Screens.tsx`)**
- `DonationsScreen`: seleção mantida; botão "Visualizar resumo" reseta estado antes de navegar.
- `DonationSummaryScreen`: aviso de simulação **antes** da confirmação; botão "Confirmar simulação" navega para `/donations/result` com `cents` e seta estado confirmado.
- `DonationResultScreen`: só exibe resultado se `state.confirmed && state.confirmedAmount === amount`; acesso direto sem confirmação mostra orientação para reiniciar fluxo.
- Textos atualizados: "Simulação: nenhuma contribuição será registrada...", "Esta é uma simulação confirmada: ... não é um recibo".

**Rotas**
- `app/(public)/donations/summary.tsx` (existente).
- `app/(public)/donations/result.tsx` (novo).
- `app/(public)/donations/_layout.tsx` (novo) — Provider do contexto.

**Testes (`tests/donations.test.mjs` novo)**
- 6 testes: valores sugeridos, `findSuggestedAmount` (válido/inválido), `formatBRL`, integridade da lista.
- Total: 44 testes (38 persistência + 6 doações) passando.

### Critérios de aceite atendidos

| Critério | Status | Evidência |
| --- | --- | --- |
| A01 — 3 valores percorrem seleção→resumo→confirmação→resultado | ✅ | Fluxo implementado nas 3 telas; testes de `findSuggestedAmount` cobrem os 3 valores |
| A02 — Avisos antes da confirmação e no resultado | ✅ | `DonationSummaryScreen` e `DonationResultScreen` com `Notice` explícitos |
| A03 — Valores/parâmetros inválidos não geram confirmação | ✅ | `findSuggestedAmount` retorna `undefined` para inválidos; `MissingRecord` na summary; `DonationResultScreen` bloqueia acesso direto |
| A04 — Acesso direto ao resultado sem confirmação não mostra sucesso | ✅ | `DonationResultScreen` verifica `state.confirmed && state.confirmedAmount === amount` |
| A05 — Voltar/alterar valor atualiza resumo; nova simulação não reutiliza confirmação | ✅ | Botão "Voltar" usa `router.back()`; "Nova simulação" chama `reset()` antes de navegar |
| A06 — Toques repetidos/navegação não duplicam confirmação | ✅ | `confirming` state desabilita botão durante navegação; `reset()` limpa estado |
| A07 — Sem dados pessoais/bancários, persistência, cobrança ou soma | ✅ | Estado apenas em memória (React context); sem AsyncStorage; textos negam cobrança |
| A08 — Jornada manual validada | ⏳ Pendente | Requer Expo Go/simulador |
| A09 — README e evidências atualizados | ✅ | Este relatório; README atualizado |

### Pendências / Limitações conhecidas

- Testes manuais em dispositivo/simulador não executados (A08) — requer Expo Go ou emulador Android/iOS.
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado.
- `npx expo-doctor` e `npx expo install --check` não executados nesta entrega; base compatível segundo execução histórica.

### Próximos passos

Validar jornada manual (A08) quando ambiente estiver disponível; então a tarefa pode ser marcada como concluída. Não iniciar automaticamente a Tarefa 006.
