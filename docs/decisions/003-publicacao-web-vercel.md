# 003 — Publicação web do protótipo na Vercel

**Data:** 12/11/2026

**Status:** implementada; validação do deploy público pendente.

## Contexto

O responsável solicitou um link para a professora executar o aplicativo sem preparar Node.js/Expo Go. Escolheu a Vercel e relatou falha de `npm ci` no commit `d3d9683`: dependências peer ausentes no lockfile. O erro foi reproduzido localmente com Node.js 24.21.0 e npm 11.19.0.

## Decisão

- Reutilizar as telas React Native por meio de `react-native-web`, sem backend novo ou alteração das regras do protótipo.
- Adicionar `react-native-web` e `@expo/metro-runtime` para execução web e declarar `react-native-gesture-handler` na faixa compatível com SDK 58, evitando a resolução automática de um peer fora da faixa recomendada. As versões foram conferidas na matriz `expo/bundledNativeModules.json` e por `expo install --check`.
- Atualizar patches compatíveis do Expo SDK 58 e reconciliar o lockfile com npm, mantendo `npm ci` como instalação reproduzível. Declarar Node.js `24.x` em `engines`.
- Usar `web.output: "single"`, com exportação SPA por Metro em `dist/`, pois os dados e a sessão já são locais e existem rotas dinâmicas de conteúdo.
- Versionar `vercel.json` com instalação, build, diretório de saída e rewrite para `index.html`. Rotas são resolvidas no cliente; arquivos estáticos existentes são servidos pela hospedagem.
- Adaptar o descarte de rascunhos para `window.confirm` no navegador e usar `repeat()` do `usePreventRemove` do Expo Router 58 para prosseguir após a confirmação. O hook do Router já registra a proteção de fechamento/recarregamento na web.

## Consequências

- Após um deploy aprovado, a professora poderá usar um link no navegador sem manter o computador do grupo ligado.
- Login e contribuições continuam demonstrativos; não há autenticação de servidor, cobrança ou sincronização de dados.
- O AsyncStorage web usa o armazenamento do navegador. Cada navegador/origem tem seus próprios dados; preview, produção e Expo Go não compartilham registros.
- Recarregar a página exige novo login, pois a sessão permanece em memória.
- O build web local e os fluxos essenciais foram verificados; isso não comprova um deploy na Vercel nem testes manuais em Android/iOS. Evidências e pendências na [Revisão 004](../reviews/004-publicacao-web-vercel.md).
