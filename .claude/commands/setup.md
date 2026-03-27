---
name: setup
description: >
  Configura o Claude Code OS pro seu negócio. Faz perguntas sobre quem você é,
  o que faz e como trabalha, e gera CLAUDE.md, memória, estrutura de pastas e
  lista de MCPs personalizados pro seu perfil.
  Use quando o usuário chamar /setup, quando _contexto/empresa.md estiver vazio
  ou ausente, ou quando disser "configurar o sistema", "primeira vez", "setup".
---

# /setup — Configuração do Sistema

## Verificação inicial

Antes de qualquer coisa, verifique se `_contexto/empresa.md` existe e tem conteúdo real (não apenas o template).

- Se **não existe ou está vazio**: inicia o fluxo de onboarding abaixo.
- Se **já tem conteúdo**: informa ao usuário que o setup já foi feito e pergunta se quer refazer ou apenas atualizar alguma parte.

---

## Onboarding (primeira vez)

Comece com uma mensagem curta de boas-vindas:

> "Boa. Vou te fazer algumas perguntas pra configurar o sistema pro seu negócio. Responde com calma — quanto mais específico, melhor o sistema vai trabalhar pra ti."

Faça as perguntas em sequência, uma por vez, em conversa natural. Não liste todas de uma vez. Espere a resposta de cada uma antes de ir pra próxima.

### Pergunta 1
"Qual é o seu nome e o nome do seu negócio?"

### Pergunta 2 — Verificação de histórico

"Você já usa o Claude Code há algum tempo, ou é a primeira vez?"

**Se já usa há algum tempo:** perguntar:

> "Quer que eu tente carregar o que você já tem configurado em outros projetos, ou prefere configurar do zero aqui?"

- **Se quiser carregar:** executar o bloco **"Carregamento de contexto existente"** abaixo antes de continuar.
- **Se preferir do zero:** continua normalmente pra Pergunta 3.

**Se for a primeira vez:** perguntar:

> "Você usa outro assistente de IA com frequência — ChatGPT, Claude na web, Gemini? Se sim, consigo pegar o contexto de lá pra não precisar responder tudo do zero."

- **Se não usa outro assistente:** continua normalmente pra Pergunta 3.
- **Se usa:** executar o bloco **"Importação de contexto de outro assistente"** abaixo antes de continuar.

---

#### Bloco: Carregamento de contexto existente (Claude Code anterior)

Tentar ler, nessa ordem:
1. `~/.claude/CLAUDE.md` — CLAUDE.md global (se existir)
2. Arquivos de memória em `~/.claude/projects/` — procurar por arquivos relevantes (empresa, preferências, contexto)

Com o que encontrar, montar um resumo e apresentar ao usuário:

> "Encontrei isso no que você já tem configurado:
>
> - **Nome / negócio:** [extraído]
> - **O que faz:** [extraído]
> - **Tom de voz:** [extraído]
> - **Ferramentas:** [extraído]
> - *(... outras informações encontradas)*
>
> Está correto? Quer ajustar alguma coisa ou completar o que faltou?"

Aguardar confirmação ou correções do usuário. Após confirmar, **pular as perguntas já respondidas** e continuar apenas com o que ficou em aberto (identidade visual, equipe, etc.).

Se não encontrar nada relevante, informar:

> "Não encontrei contexto salvo de outros projetos. Vamos configurar do zero — leva poucos minutos."

E continuar normalmente pra Pergunta 3.

---

#### Bloco: Importação de contexto de outro assistente (ChatGPT, Claude web, Gemini, etc.)

Mostrar ao usuário o seguinte prompt pra copiar e colar no assistente que ele usa:

---

> **Copia esse prompt e cola no seu assistente de IA:**
>
> ```
> Preciso exportar o contexto do meu negócio das nossas conversas para configurar uma nova ferramenta. Por favor, responda com o que sabe sobre mim nas seguintes categorias — se não souber algo, deixe em branco:
>
> NOME: [seu nome completo]
> NEGÓCIO: [nome do negócio ou projeto]
> O QUE FAZ: [descrição do que você faz e pra quem, em 1-2 frases]
> PRINCIPAIS ATIVIDADES: [o que você mais produz ou faz no dia a dia]
> CLIENTES: [atende clientes externos, uso interno, ou os dois]
> EQUIPE: [trabalha solo ou tem equipe — quem são]
> FERRAMENTAS: [ferramentas que você usa com frequência no trabalho]
> IDENTIDADE VISUAL: [cores, fontes, estilo da marca — se mencionou alguma vez]
> TOM DE VOZ: [como você prefere escrever e se comunicar]
> O QUE EVITAR: [o que te incomoda em textos ou respostas de IA]
> OUTROS DETALHES: [qualquer outro contexto relevante sobre você ou seu negócio]
> ```

---

Após mostrar o prompt, dizer:

> "Cola isso no [nome do assistente que o usuário mencionou] e traz a resposta aqui."

Aguardar o usuário colar a resposta. Com o que vier:

1. Extrair todas as informações da resposta
2. Montar um resumo e apresentar pro usuário confirmar:

> "Com base no que você trouxe, aqui está o que vou usar pra configurar:
>
> - **Nome / negócio:** [extraído]
> - **O que faz:** [extraído]
> - **Tom de voz:** [extraído]
> - **Ferramentas:** [extraído]
> - *(... demais campos preenchidos)*
>
> Está correto? Tem algo pra corrigir ou adicionar?"

3. Aguardar confirmação ou ajustes
4. **Pular as perguntas já respondidas** e continuar apenas com o que ficou em branco ou incerto (tipicamente: identidade visual, se não foi mencionada)

---

### Pergunta 3
"O que você mais produz no dia a dia? Pode ser mais de uma coisa."

*(Exemplos: conteúdo pra redes sociais, propostas comerciais, relatórios, código, emails pra clientes, apresentações, combinação de tudo)*

### Pergunta 4
"Você atende clientes externos ou usa o sistema principalmente pro seu próprio negócio?"

*(Ou os dois — pode responder livremente)*

### Pergunta 4.5 — Foco atual

"E qual é o seu principal foco agora? O que você tá tentando fazer ou resolver nos próximos meses?"

*(Pode ser um lançamento, crescer um canal, fechar mais clientes, organizar a operação, aprender uma ferramenta — qualquer coisa que esteja na cabeça)*

### Pergunta 5
"Quais ferramentas você usa hoje no trabalho? Cita as principais."

*(Exemplos: Notion, Google Drive, Canva, Gmail, Meta Ads, Google Ads, Figma, Slack, WhatsApp Business — qualquer uma que use com frequência)*

### Pergunta 6 — Identidade visual

"Sua marca tem identidade visual? Se sim, como prefere compartilhar?"

Apresentar as opções de forma natural, não como lista formal:

> "Pode me mandar o link do seu site, jogar alguns prints na pasta `dados/` e me dizer o nome dos arquivos, descrever em texto mesmo (cores, estilo, fontes), ou dizer que ainda não tem definido. Qualquer uma dessas funciona."

**Se compartilhar URL:**
- Buscar o conteúdo do site com WebFetch
- Analisar: cores dominantes, tipografia aparente, estilo geral (clean/bold/editorial/etc), tom visual
- Apresentar o que foi detectado antes de preencher o design-guide:
  > "Vi no seu site: fundo [cor], destaque em [cor], tipografia sem serifa, estilo [adjetivo]. Bate com a sua marca?"
- Ajustar conforme feedback e preencher `marca/design-guide.md`

**Se compartilhar imagens (prints de Instagram, logo, etc.):**
- Pedir pro usuário colocar os arquivos na pasta `dados/` e informar os nomes
- Ler os arquivos como imagem
- Analisar cores, estilo, padrões visuais
- Apresentar o que foi detectado antes de preencher, igual ao fluxo de URL

**Se descrever em texto:**
- Usar a descrição diretamente pra preencher `marca/design-guide.md`

**Se ainda não tiver definido:**
- Preencher o `marca/design-guide.md` com campos em branco e orientações pra preencher depois
- Mencionar brevemente: "Sem problema — você preenche quando tiver. O Claude vai usar um visual neutro até lá."

### Pergunta 7
"Como você prefere que o Claude escreva? O que mais incomoda em textos gerados por IA?"

*(Exemplos: "direto, sem enrolação, sem bullet points desnecessários" / "odeio travessão e 'mergulhe de cabeça'" / "pode ser mais informal, falo gíria com clientes")*

### Pergunta 8
"Tem equipe ou é você que toca tudo?"

*(Pode mencionar parceiros, freelas, sócios se tiver)*

---

## Processamento das respostas

Com todas as respostas, detecte o perfil principal:

**Perfis possíveis:**
- `agencia` — atende múltiplos clientes, tem processos de entrega
- `freelancer` — trabalha solo, atende clientes, vende serviço próprio
- `solopreneur` — negócio próprio sem foco em clientes, mais em audiência/produto
- `criador` — foco em conteúdo, canal, audiência
- `empresa` — pequena/média empresa com equipe organizada por setores (marketing, comercial, RH, etc.)
- `profissional-clt` — usa pra produtividade pessoal e carreira

*(Um perfil pode ter características de outro — use o que melhor descreve o uso principal)*

---

## O que gerar

### 1. Atualizar `CLAUDE.md` na raiz

Substitua o conteúdo placeholder pelo CLAUDE.md real do usuário:

```markdown
# [Nome do Negócio] — Claude Code OS

## O que é esse workspace
[uma ou duas frases descrevendo o que essa pasta representa pro negócio do usuário]

**Estrutura de pastas:**
[lista das pastas criadas e o que vai em cada uma — gerada conforme o perfil detectado]
- `templates/skills/` — templates de skills prontos pra personalizar com /mapear
- `templates/ferramentas/catalogo.md` — APIs e ferramentas disponíveis pra usar em skills

## Sobre o negócio
[descrição em 2-4 linhas com o que foi dito]

## O que mais fazemos aqui
[lista das principais atividades/entregas]

## Clientes e contexto
[atende clientes ou uso interno, tamanho, tipo]

## Tom de voz
[como escrever, o que evitar, exemplos se mencionou]

## Ferramentas conectadas
[lista das ferramentas que usa — atualizar conforme MCPs forem instalados]

---

## Contexto do negócio

No início de toda conversa, ler os seguintes arquivos (se existirem e estiverem configurados):

1. `_contexto/empresa.md` — quem é o usuário, o que faz, como funciona o negócio
2. `_contexto/preferencias.md` — tom de voz, estilo de escrita, o que evitar
3. `_contexto/estrategia.md` — foco atual, prioridades, o que pode esperar

Usar essas informações como base pra qualquer resposta ou decisão. Ao sugerir prioridades, formatos ou abordagens, considerar o foco atual descrito em `estrategia.md`.

Para qualquer tarefa visual (carrossel, proposta, slide, landing page), consultar `marca/design-guide.md` como referência de estilo.

Não é necessário listar o que foi lido nem confirmar a leitura. Apenas usar o contexto naturalmente.

---

## Fluxo de trabalho

Antes de executar qualquer tarefa, verificar se existe uma skill relevante em `.claude/skills/` ou `.claude/commands/`.
Se encontrar, seguir as instruções da skill.
Se não encontrar, executar a tarefa normalmente.

Ao concluir uma tarefa que não tinha skill mas parece repetível (o usuário provavelmente vai pedir de novo no futuro), perguntar:

> "Isso pode virar uma skill pra próxima vez. Quer que eu crie?"

Não perguntar pra tarefas pontuais ou perguntas simples. Só quando o padrão de repetição for claro.

---

## Aprender com correções

Quando o usuário corrigir algo, melhorar uma resposta ou dar uma instrução que parece permanente (frases como "na verdade é assim", "não faça mais isso", "prefiro assim", "sempre que...", "evita...", "da próxima vez..."), perguntar:

> "Quer que eu salve isso pra não precisar repetir?"

Se sim, identificar onde faz mais sentido salvar:

- **Sobre o negócio** (quem são os clientes, como funciona a empresa, serviços, mercado) → adicionar em `_contexto/empresa.md`
- **Sobre preferências e estilo** (tom de voz, formato de resposta, o que evitar, como estruturar textos) → adicionar em `_contexto/preferencias.md`
- **Sobre prioridades e foco atual** (projetos em andamento, metas do momento, prazos importantes, o que é prioridade agora) → adicionar em `_contexto/estrategia.md`
- **Regra de comportamento nessa pasta** (onde salvar arquivos, como nomear, fluxos específicos) → adicionar no próprio `CLAUDE.md`

Salvar com uma linha nova clara, sem reformatar o arquivo inteiro. Confirmar o que foi salvo mostrando a linha adicionada.

Não perguntar se a correção for óbvia de contexto imediato (ex: "na verdade o arquivo se chama X"). Só perguntar quando a informação tiver valor duradouro.

---

## Criação de skills

Quando o usuário pedir pra criar uma nova skill:

1. Verificar se existe um template relevante em `templates/skills/`. Se existir, usar como base e adaptar pro contexto do usuário
2. Perguntar: "Essa skill é específica pra esse projeto ou vai ser útil em qualquer projeto?"
   - Específica desse negócio → salvar em `.claude/skills/nome-da-skill/SKILL.md` (local)
   - Útil em qualquer projeto → salvar em `~/.claude/skills/nome-da-skill/SKILL.md` (global)
3. Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar o conteúdo da skill ao contexto do negócio
4. Se a skill precisar de arquivos de apoio (templates, referências, exemplos), criar dentro da pasta da skill
5. Seguir o fluxo da skill-creator nativa do Claude Code
```

### 2. Criar `_contexto/empresa.md`

```markdown
# Contexto da Empresa — [Nome]

**Nome:** [nome do usuário]
**Negócio:** [nome do negócio]
**O que faz:** [descrição]
**Perfil:** [agencia / freelancer / solopreneur / criador / profissional-clt]
**Atende clientes:** [sim/não/ambos]
**Equipe:** [solo / com equipe — detalhe se mencionou]
**Ferramentas:** [lista]
**Principais entregas:** [lista do que mais produz]

## Contexto adicional
[qualquer informação relevante que surgiu nas respostas]
```

### 3. Criar `_contexto/estrategia.md`

```markdown
# Foco Atual — [Nome]

## Fase
[Em que fase do negócio o usuário está agora — lançamento, crescimento, organização, etc]

## Prioridade principal
[O que foi dito como foco principal agora]

## O que pode esperar
[O que não é prioridade no momento — ajuda o Claude a não sugerir fora de hora]

## Contexto com prazo
[Datas ou eventos relevantes mencionados, se houver]

---
*Atualize esse arquivo quando suas prioridades mudarem.*
```

### 4. Criar `_contexto/preferencias.md`

```markdown
# Preferências de Comunicação

## Tom de voz
[como o Claude deve escrever pros outputs desse usuário]

## O que evitar
[lista do que incomoda, palavras proibidas, construções a evitar]

## Estilo geral
[formal/informal, curto/longo, com/sem bullet points, etc]

## Preferências adicionais
[qualquer outra preferência mencionada]
```

### 5. Pré-preencher `marca/design-guide.md`

Se o usuário descreveu cores e estilo, preencha com o que foi dito.
Se não tem identidade definida, preencha com campos em branco e um comentário orientando como preencher depois.

Em ambos os casos, manter este aviso no topo do arquivo (logo abaixo do título):

```
> Você pode editar esse arquivo a qualquer momento.
> As skills de carrossel, proposta e slide leem este arquivo antes de criar qualquer visual.
```

### 6. Escolher estrutura de pastas

Antes de criar qualquer pasta, **mostrar ao usuário o que você pensou** e deixar ele ajustar.

Ler os templates de perfil disponíveis em `templates/perfis/` pra saber quais opções existem. Depois apresentar:

> "Com base no que você me contou, acho que a estrutura de **[perfil detectado]** faz mais sentido pra você. Ficaria assim:
>
> ```
> [lista de pastas do perfil detectado]
> ```
>
> Mas também tenho outros modelos se preferir:
> - **Por cliente** (agência/freelancer) — uma pasta por cliente com briefing e proposta
> - **Por tipo de conteúdo** (solopreneur/criador) — organizado por o que você produz
> - **Por setor** (empresa) — uma pasta por área (marketing, comercial, financeiro, RH)
> - **Por projeto** (profissional) — organizado por projetos e reuniões
>
> Quer usar esse que sugeri, trocar por outro, ou montar uma estrutura personalizada?"

**Se aceitar a sugestão:** criar as pastas do perfil detectado.

**Se quiser outro template:** mostrar a estrutura daquele template e confirmar.

**Se quiser personalizar:** perguntar quais pastas faz sentido ter e criar conforme ele descrever.

Estruturas padrão por perfil (referência):

**Agência / freelancer:**
```
clientes/
  _modelo-cliente/
    briefing.md
    proposta.html
briefings/
propostas/
conteudo/
tarefas.md
```

**Solopreneur / criador:**
```
conteudo/
  carrosseis/
  newsletters/
  roteiros/
projetos/
estudos/
publicacoes/
tarefas.md
```

**Empresa (por setor):**
```
marketing/
comercial/
  propostas/
financeiro/
  relatorios/
rh/
operacoes/
projetos/
dados/
tarefas.md
```

**Profissional / carreira:**
```
trabalho/
  projetos/
  reunioes/
anotacoes/
curriculo/
tarefas.md
```

### 7. Recomendar MCPs e ferramentas

Ler `templates/ferramentas/catalogo.md` e cruzar com as ferramentas que o usuário citou na Pergunta 5.

Para cada ferramenta que o usuário usa e que tem um MCP ou conector disponível no catálogo:
- Mostrar o que o conector faz
- Mostrar o comando de instalação
- Perguntar se quer instalar agora

Exemplo:

> "Vi que você usa Notion. Tem um conector que deixa o Claude acessar suas páginas e bases direto. Quer que eu instale?"

Se o usuário aceitar, rodar o comando de instalação do MCP.
Se preferir depois, anotar em `tarefas.md`:

```
## MCPs pra instalar depois
- [ ] Notion — `claude mcp add notion -- npx -y @notionhq/notion-mcp-server`
```

Se o usuário mencionar uma ferramenta que não está no catálogo, informar:

> "Não tenho um conector pronto pra [ferramenta], mas você pode pesquisar se existe um MCP pra ela em mcp.so. Se encontrar, me passa que eu instalo."

---

## Mensagem final

Após gerar todos os arquivos, envie uma mensagem de encerramento:

> "[Nome], seu sistema tá configurado.
>
> Aqui está o que foi criado:
> - CLAUDE.md — o Claude agora sabe quem você é, como trabalha e onde fica cada coisa
> - _contexto/ — negócio, preferências e foco atual salvos
> - marca/design-guide.md — identidade visual [preenchida / pronta pra preencher]
> - Estrutura de pastas pro seu perfil de [perfil detectado]
> - [N] MCPs instalados / [N] anotados pra instalar depois
>
> **Duas coisas importantes antes de continuar:**
>
> 1. Se você tiver chaves de API (como a da Anthropic), guarde sempre num arquivo chamado `.env` — ele já está protegido e nunca vai ser enviado pro GitHub por engano.
>
> 2. Para não perder seu trabalho, conecte esse workspace ao GitHub rodando `/syncar`. Leva 2 minutos e depois o sistema salva automaticamente.
>
> **Próximo passo:** rode `/mapear` pra eu entender seus processos do dia a dia e criar skills personalizadas pra você."

---

## Regras

- Tom direto e humano, sem excesso de entusiasmo
- Não use listas com bullet points nas perguntas — faça em conversa
- Se o usuário der respostas vagas, faz uma pergunta de acompanhamento antes de continuar
- Gera os arquivos todos de uma vez no final, não um a um durante as perguntas
- Após gerar, mostra a mensagem final resumida — não lista cada linha de cada arquivo
