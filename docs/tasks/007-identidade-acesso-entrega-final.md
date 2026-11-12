# 007 — Identidade, acesso e consolidação da entrega final

**Status:** planejada — escopo autorizado pelo responsável; implementação ainda não iniciada.

## Objetivo

Consolidar a entrega acadêmica do AbrigoAção em uma única tarefa: login demonstrativo nominal, autoria individual, dados demonstrativos enriquecidos, visão geral útil, navegação integrada, acabamento visual e correção das lacunas remanescentes, preservando o conteúdo existente.

## Contexto e documentos de referência

- `README.md`: produto, pilares, limites e comandos.
- `AGENTS.md`: arquitetura, preservação, processo e entrega.
- Tarefas 002 a 006 e `docs/reviews/001-revisao-persistencia-local.md`.
- `docs/reviews/002-revisao-integrada.md` e `docs/demo/roteiro-demonstracao.md`: atualizar evidências, sem presumir validação das jornadas.
- Código atual de acesso, projetos, playbook, transições e contribuições.
- Direcionamento explícito do responsável: prazo **hoje, na data da solicitação**; disciplina não exige backend; login demonstrativo com senha `0000`, integrantes do grupo e professora Betania; dois acessos por pessoa, com prefixo `v-` para voluntário.

O responsável aprovou/liberou a 004 e autorizou avançar após a correção de contexto da 005. Esses relatos não comprovam execução individual de todos os critérios manuais. Registrar aceite informado e pendências técnicas separadamente. A 006 produziu documentos e verificações técnicas; suas afirmações de jornadas integralmente automatizadas precisam ser reconciliadas nesta tarefa.

## Pré-requisitos e linha de base

1. Ler as referências e examinar `git status --short` e o diff. Há trabalho local de entregas anteriores, incluindo arquivos ainda não rastreados: preservar tudo; não fazer checkout, reset, limpeza, commit ou push sem pedido.
2. Usar npm/lockfile e a stack compatível atual. Não acrescentar dependência para recursos disponíveis na base.
3. Executar `npm run type-check`, `npm run lint` e `npm test` antes das alterações; registrar resultados reais e quantidade/composição dos testes. A referência histórica é 44 testes: **16 playbook + 19 transições + 3 integridade de projetos/doações + 6 doações**. Não chamar os 44 de testes de persistência ou de jornadas completas.
4. Identificar disponibilidade de Expo Go/dispositivo/simulador e perguntar a plataforma prioritária, se ainda indefinida. Não presumir Android nem bloquear trabalho independente por falta dessa resposta.
5. Inspecionar chaves e formatos de persistência existentes antes de definir atualização dos exemplos. Criar fixtures de armazenamento legado nos testes, sem extrair ou modificar dados de um dispositivo real.

## Escopo incluído

### Bloco 1 — Cadastro central, login e sessão demonstrativos

Criar uma fonte única de pessoas com ID estável, nome de exibição e identificação acadêmica (integrante ou professora). Identidade da pessoa é independente do perfil de acesso: dois logins da mesma pessoa devem compartilhar o ID da pessoa e diferenciar Voluntário/Coordenação.

**Credenciais definidas — senha literal `0000` para os 16 acessos:**

| Pessoa | Login Coordenação | Login Voluntário |
| --- | --- | --- |
| Filipe Angi | `Filipe Angi` | `v-Filipe Angi` |
| João Tamosaitis | `João Tamosaitis` | `v-João Tamosaitis` |
| André Luis | `André Luis` | `v-André Luis` |
| Giovana Carvalho | `Giovana Carvalho` | `v-Giovana Carvalho` |
| Isabela Patino | `Isabela Patino` | `v-Isabela Patino` |
| Lucas Blanes | `Lucas Blanes` | `v-Lucas Blanes` |
| Matheus Peruzza | `Matheus Peruzza` | `v-Matheus Peruzza` |
| Betania | `Betania` | `v-Betania` |

- Login sem prefixo entra como **Coordenação**; `v-` entra como **Voluntário**. Não interpretar ausência de prefixo como outro perfil.
- Normalizar login: aparar espaços externos, ignorar caixa e acentos; aceitar sequências repetidas de espaços entre nomes. Não fazer correspondência parcial/por primeiro nome nem transformar pessoa desconhecida em conta válida. Senha deve coincidir exatamente com `0000`.
- Preservar grafia dos nomes acima na exibição, independentemente da entrada normalizada. Não inventar sobrenome, e-mail, foto, cargo profissional ou titulação da professora.
- Substituir os botões de exploração anônima por formulário Login/Senha, botão Entrar, alternância mostrar/ocultar senha, campos rotulados e erros claros para campos vazios e credenciais inválidas.
- Exibir “Acesso demonstrativo acadêmico”; disponibilizar orientação acessível com padrão dos logins e senha para facilitar a avaliação. Essas credenciais são exemplos públicos da demonstração, não segredos de produção.
- Guardar somente pessoa/perfil da sessão em memória. Não persistir senha ou sessão. Reinício exige nova entrada; dados de domínio continuam salvos.
- Exibir nome e perfil na área interna. Sair e trocar conta limpam sessão e campos de senha; rota interna sem sessão orienta/redireciona para entrada, sem expor ações antes disso. Área pública continua livre.
- Os dois perfis continuam podendo consultar e colaborar em playbook/transições, conforme a base. Não criar painel de administração, edição de permissões ou privilégio de servidor.
- Respeitar confirmação de descarte ao sair/trocar conta com rascunho alterado. Não atribuir um rascunho da conta anterior à nova pessoa silenciosamente; durante gravação, não permitir troca que corrompa autoria.

### Bloco 2 — Autoria individual e preservação do histórico

- Novos documentos, novas versões e novas transições registram o nome da pessoa conectada, data e indicação demonstrativa; preservar o perfil utilizado quando necessário para identificar a ação.
- Resolver identidade/autoria em regra de domínio/serviço, não repetir strings de autores por tela. Capturar o autor da ação de modo estável durante a gravação.
- Diferenciar autor de transição de responsável pela continuidade. Não restringir o campo de responsável já existente somente aos integrantes nem descartar nomes livres salvos.
- Reutilizar IDs estáveis para relacionar integrante a projeto e painel. Se forem necessários novos campos persistidos, manter leitura compatível do formato anterior e documentar a decisão.
- Versões e transições já registradas mantêm autoria, datas e conteúdo originais; não renomear autores históricos para atribuir ações antigas ao grupo.
- Ao trocar de conta no mesmo aparelho, dados locais permanecem consultáveis. Documentar que essa colaboração demonstrativa é no mesmo armazenamento, não sincronização entre celulares nem autorização segura.

### Bloco 3 — Exemplos enriquecidos e atualização controlada

**Equipe e conteúdo:**
- Tela Sobre com “Equipe do trabalho”: os sete integrantes como autores do projeto acadêmico e Betania como professora. Não apresentar a professora como integrante do grupo ou os papéis demonstrativos como vínculos reais com uma ONG.
- Manter os cinco projetos e seus IDs; enriquecer todos com atualizações datadas, etapas coerentes (planejamento/preparação/execução/encerramento conforme situação), responsáveis do grupo, pendências e aprendizados contextualizados.
- Manter casos legitimamente vazios para demonstrar estados vazios; não inventar histórico em projeto ainda sem transição. Números, obras, datas de ações e resultados continuam fictícios e identificados como exemplos.
- Distribuir os sete integrantes entre responsáveis e autores dos exemplos, sem exigir que todos sejam responsáveis principais por um projeto. Betania precisa aparecer na equipe/acesso, não é obrigatório atribuir-lhe obra ou conteúdo operacional.
- Enriquecer os seis procedimentos iniciais mantendo IDs/categorias e preservando versões já existentes: objetivo, passos, cuidados e orientação de continuidade. Criar vínculos por ID entre projetos e procedimentos relacionados.
- Alinhar guia às ações existentes: entrada, consulta, edição/versionamento e transição. Remover instrução de registro semanal de atividades se não houver esse fluxo; não implementá-lo para justificar o texto.

**Atualização dos dados já instalados:**
- Apenas alterar seeds não atualiza AsyncStorage existente. Definir atualização idempotente e testada antes de integrar a interface; registrar a estratégia em `docs/decisions/002-identidade-dados-demonstrativos.md` (ou próximo número livre).
- Chave ausente recebe exemplos novos. Para base antiga válida, reconhecer exemplos por ID **e conteúdo/versão conhecidos**, não apenas por ID. Preservar integralmente conteúdo criado, exemplos editados e versões anteriores.
- Se atualizar um exemplo intacto já persistido, acrescentar uma versão identificável com autoria/resumo demonstrativos; não reescrever versões existentes. Enriquecimento de exemplos com edições do usuário pode ser pulado para preservar seu trabalho, com a limitação documentada.
- Reexecução não duplica exemplos, versões nem transições. Não gerar registros de transição como se pessoas tivessem interagido realmente.
- Falha de leitura/validação não autoriza gravação. Falha de atualização mantém dados anteriores e permite tentar novamente. Não usar `clear`, remoção de chave, reinstalação ou troca de namespace como solução.

### Bloco 4 — Visão geral interna útil

- Saudação nominal e indicação do perfil; corrigir aviso obsoleto “alterações sem gravação”.
- Seção de projetos da pessoa conectada, relacionada por ID; para quem não tiver projeto atribuído (incluindo professora), mostrar estado vazio orientativo e acesso à lista geral.
- Conteúdos recentemente atualizados e transições recentes, carregados da mesma fonte persistida usada pelas telas, ordenados por data com desempate estável quando necessário.
- Atalhos para novo conteúdo, registrar transição (selecionando/abrindo projeto), guia e listas gerais. Links levam ao registro correto, não a um exemplo fixo inadequado.
- Indicadores, se usados, são derivados dos dados; não criar receitas/impactos inventados como métricas reais.
- Estados de carregamento, erro, nova tentativa e vazio para cada leitura aplicável. Não apresentar falha como painel vazio bem-sucedido.

### Bloco 5 — Projetos, playbook e navegação integrada

- Busca por título/descrição e filtro por situação nos projetos públicos e internos, com combinação de busca/filtro e estado sem resultados.
- Procedimentos relacionados no detalhe **interno** do projeto, com vínculos válidos. Área pública não deve expor conteúdo interno por esse atalho; pode orientar a entrar na área de membros.
- Atualizar listas, detalhes e painel ao voltar de criação/edição/transição ou troca de conta, sem exigir reiniciar o aplicativo. Preservar busca/filtro quando aplicável.
- Extrair histórico de transições para seção/componente do detalhe do projeto, sem `ScreenContainer`, cabeçalho de tela e rolagem aninhados. Manter ordenação, autoria, responsável, contexto inicial, badge de mais recente e recuperação de erro.
- Evitar respostas assíncronas antigas sobrescrevendo dados de outra rota/projeto após navegação e atualização de estado depois de desmontagem. As verificações atuais de `mounted` após `load()` não protegem as atualizações feitas dentro dele; revisar o ciclo de carregamento afetado.
- Revisar saída da área interna, retorno à lista/detalhe, rotas inexistentes, páginas sem registro e descarte de rascunhos com teclado/botão voltar do sistema.

### Bloco 6 — Contribuição simulada e confiabilidade remanescente

**Contribuição:**
- Preservar valores R$ 20/50/100 em centavos inteiros, avisos antes/depois, ausência de cobrança e estado efêmero.
- Corrigir “Voltar ao resumo”: navegar explicitamente para o resumo do valor confirmado, sem depender de `back()` após `replace()`.
- “Nova simulação” sempre limpa a confirmação antiga, independentemente de onde o botão apareça. Trocar valor deve permitir nova confirmação, sem bloqueio por confirmação de outro valor.
- Toques repetidos não empilham telas/resultados duplicados; implementar proteção efetiva no mesmo ciclo de interação, não somente depender de renderização posterior.
- Acesso direto ao resultado, reinício de sessão, valor inválido ou parâmetros múltiplos inesperados não mostram sucesso inexistente. Parâmetro `confirmed=true` não comprova confirmação.
- Manter provider único no ancestral comum das abas públicas, resumo e resultado, conforme correção após a 005. Verificar entrada por Início, aba Apoiar e “Conhecer o apoio mensal” do projeto.
- Separar regras de estado da apresentação para testes reais de confirmação, alteração, reset e acesso ao resultado.

**Persistência:**
- Completar validação de envelopes (incluindo `null`, arrays e primitivos), campos, datas válidas e numeração de versões, respeitando formatos válidos anteriores. O exemplo de versão 2 sem versão 1 deve continuar legível; não exigir histórico artificialmente completo.
- Corrigir falhas com erros compreensíveis e discrimináveis; não exibir detalhes de schema ou exceções técnicas como única orientação ao usuário.
- Garantir que erros não apaguem/reescrevam registros e que tentativas posteriores sejam possíveis, preservando formulários e histórico.
- Consolidar tipos/regras duplicados hoje em `services/`, `features/` e `types/` no menor conjunto necessário. Modelos específicos permanecem no domínio; utilitários compartilhados somente se realmente usados por mais de um domínio. Não refatorar o projeto inteiro por estilo.

### Bloco 7 — Acabamento visual e acessibilidade

- Manter branco e azul, tokens compartilhados e rotas internas `member/`.
- Melhorar composição da página inicial (missão, projetos, apoio e acesso), hierarquia de títulos, espaçamento, cards de situação/progresso/responsável e chamadas para ação.
- Avatares com iniciais dos integrantes e professora, sem depender de fotos ou serviço externo.
- Tela Sobre com equipe, contexto acadêmico e pilares; avisos demonstrativos claros e concisos, com destaque obrigatório no login e contribuição.
- Revisar labels, contraste, áreas de toque, textos longos, fontes ampliadas, telas pequenas, teclado, safe area e rolagem. Ícones não podem ser a única indicação de uma ação.
- Estados de carregamento/erro/vazio visualmente consistentes e botões que indiquem a ação/resultado, sem confirmação falsa de sucesso.

### Bloco 8 — Documentação, roteiro e revisão de evidências

- Atualizar README e AGENTS com comportamento entregue e próximo passo real; a senha demonstrativa pode constar no roteiro/README.
- Reconciliar tarefas 004–006, revisão de persistência, revisão integrada e roteiro. Preservar resultados históricos identificados como tais; corrigir contagens e alegações não sustentadas.
- Os seis testes atuais de doações cobrem valores/formatação, não navegação, provider ou confirmação. Testes de serviços não comprovam teclado, guia, busca em tela, troca de perfil, rotas ou reabertura do processo. Remover classificações de jornadas aprovadas por esses testes.
- Não declarar exportação histórica como execução nova. Resultados de qualquer comando não executado ficam pendentes, mesmo que um documento anterior diga aprovado.
- Atualizar `docs/demo/roteiro-demonstracao.md` com credenciais, perfis, dados de exemplo, ações e resultados esperados; não exigir apagar dados.
- Registrar a entrega em `docs/reviews/003-entrega-final.md`: base Git + alterações locais, ambiente, comandos/resultados, matriz de aceite, fluxos manuais, limitações e bloqueios.

## Limites da tarefa

- Sem backend, Supabase, rede obrigatória, autenticação real, cadastro público, recuperação de senha, sincronização entre aparelhos ou administração de contas.
- Sem pagamento, dados pessoais/bancários adicionais, recibo, cobrança, metas de arrecadação apresentadas como receita ou repasses imobiliários calculados.
- Sem chat, gamificação, notificações, agenda, registro semanal de atividades, exclusão de documentos ou restauração de versões.
- Sem inventar números reais de impacto, papéis acadêmicos específicos além dos informados ou termos da parceria com Roque Imóveis; não vincular institucionalmente o aplicativo à Teto Brasil.
- Não exigir imagens externas, fotografias, fontes remotas ou novas integrações para a entrega.
- Sem publicação, APK/IPA, commit ou push automáticos. Uma tarefa não autoriza delegação nem execução de uma próxima tarefa.
- Prazo curto orienta a sequência e o reaproveitamento; não autoriza omitir blocos aprovados ou marcar trabalho parcial como completo. Se algo não couber, registrar bloqueio e alinhar antes de reduzir escopo.

## Orientações e módulos envolvidos

| Área | Pontos principais |
| --- | --- |
| `features/access/`, `app/member/` | Pessoas, normalização, login, sessão, proteção demonstrativa de rotas, saudação e saída |
| `features/institutional/`, `features/onboarding/` | Início, Sobre/equipe e guia coerente |
| `features/projects/` | Exemplos, vínculos de responsáveis/procedimentos, busca/filtro, detalhe e seção de transições |
| `features/playbook/` | Conteúdo, tipos de domínio, autoria, versões, atualização ao retornar |
| `services/playbook.ts`, `services/transitions.ts` | Validação, gravação, compatibilidade, atualização idempotente e preservação |
| `features/donations/`, `app/(public)/` | Regras da simulação, navegação, parâmetros e provider compartilhado |
| `components/`, `hooks/`, `theme/` | Componentes reutilizados, carregamento/ciclo de vida e identidade visual |
| `tests/`, `docs/` | Testes de produção, fixtures legadas, decisões e evidências de entrega |

Adaptações de modelos precisam de decisão documentada e teste de compatibilidade. Não adicionar campos apenas para montar um painel artificial. Reutilizar o runner existente; importação em Node deve resolver módulos reais sem copiar funções de negócio. Se alterar configuração/dependências, explicar necessidade e verificar Expo.

## Sequência de execução dentro da tarefa

1. Registrar linha de base, pendências reais e estratégia de compatibilidade/atualização dos exemplos.
2. Implementar cadastro, login e sessão; integrar autoria individual aos serviços e testar preservação.
3. Enriquecer exemplos e aplicar atualização idempotente segura; integrar equipe/guia.
4. Implementar painel, busca/filtro, vínculos, atualização de listas e seção de transições.
5. Corrigir contribuição e validações remanescentes; aplicar acabamento visual.
6. Executar verificações, testar jornadas em dispositivo quando disponível e reconciliar documentos.
7. Entregar em revisão com matriz completa. Nenhum bloco é opcional por estar mais tarde na sequência.

## Critérios de aceite observáveis

Todos começam pendentes. Ao entregar, mapear cada ID a evidência e separar teste automatizado, inspeção e execução manual; aprovação final depende da revisão.

| ID | Critério |
| --- | --- |
| A01 | Os 16 logins da tabela aceitam `0000` e retornam pessoa/perfil corretos; os dois acessos de cada pessoa mantêm a mesma identidade nominal. |
| A02 | Normalização de caixa/acentos/espaços funciona; prefixo `v-` é respeitado; login parcial, desconhecido, vazio ou senha diferente são rejeitados sem sessão. |
| A03 | Formulário tem labels, senha mascarada/alternável, orientação demonstrativa e mensagens claras; área pública abre sem login. |
| A04 | Nome/perfil aparecem; sair/trocar conta limpa sessão; reinício exige login sem perder dados; rotas internas sem sessão não liberam ações. |
| A05 | Rascunho alterado exige descarte ao sair/trocar conta; gravação usa autor estável, sem misturar ações de contas distintas. |
| A06 | Novos documentos, versões e transições registram nome da pessoa, perfil quando aplicável, data e indicação demonstrativa; autor e responsável são distintos. |
| A07 | Conteúdos, responsáveis livres e autores históricos existentes continuam intactos, inclusive após troca entre voluntário e coordenação. |
| A08 | Fonte única de pessoas alimenta login/equipe/autoria; Sobre lista os sete integrantes e Betania como professora; não inventa contatos ou vínculos reais. |
| A09 | Cinco projetos e seis procedimentos mantêm IDs; exemplos enriquecidos são coerentes, datados e identificados como fictícios, com integrantes distribuídos e casos vazios preservados. |
| A10 | Instalação sem chave recebe novos exemplos; base antiga válida com exemplo intacto recebe atualização controlada; exemplos editados e conteúdo próprio não são sobrescritos. |
| A11 | Atualização dos exemplos preserva versões anteriores, é idempotente e não grava após leitura/validação malsucedida; falha de escrita permite tentar novamente sem perda. |
| A12 | Painel saúda pessoa e mostra seus projetos, procedimentos atualizados e transições recentes a partir de dados reais locais, com estados de erro/vazio e atalhos corretos. |
| A13 | Busca/filtro de projetos combinam corretamente na área pública e interna; zero resultados é tratado; vínculos internos abrem o procedimento correto e não expõem atalhos internos indevidos ao visitante. |
| A14 | Após salvar/voltar/trocar conta, listas, detalhe e painel refletem os dados atuais; respostas antigas não sobrescrevem outro projeto/rota. |
| A15 | Histórico de transições compõe o detalhe sem tela/rolagem aninhada; preserva ordem, autoria, responsável, contexto inicial e recuperação de erro. |
| A16 | Guia só orienta ações disponíveis e leva aos conteúdos corretos. Início, Sobre, cards e avatares mantêm identidade branca/azul e hierarquia consistente. |
| A17 | Contribuição funciona pelas três entradas públicas; resultado exige confirmação na sessão e valor válido, inclusive ao receber parâmetros ausentes/múltiplos/inválidos. |
| A18 | “Voltar ao resumo” abre o resumo do valor certo; “Nova simulação” e alteração de valor invalidam confirmação anterior; toques repetidos não duplicam navegação. |
| A19 | Reinício não restaura confirmação/sessão; contribuição não persiste, cobra ou coleta dados; avisos antes/depois permanecem explícitos. |
| A20 | Envelopes `null`/primitivos/arrays, datas e versões inválidas são rejeitados de forma controlada sem alterar valor bruto; dados válidos antigos e exemplos continuam legíveis. |
| A21 | Falha de leitura não vira painel/lista vazia de sucesso; falha de escrita mantém formulário/histórico; nova tentativa executa leitura/gravação real e informa falha persistente. |
| A22 | Em dispositivo/simulador, login, troca de conta, teclado, voltar/descarte, rolagem, safe area, textos ampliados e estados vazios/erro são verificados com ambiente/resultados registrados. |
| A23 | Jornada de dois integrantes no mesmo aparelho: um cria/edita e registra transição; outro consulta versão anterior, autoria e histórico; após encerrar/reabrir e entrar, dados persistem. |
| A24 | Tipos, lint, testes significativos dos módulos de produção, Expo Doctor, dependências e exportações têm comandos/resultados reais registrados. Testes cobrem contas, autoria, atualização legada, falhas e estado da contribuição. |
| A25 | README, AGENTS, decisão de dados, roteiro e revisões distinguem histórico/inspeção/teste/manual; contagens corretas, pendências e aceite do responsável estão explícitos. |

## Verificações esperadas

### Automatizadas

Executar e registrar os comandos exatos:

```bash
npm run type-check
npm run lint
npm test
npx expo-doctor
npx expo install --check
npx expo export --platform android
npx expo export --platform ios
git diff --check
```

- Testar matriz das 16 contas, entradas normalizadas/inválidas, perfis e resolução de autoria usando funções reais.
- Testar fixtures de base anterior: exemplos intactos, exemplo editado, documento próprio, versões antigas, transições e responsáveis livres; comparar conteúdo/valor bruto antes e depois e repetir atualização.
- Simular `getItem`/`setItem` rejeitados, JSON/envelope/conteúdo inválidos e recuperação posterior; assegurar ausência de escrita destrutiva.
- Testar regras reais de contribuição (confirmar, alterar, resetar, rejeitar acesso direto, parâmetros múltiplos) em vez de apenas valores/formatador.
- Testes relevantes de busca/filtro, relações por ID e ordenação/painel quando houver regras próprias. Não criar testes que apenas repitam constantes ou outra implementação das funções.
- Não desabilitar typed routes, lint ou verificações para obter aprovação; se tipos de rotas precisarem de atualização, usar geração suportada pelo Expo e registrar o procedimento, sem coerções para silenciar erro.

### Manual — roteiro mínimo

1. Visitante: Início → projeto → Conhecer o apoio mensal → três valores → resumo → confirmar → resultado → voltar ao resumo → nova simulação. Repetir entrada pela aba Apoiar; acesso direto ao resultado não confirmado.
2. Entrar como `v-Matheus Peruzza`/`0000`, consultar guia e buscar procedimento; criar conteúdo demonstrativo identificável, editar e conferir versão anterior.
3. Abrir projeto, consultar procedimento relacionado e registrar transição. Retornar ao painel/listas e verificar atualização.
4. Sair e entrar como `Filipe Angi`/`0000`; conferir os registros e a autoria anterior, sem perder histórico; efetuar alteração própria e conferir nova autoria.
5. Encerrar/reabrir aplicativo: sessão deve estar ausente; entrar como Betania e recuperar conteúdos/transições. Conferir também `v-Betania` e projeto não atribuído/estado vazio.
6. Validar descarte/cancelamento, navegação do sistema, rotas inexistentes, busca sem resultados, teclado, textos longos/ampliados e rolagem. Registrar método de falha simulada se houver ambiente apropriado.

Não exigir apagar armazenamento para demonstrar. Se indisponível dispositivo/simulador ou injeção manual de falha, registrar limitação e deixar critério correspondente pendente; teste de serviço/exportação não o substitui.

## Resultado, evidências e pendências — preencher na entrega

**Não iniciada.** A criação deste contrato não implementa os recursos nem valida critérios.

- **Resumo implementado:** pendente.
- **Arquivos alterados/criados e decisões:** pendente.
- **Base Git e alterações locais preservadas:** pendente.
- **Matriz A01–A25:** preencher atendido/parcial/pendente, evidência concreta, método e limitação por ID.
- **Comandos e resultados:** pendente; não copiar resultados de tarefas anteriores como execução atual.
- **Fluxos manuais e ambiente (plataforma, modelo/simulador, SO, Expo Go):** pendente.
- **Estratégia de atualização e prova de preservação dos dados:** pendente.
- **Bloqueios, pendências e aceite do responsável:** pendente.

Entregar com status **em revisão**. Não marcar concluída apenas por código/documentos prontos; não avançar automaticamente para outra tarefa nem publicar o projeto.
