# AbrigoAção

Aplicativo mobile acadêmico para integrar a gestão do conhecimento e a sustentabilidade financeira de uma ONG fictícia voltada a projetos de construção e reforma de moradias.

Projeto desenvolvido para uma atividade da disciplina de Sistemas de Informação (SI), do curso de Administração da Unicamp. O nome aprovado é **AbrigoAção**, com identidade visual branca e azul institucional.

**Estado atual:** protótipo visual navegável implementado, revisado tecnicamente e testado no Expo pelo responsável, que informou funcionamento e autorizou a publicação no GitHub. Persistência, autenticação e pagamentos ainda não estão implementados.

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

O acesso público não exige autenticação. A matriz detalhada de permissões internas será definida antes da implementação do backend. Uma seleção de perfil no protótipo será apenas uma simulação de navegação, não um mecanismo de autorização.

## MVP proposto (objetivo das próximas entregas)

A proposta inicial é um protótipo funcional com dados fictícios e interface em português do Brasil. Esse recorte pode ser ajustado pelo responsável pelo projeto conforme os requisitos da disciplina.

### Área pública

- Apresentação da instituição e da missão.
- Lista e detalhes dos projetos, com andamento, metas e atualizações fictícias.
- Escolha de contribuição mensal e confirmação explicitamente simulada.
- Apresentação da proposta de parceria com a Roque Imóveis.

### Área interna

- Acesso demonstrativo como voluntário ou coordenação.
- Guia de boas-vindas e integração de novos membros.
- Playbook por categorias, com consulta, criação e edição de conteúdo.
- Registro de autor e data das alterações, preservando versões anteriores.
- Projetos com responsáveis, aprendizados, pendências e registros de transição.
- Persistência local das alterações para recuperá-las após reabrir o aplicativo.

Persistência local não oferece colaboração entre celulares. Edição compartilhada, autenticação real e autorização dependem de uma etapa posterior de backend.

### Fora da primeira versão proposta

- Cobranças reais, armazenamento de dados de cartão e integração bancária.
- Repasse automático relacionado a transações imobiliárias.
- Chat, rede social, gamificação e notificações push.
- Integração com sistemas internos da Teto Brasil ou da Roque Imóveis.

## Jornadas que a demonstração deve comprovar

1. Um visitante conhece a instituição, abre um projeto e simula uma contribuição mensal, sem movimentação financeira.
2. Um novo voluntário acessa o guia inicial e encontra um procedimento no playbook.
3. Um membro atualiza um procedimento, identifica a versão anterior e recupera a alteração após reabrir o aplicativo.
4. Um responsável registra pendências e aprendizados de um projeto para apoiar a entrada de outro voluntário.

## Tecnologia e referência

Base tecnológica implementada:

- React Native e Expo para o aplicativo mobile;
- TypeScript com tipagem estrita;
- Expo Router para navegação;
- ícones Ionicons de `@expo/vector-icons`, com fontes locais;
- testes de integridade dos dados demonstrativos com o runner do Node.js;
- Git para versionamento.

Persistência local será escolhida em uma tarefa funcional posterior. A primeira implementação é apenas visual. Versões e decisões estão em [Fundação visual](docs/decisions/001-fundacao-visual.md).

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
  access/                    Perfis demonstrativos e futuro acesso autenticado
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
```

`app/` contém rotas enxutas: a área pública usa `(public)/(tabs)` e a área interna usa `member/(tabs)`. Detalhes e formulários ficam em pilhas fora das abas. Telas, tipos e dados demonstrativos estão em `features/`. Pastas ainda sem implementação mantêm `.gitkeep`.

## Plano de desenvolvimento

| Etapa | Entrega | Andamento |
| --- | --- | --- |
| 1. Estruturação | Escopo, regras e pastas | Concluída |
| 2. Experiência | Mapa de telas, jornadas e identidade inicial | Direção aprovada; teste geral no Expo relatado pelo responsável |
| 3. Fundação e layout | Expo, navegação, dados fictícios e telas | Verificações técnicas aprovadas; teste geral aceito para publicação |
| 4. Conhecimento | Playbook, versões, transições e persistência local | Planejada; interface disponível, gravação pendente |
| 5. Sustentabilidade | Fluxo demonstrativo de contribuição e parceria | Interface disponível; aceite do fluxo pendente |
| 6. Entrega acadêmica | Revisão e roteiro de demonstração | Pendente |

As etapas são uma sequência de trabalho, não um cronograma com datas. Integrações reais serão planejadas se os requisitos da atividade as exigirem.

## Organização do trabalho

- **Responsável pelo projeto:** define prioridades, requisitos da disciplina e aprova decisões de produto.
- **Gerente operacional e técnico (este assistente):** estrutura o caminho, prepara tarefas, define critérios de aceite e revisa entregas.
- **Agente implementador (Nemotron Ultra 3 ou Muse Spark):** escreve o código e executa verificações segundo o `AGENTS.md` e a tarefa vigente.

O contrato de trabalho dos agentes está em [AGENTS.md](AGENTS.md).

## Primeira implementação — protótipo visual

Entrega e revisão registradas na [Tarefa 001](docs/tasks/001-fundacao-layout-navegavel.md), com roteiro de testes manuais.

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

## Executar e testar

Ambiente utilizado na revisão: **Node.js 24.21.0 e npm 11.19.0**. Use Node.js 24 para reproduzir também os testes com leitura nativa de TypeScript.

```bash
npm ci
npm start
```

Abra o projeto no Expo Go compatível com **SDK 57**, com computador e celular na mesma rede. O terminal apresenta o QR code. A compatibilidade da versão do Expo Go instalada deve ser conferida no dispositivo.

Com emulador/simulador instalado:

```bash
npm run android
npm run ios
```

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

### Resultado da revisão técnica

- Checagem de tipos e lint: aprovados, sem avisos de lint.
- Testes: 4 aprovados, cobrindo integridade dos históricos, projetos, registros inexistentes e valores de contribuição. O Node pode emitir aviso de detecção de módulo ao importar os dados TypeScript; isso não representa falha dos testes.
- Expo Doctor: 21/21 verificações aprovadas; dependências compatíveis segundo `expo install --check`.
- Bundles Android e iOS: exportados com sucesso. Exportação não equivale a teste em dispositivo nem geração de APK/IPA.
- Execução no Expo: o responsável informou “testei e funcionou” e autorizou prosseguir com a publicação. Sistema, modelo, versão do Expo Go e resultado individual das jornadas não foram informados; o checklist detalhado permanece como referência na Tarefa 001. Não houve execução manual pelo assistente.
- `npm audit --omit=dev`: 28 alertas (10 moderados e 18 altos), incluindo dependências transitivas de Expo/Metro e Router. Não foi aplicada a correção forçada, pois propõe versões incompatíveis. Detalhes e acompanhamento na Tarefa 001.

## Decisões pendentes

- Prazo, rubrica de avaliação e exigência de backend na disciplina.
- Plataforma prioritária para demonstração: Android ou iOS.
- Regras detalhadas de edição do playbook e administração de acessos.
- Necessidade de pagamentos em ambiente de testes ou reais em uma fase futura.
- Condições da parceria proposta, caso sejam definidas pelo responsável.
