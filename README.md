# AbrigoAção

Aplicativo acadêmico mobile, com versão web para demonstração, para integrar a gestão do conhecimento e a sustentabilidade financeira de uma ONG fictícia voltada a projetos de construção e reforma de moradias.

Projeto desenvolvido para uma atividade da disciplina de Sistemas de Informação (SI), do curso de Administração da Unicamp. O nome aprovado é **AbrigoAção**, com identidade visual branca e azul institucional.

## Para a professora: como acessar e avaliar

### [Abrir o aplicativo no navegador](https://abrigoacao-unicamp-si.vercel.app)

O link funciona no navegador do computador ou do celular, sem instalar Expo Go ou baixar o projeto.

**[Abrir o guia passo a passo de acesso e uso do aplicativo](docs/demo/guia-professora.md)**

O guia explica o acesso pelo navegador após a publicação ou pelo Expo Go, a entrada na área dos membros e o uso de cada funcionalidade, com exemplos para avaliação.

| Acesso demonstrativo da professora | Login | Senha |
| --- | --- | --- |
| Coordenação | `Betania` | `0000` |
| Voluntário | `v-Betania` | `0000` |

A área pública pode ser explorada sem login. A versão web está publicada na Vercel pelo link acima. Pelo Expo Go, é necessário iniciar o projeto no computador e escanear o QR code, conforme o guia. O GitHub contém o código e a documentação.

## Estado do projeto

**Estado atual:** Tarefa 007 — Identidade, acesso e consolidação da entrega final **entregue em revisão**. Login demonstrativo nominal (16 acessos), autoria individual, equipe, dados enriquecidos, painel, navegação integrada, acabamento e correções implementados. Preservação dos dados existentes e reconciliação das evidências das entregas anteriores concluídas. 44 testes automatizados (16 playbook + 19 transições + 3 integridade + 6 doações). Verificações técnicas (tipos, lint, Expo Doctor, exportações) aprovadas. Testes manuais em dispositivo/simulador e aceite final do responsável pendentes. Backend não exigido.

**Próximo passo:** validação manual em dispositivo (critérios A22, A23) e registro de aceite pelo responsável.

**Publicação web (ajuste posterior à Tarefa 007):** lockfile corrigido, instalação limpa validada, dependências web compatíveis com SDK 58, exportação SPA e configuração Vercel implementadas. Deploy `e7e2ae5` aprovado na Vercel; fluxos essenciais verificados com Chromium automatizado tanto no build local quanto no domínio público. Testes manuais em dispositivo e aceite acadêmico continuam pendentes. Evidências na [Revisão 004](docs/reviews/004-publicacao-web-vercel.md).

## Contexto e objetivo

A organização é fictícia, inspirada na atuação da Teto Brasil, sem vínculo institucional presumido. Ela enfrenta três desafios principais:

- rotatividade de voluntários;
- perda de conhecimentos e informações nas transições entre membros;
- dificuldade de manter uma arrecadação financeira previsível.

O aplicativo será um portal integrado para membros e público externo. Seu objetivo é preservar a memória organizacional, facilitar a integração de voluntários e apoiar a continuidade dos projetos por meio de contribuições recorrentes.

## Pilares do produto

### Gestão do conhecimento

Um playbook colaborativo reunirá processos, orientações, aprendizados e informações dos projetos. O conteúdo deverá registrar autoria e atualização, permitindo que novos integrantes entendam como trabalhar e que as transições preservem responsabilidades e pendências.

### Sustentabilidade financeira

O público poderá conhecer os projetos e percorrer um fluxo de contribuição mensal. Também será apresentada a proposta de parceria com a Roque Imóveis, na qual uma porcentagem de determinadas vendas ou locações seria destinada à instituição.

A parceria é uma proposta do projeto acadêmico: não há acordo, percentual, base de cálculo ou periodicidade de repasse confirmados. Esses dados não devem ser inventados nem apresentados como compromissos reais.

## Públicos e acessos propostos

| Perfil | Funcionalidades |
| --- | --- |
| Visitante/apoiador | Conhecer a ONG, consultar projetos e percorrer o fluxo de contribuição mensal |
| Voluntário | Consultar o conteúdo interno e colaborar no playbook e nos registros de continuidade |
| Coordenação | Organizar conteúdos e projetos e, quando houver backend, administrar acessos |

O acesso público não exige autenticação. A matriz detalhada de permissões internas será definida antes da implementação do backend. Login demonstrativo nominal (16 credenciais, senha `0000`) implementado na Tarefa 007; não é autenticação real nem autorização segura.

## MVP proposto (objetivo das próximas entregas)

A proposta inicial é um protótipo funcional com dados fictícios e interface em português do Brasil. Esse recorte pode ser ajustado pelo responsável pelo projeto conforme os requisitos da disciplina.

### Área pública

- Apresentação da instituição e da missão.
- Lista e detalhes dos projetos, com andamento, metas e atualizações fictícias; busca por título/descrição/objetivo e filtro por situação.
- Escolha de contribuição mensal (R$ 20/50/100) e confirmação explicitamente simulada; resultado exige confirmação na sessão; avisos antes/depois.
- Apresentação da proposta de parceria com a Roque Imóveis.

### Área interna

- Login demonstrativo nominal: 8 pessoas × 2 perfis (Voluntário/Coordenação), senha `0000`, prefixo `v-` para Voluntário.
- Painel (Visão geral) com saudação nominal, projetos da pessoa, procedimentos recentes, transições recentes, atalhos.
- Guia de boas-vindas alinhado às ações existentes (entrada, consulta, edição/versionamento, transição).
- Playbook por categorias (6 procedimentos enriquecidos), com consulta, criação, edição, versionamento, busca e filtro.
- Registro de autor nominal (`Nome (Perfil)`), data e indicação demonstrativa; versões anteriores preservadas.
- Projetos (5) com responsáveis do grupo, atualizações datadas, pendências, aprendizados, transições; procedimentos relacionados por ID.
- Registros de transição com autor nominal, responsável livre, pendências/aprendizados; histórico por projeto ordenado decrescente.
- Persistência local das alterações (AsyncStorage) com migração idempotente segura; dados sobrevivem a fechamento/reabertura.

Persistência local não oferece colaboração entre celulares. Edição compartilhada, autenticação real e autorização dependem de uma etapa posterior de backend.

### Fora da primeira versão proposta

- Cobranças reais, armazenamento de dados de cartão e integração bancária.
- Repasse automático relacionado a transações imobiliárias.
- Chat, rede social, gamificação e notificações push.
- Integração com sistemas internos da Teto Brasil ou da Roque Imóveis.

## Jornadas que a demonstração deve comprovar

1. Um visitante conhece a instituição, abre um projeto e simula uma contribuição mensal, sem movimentação financeira.
2. Um novo voluntário entra com login nominal, acessa o guia inicial e encontra um procedimento no playbook.
3. Um membro atualiza um procedimento com autoria individual, identifica a versão anterior e recupera a alteração após reabrir o aplicativo; troca de conta preserva histórico.
4. Um responsável registra transição com autoria nominal, pendências e aprendizados para apoiar a entrada de outro voluntário; painel reflete atualizações.

## Tecnologia e referência

Base tecnológica implementada:

- React Native e Expo para o aplicativo mobile;
- TypeScript com tipagem estrita;
- Expo Router para navegação;
- ícones Ionicons de `@expo/vector-icons`, com fontes locais;
- testes de integridade dos dados demonstrativos com o runner do Node.js;
- Git para versionamento.

Persistência local implementada com `@react-native-async-storage/async-storage` (Tarefas 002, 003 e 007). Versões e decisões estão em [Fundação visual](docs/decisions/001-fundacao-visual.md), [Tarefa 002](docs/tasks/002-playbook-persistencia-local.md), [Tarefa 003](docs/tasks/003-registros-transicao-persistentes.md) e [Decisão 002](docs/decisions/002-identidade-dados-demonstrativos.md).

O GasIndex é referência de organização e configuração técnica. O projeto está disponível no diretório irmão `../GasIndex`. Dependências e padrões devem ser avaliados antes do reaproveitamento; funcionalidades de postos, localização, preços e ranking não pertencem a este produto.

Backend, autenticação e provedor de pagamentos ainda não foram escolhidos. Supabase é uma possibilidade para avaliação futura, não uma integração existente.

## Estrutura de pastas

```text
app/                         Rotas e layouts do Expo Router
components/                  Componentes visuais compartilhados
features/
  institutional/             Apresentação da ONG e parceria proposta
  onboarding/                Integração e guia de novos voluntários
  playbook/                  Conteúdos e histórico de versões
  projects/                  Projetos e registros de continuidade
  donations/                 Contribuições e fluxo demonstrativo
  access/                    Cadastro de pessoas, login, sessão, permissões
services/                    Acesso a armazenamento e integrações
hooks/                       Comportamentos compartilhados de interface
types/                       Tipos realmente compartilhados
utils/                       Funções utilitárias independentes
theme/                       Cores, tipografia e espaçamentos
assets/                      Imagens, ícones e fontes
tests/                       Testes de regras e fluxos relevantes
docs/
  tasks/                     Tarefas delimitadas para implementação
  decisions/                 Registro de decisões técnicas e de produto
  reviews/                   Achados de revisão, evidências e pendências
  demo/                      Roteiro de demonstração
```

`app/` contém rotas enxutas: a área pública usa `(public)/(tabs)` e a área interna usa `member/(tabs)`. Detalhes e formulários ficam em pilhas fora das abas. Telas, tipos e dados demonstrativos estão em `features/`. Pastas ainda sem implementação mantêm `.gitkeep`.

## Plano de desenvolvimento

| Etapa | Entrega | Andamento |
| --- | --- | --- |
| 1. Estruturação | Escopo, regras e pastas | Concluída |
| 2. Experiência | Mapa de telas, jornadas e identidade inicial | Direção aprovada; teste geral no Expo relatado pelo responsável |
| 3. Fundação e layout | Expo, navegação, dados fictícios e telas | Verificações técnicas aprovadas; teste geral aceito para publicação |
| 4. Conhecimento | Playbook, versões, transições e persistência local | **Em revisão** (Tarefas 002, 003, 007); playbook funcional + transições persistentes + login/autoria/painel |
| 5. Sustentabilidade | Fluxo demonstrativo de contribuição e parceria | **Em revisão** (Tarefa 007); jornada completa com confirmação, navegação corrigida, proteções |
| 6. Entrega acadêmica | Revisão e roteiro de demonstração | **Em revisão** (Tarefa 007); roteiro atualizado, reconciliação de evidências, revisão final |

As etapas são uma sequência de trabalho, não um cronograma com datas. Integrações reais serão planejadas se os requisitos da atividade as exigirem.

### Sequência preparada para o próximo agente

| Ordem | Tarefa | Condição |
| --- | --- | --- |
| 1 | [004 — Confiabilidade da persistência local](docs/tasks/004-confiabilidade-persistencia-local.md) | **Entregue em revisão** — falhas F01–F06 corrigidas, 38 testes passando |
| 2 | [005 — Contribuição simulada completa](docs/tasks/005-contribuicao-simulada.md) | **Entregue em revisão** — jornada completa, 44 testes totais |
| 3 | [006 — Revisão integrada e entrega acadêmica](docs/tasks/006-revisao-integrada-entrega-academica.md) | **Entregue em revisão** — verificações técnicas e roteiro; jornadas manuais não comprovadas pela suíte |
| 4 | [007 — Identidade, acesso e consolidação da entrega final](docs/tasks/007-identidade-acesso-entrega-final.md) | **Entregue em revisão** — implementação completa; critérios A01–A25; aguarda validação manual e aceite |

Leia README, AGENTS, a tarefa e suas referências antes de implementar. Execute uma tarefa por vez, entregue em revisão com evidências e não inicie automaticamente a seguinte. Para a 007, prazo é o dia da solicitação e backend não é exigido; rubrica detalhada e plataforma de demonstração permanecem a confirmar.

### Revisão integrada (pós-Tarefa 007)

Na entrega da 007 foram implementados: login nominal (16 credenciais), autoria individual, dados enriquecidos, painel, busca/filtro, navegação integrada, correções de contribuição e persistência, acabamento visual, documentação atualizada. Resultados técnicos: tipos, lint, 44 testes (16 playbook + 19 transições + 3 integridade + 6 doações), Expo Doctor, dependências, exportações Android/iOS aprovados. Roteiro (`docs/demo/roteiro-demonstracao.md`) e revisão (`docs/reviews/003-entrega-final.md`) atualizados com reconciliação de evidências anteriores. Testes manuais em dispositivo/simulador (A22, A23) e aceite final do responsável pendentes. Marcações excessivas em documentos 004–006 reconciliadas; resultados históricos identificados como tais; pendências técnicas separadas.

## Organização do trabalho

- **Responsável pelo projeto:** define prioridades, requisitos da disciplina e aprova decisões de produto.
- **Gerente operacional e técnico (este assistente):** estrutura o caminho, prepara tarefas, define critérios de aceite e revisa entregas.
- **Agente implementador (Nemotron Ultra 3 ou Muse Spark):** escreve o código e executa verificações segundo o `AGENTS.md` e a tarefa vigente.

O contrato de trabalho dos agentes está em [AGENTS.md](AGENTS.md).

## Primeira implementação — protótipo visual

Entrega e revisão registradas na [Tarefa 001](docs/tasks/001-fundacao-layout-navegavel.md), com roteiro de testes manuais.

Esta seção descreve a entrega histórica da fundação. Os comportamentos de gravação e histórico foram posteriormente ampliados pelas tarefas 002, 003 e 007.

### Disponível no código

- Área pública com Início, Projetos, Apoiar e Sobre.
- Detalhes dos projetos e apresentação da parceria proposta.
- Escolha ilustrativa de R$ 20, R$ 50 ou R$ 100 e visualização de resumo mensal sem pagamento.
- Entrada demonstrativa como voluntário ou coordenação, com perfil mantido somente em memória na área interna.
- Visão geral, guia, projetos internos e registros fictícios de continuidade.
- Playbook com busca e filtro em memória, leitura de conteúdo e histórico demonstrativo.
- Formulários de novo conteúdo, edição e transição; botão Salvar desabilitado e confirmação de descarte de rascunhos alterados.
- Tratamento de páginas, registros e versões inexistentes.
- Rolagem, safe area, campos acessíveis e adaptação ao teclado configurados; o relato de teste geral não detalha cada verificação de acessibilidade e layout.

### Limites desta entrega

Não há gravação, sincronização entre dispositivos, login real, permissões de servidor ou cobrança. Os históricos são exemplos estáticos, não versões geradas por edições. Ao sair de um formulário, o rascunho é descartado após confirmação; ao encerrar o aplicativo não há recuperação. Os perfis têm a mesma interface e não concedem privilégios reais.

## Segunda implementação — Playbook com persistência local (Tarefa 002)

Entrega e revisão registradas na [Tarefa 002](docs/tasks/002-playbook-persistencia-local.md).

### Disponível no código

- Playbook com 6 procedimentos demonstrativos carregados do armazenamento local.
- Criação de novo conteúdo com título, categoria, conteúdo e resumo da alteração.
- Edição de conteúdo existente: título, categoria, conteúdo e resumo; cria nova versão preservando as anteriores.
- Histórico de versões por documento com navegação para visualizar qualquer versão.
- Busca por título/conteúdo e filtro por categoria funcionando sobre dados persistidos.
- Persistência em AsyncStorage: dados sobrevivem a fechamento/reabertura do app.
- **Tratamento de erros de leitura corrigido (Tarefa 004):** erros propagam sem sobrescrever dados; inicialização só para chave ausente; validação completa de envelope e conteúdo.
- **Estados de loading/erro/retry funcionais (Tarefa 004):** botão "Tentar novamente" executa nova leitura e recupera após falha temporária.
- Formulários com validação, botão Salvar habilitado apenas quando válido, feedback de salvamento.
- Confirmação de descarte de rascunhos não salvos preservada.
- Avisos de interface atualizados: alterações salvas localmente, dados não compartilhados entre dispositivos.
- Perfil demonstrativo (voluntário/coordenação) não apaga dados ao sair.

### Limites desta entrega

- Exclusão de documentos, restauração de versão específica, sincronização multi-dispositivo não implementados.
- Autenticação real e permissões de servidor não implementadas.
- Registros de transição foram adicionados posteriormente na Tarefa 003, também em revisão.
- Fluxo de contribuição mensal simulada não finalizado (falta confirmação e resultado).
- Testes manuais em dispositivo/simulador não executados neste ambiente.
- O descompasso de patches relatado na entrega original é histórico; consulte os resultados posteriores da Tarefa 003. Nenhuma nova checagem de dependências foi feita na revisão de persistência.
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado.
- **Falhas F01–F06 corrigidas na Tarefa 004** — validação completa, propagação de erros, retry funcional, testes dos serviços reais.

### Verificações técnicas

Resultados atuais (após Tarefa 004):

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | **38 testes aprovados** (19 playbook + 19 transições, serviços reais) |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

*Resultados históricos da entrega original: 14 testes playbook (implementações duplicadas).*

## Terceira implementação — Registros de transição persistentes (Tarefa 003)

Entrega e revisão registradas na [Tarefa 003](docs/tasks/003-registros-transicao-persistentes.md).

### Disponível no código

- Modelo de transição com id, projectId, responsible, pending, learnings, author, createdAt
- Persistência independente em AsyncStorage (chave `abrigoacao.transitions.v1`)
- Formulário funcional: validação, autor por perfil, feedback de salvamento, confirmação de descarte
- Histórico embutido no detalhe interno do projeto com **estados de loading/erro/retry funcionais (Tarefa 004)**.
- Ordenação decrescente por data, badge "Mais recente", data/hora formatada em pt-BR
- Contexto inicial de transição preservado como "Registro de transição (contexto inicial)"
- Botão "Registrar transição" condicionado a permissão `canWriteTransitions`
- Perfil demonstrativo reflete autoria: "Voluntário (demo)" ou "Coordenação (demo)"
- Dados locais não compartilhados entre dispositivos
- **Falhas F01–F06 corrigidas na Tarefa 004** — validação completa de registros, propagação de erros, retry funcional, testes dos serviços reais.

### Limites desta entrega

- Edição/exclusão de transições, sincronização, backend não implementados
- Fluxo de contribuição mensal simulada não finalizado (falta confirmação e resultado)
- Testes manuais em dispositivo/simulador não executados neste ambiente
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` ao rodar testes — não afeta resultado
- **Falhas F01–F06 corrigidas na Tarefa 004** — validação completa, propagação de erros, retry, testes reais.

### Verificações técnicas

Resultados atuais (após Tarefa 004):

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | **38 testes aprovados** (19 playbook + 19 transições, serviços reais) |
| `npx expo export --platform android` | Bundle Hermes exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes exportado com sucesso |

*Resultados históricos da entrega original: 17 testes transições (implementações duplicadas).*

## Quarta implementação — Identidade, acesso e consolidação (Tarefa 007)

Entrega e revisão registradas na [Tarefa 007](docs/tasks/007-identidade-acesso-entrega-final.md) e [Revisão 003](docs/reviews/003-entrega-final.md).

### Disponível no código

**Bloco 1 — Cadastro e login:**
- Fonte única de 8 pessoas com IDs estáveis (`features/access/people.ts`).
- 16 credenciais: senha `0000`; prefixo `v-` = Voluntário; sem prefixo = Coordenação.
- Normalização de login (caixa/acentos/espaços); erros claros para campos vazios/inválidos.
- `AuthProvider` + `useAuth`/`useSession`/`usePermissions`: sessão em memória; logout limpa sessão.
- `LoginScreen` com labels, senha mascarada/alternável, orientação demonstrativa, avatares com iniciais.

**Bloco 2 — Autoria individual:**
- `getDemoAuthor(profile, personName?)`: formato `"Nome (Perfil)"` (ex: `Filipe Angi (Coordenação)`).
- Fallback legado `"Perfil (demo)"` preservado nas versões antigas.
- Novos documentos, versões e transições registram pessoa conectada, perfil, data, indicação demonstrativa.
- Autor e responsável distintos; responsáveis livres não restringidos.

**Bloco 3 — Dados enriquecidos e migração segura:**
- 6 procedimentos enriquecidos (objetivo, passos, cuidados, continuidade); versões expandidas com autores nominais.
- 5 projetos com responsáveis do grupo, atualizações datadas, pendências/aprendizados contextualizados; casos vazios preservados.
- Tela Sobre com 7 integrantes + Betania (professora); avatares com iniciais.
- Guia alinhado às ações reais (sem registro semanal inexistente).
- Migração idempotente `dataVersion = 2`: reconhece exemplos por ID + conteúdo/versão conhecidos; preserva edições e conteúdo próprio; não duplica; falha leitura/validação não grava; falha escrita preserva dados e permite retry.
- Decisão documentada em `docs/decisions/002-identidade-dados-demonstrativos.md`.

**Bloco 4 — Painel (Visão geral):**
- Saudação nominal + perfil; aviso atualizado.
- Seus projetos (por ID); procedimentos recentes (5); transições recentes (5).
- Atalhos: Novo conteúdo, Registrar transição, Guia, Playbook.
- Estados loading/erro/retry/vazio por seção.

**Bloco 5 — Navegação integrada:**
- Busca/filtro combinados (público/interno): título/descrição/objetivo + situação.
- Procedimentos relacionados no detalhe interno (`relatedProcedures` por ID); público não expõe internos.
- Listas/detalhe/painel atualizam ao voltar/salvar/trocar conta.
- `TransitionHistorySection` componente (sem tela/rolagem aninhada); ordenação, autoria, responsável, contexto inicial, badge, retry.
- Ciclo de carregamento com `mounted` flag evita updates pós-desmontagem.

**Bloco 6 — Contribuição e persistência robustas:**
- Valores R$ 20/50/100 em centavos; avisos explícitos; estado efêmero.
- "Voltar ao resumo" navega explicitamente para valor confirmado; "Nova simulação" e troca de valor limpam confirmação; proteção 300ms contra toques duplicados.
- Acesso direto a resultado sem confirmação bloqueado; provider único no ancestral comum.
- Validação completa de envelopes (`null`, arrays, primitivos), campos, datas, versões; v2 sem v1 legível.
- Erros discrimináveis; falha não apaga/reescreve; retry real.

**Bloco 7 — Acabamento visual:**
- Tokens branco/azul; rotas `member/`; hierarquia Home; cards situação/progresso/responsável.
- Avatares com iniciais (8 pessoas); AboutScreen com equipe e pilares.
- Labels, contraste, áreas de toque 48dp, textos longos, fontes ampliadas, teclado, safe area.
- Estados consistentes; botões indicam ação/resultado; sem confirmação falsa.

**Bloco 8 — Documentação:**
- `docs/decisions/002-identidade-dados-demonstrativos.md`: decisão de migração.
- `docs/demo/roteiro-demonstracao.md`: credenciais, jornadas, reconciliação.
- `docs/reviews/003-entrega-final.md`: base Git, comandos/resultados, matriz A01–A25, fluxos manuais, limitações.
- README e AGENTS.md atualizados.

### Limites desta entrega

- Backend, autenticação real, provedor de pagamentos não implementados (fora do MVP).
- Testes manuais em dispositivo/simulador não executados (critérios A22, A23 pendentes).
- Rubrica detalhada e plataforma de demonstração a confirmar pelo responsável.
- Aviso Node.js `[MODULE_TYPELESS_PACKAGE_JSON]` — não afeta resultado.

### Verificações técnicas

Resultados da Tarefa 007:

| Comando | Resultado |
|---|---|
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npm test` | **44 testes aprovados** (16 playbook + 19 transições + 3 integridade + 6 doações) |
| `npx expo-doctor` | 20/20 checks aprovados |
| `npx expo install --check` | Dependências up to date |
| `npx expo export --platform android` | Bundle Hermes 2.7MB exportado com sucesso |
| `npx expo export --platform ios` | Bundle Hermes 2.7MB exportado com sucesso |
| `git diff --check` | Sem problemas |

## Executar e testar

Ambiente utilizado na revisão: **Node.js 24.21.0 e npm 11.19.0**. Use Node.js 24 para reproduzir também os testes com leitura nativa de TypeScript.

```bash
npm ci
npm start
```

Abra o projeto no Expo Go compatível com **SDK 58**, com computador e celular na mesma rede. O terminal apresenta o QR code. A compatibilidade da versão do Expo Go instalada deve ser conferida no dispositivo.

Com emulador/simulador instalado:

```bash
npm run android
npm run ios
```

### Executar no navegador e publicar na Vercel

Para desenvolvimento web local:

```bash
npm run web
```

Para gerar os arquivos de produção em `dist/`:

```bash
npm run build:web
```

O projeto usa Metro e `web.output: "single"` (SPA). O arquivo `vercel.json` registra:

| Configuração | Valor |
| --- | --- |
| Application/Framework Preset | Other |
| Install Command | `npm ci` |
| Build Command | `npm run build:web` (equivalente a `npx expo export --platform web`) |
| Output Directory | `dist` |
| Root Directory | Raiz do repositório |
| Node.js | `24.x`, declarado em `package.json` |
| Environment Variables | Nenhuma necessária para o protótipo |

O rewrite entrega `index.html` para rotas como `/projects/1` e `/member/enter`, permitindo acesso direto e atualização da página. Arquivos existentes de JavaScript, fontes e imagens continuam sendo servidos normalmente pela Vercel.

Após enviar uma atualização à branch `main`, use o deploy do **commit mais recente**. Se a integração Git estiver ativa, a Vercel deverá iniciar o novo deploy; confirme o commit na aba Deployments. Repetir um deploy antigo mantém o lockfile antigo e o erro anterior. Se houver overrides no painel, mantenha os valores da tabela.

Na web, conteúdos e transições ficam no armazenamento do próprio navegador e domínio; não são compartilhados com outro navegador, dispositivo, domínio de preview ou Expo Go. Atualizar a página encerra o login demonstrativo em memória, mas preserva os registros salvos. Detalhes da escolha estão na [Decisão 003](docs/decisions/003-publicacao-web-vercel.md).

Verificações:

```bash
npm run type-check
npm run lint
npm test
npx expo-doctor
npx expo install --check
npx expo export --platform android
npx expo export --platform ios
```

### Revisão atual (pós-Tarefa 007)

Tipos e lint aprovados; `npm test` executou **44 testes aprovados** (16 playbook + 19 transições + 3 integridade + 6 doações). Falhas F01–F06 corrigidas e preservadas; migração idempotente adicionada sem quebrar compatibilidade. Login nominal, autoria individual, painel, navegação integrada, contribuição corrigida, acabamento visual implementados. Exportações Android/iOS aprovadas. Testes manuais em dispositivo pendentes (A22, A23). Evidências e achados no [registro de revisão](docs/reviews/003-entrega-final.md).

## Decisões pendentes

- Rubrica detalhada de avaliação (prazo no dia da solicitação da 007 e backend não exigido, conforme responsável).
- Plataforma prioritária para demonstração: Android ou iOS.
- Regras detalhadas de edição do playbook e administração de acessos.
- Necessidade de pagamentos em ambiente de testes ou reais em uma fase futura.
- Condições da parceria proposta, caso sejam definidas pelo responsável.
