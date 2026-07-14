---
name: novo-projeto
description: >
  Cria uma nova pasta de projeto com CLAUDE.md personalizado. Entrevista o usuário
  sobre o projeto, gera a estrutura e referencia no CLAUDE.md principal.
  Use quando o usuário chamar /novo-projeto, disser "novo cliente", "novo projeto",
  "criar pasta pro cliente X", "vou começar um projeto novo", ou quando precisar
  organizar um trabalho novo em pasta separada.
---

# /novo-projeto — Criar novo projeto com contexto

Cria uma pasta de projeto com CLAUDE.md dedicado, entrevistando o usuário sobre o que é o projeto.

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

Verificar a estrutura de pastas que já existe (ler CLAUDE.md principal) pra manter consistência.

Apresentar a sugestão:

> "Sugiro criar em `clientes/nome-do-cliente/`. Faz sentido ou prefere outro lugar?"

Aguardar confirmação.

### Passo 3: Criar a pasta e o CLAUDE.md

Criar a pasta e gerar o CLAUDE.md do projeto:

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

### Passo 4: Atualizar o CLAUDE.md principal

Ler o CLAUDE.md da raiz do workspace. Encontrar a seção de **estrutura de pastas** e adicionar a nova pasta.

Exemplo:

> Adicionei `clientes/fabio-haag/` na estrutura de pastas do CLAUDE.md principal.

Se a seção de estrutura não existir ou não fizer sentido editar, pular e informar:

> "Criei a pasta e o CLAUDE.md do projeto. Se quiser, adiciona na estrutura de pastas do CLAUDE.md principal depois."

### Passo 5: Atualizar contexto (se aplicável)

Se o projeto é um **cliente novo**, perguntar:

> "Quer que eu adicione esse cliente em `_contexto/empresa.md` também?"

Se sim, adicionar uma linha na seção de clientes do empresa.md.

### Passo 6: Confirmar

Mostrar o resumo:

```
Projeto criado!

Pasta: clientes/fabio-haag/
CLAUDE.md: clientes/fabio-haag/CLAUDE.md
Referência: adicionado na estrutura de pastas do CLAUDE.md principal

Pra trabalhar nesse projeto, é só falar. O Claude já vai ler o contexto da pasta.
```

## Regras

- Tom direto, sem cerimônia
- Não criar subpastas dentro do projeto a menos que o usuário peça
- O CLAUDE.md do projeto deve ser curto (menos de 30 linhas no início). Vai crescer com o uso
- Nunca mover pastas existentes sem perguntar
- Se o usuário já criou a pasta manualmente, só gerar o CLAUDE.md dentro dela
- Respeitar a estrutura de pastas que o `/setup` criou pra aquele perfil
