# 001 — Revisão da persistência local

**Status:** corrigida — aguardando revisão; correções entregues na [Tarefa 004](../tasks/004-confiabilidade-persistencia-local.md).

## Contexto e alcance

Revisão do código após a entrega da Tarefa 003, na base `ac9fa7d`. Foram examinados README, tarefas 002 e 003, serviços, formulários, histórico de transições e testes. O repositório estava sem alterações locais no início da preparação deste repasse.

Os achados abaixo são de inspeção estática. Os cenários de falha não foram reproduzidos no aplicativo; os passos indicados devem orientar testes dos serviços reais e validação manual. Nenhuma correção de código foi realizada neste registro.

## Verificações executadas na revisão

| Comando | Resultado observado |
| --- | --- |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, sem erros ou avisos |
| `npm test` | 31 aprovados; aviso `[MODULE_TYPELESS_PACKAGE_JSON]` |

Os testes de persistência duplicam implementações e não comprovam o comportamento dos serviços reais. Não houve execução em celular/simulador, nova exportação, Expo Doctor ou checagem de dependências nesta revisão. Resultados anteriores desses comandos são históricos.

## Falhas abertas

### F01 — Reinicialização destrutiva do playbook

- **Prioridade:** alta. **Status:** aberta.
- **Evidência:** `services/playbook.ts`, função `loadPlaybook`: `schemaVersion` incompatível ou `entries` que não seja array provoca `savePlaybook(initial)`.
- **Impacto:** substitui o conteúdo existente pelos exemplos, contrariando a preservação de dados exigida pelo projeto.
- **Cenário de verificação:** fornecer payload com versão incompatível e depois payload com `entries` inválido; chamar o serviço real e comparar o valor bruto antes/depois.
- **Encerramento:** leitura rejeitada com erro identificável, sem qualquer gravação ou alteração do conteúdo original. Inicialização automática somente para chave ausente.

### F02 — Falhas de leitura ocultadas e gravação posterior sobre base incompleta

- **Prioridade:** alta. **Status:** aberta.
- **Evidência:** `loadPlaybook` captura falhas retornando exemplos; `loadTransitions` retorna `[]` para erros e estruturas inválidas. Criação/edição usa esses resultados como base para gravar.
- **Impacto:** a interface pode mostrar exemplos ou histórico vazio como leitura bem-sucedida. Uma criação após falha de leitura pode substituir dados anteriores. A falha da gravação inicial dos exemplos também é ocultada pelo playbook.
- **Cenário de verificação:** simular `getItem` rejeitado com dados anteriores preservados; permitir `setItem`; tentar leitura e criação/edição. Repetir com JSON inválido e estrutura incompatível.
- **Encerramento:** erro chega ao consumidor; nenhuma gravação é tentada após leitura malsucedida; formulário permanece preenchido e histórico anterior permanece intacto.

### F03 — Testes executam cópias da implementação

- **Prioridade:** alta. **Status:** aberta.
- **Evidência:** `tests/playbook-persistence.test.mjs` e `tests/transitions.test.mjs` declaram funções locais de leitura, gravação e criação, em vez de importar os serviços. Os testes do playbook esperam reinicialização em alguns erros de estrutura.
- **Impacto:** alterações ou defeitos no código de produção podem não afetar o resultado dos testes; o comportamento destrutivo recebe aprovação na suíte atual.
- **Encerramento:** testes importam o código de produção, simulam somente armazenamento/condições externas e verificam preservação e recuperação. Remover expectativas de reinicialização destrutiva.

### F04 — Nova tentativa não refaz a leitura

- **Prioridade:** média. **Status:** aberta.
- **Evidência:** `features/playbook/PlaybookFormScreen.tsx` e `features/projects/TransitionHistoryScreen.tsx`: `retry` altera `loading` e `error`, mas não chama a leitura nem modifica uma dependência do efeito que carrega dados.
- **Impacto:** se o estado de erro for alcançado, o botão pode deixar a tela em carregamento sem nova consulta. Hoje F02 também impede a exposição de várias dessas falhas.
- **Encerramento:** após falha temporária, clicar em “Tentar novamente” produz nova chamada ao serviço e recupera os dados; falha persistente volta a exibir erro. Examinar as demais telas do playbook para o mesmo padrão.

### F05 — Validação insuficiente do conteúdo armazenado

- **Prioridade:** média. **Status:** aberta.
- **Evidência:** playbook aceita qualquer array em `entries`; transições verificam o envelope e se `records` é array, sem validar cada registro.
- **Impacto:** objetos incompletos ou tipos incorretos podem chegar à apresentação, provocar falhas e ser propagados em novas gravações.
- **Cenário de verificação:** arrays contendo `null`, objetos sem campos obrigatórios, versões vazias e datas inválidas, além de estruturas válidas existentes.
- **Encerramento:** validação do domínio rejeita payload inválido integralmente, sem filtrar e descartar registros silenciosamente; todos os exemplos e dados válidos anteriores permanecem compatíveis.

### F06 — Documentação e aceite sem evidências suficientes

- **Prioridade:** média. **Status:** aberta; sinalização documental inicial feita neste repasse.
- **Evidência:** README afirmava preservação em erros incompatível com F01/F02. Tarefas 002 e 003 registram critérios atendidos por inspeção ou funções duplicadas; a 003 cita exportações como evidência de ausência de crash em navegação. Ambas informam ausência de teste manual.
- **Impacto:** entrega pode ser considerada aprovada sem comprovação dos fluxos e da recuperação em dispositivo.
- **Encerramento:** reconciliar afirmações com os resultados reais da Tarefa 004 e registrar validação manual por critério; pendências continuam abertas até obtenção de evidências. Exportação não comprova navegação em execução.

## Atualização e encerramento

O implementador deve registrar por ID: arquivos corrigidos, testes/comandos, resultado, evidência manual quando aplicável e pendências. Pode indicar "corrigida, aguardando revisão"; o encerramento depende da revisão dos critérios. As tarefas 002 e 003 permanecem em revisão.

| Achado | Entrega do implementador | Evidência | Resultado da revisão |
| --- | --- | --- | --- |
| F01 | Corrigida | `services/playbook.ts`: erro em schema mismatch/estrutura inválida; testes "schema version incompatível", "estrutura inválida" | Corrigida, aguardando revisão |
| F02 | Corrigida | Erros propagam; criação/edição bloqueada após falha de leitura; testes "createEntry falha se loadPlaybook falhar", etc. | Corrigida, aguardando revisão |
| F03 | Corrigida | Testes reescritos importando serviços reais; 38 testes passando | Corrigida, aguardando revisão |
| F04 | Corrigida | `retry` chama `load()` extraído com `useCallback` em `PlaybookScreens`, `PlaybookFormScreen`, `TransitionHistoryScreen` | Corrigida, aguardando revisão |
| F05 | Corrigida | Validação completa de envelope + cada registro/versão; testes "entrada com versão inválida", "registro com campos inválidos" | Corrigida, aguardando revisão |
| F06 | Atualizada | Critérios mapeados a testes automatizados; documentação reconciliada | Corrigida, aguardando revisão |
