---
name: proposta-comercial
description: >
  Gera uma proposta comercial profissional em HTML a partir de um briefing em texto livre.
  Aplica a identidade visual da marca do usuário (cores, fontes do design-guide.md).
  Use quando o usuário mencionar "proposta", "proposta comercial", "orçamento",
  "apresentação de projeto" ou pedir um documento de venda para um cliente.
---

# /proposta-comercial — Geração de Proposta

## Dependências

- **Identidade visual:** `marca/design-guide.md`
- **Contexto do negócio:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`

---

## Workflow

### Passo 1 — Coletar o briefing

Se o usuário ainda não forneceu um briefing completo, perguntar:

1. "Nome do cliente e empresa?"
2. "Qual é o problema ou necessidade do cliente?"
3. "O que você propõe fazer? (serviço ou produto)"
4. "Qual é o valor? (pode ser range ou 'a definir')"
5. "Tem prazo ou entregável específico?"

Se o usuário já forneceu as informações de forma livre, extrai o que der e prossegue sem fazer todas as perguntas.

### Passo 2 — Ler os arquivos de contexto

- Ler `marca/design-guide.md` pra aplicar cores e fontes
- Ler `_contexto/empresa.md` pra dados do prestador (nome, serviços, contato)
- Ler `_contexto/preferencias.md` pra tom da proposta

### Passo 3 — Gerar o HTML

Criar um arquivo HTML completo com as seguintes seções:

**Estrutura da proposta:**
1. Header — logo/nome da empresa prestadora + data. Se o design guide tiver logo definido na seção **Logo**, usar a imagem (largura 140-180px). Escolher a versão correta (fundo claro ou escuro) conforme o estilo da proposta. Se não tiver logo, usar o nome da empresa em texto
2. Destinatário — "Proposta para [Cliente]"
3. O problema — o desafio que o cliente enfrenta (em 2-3 parágrafos, na perspectiva do cliente)
4. A solução — o que você propõe e por que resolve
5. Escopo — o que está incluído (lista clara)
6. O que NÃO está incluído (quando relevante — evita conflito depois)
7. Prazo e entregáveis
8. Investimento — valor com contexto de ROI quando possível
9. Próximos passos — call to action claro
10. Sobre a empresa — 3-4 linhas sobre quem entrega

**Estilo visual:**
- Aplicar cores e fontes do `marca/design-guide.md`
- Se design guide estiver vazio, usar: fundo branco, texto escuro, acento em azul escuro (#1E3A5F), tipografia limpa
- Layout de uma coluna, responsivo, leve
- Seções com espaçamento generoso
- Valor em destaque visual (não escondido)

### Passo 4 — Salvar e oferecer publicação

Salvar em `propostas/proposta-[nome-cliente]-[data].html`

Perguntar: "Quer que eu publique essa proposta com um link compartilhável? É só chamar `/publicar-site` passando o arquivo."

---

## Regras

- Tom da proposta segue `_contexto/preferencias.md`
- Nunca inventar valor, prazo ou escopo — se não foi fornecido, deixar placeholder claro pra preencher
- A proposta deve soar como veio de uma pessoa, não de um template corporativo
- Sem jargão desnecessário ("soluções inovadoras", "entregamos valor", etc)
