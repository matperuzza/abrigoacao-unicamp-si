# AbrigoAção

Aplicativo mobile acadêmico para integrar a gestão do conhecimento e a sustentabilidade financeira de uma ONG fictícia voltada a projetos de construção e reforma de moradias.

Projeto desenvolvido para uma atividade da disciplina de Sistemas de Informação (SI), do curso de Administração da Unicamp. O nome AbrigoAção, inspirado no nome da pasta do projeto.

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

## MVP proposto

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

Base tecnológica proposta:

- React Native e Expo para o aplicativo mobile;
- TypeScript com tipagem estrita;
- Expo Router para navegação;
- persistência local a escolher na tarefa de fundação;
- Git para versionamento.

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

As pastas começam vazias, com arquivos `.gitkeep` para preservação futura no Git. Código específico de um domínio deve permanecer em sua feature; não criar camadas sem necessidade.

## Plano de desenvolvimento

| Etapa | Entrega | Critério de aceite |
| --- | --- | --- |
| 1. Estruturação | Escopo, regras e pastas | Documentação coerente com a proposta acadêmica |
| 2. Experiência | Mapa de telas, jornadas e identidade inicial | Fluxos público e interno definidos com o responsável |
| 3. Fundação técnica | Expo, navegação, dados fictícios e persistência | Aplicativo abre no celular e verificações configuradas passam |
| 4. Conhecimento | Integração, playbook, versões e transições | Jornadas internas demonstráveis com alterações persistidas |
| 5. Sustentabilidade | Projetos públicos, contribuição simulada e parceria | Jornada pública completa e valores claramente contextualizados |
| 6. Entrega acadêmica | Revisão e roteiro de demonstração | Jornadas verificadas e limitações documentadas |

As etapas são uma sequência de trabalho, não um cronograma com datas. Integrações reais serão planejadas se os requisitos da atividade as exigirem.

## Organização do trabalho

- **Responsável pelo projeto:** define prioridades, requisitos da disciplina e aprova decisões de produto.
- **Gerente operacional e técnico (este assistente):** estrutura o caminho, prepara tarefas, define critérios de aceite e revisa entregas.
- **Agente implementador (Nemotron Ultra 3 ou Muse Spark):** escreve o código e executa verificações segundo o `AGENTS.md` e a tarefa vigente.

O contrato de trabalho dos agentes está em [AGENTS.md](AGENTS.md).

## Estado atual e preparação do ambiente

O repositório contém a documentação e a estrutura de pastas. Ainda não há aplicativo, `package.json`, dependências instaladas, backend ou scripts executáveis.

A primeira tarefa técnica deverá:

1. Conferir os requisitos atuais de Node.js e npm da versão estável de Expo escolhida.
2. Inicializar Expo com TypeScript e Expo Router, preservando os arquivos deste projeto.
3. Registrar versões compatíveis e manter o lockfile do npm.
4. Configurar scripts de inicialização, lint e checagem de tipos.
5. Definir persistência local e a organização dos dados demonstrativos.
6. Verificar a abertura em dispositivo ou emulador e atualizar este README com comandos efetivamente disponíveis.

Não execute um gerador sobre esta pasta sem conferir quais arquivos ele substituirá.

## Decisões pendentes

- Nome final da ONG e identidade visual.
- Prazo, rubrica de avaliação e exigência de backend na disciplina.
- Plataforma prioritária para demonstração: Android ou iOS.
- Regras detalhadas de edição do playbook e administração de acessos.
- Necessidade de pagamentos em ambiente de testes ou reais em uma fase futura.
- Condições da parceria proposta, caso sejam definidas pelo responsável.
