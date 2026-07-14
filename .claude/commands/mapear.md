---
name: mapear
description: >
  Entrevista o usuário sobre seus processos repetitivos e cria pastas e skills
  personalizadas pro dia a dia dele. Rodar depois do /setup.
  Use quando o usuário chamar /mapear, quando disser "quero organizar meus processos",
  "quero criar skills", "mapear tarefas", ou "personalizar o ambiente".
---

# /mapear — Mapeamento de Processos

## Contexto

Essa skill é o segundo passo depois do `/setup`. O setup configurou quem o usuário é. Agora vamos entender **o que ele faz no dia a dia** e criar a estrutura certa pra isso.

## Antes de começar

1. Ler `_contexto/empresa.md` pra entender o negócio
2. Ler `_contexto/estrategia.md` pra saber o foco atual
3. Ler `templates/ferramentas/catalogo.md` pra saber quais APIs, CLIs e MCPs estão disponíveis
4. Ler `templates/skills/catalogo.md` pra saber quais skills externas prontas existem
5. Listar as pastas que já existem no workspace (pra não criar duplicatas)
6. Listar os templates disponíveis em `templates/skills/` (pra saber o que já temos pronto)

## Fase 1 — Descoberta

Começar com uma pergunta aberta:

> "Me conta: quais são as coisas que você faz toda semana (ou todo mês) no seu trabalho que tomam tempo? Pode ser qualquer coisa: criar conteúdo, mandar propostas, fazer relatórios, responder clientes, montar apresentações..."

Deixar o usuário responder livremente. Depois, fazer perguntas de aprofundamento conforme necessário:

- "Esse [processo X] segue sempre o mesmo passo a passo ou muda muito?"
- "O resultado final é um arquivo? Se sim, onde você guarda hoje?"
- "Tem alguma coisa que você faz antes de começar esse processo? Tipo juntar informações, ler algo?"
- "Com que frequência você faz isso?"

O objetivo é montar uma lista clara de processos repetitivos. Pra cada um, entender:
- **O que é** (em uma frase)
- **Frequência** (diário, semanal, por demanda)
- **Se gera um entregável** (arquivo, documento, post) ou é só um processo
- **Se segue um passo a passo consistente** ou varia muito

## Fase 2 — Apresentar o mapa

Quando tiver entendido o suficiente (geralmente 3-6 processos), apresentar o mapa:

> "Beleza, identifiquei esses processos no seu dia a dia:
>
> 1. **[nome do processo]** — [frequência] — [gera entregável / é um fluxo]
> 2. **[nome do processo]** — [frequência] — [gera entregável / é um fluxo]
> 3. ...
>
> Qual você quer organizar primeiro?"

Aguardar o usuário escolher. Mapear um por vez.

## Fase 3 — Organizar cada processo

Para o processo escolhido, seguir esta lógica:

### 3.1 — Verificar se já tem algo pronto

Verificar em duas fontes, nessa ordem:

**1. Templates de skills** (`templates/skills/`) — skills editáveis que vão ser instaladas no projeto.

**2. Catálogo de skills externas** (`templates/skills/catalogo.md`) — skills globais ou nativas do Claude Code que já estão prontas.

**Se encontrar template compatível:**

> "Tenho um template pronto pra isso: [nome do template].
> Deixa eu te mostrar o que ele faz:"

Mostrar um resumo curto do fluxo do template (não o arquivo inteiro). Depois perguntar:

> "Esse fluxo faz sentido pro seu caso? Quer ajustar alguma coisa?"

Adaptar conforme o feedback antes de instalar.

**Se encontrar skill externa compatível (do catálogo):**

> "Já existe uma skill pronta pra isso: [nome]. Ela [o que faz em uma frase]. Você pode usar ela direto com `/[nome]` sem precisar criar nada. Quer testar?"

Se o usuário quiser adaptar o comportamento, criar uma skill local que complementa ou substitui a externa.

**Se não encontrar nada:**

> "Não tenho nada pronto pra isso, mas consigo criar uma skill do zero com base no que você me contou."

Seguir pra criação manual (3.3).

### 3.2 — Decidir a estrutura

Analisar as pastas que já existem no workspace e decidir:

**Se o processo gera entregáveis (arquivos):**
- Verificar se já existe uma pasta onde faz sentido guardar (ex: `conteudo/`, `propostas/`, `clientes/`)
- Se sim, usar a pasta existente. Não criar pasta nova.
- Se não, criar uma pasta nova com nome claro

**Se o processo é só um fluxo (não gera arquivo em lugar fixo):**
- Não criar pasta nova. Só a skill basta.

**Se o processo gera entregáveis E tem passo a passo:**
- Criar pasta (se necessário) + skill que aponta pra essa pasta

Antes de criar qualquer coisa, mostrar o plano:

> "Pra esse processo, vou fazer o seguinte:
>
> - [Criar pasta `conteudo/newsletters/` pra guardar os resultados] (se aplicável)
> - [Instalar a skill `/newsletter` em .claude/skills/newsletter/SKILL.md] (se aplicável)
> - [A skill vai salvar os arquivos em `conteudo/newsletters/`] (se aplicável)
>
> Bora?"

Só criar depois que o usuário confirmar.

### 3.3 — Criar a skill personalizada

Antes de criar, ler `templates/ferramentas/catalogo.md` e verificar se alguma ferramenta disponível resolve parte do fluxo que o usuário descreveu. Por exemplo:

- O processo envolve publicar em rede social? → verificar se Post for Me ou Canva MCP ajudam
- Precisa gerar imagem? → verificar Gemini ou DALL-E
- Parte de um vídeo do YouTube? → verificar yt-dlp
- Gera HTML visual? → incorporar Playwright pra renderizar em PNG
- Precisa ler conteúdo de sites? → usar WebFetch ou Jina Reader

Se encontrar ferramenta relevante, incorporar na skill e avisar o usuário:

> "Pra essa skill funcionar completa, você vai precisar configurar [ferramenta]. [Instrução curta de como configurar]. Quer que eu configure agora ou prefere fazer depois?"

A partir daqui o fluxo se divide em dois caminhos, dependendo do que aconteceu na 3.1:

#### Caminho A — Adaptar template existente

Quando a 3.1 encontrou um template compatível em `templates/skills/`, criar a skill diretamente a partir dele. Garantir:

1. O frontmatter tem `name` e `description` claros
2. A skill lê o contexto relevante (`_contexto/preferencias.md`, `marca/design-guide.md` se for visual)
3. O passo a passo reflete o que o usuário descreveu, não um fluxo genérico
4. Se gera arquivo, a skill indica onde salvar
5. O tom e formato seguem as preferências do usuário
6. Se usa ferramenta do catálogo, inclui as instruções de uso dentro da skill

#### Caminho B — Criar do zero (delegar pra skill-creator)

Quando a 3.1 não encontrou nem template nem skill externa que sirva, **invocar a skill-creator nativa do Claude Code via Skill tool** ao invés de tentar escrever a skill na mão. A skill-creator é especialista em estruturar skills com os princípios certos (concisão, degrees of freedom, anatomia correta de bundled resources).

Antes de invocar, montar um briefing completo com tudo que você já sabe da entrevista e do contexto do projeto:

- **O processo** — o que o usuário descreveu, em uma frase
- **Frequência e gatilhos** — quando ele faz isso, o que dispara
- **Passo a passo** — o fluxo que ele descreveu, sem inventar etapas
- **Entregável** — se gera arquivo, qual formato e onde salvar
- **Ferramentas relevantes** — o que do `templates/ferramentas/catalogo.md` se aplica
- **Contexto do negócio** — pontos de `_contexto/empresa.md` e `_contexto/preferencias.md` que importam (tom de voz, estilo, restrições)
- **Identidade visual** — se for skill que gera output visual, apontar pra `marca/design-guide.md`
- **Onde salvar** — `.claude/skills/nome-da-skill/SKILL.md`

Passar esse briefing pra skill-creator e deixar ela estruturar a skill. Depois que ela retornar, **revisar o resultado** antes de finalizar:

- O frontmatter ficou claro?
- O tom da skill bate com as preferências do usuário?
- A skill lê os arquivos de contexto certos no início?
- Os triggers (palavras que disparam a skill) fazem sentido pro vocabulário do usuário?

Ajustar o que precisar ajustar antes de mostrar pro usuário. Se algo crítico ficou de fora, pedir pra skill-creator complementar ou editar direto.

#### Estrutura final (vale pros dois caminhos)

Salvar em `.claude/skills/nome-da-skill/SKILL.md` (local do projeto).

Se a skill precisar de arquivos de apoio (templates HTML, referências de design, exemplos de output), criar dentro da mesma pasta:

```
.claude/skills/nome-da-skill/
  SKILL.md              ← instruções principais
  template.html         ← template de output (se aplicável)
  referencia.md         ← material de referência (se aplicável)
```

Depois de criar, confirmar:

> "Pronto, a skill `/[nome]` tá instalada. Você pode rodar ela agora se quiser testar, ou a gente segue pro próximo processo."

## Fase 4 — Continuar ou encerrar

Depois de cada processo mapeado, perguntar:

> "Quer mapear o próximo da lista?"

Se sim, voltar pra Fase 3 com o próximo processo.

Se não, salvar os processos que ainda não foram mapeados em `tarefas.md`:

```
## Processos pra mapear depois
- [ ] [processo não mapeado 1]
- [ ] [processo não mapeado 2]
```

Mensagem final:

> "[N] processos mapeados, [N] skills criadas.
> Os que ficaram pendentes estão salvos em tarefas.md. Quando quiser continuar, é só rodar /mapear de novo."

## Regras

- Tom direto, conversa natural, sem formalidade
- Uma pergunta por vez durante a entrevista. Não listar 5 perguntas de uma vez
- Sempre verificar o que já existe antes de criar pasta ou skill nova
- Sempre mostrar o plano antes de criar qualquer coisa
- Nunca criar skill que o usuário não confirmou
- Se o usuário descrever um processo vago demais, pedir mais detalhes antes de continuar
- Se o processo do usuário for muito simples (tipo "mando um email pro cliente"), sugerir que talvez não precise de skill: "Isso parece simples o bastante pra fazer direto. Quer criar uma skill mesmo assim ou seguimos pro próximo?"
