---
name: comentario-dm-ratos
description: Automacao de DM no Instagram (tipo ManyChat). Quando alguem comenta uma keyword em um post, envia DM automatica + responde o comentario publicamente. Cria, lista e remove automacoes. Faz retroativo em comentarios antigos. Use quando o usuario mencionar "automacao instagram", "dm automatica", "manychat", "comente X que eu mando", "criar automacao pro post", "listar automacoes", "parar automacao", "retroativo", "comentario dm". Tambem dispara com /comentario-dm-ratos setup.
---

# Comentario DM Ratos

Skill de automacao de DM no Instagram via Cloudflare Worker. Funciona como um ManyChat simplificado: configura um post, uma keyword e uma mensagem. Quando alguem comenta a keyword, recebe a DM automaticamente + o perfil responde o comentario com uma frase rotacionada.

## Infraestrutura

- **Worker:** Cloudflare Worker (deploy feito pelo aluno no setup)
- **Codigo:** `worker/src/index.js` (dentro desta skill)
- **KV:** automacoes ficam no Cloudflare KV (namespace AUTOMATIONS)
- **Auth:** todas as chamadas usam `?key=<VERIFY_TOKEN>` do `.env`
- **Config:** `.env` na raiz da skill + `contas.yaml` com dados da conta

## Setup (primeira vez)

Quando o usuario pedir para configurar, rodar setup, ou for a primeira vez usando a skill, o Claude DEVE guiar o setup interativo fase por fase. Cada fase termina com uma confirmacao antes de seguir.

**IMPORTANTE:** Ler `references/setup-instagram-app.md` e `references/setup-cloudflare.md` ANTES de comecar o setup. Esses arquivos contem os tutoriais completos. Se o aluno mandar prints ou tiver duvidas sobre alguma tela, consultar esses arquivos para orientar.

### Fase 1 — Verificar pre-requisitos

```bash
npx wrangler --version
```

- Se funcionar: "Wrangler instalado. Versao X."
- Se nao: "Precisa instalar o Wrangler primeiro. Roda isso:"
  ```bash
  npm install -g wrangler
  ```

Depois verificar login:
```bash
npx wrangler whoami
```

- Se logado: "Logado como X. Account ID: Y." — anotar o Account ID.
- Se nao: "Precisa logar no Cloudflare. Roda isso (vai abrir o navegador):"
  ```bash
  npx wrangler login
  ```
  Depois rodar `npx wrangler whoami` de novo pra confirmar e capturar o Account ID.

### Fase 2 — Coletar dados do Instagram

Perguntar: **"Tu ja criou o app no Meta Developer Dashboard?"**

**Se nao:**
> "Sem problema. Segue esse tutorial pra criar o app e gerar o token:
> [ratosdeia.com.br/assets/tutorial-instagram-dm/](https://ratosdeia.com.br/assets/tutorial-instagram-dm/)
>
> Quando tiver o token e o Account ID, volta aqui que a gente continua."

Parar aqui e esperar o aluno voltar.

**Se sim:**
> "Me passa esses 3 dados:
> 1. **Token de acesso** (comeca com IGAA...)
> 2. **Instagram Account ID** (numero tipo 17841...)
> 3. **Username do Instagram** (ex: @meuinsta)"

Depois de receber os dados:

1. Gerar um verify token aleatorio:
   ```bash
   openssl rand -hex 16
   ```

2. Pegar o username do Instagram (sem @)

3. Criar o `.env` na raiz da skill:
   ```
   # Comentario DM Ratos — Configuracao
   # Gerado automaticamente pelo setup. NAO commitar esse arquivo.

   INSTAGRAM_ACCESS_TOKEN="IGAA..."
   INSTAGRAM_ACCOUNT_ID="17841..."
   INSTAGRAM_USERNAME="meuinsta"
   INSTAGRAM_WEBHOOK_VERIFY_TOKEN="token_gerado"
   CLOUDFLARE_ACCOUNT_ID="account_id_do_wrangler"
   WORKER_URL=""
   ```

**SEGURANCA:** NUNCA exibir o token do Instagram no terminal. Usar variaveis e pipes, nunca echo com o valor visivel.

### Fase 3 — Configurar Cloudflare

Se o Account ID ja foi capturado do `npx wrangler whoami` na Fase 1, pular pra Fase 4.

Se nao conseguiu extrair:
> "Me passa teu Cloudflare Account ID. Se nao sabe onde achar: [ratosdeia.com.br/assets/tutorial-cloudflare-setup/](https://ratosdeia.com.br/assets/tutorial-cloudflare-setup/)"

Salvar no `.env` como `CLOUDFLARE_ACCOUNT_ID`.

### Fase 4 — Deploy automatico

Executar em sequencia:

**4.1. Criar KV Namespace:**
```bash
cd SKILL_DIR/worker && npx wrangler kv namespace create AUTOMATIONS
```
Parsear o output pra extrair o `id` do namespace. O output parece com:
```
Add the following to your configuration file in your kv_namespaces array:
{ binding = "AUTOMATIONS", id = "abc123..." }
```

**4.2. Gerar wrangler.toml:**

Ler `worker/wrangler.toml.template` e substituir os placeholders:
- `SLUG` → username do Instagram (sem @, lowercase, sem pontos)
- `CLOUDFLARE_ACCOUNT_ID` → do `.env`
- `INSTAGRAM_ACCOUNT_ID` → do `.env`
- `KV_NAMESPACE_ID` → do passo 4.1

Escrever o resultado em `worker/wrangler.toml`.

**4.3. Configurar secrets:**
```bash
cd SKILL_DIR/worker
```

Ler o `.env` da skill e configurar os secrets via pipe (NUNCA exibir tokens no terminal):

```bash
# Ler token do .env e enviar pro wrangler sem exibir
grep INSTAGRAM_ACCESS_TOKEN SKILL_DIR/.env | cut -d'"' -f2 | npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
```

```bash
grep INSTAGRAM_WEBHOOK_VERIFY_TOKEN SKILL_DIR/.env | cut -d'"' -f2 | npx wrangler secret put INSTAGRAM_WEBHOOK_VERIFY_TOKEN
```

**4.4. Deploy:**
```bash
cd SKILL_DIR/worker && npx wrangler deploy
```

Capturar a URL do Worker no output (tipo `https://comentario-dm-xxx.workers.dev`).

Atualizar o `.env` com `WORKER_URL="https://..."`.

### Fase 5 — Configurar webhook e politica de privacidade no Meta

Mostrar ao aluno:

> "Agora vai no Meta Developer Dashboard ([developers.facebook.com](https://developers.facebook.com/)), abre teu app, e faz isso:
>
> **Webhook:**
> 1. Na sidebar, clica em **Webhooks**
> 2. Clica em **Add Subscription** > seleciona **Instagram**
> 3. Cola esses dados:
>    - **Callback URL:** `https://SEU-WORKER.workers.dev/webhook`
>    - **Verify Token:** `TOKEN_GERADO`
> 4. Clica em **Verify and Save**
> 5. Na lista de campos, ativa **comments** (clica em Subscribe)
>
> **Politica de privacidade:**
> O teu Worker ja tem uma pagina de privacidade pronta. Quando o Meta pedir a URL da politica de privacidade, cola:
> `https://SEU-WORKER.workers.dev/privacy`
>
> Me avisa quando terminar."

Substituir os valores reais na mensagem (WORKER_URL do `.env`).

### Fase 6 — Validar

Depois que o aluno confirmar que configurou o webhook:

```bash
curl -s "WORKER_URL/webhook?hub.mode=subscribe&hub.verify_token=VERIFY_TOKEN&hub.challenge=teste_ok_123"
```

- Se retornar `teste_ok_123`: "Tudo certo! Teu Worker ta no ar e respondendo."
- Se retornar 403: "O verify token nao bateu. Verifica se colou o token certo no Meta."
- Se der erro de conexao: "O Worker nao ta acessivel. Verifica se o deploy funcionou com `npx wrangler deploy`."

### Fase 7 — Cadastrar conta (contas.yaml)

Preencher automaticamente o `contas.yaml` com os dados coletados:

```yaml
contas:
  USERNAME:
    nome: "Instagram @username"
    instagram_account_id: "17841..."
    instagram_username: "@username"
    worker_url: "https://comentario-dm-xxx.workers.dev"
    notas: ""
```

Mensagem final:
> "Setup completo! Tua automacao de DM ta funcionando. Agora e so criar automacoes pros teus posts.
>
> Exemplos do que tu pode pedir:
> - 'cria automacao pro post X, keyword LINK, mensagem com o link do curso'
> - 'lista minhas automacoes'
> - 'remove automacao do post X'"

---

## Operacoes

### Pre-requisito: carregar config

Antes de QUALQUER operacao, o Claude DEVE:
1. Ler o `.env` da skill pra pegar `WORKER_URL` e `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
2. Ler `contas.yaml` pra resolver nomes de conta
3. Ler `aprendizados.md` e aplicar regras aprendidas

**SEGURANCA:** NUNCA exibir tokens em outputs de terminal.

### 1. Criar automacao

O usuario vai dizer algo como:
- "cria automacao pro post X, keyword Y, mensagem Z"
- "quando alguem comentar LINK nesse post, manda o link do curso"

**O que fazer:**

1. Ler o `.env` pra pegar `WORKER_URL`, `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`, `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_ACCOUNT_ID`

2. Se o usuario passou uma **URL do Instagram** (tipo `https://www.instagram.com/p/ABC123/`), converter pra `media_id`:
   ```bash
   # Buscar posts recentes e encontrar o shortcode
   # NUNCA exibir o token no terminal — usar pipe do .env
   curl -s "https://graph.instagram.com/v22.0/ACCOUNT_ID?fields=business_discovery.fields(media.limit(50){id,shortcode,caption,timestamp})&username=USERNAME&access_token=TOKEN"
   ```
   Extrair o shortcode da URL e encontrar o `media_id` correspondente.

3. Montar o payload e chamar o Worker:
   ```bash
   curl -s -X POST "WORKER_URL/automations?key=VERIFY_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "media_id": "...",
       "keyword": "...",
       "message": "...",
       "comment_replies": ["feito, enviado! confere tua DM :envelope_with_arrow:", "pronto, confere tua DM! :rat:", "mandei la na DM!", "enviado! olha tua DM :eyes:"],
       "label": "descricao curta"
     }'
   ```

   **IMPORTANTE:** SEMPRE incluir `comment_replies`. Se o usuario quiser frases personalizadas, usar as dele. Senao, usar as 4 padrao acima.

4. Confirmar pro usuario: keyword, DM que sera enviada, e frases de resposta publica.

5. **OBRIGATORIO:** Criar ou atualizar o arquivo `automacoes-dm.md` na raiz do projeto do usuario. Tabela com:

   | Status | Keyword | Post | Label | DM (resumo) | Data |
   |--------|---------|------|-------|-------------|------|
   | :white_check_mark: ativo | link | instagram.com/p/ABC | Curso IA | "Opa! Aqui o link..." | 2026-04-04 |

   Ao remover, marcar como `:x: removido` (nao apagar a linha — manter historico).

### 2. Listar automacoes

```bash
curl -s "WORKER_URL/automations?key=VERIFY_TOKEN"
```

Mostrar em formato legivel: label, keyword, trecho da mensagem, data de criacao, status.

### 3. Remover automacao

```bash
curl -s -X DELETE "WORKER_URL/automations?key=VERIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"media_id": "..."}'
```

Atualizar o `automacoes-dm.md` marcando como `:x: removido`.

### 4. Retroativo (enviar DMs pra comentarios antigos)

Quando o usuario pedir "manda retroativo", "envia pros comentarios antigos", "varre os comentarios do post X":

1. **Buscar comentarios do post via Graph API:**
   ```bash
   curl -s "https://graph.instagram.com/v22.0/MEDIA_ID/comments?fields=id,text,username,timestamp&limit=100&access_token=TOKEN"
   ```

2. **Filtrar** por keyword (case insensitive, mesmo criterio do Worker)

3. **Excluir** comentarios do proprio perfil

4. **Mostrar ao usuario** a lista de comentarios encontrados:
   > "Encontrei X comentarios com a keyword 'LINK':
   > - @usuario1: 'quero o link por favor' (2h atras)
   > - @usuario2: 'manda o link!' (5h atras)
   >
   > Quer que eu envie a DM pra todos? Vou incluir delay de 2s entre cada pra nao tomar rate limit."

5. **Esperar confirmacao** do usuario antes de enviar.

6. **Enviar DMs** uma a uma com delay de 2 segundos:
   ```bash
   curl -s -X POST "https://graph.instagram.com/v22.0/ACCOUNT_ID/messages" \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"recipient":{"comment_id":"COMMENT_ID"},"message":{"text":"MENSAGEM"}}'
   ```

7. Opcionalmente, responder cada comentario publicamente tambem:
   ```bash
   curl -s -X POST "https://graph.instagram.com/v22.0/COMMENT_ID/replies" \
     -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"message":"frase rotacionada"}'
   ```

8. Reportar resultado: "Enviado pra X de Y comentarios. Z falharam (motivo)."

**Por que nao passa pelo Worker?** E uma operacao one-shot. O Worker cuida so de webhooks em tempo real. O retroativo roda direto via curl.

---

## Aprendizados (memoria persistente)

**Arquivo:** `aprendizados.md` (raiz da skill)

O Claude DEVE:

1. **Ler `aprendizados.md` no inicio de QUALQUER operacao.** Aplicar todas as regras listadas.

2. **Quando o usuario corrigir algo** (ex: "a mensagem tinha que ser diferente", "nao era pra responder o comentario"), perguntar:
   "Quer que eu registre isso nos aprendizados pra nao esquecer nas proximas vezes?"

3. **Formato de cada entrada:**
   ```markdown
   ### {DATA} — {titulo curto}
   **Regra:** {o que fazer sempre/nunca}
   **Contexto:** {o que aconteceu pra gerar esse aprendizado}
   ```

4. **Nao duplicar** — antes de adicionar, verificar se ja existe regra similar.

---

## Regras

- Keyword e case insensitive (o Worker ja faz `.toLowerCase()`)
- A DM e uma "private reply" vinculada ao comentario — so pode enviar 1 DM por comentario
- Se a pessoa nao segue o perfil, a DM cai em "Solicitacoes de mensagem"
- Janela de 7 dias: o comentario precisa ter menos de 7 dias pra DM funcionar
- Mensagem max: 1000 bytes (UTF-8)
- Nunca enviar DM pra comentarios do proprio perfil (o Worker ja filtra)
- NUNCA exibir tokens em outputs de terminal — usar pipes e variaveis

## Troubleshooting

- **Webhook nao recebe eventos:** verificar se o app no Meta esta com status "Publicado" (modo Development so recebe eventos de testadores cadastrados)
- **DM nao esta sendo enviada:** verificar logs do Worker com `cd SKILL_DIR/worker && npx wrangler tail`
- **Token expirado:** gerar novo token no Meta Developer Dashboard e atualizar via `cd SKILL_DIR/worker && echo "NOVO_TOKEN" | npx wrangler secret put INSTAGRAM_ACCESS_TOKEN`. Atualizar o `.env` tambem.
- **Rate limit (erro 4):** esperar 60 segundos. No retroativo, aumentar o delay entre envios.
- **Erro 10 (permission denied):** falta permissao no app. Verificar `instagram_business_manage_messages`.
