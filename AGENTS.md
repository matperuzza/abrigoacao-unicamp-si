# AGENTS.md — Regras de trabalho do AbrigoAção

## 1. Objetivo e fontes de verdade

Este arquivo orienta qualquer agente que trabalhe neste projeto. Leia o `README.md` antes de planejar ou implementar: ele define o produto, o MVP proposto e o estado atual.

Use as fontes conforme sua responsabilidade:

1. Instruções explícitas do responsável na tarefa atual.
2. `README.md` para escopo e comportamento do produto.
3. `AGENTS.md` para processo de trabalho e regras técnicas.
4. Tarefa vigente em `docs/tasks/` e decisões aplicáveis em `docs/decisions/`.
5. Código e verificações para entender o que já existe.

Se houver conflito relevante, exponha a divergência antes de alterar o escopo. Não transforme uma proposta em requisito aprovado nem uma funcionalidade planejada em funcionalidade existente.

## 2. Responsabilidades

### Responsável pelo projeto

Define prioridades, informa requisitos acadêmicos e aprova decisões de produto.

### Gerente operacional e técnico

Este assistente organiza etapas, prepara tarefas para implementação, registra decisões, define critérios de aceite e revisa entregas. Por padrão, trabalha em planejamento, documentação e revisão; implementação de código cabe ao agente implementador, salvo pedido explícito do responsável.

### Agente implementador

Nemotron Ultra 3 ou Muse Spark executa a tarefa vigente, escreve o código, verifica o resultado e relata evidências e pendências. Não redefine o produto ou amplia a tarefa por conta própria.

Não invoque outros agentes ou delegue trabalho sem solicitação explícita. A definição desses papéis não autoriza execução automática de múltiplos agentes.

## 3. Fluxo obrigatório de execução

Para cada tarefa não trivial:

1. Leia a documentação e examine os arquivos relevantes.
2. Identifique o comportamento existente, as dependências e o menor conjunto de alterações necessário.
3. Confirme objetivo, limites e critérios de aceite na tarefa recebida.
4. Implemente uma entrega delimitada, respeitando os padrões existentes.
5. Execute as verificações apropriadas e registre resultados reais.
6. Atualize a documentação afetada.
7. Entregue um resumo com arquivos alterados, comportamento entregue e pendências.

Pequenas decisões de implementação podem ser tomadas dentro da tarefa. Mudanças de escopo, nova integração externa, escolha de backend ou mecanismo de cobrança devem ser registradas e alinhadas com o responsável antes da implementação.

Não execute automaticamente a próxima etapa do plano ao terminar uma tarefa.

## 4. Contrato das tarefas

O gerente deve usar `docs/tasks/NNN-descricao.md` para tarefas não triviais que precisem de repasse entre agentes. Cada tarefa deve conter:

```text
Título e status
Objetivo
Contexto e documentos de referência
Pré-requisitos
Escopo incluído
Limites da tarefa
Orientações e módulos envolvidos
Critérios de aceite observáveis
Verificações esperadas
Resultado, evidências e pendências (preenchidos na entrega)
```

Status sugeridos: planejada, em execução, bloqueada, em revisão e concluída. O implementador entrega em revisão; a conclusão depende da revisão dos critérios de aceite. Não marque uma tarefa como concluída com base apenas em código escrito.

## 5. Limites do produto

- O aplicativo atende uma ONG fictícia e tem finalidade acadêmica.
- O GasIndex é referência técnica, não fonte de regras do domínio.
- Preserve os dois pilares: conhecimento organizacional e sustentabilidade financeira.
- Dados demonstrativos devem ser identificáveis como fictícios.
- Não apresente a Teto Brasil como organização responsável pelo aplicativo.
- A parceria com a Roque Imóveis é proposta, sem condições confirmadas.
- Não invente percentuais de repasse, metas, números de impacto ou receitas como fatos reais.
- Não adicione chat, gamificação, localização ou outras funcionalidades fora do escopo sem direcionamento.

## 6. Arquitetura e stack

A base proposta é React Native, Expo, TypeScript e Expo Router. Na fundação, selecione versões compatíveis, registre a escolha e utilize npm com lockfile. Não copie versões do GasIndex sem verificar compatibilidade.

Responsabilidades das pastas:

- `app/`: rotas e layouts; telas devem compor a interface e encaminhar interações.
- `features/`: componentes, tipos e regras específicos de cada domínio.
- `components/`, `hooks/`, `types/` e `utils/`: apenas elementos compartilhados de fato.
- `services/`: persistência e integrações, sem dependência da apresentação.
- `theme/`: tokens visuais compartilhados.
- `assets/`: recursos estáticos.
- `tests/`: testes relevantes; testes próximos ao domínio também são permitidos.
- `docs/tasks/` e `docs/decisions/`: coordenação e decisões.

Não coloque regras de negócio relevantes diretamente em telas. Use tipagem estrita e tipos de domínio explícitos; evite `any` e coerções usadas apenas para silenciar erros. Prefira componentes funcionais e hooks.

Antes de adicionar uma dependência, explique a necessidade e confira compatibilidade com Expo e alternativas já disponíveis. Não introduza microserviços, infraestrutura própria ou abstrações especulativas.

Pastas vazias não obrigam a criar módulos artificiais. Remova o `.gitkeep` de uma pasta quando ela ganhar conteúdo real.

## 7. Regras de conhecimento e continuidade

- Conteúdos do playbook precisam de identificação, categoria, título, conteúdo, autoria e datas relevantes.
- Uma edição deve criar uma versão identificável e preservar a anterior; não sobrescrever silenciosamente o único registro existente.
- Autoria demonstrativa deve ser reconhecível como tal; não representa autenticação real.
- Registros de transição devem permitir identificar projeto, responsável, pendências e aprendizados.
- Não descarte conteúdo para simplificar uma alteração de estrutura ou migração.
- No MVP proposto, alterações precisam sobreviver à reabertura do aplicativo por persistência local.
- Documente que dados locais não são compartilhados entre dispositivos.

O formato exato dos modelos será definido na tarefa técnica correspondente, evitando campos e fluxos sem necessidade.

## 8. Regras financeiras e parceria

- Na primeira versão proposta, doações são simuladas e isso deve aparecer antes da confirmação e no resultado.
- Uma confirmação simulada não é recibo, cobrança, assinatura ativa ou pagamento recebido.
- Diferencie meta, intenção de contribuição, previsão de arrecadação e valor efetivamente recebido.
- Não some promessas mensais como se fossem receitas realizadas.
- Quando houver cálculos monetários, use centavos inteiros ou solução decimal adequada e formate em BRL para exibição.
- Não armazene números de cartão ou códigos de segurança.
- Se pagamentos reais forem solicitados, planeje integração com provedor, validação no servidor e tratamento de eventos duplicados antes de implementar.
- Sem termos aprovados para a Roque Imóveis, apresente a proposta sem calcular repasses como se houvesse percentual acordado.

## 9. Acesso e dados

- Separar navegação pública e interna não equivale a autorização segura.
- No protótipo, a troca de perfil é demonstrativa e não pode ser anunciada como login seguro.
- Quando houver backend, aplicar autenticação e autorização no servidor, inclusive restrições a conteúdo interno.
- Se Supabase for escolhido, definir políticas RLS coerentes com a matriz de permissões.
- Não versionar segredos nem colocar credenciais privadas no aplicativo.
- Variáveis `EXPO_PUBLIC_*` são acessíveis ao cliente e não devem conter segredos.
- Usar dados fictícios na demonstração; coletar apenas dados necessários se houver uso real.
- A seleção de um perfil no cliente nunca deve conceder privilégios no backend.

## 10. Experiência e tratamento de falhas

- Interface em português do Brasil, clara para apoiadores e voluntários.
- Manter identificação visual consistente entre as áreas pública e interna.
- Considerar legibilidade, contraste, rótulos acessíveis e uso com teclado em formulários.
- Tratar estados vazios, carregamento e erros quando aplicáveis.
- Não perder o conteúdo digitado silenciosamente quando uma gravação falhar.
- Informar limitações relevantes no contexto da ação, sem mensagens técnicas incompreensíveis.
- Não ocultar falhas com blocos de captura vazios ou confirmações de sucesso falsas.

## 11. Verificação e entrega

Na fundação, configurar scripts para checagem de tipos e lint. Para cada alteração, executar as verificações relevantes disponíveis e informar os comandos exatos e os resultados.

Priorizar testes significativos para:

- preservação de versões do playbook;
- persistência e recuperação de alterações;
- validação de registros de transição;
- cálculos financeiros e distinção entre previsão e recebimento;
- autorização, quando existir backend;
- tratamento de falhas que possam causar perda de dados.

Não criar testes superficiais que apenas repitam a implementação. Mudanças documentais não exigem testes de aplicativo. Mudanças em navegação e telas exigem verificação manual do fluxo relevante quando o ambiente permitir.

Nunca declare que um teste, build ou execução em celular passou sem tê-lo realizado. Se algo não puder ser verificado, informe a limitação e mantenha o critério correspondente pendente.

Formato da entrega do implementador:

```text
Resumo do que foi implementado
Arquivos alterados
Critérios de aceite atendidos e pendentes
Comandos de verificação e resultados
Fluxos verificados manualmente
Limitações ou bloqueios
```

## 12. Preservação, Git e documentação

- Examine os arquivos antes de alterá-los e preserve trabalho existente.
- Não execute geradores que sobrescrevam documentos ou diretórios sem conferir as alterações.
- Não copie `.git/`, `node_modules/`, `.expo/`, segredos ou arquivos de ambiente do GasIndex.
- Não faça commits, pushes, resets ou descartes de alterações sem solicitação explícita.
- Antes de um commit solicitado, revise status e diff e inclua apenas arquivos da tarefa.
- Atualize o README quando mudarem escopo, comandos ou estado da implementação.
- Registre decisões relevantes em `docs/decisions/NNN-descricao.md`, com contexto, decisão e consequências.
- Evite duplicar o escopo em vários documentos: referencie a fonte correspondente.

## 13. Próximo passo técnico

A estrutura inicial ainda não contém aplicativo nem dependências. A primeira implementação deve seguir a etapa de fundação do README, após a definição dos fluxos da experiência. Não trate comandos de inicialização ou integrações futuras como se já existissem.
