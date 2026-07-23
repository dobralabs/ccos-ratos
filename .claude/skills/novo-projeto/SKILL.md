---
name: novo-projeto
description: >
  Cria uma nova pasta de projeto com AGENTS.md personalizado (+ CLAUDE.md ponteiro). Entrevista o usuário
  sobre o projeto, gera a estrutura e referencia no AGENTS.md principal.
  Use quando o usuário chamar /novo-projeto, disser "novo cliente", "novo projeto",
  "criar pasta pro cliente X", "vou começar um projeto novo", ou quando precisar
  organizar um trabalho novo em pasta separada.
---

# /novo-projeto — Criar novo projeto com contexto

Cria uma pasta de projeto com AGENTS.md dedicado (+ CLAUDE.md ponteiro), entrevistando o usuário sobre o que é o projeto.

## Quando usar

- Novo cliente entrando
- Novo site ou app pra desenvolver
- Novo produto ou lançamento
- Qualquer trabalho que merece pasta própria e contexto separado

## Fluxo

### Passo 1: Entender o projeto

Perguntar em conversa natural (uma pergunta por vez):

**Pergunta 1:** "Qual é o nome do projeto? (pode ser nome do cliente, do produto ou do site)"

**Pergunta 2:** "Que tipo de projeto é?"
- Cliente (entrega de serviço pra alguém)
- Produto próprio (site, app, curso, loja)
- Conteúdo (canal, série, newsletter)
- Interno (processo, ferramenta, organização)

**Pergunta 3:** "Me explica em poucas palavras o que é o projeto e o que tu precisa entregar."

**Pergunta 4:** "Tem prazo, orçamento ou ferramenta específica que eu precise saber?"

Se o usuário der respostas completas logo na primeira, pular as perguntas já respondidas.

### Passo 2: Definir a pasta

Sugerir o local baseado no tipo de projeto e na estrutura atual:

- **Cliente** → `clientes/nome-do-cliente/`
- **Produto** → `projetos/nome-do-projeto/`
- **Conteúdo** → `conteudo/nome-do-projeto/`
- **Interno** → `projetos/nome-do-projeto/`

Verificar a estrutura de pastas que já existe (ler AGENTS.md principal) pra manter consistência.

Apresentar a sugestão:

> "Sugiro criar em `clientes/nome-do-cliente/`. Faz sentido ou prefere outro lugar?"

Aguardar confirmação.

### Passo 3: Criar a pasta e o AGENTS.md do projeto

Pra funcionar no Claude Code e no Codex, cada projeto segue o mesmo padrão da raiz:
o conteúdo vai num `AGENTS.md`, e um `CLAUDE.md` com uma linha só (`@AGENTS.md`) aponta pra ele.

1. Criar a pasta do projeto.
2. Gerar `<pasta>/AGENTS.md` com o conteúdo abaixo.
3. Gerar `<pasta>/CLAUDE.md` com exatamente uma linha: `@AGENTS.md`.

Conteúdo do `AGENTS.md`:

```markdown
# [Nome do Projeto]

## O que é
[descrição curta do projeto, 1-2 frases]

## Tipo
[Cliente / Produto / Conteúdo / Interno]

## Escopo
[o que precisa ser entregue, baseado nas respostas]

## Contexto
[prazo, orçamento, ferramentas, qualquer detalhe relevante]

## Arquivos importantes
- (será preenchido conforme o projeto avança)

## Regras específicas
- (será preenchido conforme o projeto avança)
```

Se for **cliente**, adicionar também:

```markdown
## Contato
[nome do contato, se mencionou]

## Entregas
- [ ] [entrega 1]
- [ ] [entrega 2]
```

### Passo 4: Atualizar o AGENTS.md principal

Ler o AGENTS.md da raiz do workspace. Encontrar a seção de **estrutura de pastas** e adicionar a nova pasta.

Exemplo:

> Adicionei `clientes/fabio-haag/` na estrutura de pastas do AGENTS.md principal.

Se a seção de estrutura não existir ou não fizer sentido editar, pular e informar:

> "Criei a pasta e o AGENTS.md do projeto. Se quiser, adiciona na estrutura de pastas do AGENTS.md principal depois."

### Passo 5: Atualizar contexto (se aplicável)

Se o projeto é um **cliente novo**, perguntar:

> "Quer que eu adicione esse cliente em `_contexto/empresa.md` também?"

Se sim, adicionar uma linha na seção de clientes do empresa.md.

### Passo 6: Confirmar

Mostrar o resumo:

```
Projeto criado!

Pasta: clientes/fabio-haag/
AGENTS.md: clientes/fabio-haag/AGENTS.md (+ CLAUDE.md apontando pra ele)
Referência: adicionado na estrutura de pastas do AGENTS.md principal

Pra trabalhar nesse projeto, é só falar. O agente já vai ler o contexto da pasta.
```

## Regras

- Tom direto, sem cerimônia
- Não criar subpastas dentro do projeto a menos que o usuário peça
- O AGENTS.md do projeto deve ser curto (menos de 30 linhas no início). Vai crescer com o uso
- Nunca mover pastas existentes sem perguntar
- Se o usuário já criou a pasta manualmente, só gerar o AGENTS.md (+ CLAUDE.md ponteiro) dentro dela
- Respeitar a estrutura de pastas que o `/setup` criou pra aquele perfil
