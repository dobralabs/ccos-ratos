---
name: roteiro-post
description: >
  Transforma uma ideia, texto, link ou arquivo em roteiro de post para redes sociais,
  vídeo curto, thread ou newsletter. Calibra o formato e o tom ao canal pedido.
  Use quando o usuário pedir "faz um roteiro", "transforma isso num post",
  "escreve um roteiro de vídeo", "cria uma thread", "faz uma newsletter sobre isso".
---

# /roteiro-post — Roteiro de Conteúdo

## Dependências

- **Contexto do negócio:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`

---

## Workflow

### Passo 1 — Entender o pedido

Identificar:
1. **O conteúdo fonte:** ideia, link, texto, arquivo, transcrição ou assunto livre
2. **O formato de saída:** post Instagram, vídeo curto (Reels/TikTok), thread X/LinkedIn, newsletter, roteiro de YouTube

Se não estiver claro, perguntar: "Pra qual formato é esse roteiro? (post, vídeo curto, thread, newsletter)"

Se for um link, usar WebFetch pra buscar o conteúdo.

### Passo 2 — Ler o contexto

Ler `_contexto/empresa.md` e `_contexto/preferencias.md` pra calibrar:
- Tom (informal/formal, gíria ou não, etc)
- Público (quem lê/assiste)
- Posicionamento (o que a marca defende)

### Passo 3 — Escrever o roteiro

**Post (Instagram/LinkedIn):**
- Hook nas primeiras 2 linhas (antes do "ver mais")
- Desenvolvimento em parágrafos curtos ou lista com contexto
- CTA no final (pergunta, link, salvar)
- Sugestão de hashtags (5-10)

**Vídeo curto (Reels/TikTok — até 60s):**
- 0-3s: hook visual + frase de abertura
- 4-20s: o problema ou a promessa
- 21-45s: a resposta ou o conteúdo principal
- 46-60s: conclusão + CTA
- Formato: linha a linha, com marcações de tempo aproximadas

**Thread (X ou LinkedIn):**
- Tweet/post 1: hook que para o scroll
- Tweets 2-8: um ponto por tweet, progressão lógica
- Tweet final: conclusão + CTA

**Newsletter:**
- Linha de assunto + pré-header (duas opções)
- Abertura pessoal (2-4 linhas)
- Desenvolvimento em seções curtas
- Encerramento com CTA

### Passo 4 — Salvar

Salvar em `conteudo/roteiros/roteiro-[tema]-[data].md`

---

## Regras

- Tom segue `_contexto/preferencias.md` estritamente
- Não usar fórmulas de youtuber ("ei pessoal", "não esquece de dar like")
- O roteiro deve soar como o usuário fala, não como conteúdo genérico
- Frases de transição naturais, não clichês de criador de conteúdo
