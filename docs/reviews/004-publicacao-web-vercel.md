# Revisão 004 — Correção da instalação e preparação web/Vercel

**Data:** 12/11/2026

**Base:** `d3d9683`, com alterações desta entrega.

**Estado:** verificação técnica local aprovada; deploy público e aceite do responsável pendentes.

## Objetivo e limites

Corrigir o erro de dependências apresentado na Vercel e preparar a versão web para acesso por link. Pedido explícito do responsável após escolher a Vercel. Sem nova integração de backend ou cobrança. A decisão técnica está em [003 — Publicação web](../decisions/003-publicacao-web-vercel.md).

## Alterações

- `package.json` e `package-lock.json`: dependências web, peer nativo compatível, patches do SDK 58, Node.js 24 e scripts `web`/`build:web`.
- `app.json`: Metro com saída SPA (`single`).
- `vercel.json`: instalação limpa, exportação web, saída `dist` e fallback de rotas para `index.html`.
- `hooks/useDiscardDraft.ts`: confirmação web e continuação de navegação pela API `repeat()` atual do Expo Router, também usada na confirmação nativa.
- README, guia da professora e decisão técnica atualizados. Corrigida no guia a informação sobre o projeto atribuído a Betania, conferida durante a execução no navegador.

## Comandos e resultados reais

Ambiente: macOS, Node.js 24.21.0 e npm 11.19.0.

| Comando | Resultado |
| --- | --- |
| `npm ci --dry-run` antes da correção | Reproduziu o EUSAGE relatado na Vercel |
| `npx expo install react-native-web @expo/metro-runtime react-native-gesture-handler` | Dependências compatíveis instaladas; lockfile reconciliado |
| `npx expo install --fix` | Patches do SDK 58 ajustados |
| `npm ci` após os ajustes de dependências | Instalação limpa aprovada: 784 pacotes |
| `npm run build:web` | Exportação de produção aprovada em `dist/`, com `index.html`, JS e assets |
| `npm run type-check` | Aprovado |
| `npm run lint` | Aprovado, sem avisos |
| `npm test` | 44 aprovados; aviso preexistente `MODULE_TYPELESS_PACKAGE_JSON` permanece |
| `npx expo install --check` | Dependências atualizadas e compatíveis |
| `npx expo-doctor` | 20/20 verificações aprovadas |
| `npx expo export --platform android --platform ios --output-dir dist-native-check` | Exportações Android e iOS aprovadas; artefatos temporários removidos após verificação |
| `git diff --check` | Aprovado, sem problemas de whitespace |

O npm informou 8 vulnerabilidades moderadas na árvore durante a instalação. Não bloqueiam a instalação nem a exportação; não foi executada atualização forçada de dependências fora desta correção.

## Fluxos web executados

Foi usado **Playwright 1.65.0 com Chromium headless**, instalado em diretório temporário fora do repositório. O script temporário foi executado por `node /var/folders/79/_bpz0dk50z1gxshtc493y5740000gn/T/opencode/abrigoacao-web-check/check.cjs`. Ele serviu os arquivos reais de `dist/` via HTTP local, com fallback SPA. Não é um teste hospedado na Vercel nem uma suíte adicionada ao projeto.

Resultado final da execução:

- Início, navegação pública, busca de projetos: aprovados.
- Abertura direta de `/projects/1` e recarregamento da página: aprovados no servidor local.
- Contribuição: resumo → confirmação → resultado, com aviso de ausência de pagamento: aprovado.
- Login `Betania` / `0000` e painel: aprovados.
- Criação e edição de conteúdo, autoria nominal, versão 2 e leitura intacta da versão 1: aprovados.
- Recuperação do conteúdo após recarregar e fazer novo login: aprovada.
- Cancelar descarte mantém rascunho; aceitar descarte sai do formulário: aprovados. O teste identificou a necessidade de usar `repeat()`, corrigida antes da execução final.
- Criação de transição, autoria e recuperação após nova sessão: aprovadas.
- Acesso e login em viewport 390 × 844: aprovados. Essa emulação não equivale a teste em celular físico.
- Nenhum erro JavaScript não tratado foi registrado na execução final.

## Pendências

1. A Vercel deve executar o deploy do commit novo, não o redeploy de `d3d9683`.
2. Confirmar o estado **Ready**, abrir o domínio final e conferir `/`, `/projects/1`, `/member/enter`, assets e recarregamento. A configuração Vercel está preparada, mas a execução remota ainda não foi observada nesta revisão.
3. Inserir o link real no README e no guia depois que o endereço for confirmado.
4. Testes manuais em dispositivo e aceite acadêmico continuam pendentes; as verificações desta entrega não concluem os critérios A22/A23 da Tarefa 007.
