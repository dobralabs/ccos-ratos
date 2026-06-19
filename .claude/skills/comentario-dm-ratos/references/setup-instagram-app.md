# Como configurar o App no Meta Developer Dashboard

Tutorial passo a passo pra criar o app que conecta teu Instagram com a automacao de DMs.

> Tutorial visual com prints: [ratosdeia.com.br/assets/tutorial-instagram-dm/](https://ratosdeia.com.br/assets/tutorial-instagram-dm/)

---

## 1. Criar o App

1. Acessa [developers.facebook.com](https://developers.facebook.com/)
2. Loga com tua conta do Facebook (a mesma vinculada ao Instagram Business)
3. Clica em **My Apps** > **Create App**
4. Tipo de app: **Business**
5. Nome do app: qualquer coisa (ex: "Automacao DM")
6. Conta Business: seleciona a tua (ou cria uma se nao tiver)
7. Clica em **Create App**

## 2. Adicionar o produto Instagram

1. No painel do app, vai em **Add Products**
2. Procura **Instagram** e clica em **Set Up**
3. Na sidebar, vai aparecer **Instagram > API setup with Instagram login**

## 3. Configurar permissoes

No painel do app, vai em **App Review > Permissions and Features**. Tu precisa dessas 3 permissoes:

| Permissao | Pra que serve |
|-----------|---------------|
| `instagram_business_basic` | Ler dados da conta (posts, comentarios) |
| `instagram_manage_comments` | Responder comentarios publicamente |
| `instagram_business_manage_messages` | Enviar DMs (private reply) |

**Modo Development:** essas permissoes ja funcionam pra contas de teste (tua propria conta). Nao precisa submeter pra review pra testar.

**Modo Live (producao):** pra funcionar com qualquer conta, precisa submeter cada permissao pra review da Meta. Mas pra uso proprio, o modo Development ja basta.

## 4. Gerar o Token de Acesso

1. Vai em **Instagram > API setup with Instagram login**
2. Em **Generate access tokens**, seleciona tua conta Instagram Business
3. Marca as 3 permissoes listadas acima
4. Clica em **Generate token**
5. Copia o token (comeca com `IGAA...`)

**IMPORTANTE:** esse token tem validade de 60 dias. Quando expirar, tu gera um novo aqui e atualiza no Worker com `npx wrangler secret put INSTAGRAM_ACCESS_TOKEN`.

## 5. Pegar o Instagram Account ID

Na mesma tela de API setup, o Account ID aparece logo abaixo do token gerado. E um numero tipo `17841447368297614`.

Se nao achar, pode buscar via API:
```
GET https://graph.instagram.com/v22.0/me?fields=id,username&access_token=SEU_TOKEN
```

## 6. Configurar o Webhook

**Essa parte tu faz DEPOIS do deploy do Worker** (o setup guiado da skill cuida disso).

1. No painel do app, vai em **Webhooks** na sidebar
2. Clica em **Add Subscription** > seleciona **Instagram**
3. Preenche:
   - **Callback URL:** `https://teu-worker.workers.dev/webhook`
   - **Verify Token:** o token de verificacao que o setup gerou
4. Clica em **Verify and Save**
5. Na lista de campos, ativa **comments** (clica em Subscribe)

## 7. Politica de Privacidade

O Meta exige uma URL de politica de privacidade pra apps que usam a API do Instagram.

Opcoes:
- **Gerar automaticamente:** a skill pode gerar uma pagina HTML basica e hospedar no Cloudflare Pages
- **Usar um servico:** [privacypolicygenerator.info](https://www.privacypolicygenerator.info/) gera uma gratis
- **Colar qualquer URL:** se tu ja tem um site com politica de privacidade, pode usar

Onde configurar: no painel do app, **Settings > Basic > Privacy Policy URL**.

## 8. Publicar o App (opcional)

- **Modo Development:** funciona pra tua propria conta. Basta adicionar tua conta como testador em **Roles > Instagram Testers**.
- **Modo Live:** necessario se tu quiser que outras contas usem o app. Requer review das permissoes.

Pra uso proprio (tipo ManyChat pra ti mesmo), o modo Development resolve.

## Troubleshooting

### "O webhook nao recebe eventos"
- Verifica se o app esta em modo **Live** OU se tua conta esta como **Instagram Tester**
- Verifica se o campo **comments** esta com Subscribe ativo
- Verifica se o Verify Token bate com o configurado no Worker

### "Erro 190: Invalid OAuth access token"
- Token expirou (dura 60 dias). Gera um novo e atualiza no Worker:
  ```bash
  echo "NOVO_TOKEN" | npx wrangler secret put INSTAGRAM_ACCESS_TOKEN
  ```

### "Erro 10: Permission denied"
- Falta permissao. Verifica se as 3 permissoes estao ativas no app
- Se estiver em modo Development, verifica se tua conta e testadora

### "DM nao chega mas comentario ta sendo detectado"
- Provavelmente falta a permissao `instagram_business_manage_messages`
- Ou a pessoa nao segue teu perfil (DM vai pra "Solicitacoes")
