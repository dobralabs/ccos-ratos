---
name: slide
description: >
  Cria um slide ou card visual em HTML pra usar em apresentações, decks ou posts.
  Aplica a identidade visual do usuário (marca/design-guide.md).
  Use quando o usuário pedir "faz um slide", "cria um card", "quero um visual pra apresentação",
  "frame pra deck", ou pedir um slide sobre algum tema específico.
---

# /slide — Criação de Slide ou Card Visual

## Dependências

- **Identidade visual:** `marca/design-guide.md`

---

## Workflow

### Passo 1 — Entender o que o usuário quer

Se não estiver claro, perguntar:
1. "Qual é o tema ou conteúdo do slide?"
2. "Qual é o formato? (card quadrado 1:1, slide wide 16:9, story vertical 9:16)"
3. "É um slide de dados/estatística, texto/insight, diagrama/fluxo, ou visual/imagem?"

### Passo 2 — Ler o design guide

Ler `marca/design-guide.md` pra aplicar as cores e fontes corretas.
Se estiver vazio, usar padrão: fundo escuro, acento amarelo, Bricolage Grotesque.

### Passo 3 — Gerar o HTML

Criar um arquivo HTML único, com dimensões específicas pro formato pedido:
- Card 1:1: 1080x1080px
- Slide 16:9: 1920x1080px
- Story 9:16: 1080x1920px

**Tipos de layout por conteúdo:**

*Dado/estatística:*
- Número em destaque grande (80-120px)
- Label descritivo pequeno abaixo
- Fundo de cor sólida ou gradiente sutil

*Texto/insight:*
- Título em serif italic grande
- Corpo em sans-serif, até 3 frases
- Elemento gráfico de destaque (linha, box, destaque de cor)

*Diagrama/fluxo:*
- Usar CSS para criar caixas, setas e conexões
- Layout horizontal ou vertical conforme o conteúdo

### Passo 4 — Salvar

Salvar em `conteudo/slides/slide-[tema]-[data].html`

Renderizar com Playwright se disponível e mostrar o resultado.

---

## Regras

- Um slide por vez — se o usuário quer vários, criar um de cada vez e confirmar antes do próximo
- Inline CSS, sem dependências externas além do Google Fonts
- O slide deve funcionar como screenshot — tudo visível dentro da área, sem scroll
- Se o design guide tiver logo definido na seção **Logo**, pode incluir no slide quando fizer sentido (ex: canto inferior, assinatura). Escolher a versão correta conforme o fundo do slide
