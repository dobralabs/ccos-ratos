---
name: carrossel
description: >
  Cria carrosséis completos para Instagram e TikTok com a identidade visual do usuário.
  Gera o texto dos slides, cria os HTMLs estilizados com a marca do usuário, renderiza
  em PNG via Playwright e pergunta se quer versão TikTok.
  Use quando o usuário mencionar "carrossel", "carousel", "slides instagram",
  "slides tiktok", "faz um carrossel", ou pedir pra transformar um tema em carrossel.
---

# /carrossel — Criação de Carrossel

## Dependências

- **Identidade visual:** `marca/design-guide.md` — LER ANTES de criar qualquer HTML
- **Contexto do negócio:** `_contexto/empresa.md`
- **Tom de voz:** `_contexto/preferencias.md`
- **Playwright CLI:** `npx playwright screenshot` para renderizar HTMLs em PNG. Se nunca usou, rodar uma vez: `npx playwright install chromium`

## Input

O usuário fornece:
- Tema, ideia, texto livre, link ou arquivo de referência
- Número do episódio ou série (se aplicável)
- Foto pra capa (opcional — se não fornecer, cria capa sem foto)

---

## Workflow em 3 Fases

### Fase 1 — Texto

1. Ler `_contexto/preferencias.md` pra calibrar o tom de voz
2. Ler `_contexto/empresa.md` pra entender o contexto e o público
3. Se o input for um link, usar WebFetch pra buscar o conteúdo
4. Definir o ângulo do carrossel: educacional, oportunidade, contrário, provocativo ou inspiracional
5. Escrever 8-10 slides seguindo o fluxo:
   - **Slide 1 (Capa):** 3 opções de título (max 8 palavras cada) + subtítulo — o usuário escolhe antes de continuar
   - **Slides 2-3 (Contexto):** o que é / por que importa
   - **Slides 4-7 (Desenvolvimento):** um insight por slide, opinião clara
   - **Slide 8-9 (Implicação):** "o que isso muda pra quem tá lendo?"
   - **Slide final (CTA):** chamada pra ação + menção ao canal/marca

**Tom do texto:**
- Frases longas e naturais (2-4 frases por slide), não bullet points disfarçados
- Frases curtas e picotadas ficam com cara de IA — evitar
- Manter o curiosity gap entre slides, mas dentro de cada slide o texto deve fluir
- Seguir as regras de `_contexto/preferencias.md` (sem travessões se indicado, etc)

6. Salvar o texto em `conteudo/carrosseis/[tema]/carousel-text.md`

**CHECKPOINT:** mostrar o texto completo + as 3 opções de capa. Esperar o usuário escolher a capa e aprovar o texto antes de seguir pra Fase 2.

---

### Fase 2 — Visual (HTMLs + PNGs)

1. Ler `marca/design-guide.md` pra aplicar a identidade visual
2. Se o design guide estiver vazio ou com campos em branco, avisar:
   > "Seu design-guide.md ainda não tem as cores e fontes definidas. Vou usar um layout limpo padrão agora. Pra personalizar, preenche o arquivo marca/design-guide.md e chama /carrossel de novo."
3. Criar HTMLs (1080x1350px, inline CSS, Google Fonts como única dependência externa)

**Padrão visual dos slides:**
- Fundo: cor definida no design guide (ou #0D0D0D se não definido)
- Tipografia: fontes do design guide (ou Bricolage Grotesque + Instrument Serif padrão)
- Cor de destaque: cor do design guide (ou #FFD600 padrão)
- Variação visual: não fazer todos os slides com layout idêntico — usar pelo menos 2 layouts diferentes (ex: texto simples, destaque com número grande, card com borda, citação em destaque)
- Último slide: apenas branding e CTA, sem texto longo

4. Salvar HTMLs em `conteudo/carrosseis/[tema]/instagram/`
5. Renderizar cada HTML em PNG via CLI:
   ```bash
   npx playwright screenshot --viewport-size=1080,1350 --full-page "file:///caminho/absoluto/slide-XX.html" "slide-XX.png"
   ```
   - Renderizar slide 1 primeiro e mostrar pro usuário antes de renderizar os demais

**CHECKPOINT:** mostrar slide 1 renderizado. Se aprovado, renderizar os demais.

Salvar PNGs em `conteudo/carrosseis/[tema]/instagram/`.

---

### Fase 3 — Versão TikTok (opcional)

Após finalizar o Instagram, perguntar:
> "Quer a versão TikTok também? (1080x1920, formato vertical para stories/reels)"

Se sim:
- Adaptar os HTMLs: height 1920px, ajustar padding, aumentar fonte levemente
- Renderizar via CLI:
  ```bash
  npx playwright screenshot --viewport-size=1080,1920 --full-page "file:///caminho/absoluto/slide-XX.html" "slide-XX.png"
  ```
- Salvar em `conteudo/carrosseis/[tema]/tiktok/`

---

## Output final

```
conteudo/carrosseis/[tema]/
  carousel-text.md          ← texto aprovado + legenda sugerida
  instagram/
    slide-01.html → slide-01.png
    slide-02.html → slide-02.png
    ...
  tiktok/ (se solicitado)
    slide-01.html → slide-01.png
    ...
```

## Regras

- Texto aprovado na Fase 1 não muda na Fase 2
- Sempre mostrar slide 1 antes de renderizar os demais
- Se o usuário pedir ajuste no visual, editar o HTML e re-renderizar apenas o slide alterado
- Sem travessões (—) no texto por padrão, a menos que o preferencias.md indique o contrário
