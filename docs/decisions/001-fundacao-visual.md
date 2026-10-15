# 001 — Fundação do protótipo visual

**Status:** decisões aplicadas; responsável relatou funcionamento no Expo e autorizou publicação. Resultados individuais dos testes visuais não informados.

## Contexto

O responsável aprovou o nome AbrigoAção e o uso de branco e azul institucional. A primeira entrega deve permitir avaliar as jornadas completas com dados fictícios, antes de persistência e integrações.

## Decisão

### Base e versões

Mantida a família Expo SDK 57 da implementação inicial após validação por `expo install --check` e Expo Doctor (21/21). Versões efetivamente resolvidas no lockfile durante a revisão:

| Pacote | Versão |
| --- | --- |
| Expo | 57.0.30 |
| Expo Router | 57.0.28 |
| React / React DOM | 19.2.3 |
| React Native | 0.86.3 |
| TypeScript | 6.0.3 |
| @expo/vector-icons | 15.1.1 |
| expo-font | 57.0.4 |

O npm com lockfile é a referência para instalação reproduzível. Ambiente utilizado: Node.js 24.21.0 e npm 11.19.0. A lista integral de pacotes permanece em `package.json`/`package-lock.json`.

Adicionados `@expo/vector-icons` e `expo-font` via `npx expo install`: fornecem Ionicons consistentes e fontes empacotadas para Android/iOS, substituindo os emojis. Não foi adicionada biblioteca de estado nem de UI. Fontes dos ícones são locais; textos usam a fonte de sistema.

### Identidade

Tokens centralizados em `theme/index.ts`: fundo `#FFFFFF`, superfícies `#F8FAFC`, azul principal `#1D4ED8`, azul escuro `#1E3A8A`, azul suave `#EFF6FF`, texto `#0F172A`, texto secundário `#475569` e borda `#CBD5E1`. Estados são identificados também por texto, não apenas cor.

Não manter um contexto React para tokens estáticos: importar o tema diretamente evita um provider sem comportamento. Ícones interativos e botões recebem rótulos e estados acessíveis.

### Navegação e apresentação

- Abas públicas em `(public)/(tabs)` e internas em `member/(tabs)`.
- Telas secundárias em pilhas acima das abas.
- Prefixo `member/` evita a colisão entre projetos públicos e internos.
- Perfil demonstrativo somente em memória, no provider da área interna; sair remove a seleção. `Stack.Protected` organiza acesso demonstrativo e histórico de navegação, sem promessa de autorização segura.
- Formulários secundários podem confirmar descarte com `usePreventRemove`, exportado por `expo-router/react-navigation` no SDK utilizado, sem importar outra instância de React Navigation.
- Telas compartilham safe area, rolagem e ajuste ao teclado. Rotas apenas compõem telas das features.

### Dados

Projetos e playbook usam módulos tipados e uma fonte única por domínio. Versões de playbook guardam seu próprio conteúdo e são exemplos somente de leitura. IDs inválidos exibem erro contextual, sem substituir por outro registro. Contribuições usam centavos inteiros, com opções permitidas validadas no resumo.

Nenhuma alteração é persistida nesta tarefa. A implementação futura de persistência e histórico real continua no escopo do MVP e exigirá tarefa própria.

## Consequências

- O protótipo pode ser revisado sem serviços ou credenciais externas.
- Exportações Android e iOS foram geradas; posteriormente o responsável relatou funcionamento geral no Expo. Detalhes do dispositivo e resultados individuais dos cenários não foram informados.
- `npm test` usa o runner nativo do Node e stripping de TypeScript para testar integridade dos dados sem instalar framework. Pode aparecer aviso Node de detecção de módulo; os quatro testes passam.
- Alertas reais de dependências não foram resolvidos por mudança major/forçada: acompanhamento na [Tarefa 001](../tasks/001-fundacao-layout-navegavel.md).
- Ao implementar persistência, dados iniciais não deverão sobrescrever conteúdo criado pelo usuário; o modelo e a migração deverão ser definidos nessa tarefa futura.
