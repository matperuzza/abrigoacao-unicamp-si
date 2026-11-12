# Guia da professora — como acessar e usar o AbrigoAção

Olá, professora Betania! Este guia apresenta o passo a passo para conhecer e avaliar o aplicativo do grupo.

O **AbrigoAção** é um protótipo acadêmico de uma ONG fictícia voltada à construção e reforma de moradias. Ele reúne dois pilares: **gestão do conhecimento**, com procedimentos e registros de continuidade, e **sustentabilidade financeira**, com uma simulação de apoio mensal e uma proposta de parceria imobiliária.

## Índice

- [1. Como abrir o aplicativo no celular](#1-como-abrir-o-aplicativo-no-celular)
- [2. Como entrar com o acesso da professora](#2-como-entrar-com-o-acesso-da-professora)
- [3. Funcionalidades da área pública](#3-funcionalidades-da-área-pública)
- [4. Funcionalidades da área dos membros](#4-funcionalidades-da-área-dos-membros)
- [5. Sequência sugerida para avaliação](#5-sequência-sugerida-para-avaliação)
- [6. Dúvidas e dificuldades comuns](#6-dúvidas-e-dificuldades-comuns)
- [7. O que considerar nesta versão](#7-o-que-considerar-nesta-versão)

## 1. Como abrir o aplicativo no celular

O aplicativo é executado pelo **Expo Go**, um aplicativo gratuito usado para abrir projetos em desenvolvimento no celular. O computador executa o projeto e o celular abre a interface. Os arquivos baixados do GitHub ficam no computador; não é necessário copiá-los para o celular.

**Você vai precisar de:** um computador Windows ou Mac, um celular Android ou iPhone e conexão à internet. Durante o uso, conecte computador e celular à mesma rede Wi-Fi.

### Passo 1 — Baixar o Expo Go no celular

**No Android:**

1. Abra a **Google Play Store** no celular.
2. Pesquise por **Expo Go** ou abra o [Expo Go na Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent).
3. Confira o nome **Expo Go**, publicado pela **Expo**.
4. Toque em **Instalar** e aguarde.
5. Toque em **Abrir**. Se o aplicativo solicitar permissão para usar a câmera ao ler o QR code, permita.

**No iPhone:**

1. Abra a **App Store** no celular.
2. Pesquise por **Expo Go** ou abra o [Expo Go na App Store](https://apps.apple.com/app/expo-go/id982107779).
3. Confira o nome **Expo Go**, publicado pela **Expo**.
4. Toque em **Obter** e confirme a instalação, se solicitado.
5. Aguarde a instalação e abra o aplicativo.

**Compatibilidade:** este projeto usa **Expo SDK 58**. O Expo Go instalado precisa ser compatível com essa versão. Se aparecer um aviso de versão incompatível ao abrir o projeto, confira as opções oficiais em [expo.dev/go](https://expo.dev/go) e solicite apoio ao grupo. A instalação pela loja, por si só, não comprova essa compatibilidade.

### Passo 2 — Instalar o Node.js no computador

O Node.js permite executar o projeto. Sua instalação também inclui o **npm**, ferramenta que baixa os componentes necessários ao aplicativo.

1. No computador, acesse o [site oficial do Node.js](https://nodejs.org/en/download).
2. Selecione a versão **24.x** e o sistema do computador: **Windows** ou **macOS**.
3. Baixe o instalador correspondente ao computador (`.msi` no Windows ou `.pkg` no Mac).
4. Abra o arquivo baixado e siga o assistente de instalação, mantendo as opções padrão, inclusive a instalação do npm.
5. Quando terminar, feche e reabra qualquer terminal que já estivesse aberto para que ele reconheça a instalação.

### Passo 3 — Baixar o repositório do GitHub

O repositório é a pasta com o código e os arquivos do aplicativo. Este caminho usa o download em ZIP e **não exige instalar Git**.

1. No navegador do computador, abra o [repositório do AbrigoAção](https://github.com/matperuzza/abrigoacao-unicamp-si).
2. Na página principal do repositório, acima da lista de arquivos, clique no botão verde **Code**.
3. No menu aberto, clique em **Download ZIP**.
4. Aguarde o download do arquivo `abrigoacao-unicamp-si-main.zip`, normalmente salvo em **Downloads**.
5. Extraia o arquivo:
   - **Windows:** clique com o botão direito no ZIP, escolha **Extrair Tudo…** e depois **Extrair**.
   - **Mac:** dê dois cliques no ZIP; o sistema criará a pasta extraída.
6. Abra a pasta extraída `abrigoacao-unicamp-si-main`.
7. Confira se ela contém os arquivos **`package.json`**, **`package-lock.json`** e **`README.md`**, além das pastas **`app`** e **`features`**. Se houver outra pasta com o mesmo nome dentro dela, entre nessa pasta até encontrar esses arquivos.

**Importante:** faça os próximos passos na pasta extraída, não dentro do arquivo ZIP. Guarde a pasta para poder abrir o aplicativo novamente depois.

### Passo 4 — Abrir o terminal na pasta do projeto

O terminal é a janela em que serão digitados os comandos para instalar e iniciar o aplicativo.

**No Windows:**

1. Abra no **Explorador de Arquivos** a pasta do projeto que contém `package.json`.
2. Clique na barra de endereço da janela, onde aparece o caminho da pasta.
3. Digite `cmd` nessa barra e pressione **Enter**.
4. Uma janela do **Prompt de Comando** será aberta já na pasta do projeto.

**No Mac:**

1. Abra a pasta do projeto no **Finder**.
2. Pressione **Command + Espaço**, digite `Terminal` e pressione **Enter**.
3. Na janela do Terminal, digite `cd` seguido de um espaço, sem pressionar Enter ainda.
4. Arraste a pasta do projeto do Finder para a janela do Terminal. O caminho será preenchido automaticamente após `cd `.
5. Pressione **Enter** para entrar nessa pasta.

**Nos dois sistemas**, confira a instalação digitando um comando por vez e pressionando **Enter** após cada um:

```bash
node --version
```

O resultado deve começar com **`v24.`**.

```bash
npm --version
```

O segundo comando deve mostrar um número de versão do npm. Se aparecer que o comando não foi encontrado ou não é reconhecido, feche o terminal, confira a instalação do Node.js e abra o terminal novamente.

### Passo 5 — Instalar os componentes do aplicativo

1. No terminal aberto na pasta do projeto, digite:

   ```bash
   npm ci
   ```

2. Pressione **Enter** e aguarde. Essa etapa precisa de internet e pode levar alguns minutos.
3. Durante a instalação, o terminal exibirá mensagens. Aguarde até ele terminar e permitir digitar outro comando.
4. Se a instalação terminar com erro, anote ou fotografe a mensagem e envie ao grupo antes de continuar.

Esse comando baixa as dependências e cria a pasta `node_modules`. Não é necessário abrir ou executar individualmente os arquivos do projeto.

### Passo 6 — Iniciar o projeto e gerar o QR code

1. No mesmo terminal, digite:

   ```bash
   npm start
   ```

2. Pressione **Enter**.
3. Aguarde o Expo iniciar e mostrar um **QR code** na janela do terminal.
4. Deixe essa janela aberta. Ela mantém o projeto disponível para o celular.

### Passo 7 — Abrir o AbrigoAção no Expo Go

1. Confira se computador e celular estão conectados à **mesma rede Wi-Fi**.
2. Com o QR code visível no computador:
   - **Android:** abra o **Expo Go**, toque na opção de escanear QR code e aponte a câmera para o código.
   - **iPhone:** abra o aplicativo **Câmera**, aponte para o QR code e toque no aviso para abrir o projeto no **Expo Go**. Se o sistema pedir permissão de acesso à rede local, permita.
3. Aguarde o carregamento. Na primeira abertura, o computador também precisa preparar os arquivos do aplicativo, o que pode levar um pouco mais de tempo.
4. Quando aparecer a tela **AbrigoAção**, o aplicativo está aberto. A área pública já pode ser utilizada sem login.
5. Para acessar as funções internas, siga a [seção 2: acesso da professora](#2-como-entrar-com-o-acesso-da-professora).

O QR code é gerado ao iniciar o projeto; não há um QR code permanente neste guia. Mantenha o computador ligado, conectado à rede e com o terminal executando o Expo durante o uso.

### Passo 8 — Encerrar e abrir novamente em outro momento

1. Quando terminar, volte ao terminal do computador e pressione **Ctrl + C** para encerrar o servidor. No Mac, também é **Control + C**, não Command + C.
2. Para usar novamente, abra o terminal na mesma pasta extraída do projeto, conforme o passo 4.
3. Execute **`npm start`** e leia o novo QR code com o celular.
4. Não é necessário reinstalar o Node.js, o Expo Go ou executar `npm ci` a cada abertura. A instalação das dependências é necessária no primeiro preparo ou quando o projeto exigir atualização delas.

**Durante a apresentação com o computador do grupo:** a professora pode fazer apenas o passo 1, conectar-se à mesma rede do grupo e seguir o passo 7 com o QR code fornecido pela equipe. Os passos de preparação do computador ficam a cargo do grupo nesse caso.

## 2. Como entrar com o acesso da professora

Para consultar a apresentação, os projetos e o apoio mensal, **não é necessário entrar em uma conta**. Para explorar o playbook e os registros internos:

1. Na aba **Início**, role a página até encontrar **Área dos membros**. Esse botão também está disponível em **Sobre**.
2. Toque em **Área dos membros**.
3. No campo **Login**, digite `Betania`.
4. No campo **Senha**, digite `0000` — quatro zeros.
5. Toque em **Entrar**.
6. Confira seu nome e o perfil **Coordenação** na tela **Visão geral**.

| Perfil para experimentar | Login | Senha |
| --- | --- | --- |
| Coordenação | `Betania` | `0000` |
| Voluntário | `v-Betania` | `0000` |

Use somente o primeiro nome no login. O aplicativo aceita variações de maiúsculas/minúsculas e acentos.

Os dois perfis permitem consultar, criar e editar conteúdos do playbook e registrar transições nesta demonstração. O perfil aparece na identificação da pessoa e na autoria dos registros. Não há uma tela de administração de usuários nesta versão.

O acesso é **demonstrativo**, preparado para a atividade acadêmica; não representa autenticação segura de um sistema em produção.

## 3. Funcionalidades da área pública

### Início — conhecer a proposta

1. Abra a aba **Início**.
2. Leia a apresentação e a missão da organização fictícia.
3. Toque em **Conhecer projetos** ou em um dos projetos em destaque para consultar os detalhes.
4. Use **Apoiar mensalmente** para abrir a simulação de contribuição ou **Área dos membros** para entrar na parte interna.

### Projetos — pesquisar e consultar iniciativas

1. Abra a aba **Projetos**.
2. Consulte os cinco projetos demonstrativos.
3. No campo **Buscar**, digite parte do título, da descrição ou do objetivo de um projeto.
4. Se desejar, selecione uma situação: **Em andamento**, **Planejamento** ou **Concluído**. A busca e o filtro podem ser usados juntos.
5. Toque no projeto para ler objetivo, descrição, progresso e atualizações.
6. No detalhe, toque em **Conhecer o apoio mensal** para experimentar a contribuição simulada.

Para voltar à lista completa, apague a busca e selecione **Todas**. Os números e o progresso apresentados são fictícios.

### Apoiar — simular uma contribuição mensal

**Toda esta operação é simulada: não há cobrança, pagamento, assinatura ativa ou emissão de recibo.**

1. Abra a aba **Apoiar**.
2. Escolha um dos valores ilustrativos: **R$ 20,00**, **R$ 50,00** ou **R$ 100,00**.
3. Toque em **Visualizar resumo**.
4. Confira o valor, a periodicidade mensal e o aviso de simulação.
5. Toque em **Confirmar simulação**.
6. Consulte o **Resultado da simulação**, que reforça que nenhum pagamento foi realizado.
7. Use **Nova simulação** para experimentar outro valor ou **Voltar ao resumo** para rever o valor escolhido.

Não é necessário informar cartão ou dados bancários. O resultado representa uma intenção ilustrativa de apoio mensal, não dinheiro recebido pela instituição.

### Sobre e parceria — conhecer o contexto do trabalho

1. Abra a aba **Sobre**.
2. Consulte a apresentação acadêmica, a equipe do trabalho e os dois pilares do aplicativo.
3. Toque em **Parceria proposta com a Roque Imóveis**.
4. Leia a ideia de apoio aos projetos por meio de parte de determinadas vendas ou locações imobiliárias.

A parceria é apenas uma **proposta acadêmica**, sem acordo firmado, percentual ou condições de repasse definidos.

## 4. Funcionalidades da área dos membros

Entre com `Betania` e senha `0000` antes de seguir os passos desta seção.

### Visão geral — acompanhar informações e acessar atalhos

1. Consulte seu nome e perfil no início do painel.
2. Em **Seus projetos**, veja os projetos atribuídos à pessoa conectada. Para Betania, a mensagem **Nenhum projeto atribuído** é esperada; toque em **Ver projetos** para consultar a lista geral.
3. Em **Procedimentos recentes**, toque em um item para abrir o conteúdo do playbook.
4. Em **Transições recentes**, toque em um registro para abrir o projeto correspondente.
5. Use os atalhos **Novo conteúdo**, **Guia do voluntário** e **Playbook** para acessar essas funções.

O atalho **Registrar transição** do painel abre o formulário do primeiro projeto da lista. Para escolher um projeto específico, abra a aba **Projetos**, entre no projeto desejado e registre a transição por lá.

### Guia — conhecer os primeiros passos de um voluntário

1. Abra a aba **Guia**.
2. Leia as orientações de integração, atuação em campo e passagem de responsabilidade.
3. Use os botões para abrir as boas-vindas, o procedimento de visita a obra, a segurança no canteiro ou o encerramento de projeto.
4. Toque em **Ver todos os projetos** para conhecer as iniciativas internas.

### Playbook — consultar e pesquisar procedimentos

O playbook é o manual de conhecimento da organização: reúne orientações para que os aprendizados não se percam com a troca de voluntários.

1. Abra a aba **Playbook**.
2. Consulte os procedimentos demonstrativos.
3. Digite um termo em **Buscar**, por exemplo `visita`, para pesquisar no título e no conteúdo atual.
4. Se desejar, escolha uma categoria para refinar a busca.
5. Toque em um item para ler o texto e conferir **autor, data e número da versão**.

Para ver todos os conteúdos novamente, apague a busca e selecione **Todas**.

### Playbook — criar um novo conteúdo

1. Na aba **Playbook**, toque em **Novo conteúdo**.
2. Preencha **Título**, escolha a **Categoria** e escreva o **Conteúdo**.
3. Preencha **Resumo da alteração**, explicando brevemente o que está sendo registrado.
4. Toque em **Salvar**. O botão fica disponível quando título, conteúdo e resumo estão preenchidos.
5. Ao retornar à lista, busque pelo título e abra o registro.
6. Confira a autoria da conta conectada, por exemplo **Betania (Coordenação)**.

**Exemplo para experimentar:** título `Orientações de teste da professora`; conteúdo `Antes de uma visita, conferir os materiais e combinar as responsabilidades da equipe.`; resumo `Criação de exemplo para avaliação.` Escolha a categoria que considerar adequada.

### Playbook — editar e consultar versões anteriores

1. Abra um conteúdo e toque em **Editar**.
2. Altere o texto e preencha **Resumo da alteração**.
3. Toque em **Salvar** e abra novamente o conteúdo na lista.
4. Toque em **Histórico de versões**.
5. Confira a nova versão, com autor, data e resumo da alteração.
6. Toque em uma versão anterior para ler o conteúdo preservado.

Cada edição salva cria uma nova versão. O histórico permite consulta; não há botão para restaurar uma versão antiga nem excluir um conteúdo nesta versão do aplicativo.

### Projetos internos — consultar informações de continuidade

1. Abra a aba **Projetos** dentro da área dos membros.
2. Use a busca e os filtros de situação, se desejar.
3. Toque no projeto que quer consultar.
4. Leia objetivo, descrição, progresso, atualizações, responsável, aprendizados e pendências.
5. Consulte o **Registro de transição (contexto inicial)** e o histórico de transições, quando houver.

Essas informações ajudam um novo integrante a entender o que já aconteceu e o que precisa ser feito. Os projetos são exemplos predefinidos; não há formulário de criação ou edição de projetos nesta versão.

### Registrar transição — documentar a passagem de responsabilidade

1. Na aba interna **Projetos**, abra o projeto desejado.
2. Toque em **Registrar transição**.
3. Confira o projeto e o autor do registro, preenchidos pelo aplicativo.
4. Informe o **Novo responsável (demonstrativo)**.
5. Preencha **Pendências**, **Aprendizados** ou ambos. É obrigatório informar o responsável e ao menos um desses dois campos.
6. Toque em **Salvar**.
7. No detalhe do projeto, consulte o histórico: o registro mais novo aparece primeiro, identificado como **Mais recente**, com autor, responsável e data/hora.

**Exemplo para experimentar:** responsável `Equipe de demonstração`; pendência `Conferir a lista de materiais antes da próxima visita.`; aprendizado `Confirmar a disponibilidade dos voluntários com antecedência.`

O responsável informado e o autor são informações distintas. O registro documenta a passagem de responsabilidade; não altera automaticamente o responsável predefinido do projeto. As transições salvas podem ser consultadas, mas não editadas ou excluídas pela interface atual.

### Sair, trocar de perfil e conferir o que foi salvo

1. Na aba **Visão geral**, toque em **Sair da conta**.
2. Entre novamente com `v-Betania` e senha `0000` para experimentar o perfil **Voluntário**.
3. Abra o conteúdo criado anteriormente e consulte o histórico. A autoria anterior permanece identificada.
4. Se editar com o novo perfil, a próxima versão será atribuída a **Betania (Voluntário)**.
5. Para conferir a persistência, feche o aplicativo, reabra o projeto no Expo Go e entre novamente. Consulte o conteúdo e a transição salvos no mesmo aparelho.

O botão **Voltar à área pública** permite retomar a apresentação. Para encerrar a sessão ou trocar de perfil, use **Sair da conta**. O login precisa ser feito novamente após reiniciar o aplicativo; os conteúdos e as transições salvos ficam no armazenamento local.

## 5. Sequência sugerida para avaliação

| Etapa | O que experimentar | O que observar |
| --- | --- | --- |
| 1 | Abrir Início, Sobre e a proposta de parceria | Contexto acadêmico, equipe e dois pilares |
| 2 | Buscar e abrir um projeto público | Organização das informações e filtros |
| 3 | Simular apoio mensal até o resultado | Valor escolhido e avisos de ausência de cobrança |
| 4 | Entrar como `Betania` / `0000` | Identificação nominal e painel interno |
| 5 | Abrir Guia e consultar um procedimento | Apoio à integração de voluntários |
| 6 | Criar e depois editar um conteúdo de teste | Autoria e criação de nova versão |
| 7 | Abrir uma versão anterior no histórico | Preservação do conhecimento anterior |
| 8 | Registrar transição em um projeto | Responsável, pendências, aprendizados e histórico |
| 9 | Sair e entrar como `v-Betania` | Troca de perfil e preservação da autoria anterior |
| 10 | Fechar, reabrir e consultar os registros no mesmo aparelho | Persistência local dos dados salvos |

## 6. Dúvidas e dificuldades comuns

| Situação | Como proceder |
| --- | --- |
| O QR code não abre o projeto | Confira se computador e celular estão na mesma rede, se o terminal continua executando o Expo e se o Expo Go é compatível com SDK 58. Peça ajuda ao grupo se a rede bloquear a conexão. |
| Não encontro o botão Code para baixar | Abra a página principal do repositório pelo link do passo 3; o botão fica acima da lista de arquivos. |
| O terminal informa que não encontrou package.json ou package-lock.json | Confira se extraiu o ZIP e abriu o terminal na pasta que contém esses arquivos, conforme os passos 3 e 4. |
| node ou npm não é reconhecido | Instale o Node.js 24 e depois feche e reabra o terminal. |
| A instalação com npm ci terminou com erro | Confira a conexão com a internet e envie a mensagem ao grupo. Aguarde a instalação terminar com sucesso antes de executar npm start. |
| O login não é aceito | Use `Betania` ou `v-Betania`, sem sobrenome, e senha `0000` com quatro zeros. |
| Não encontro Área dos membros | Role a aba Início até o final ou procure o botão na aba Sobre. |
| A busca não mostra resultados | Apague o termo e selecione Todas; depois tente novamente com uma palavra do conteúdo. |
| Salvar está desabilitado no playbook | Preencha título, conteúdo e resumo da alteração. |
| O registro de transição não salva por validação | Informe o novo responsável e pelo menos pendências ou aprendizados. |
| Apareceu Não foi possível carregar | Toque em Tentar novamente. Se persistir, informe o grupo e a tela em que ocorreu. |
| Apareceu Falha ao salvar | O formulário mantém o texto digitado; tente salvar novamente antes de sair da tela. |
| Quero sair de um formulário sem salvar | Use Cancelar ou voltar. Se aparecer confirmação de descarte, confirme apenas se quiser perder o rascunho. |
| Não vejo no meu celular algo salvo pelo grupo | Os dados são locais: um aparelho não recebe alterações feitas em outro. |

## 7. O que considerar nesta versão

- A ONG, os projetos, os números e os registros de exemplo são **fictícios**. O aplicativo não é um sistema oficial da Teto Brasil.
- As contribuições são **simulações**, sem movimentação financeira.
- O login é demonstrativo; não há autenticação real nem colaboração por servidor.
- Conteúdos e transições salvos permanecem **somente no aparelho utilizado**, inclusive ao trocar de conta. Desinstalar ou limpar os dados do aplicativo pode remover esses registros.
- Rascunhos não salvos e a confirmação da simulação não têm a mesma persistência dos conteúdos salvos.
- Este guia foi conferido com o código atual. A validação manual completa em dispositivo e o aceite final permanecem pendentes, conforme o [estado do projeto](../../README.md#estado-do-projeto).

Para informações técnicas e verificações registradas, consulte o [README](../../README.md). O [roteiro técnico de demonstração](roteiro-demonstracao.md) reúne os cenários detalhados de revisão.
