# 001 — Fundação técnica e layout navegável

**Status:** em revisão — verificações técnicas aprovadas e teste geral no Expo aceito pelo responsável para publicação. Evidências individuais do checklist manual não informadas.

## Objetivo

Entregar o protótipo visual navegável do AbrigoAção para avaliar identidade e jornadas antes da implementação de gravação ou integrações.

## Contexto e documentos de referência

- [README](../../README.md): escopo do produto, estado e comandos.
- [AGENTS](../../AGENTS.md): regras de desenvolvimento e revisão.
- [Decisão 001](../decisions/001-fundacao-visual.md): arquitetura visual e versões.
- Plano de primeira implementação aprovado na conversa: nome AbrigoAção, fundo branco, azul institucional, navegação pública e interna, dados fictícios e formulários sem gravação.
- Implementação inicial: Nemotron Ultra 3. Revisão e correções: gerente técnico, por solicitação explícita do responsável.

## Pré-requisitos

- Node.js 24 e npm para reproduzir os comandos verificados.
- Expo Go compatível com SDK 57 ou ambiente mobile de desenvolvimento compatível.
- Documentação e arquivos existentes preservados.

## Escopo incluído

- Fundação Expo/TypeScript estrito/Expo Router, lockfile npm e scripts.
- Tema branco e azul, componentes acessíveis, safe area e rolagem.
- Abas públicas: Início, Projetos, Apoiar, Sobre.
- Detalhes de projeto, resumo de apoio mensal e parceria proposta.
- Entrada de perfis demonstrativos e abas internas: Visão geral, Playbook, Projetos, Guia.
- Conteúdo, histórico e versão de playbook; formulários de criação, edição e transição.
- Busca, categorias, seleção de valores e rascunhos somente em memória.
- Dados estáticos tipados, estados vazios e registros inexistentes.

## Limites da tarefa

Não inclui persistência, autenticação real, autorização, backend, pagamentos, upload ou envio de formulários. Salvar permanece desabilitado. O histórico é fictício. A parceria não possui termos aprovados.

O MVP futuro continua prevendo persistência: sua ausência é um recorte desta entrega visual, não uma retirada do requisito.

## Orientações e módulos envolvidos

- `app/(public)/(tabs)`: quatro abas públicas, com detalhes em pilha no grupo público.
- `app/member/(tabs)`: quatro abas internas, com detalhes e formulários em pilha sob `member/`.
- `features/access`: perfil demonstrativo em contexto, limitado à área interna e sem persistência; rotas protegidas apenas como convenção de navegação.
- `features/projects`: dados compartilhados por listas e detalhes públicos/internos.
- `features/playbook`: conteúdos e versões reunidos por documento; a edição abre o conteúdo atual.
- `features/donations`: opções em centavos, seleção validada e resumo sem efeitos financeiros.
- `features/institutional` e `features/onboarding`: apresentação e guia.
- `components`, `theme` e `hooks/useDiscardDraft.ts`: interface compartilhada e confirmação de descarte, inclusive em eventos de retorno.

## Critérios de aceite observáveis

### Verificados tecnicamente

- [x] Projeto com TypeScript estrito, scripts e lockfile npm.
- [x] Rotas públicas e internas com caminhos distintos; detalhes fora das abas.
- [x] Dados tipados e unificados; nenhum `any` ou coerção para silenciar erros.
- [x] Busca e filtro em memória implementados; estado sem resultados disponível.
- [x] Formulários de novo conteúdo, edição e transição presentes, sem gravação.
- [x] Histórico estático preserva conteúdo anterior; IDs inválidos não recebem registros substitutos.
- [x] Apoio com opções de R$ 20, R$ 50 e R$ 100, valores em centavos e resumo validado.
- [x] Dados fictícios, perfis demonstrativos e ausência de pagamento explicitados na interface.
- [x] Tipos, lint sem avisos, testes de integridade, Expo Doctor e bundles mobile aprovados.
- [x] README e decisão técnica atualizados com limitações reais.

### Checklist manual — resultados individuais não informados

O responsável relatou “testei e funcionou” e autorizou a publicação. Esse aceite comprova o relato de funcionamento geral no Expo, mas não permite marcar cada cenário abaixo como verificado. Os itens permanecem como referência para testes detalhados.

- [ ] Aplicativo abre na área pública sem erro de runtime.
- [ ] Abas exibem somente quatro itens em cada área.
- [ ] Navegação e retorno funcionam nas jornadas abaixo.
- [ ] Ambos os perfis são apresentados corretamente; saída limpa a seleção demonstrativa.
- [ ] Rascunho alterado exige confirmação ao cancelar, voltar ou usar gesto/botão do sistema.
- [ ] Campos e ações permanecem acessíveis com teclado aberto.
- [ ] Rolagem e safe area funcionam em celular estreito e em largura maior.
- [ ] Textos ampliados não cortam informações essenciais; ícones e contraste aprovados.
- [ ] Nome e identidade visual aprovados na execução.

## Verificações esperadas e resultado da revisão

| Comando | Resultado real |
| --- | --- |
| `npm test` | 4 testes aprovados; aviso Node de detecção de módulo TypeScript |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, 0 erros e 0 avisos |
| `npx expo-doctor` | 21/21 verificações aprovadas |
| `npx expo install --check` | Dependências compatíveis |
| `npx expo export --platform android` | Bundle Hermes exportado |
| `npx expo export --platform ios` | Bundle Hermes exportado |
| `git diff --check` | Sem erro na revisão técnica |
| `npm audit --omit=dev` | 28 alertas: 10 moderados e 18 altos |

Exportação não é execução mobile, instalação nativa, teste de interação ou geração de APK/IPA. A declaração inicial do implementador de que o aplicativo já abria no celular não possuía evidência de execução. Após a revisão, o responsável realizou um teste no Expo e relatou funcionamento geral; não foram informados resultados individuais por cenário.

## Roteiro de teste manual para o responsável

Executar `npm start` e abrir no Expo Go compatível. Registrar sistema, modelo, versão do Expo Go e capturas de qualquer erro.

1. **Público:** Início → projeto em destaque → detalhes → apoio mensal → selecionar cada opção → Visualizar resumo → voltar. Conferir avisos e valores.
2. **Lista pública:** abrir cada um dos cinco projetos; Luz no Lar e Jardim Solidário devem ter detalhes próprios.
3. **Institucional:** Sobre → parceria; conferir caráter proposto, sem percentual acordado.
4. **Entrada:** explorar como voluntário → visão geral → guia → boas-vindas → voltar. Sair, entrar como coordenação e conferir o perfil.
5. **Playbook:** buscar um título, filtrar categoria e buscar termo sem resultado. Limpar o filtro. Abrir boas-vindas → histórico → versão 1; comparar com versão 2.
6. **Formulário:** editar conteúdo; conferir título/texto atuais; alterar e cancelar. Escolher continuar editando, conferir o rascunho e depois descartá-lo. Repetir com retorno do sistema e formulário Novo conteúdo.
7. **Continuidade:** projetos internos → projeto com pendências → transição → digitar, abrir teclado e testar descarte. Abrir Mutirão São João e conferir estado sem pendências.
8. **Layout:** rolar telas longas, conferir barras do sistema e textos ampliados. Testar uma largura próxima de 360 pontos e outra maior quando possível.
9. **Endereços inválidos (quando possível por deep link):** projeto inexistente, documento inexistente e versão inexistente devem mostrar estado de conteúdo não encontrado, nunca outro registro.
10. **Saída:** voltar à área pública; entrar novamente deve permitir escolher o perfil. Reabrir o app deve começar sem autenticação nem conteúdo salvo.

**Fluxos verificados manualmente pelo assistente nesta revisão:** nenhum. Após a entrega, o responsável informou “testei e funcionou” e autorizou prosseguir. Sistema, modelo, versão do Expo Go e capturas não foram fornecidos.

## Resultado, evidências e pendências

### Correções efetuadas

- Eliminadas colisões entre `/projects` público e interno, bem como abas extras para detalhes.
- Substituídos HTML e emojis da navegação por componentes nativos e Ionicons.
- Removidos dados duplicados e fallbacks que mostravam o primeiro projeto/documento para IDs inválidos.
- Preservados os cinco projetos existentes e os conteúdos/versionamentos demonstrativos anteriores em módulos tipados.
- Corrigidos edição genérica, ausência de novo conteúdo, seleção de perfil e histórico de outro documento.
- Adicionados rolagem, tratamento de teclado, alvos de toque, rótulos acessíveis e confirmação de descarte.
- Removidos contexto de tema estático desnecessário, imports sem uso, `any`, supressões de lint e `.gitkeep` de pastas preenchidas.

### Acompanhamento das dependências

Auditoria real identificou advisories em `braces` (Metro/micromatch), `node-forge` (ferramentas Expo), `uuid` (xcode/config plugins) e `decode-uri-component` (query-string/Router). Os 28 resultados incluem os pacotes transitivamente afetados, não 28 falhas independentes no código do aplicativo.

O comando sugeriu `npm audit fix --force`, incluindo downgrade para Expo 44 ou mudança major de Router. Não foi aplicado por quebrar a base SDK 57 validada. Reavaliar correções compatíveis antes de uma distribuição e planejar migração de SDK em tarefa própria se necessária. Não declarar a árvore de dependências livre de vulnerabilidades.

### Próximo marco

Publicar a entrega autorizada no GitHub. O teste geral foi aceito pelo responsável; verificações detalhadas e alertas de dependências permanecem documentados. Uma próxima implementação depende de tarefa própria, sem início automático de funcionalidades.
