---
name: publicar-instagram
description: >
  Publica carrosséis e posts no Instagram e TikTok direto do Claude Code.
  Suporta dois métodos: Post for Me (mais simples, multi-plataforma) ou
  Graph API do Instagram (direto, sem intermediário).
  Inclui setup guiado na primeira vez pra configurar credenciais.
  Use quando o usuário mencionar "publicar", "postar no instagram", "publicar carrossel",
  "publicar no tiktok", "postar isso", ou pedir pra enviar imagens pro Instagram/TikTok.
---

# /publicar — Publicar no Instagram e TikTok

## Setup (primeira vez)

Na primeira vez, guiar o usuário pra escolher e configurar o método de publicação.

### Perguntar o método

> "Pra publicar direto do Claude Code, tu tem duas opções:
>
> **1. Post for Me** (recomendado)
> - Publica no Instagram, TikTok e LinkedIn com uma API só
> - Setup em 5 minutos, token não expira
> - Gratuito pra uso normal
> - Site: postforme.dev
>
> **2. Graph API do Instagram** (avançado)
> - Publica direto pela API oficial do Meta/Facebook
> - Só Instagram (TikTok e LinkedIn não)
> - Token expira a cada 60 dias (precisa renovar)
> - Setup mais técnico (~15 min)
> - Gratuito
>
> Qual tu prefere?"

---

### Setup Post for Me

Se escolheu Post for Me:

1. **Criar conta:**
   > "Acessa postforme.dev, cria uma conta e conecta teu Instagram (e TikTok se quiser).
   > Depois vai em Settings > API e copia a API Key. Cola aqui."

2. **Salvar a key:**
   Receber a API key e adicionar no `.env`:
   ```
   POSTFORME_API_KEY=pfm_live_xxxxx
   ```

3. **Testar conexão:**
   ```bash
   curl -s -H "Authorization: Bearer $(grep POSTFORME_API_KEY .env | cut -d= -f2)" \
     "https://app.postforme.dev/api/v1/social-accounts?platform=instagram" | head -c 200
   ```
   Se retornar conta conectada, tá pronto. Se não, guiar o usuário pra conectar a conta no dashboard.

4. **Instalar o script de publicação:**
   Copiar `scripts/publish-postforme.js` (que vem com esta skill) pra pasta `scripts/` do projeto do usuário.

5. Confirmar:
   > "Pronto! Script de publicação instalado. Tua conta tá conectada. Pra publicar, é só chamar /publicar com as imagens."

---

### Setup Graph API

Se escolheu Graph API:

1. **Guiar configuração do Meta Developer:**
   > "Vou te guiar passo a passo. Primeiro:
   > 1. Acessa developers.facebook.com e cria um app tipo 'Empresa'
   > 2. No app, ativa o produto 'Instagram Graph API'
   > 3. Vai no Graph API Explorer (developers.facebook.com/tools/explorer/)
   > 4. Seleciona teu app e gera um token com estes escopos:
   >    - instagram_content_publish
   >    - instagram_basic
   >    - pages_read_engagement
   > 5. Cola o token aqui"

2. **Converter token pra longa duração (60 dias):**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=TOKEN_CURTO"
   ```
   Pedir App ID e App Secret ao usuário.

3. **Pegar Instagram User ID:**
   ```bash
   curl -s "https://graph.facebook.com/v21.0/me/accounts?access_token=TOKEN_LONGO" | python3 -m json.tool
   ```
   Com o Page ID:
   ```bash
   curl -s "https://graph.facebook.com/v21.0/PAGE_ID?fields=instagram_business_account&access_token=TOKEN_LONGO"
   ```

4. **Configurar imgbb (host de imagens):**
   > "A Graph API precisa de URL pública pra cada imagem. O imgbb faz isso de graça:
   > 1. Acessa api.imgbb.com
   > 2. Cria conta e copia a API Key
   > 3. Cola aqui"

5. **Salvar tudo no `.env`:**
   ```
   INSTAGRAM_ACCESS_TOKEN=token_longo_aqui
   INSTAGRAM_USER_ID=id_aqui
   IMGBB_API_KEY=key_aqui
   ```

6. **Instalar o script:**
   Copiar `scripts/publish-graph-api.js` (que vem com esta skill) pra pasta `scripts/` do projeto do usuário.

7. **Avisar sobre renovação:**
   > "Importante: teu token do Instagram expira em 60 dias. Quando parar de funcionar, roda /publicar de novo que eu te guio pra renovar."

---

## Workflow de publicação (após setup)

### 1. Detectar o que publicar

Se o usuário chamou `/publicar` sem argumentos, verificar:
- Existe `conteudo/carrosseis/` com PNGs recentes? Se sim, oferecer publicar o mais recente
- Se não, perguntar: "O que tu quer publicar? Me passa o caminho das imagens ou roda /carrossel primeiro"

Se chamou com caminho (ex: `/publicar conteudo/carrosseis/ia-no-varejo/instagram/`):
- Usar os PNGs e o `carousel-text.md` (legenda) daquela pasta

### 2. Detectar o método configurado

Verificar `.env`:
- Se tem `POSTFORME_API_KEY` -> usar Post for Me
- Se tem `INSTAGRAM_ACCESS_TOKEN` -> usar Graph API
- Se tem os dois -> perguntar qual usar
- Se não tem nenhum -> rodar setup

### 3. Preview antes de publicar

Antes de qualquer publicação, mostrar preview:

> "Vou publicar no Instagram:
> - Imagens: slide-01.png, slide-02.png, ... slide-08.png
> - Legenda: [primeiros 200 chars]...
> - Método: Post for Me / Graph API
>
> Quer que eu faça um dry-run primeiro pra testar, ou manda direto?"

### 4. Dry-run (recomendado na primeira vez)

```bash
# Post for Me
node --env-file=.env scripts/publish-postforme.js \
  --platform "instagram" \
  --images "slide-01.png,slide-02.png,..." \
  --caption "legenda" \
  --dry-run

# Graph API
node --env-file=.env scripts/publish-graph-api.js \
  --images "slide-01.png,slide-02.png,..." \
  --caption "legenda" \
  --dry-run
```

Mostrar resultado do dry-run. Se OK, perguntar:
> "Dry-run passou. Quer publicar de verdade?"

### 5. Publicar

```bash
# Post for Me — Instagram
node --env-file=.env scripts/publish-postforme.js \
  --platform "instagram" \
  --images "slide-01.png,slide-02.png,..." \
  --caption "legenda"

# Post for Me — TikTok (SEMPRE como draft pro usuario escolher musica no app)
node --env-file=.env scripts/publish-postforme.js \
  --platform "tiktok" \
  --images "slide-01.png,slide-02.png,..." \
  --caption "legenda tiktok" \
  --draft

# Graph API — Instagram
node --env-file=.env scripts/publish-graph-api.js \
  --images "slide-01.png,slide-02.png,..." \
  --caption "legenda"
```

### 6. Confirmar

Após publicação:
> "Publicado no Instagram! [link se disponível]"

Se o usuário quiser publicar no TikTok também (e usar Post for Me), perguntar:
> "Quer publicar no TikTok também? Vai como rascunho pra tu escolher a música no app."

---

## Regras

- NUNCA publicar sem confirmação explícita do usuário
- Dry-run recomendado na primeira publicação (não obrigatório depois)
- TikTok via Post for Me: SEMPRE como draft (flag --draft)
- Se o token da Graph API expirou, guiar renovação em vez de dar erro genérico
- Legenda max: 2200 caracteres (Instagram/TikTok), 3000 (LinkedIn)
- Imagens: 2-10 (Instagram), 4-35 (TikTok)
- Nunca commitar `.env` no git (já tá no .gitignore)
