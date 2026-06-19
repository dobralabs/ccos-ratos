# Como configurar o Cloudflare Workers

Tutorial pra criar a conta no Cloudflare e ter tudo pronto pro deploy do Worker.

> Tutorial visual com prints: [ratosdeia.com.br/assets/tutorial-cloudflare-setup/](https://ratosdeia.com.br/assets/tutorial-cloudflare-setup/)

---

## 1. Criar a conta

1. Acessa [cloudflare.com](https://www.cloudflare.com/)
2. Clica em **Sign Up**
3. Cria a conta com email e senha
4. Confirma o email

**O plano Free ja inclui tudo que tu precisa:** Workers (100k requests/dia), KV Storage, e deploy ilimitado.

## 2. Pegar o Account ID

1. Depois de logar, vai no dashboard do Cloudflare
2. Na sidebar, clica em **Workers & Pages**
3. O **Account ID** aparece na sidebar direita (ou na URL: `dash.cloudflare.com/ACCOUNT_ID/workers`)
4. Copia esse ID — tu vai precisar no setup

Alternativa via terminal (se ja tiver o wrangler logado):
```bash
npx wrangler whoami
```
O Account ID aparece no output.

## 3. Instalar o Wrangler (CLI do Cloudflare)

```bash
npm install -g wrangler
```

Verificar instalacao:
```bash
npx wrangler --version
```

## 4. Logar no Wrangler

```bash
npx wrangler login
```

Isso abre o navegador pra tu autorizar. Depois de autorizar, o terminal confirma o login.

Verificar:
```bash
npx wrangler whoami
```

## 5. O que o setup da skill faz automaticamente

Depois de logar no Wrangler e ter o Account ID, o setup guiado da skill cuida de:

1. **Criar o KV Namespace** — armazenamento das automacoes
2. **Gerar o wrangler.toml** — config do Worker com teus IDs
3. **Configurar os secrets** — tokens ficam encriptados no Cloudflare
4. **Fazer o deploy** — publica o Worker e retorna a URL

Tu nao precisa mexer no dashboard do Cloudflare pra nada disso.

## Troubleshooting

### "Erro: You must be logged in"
```bash
npx wrangler login
```

### "Erro: Account not found"
- Verifica se o Account ID esta correto
- Verifica se a conta tem o plano Free ativo (nao precisa de plano pago)

### "Erro: KV namespace not found"
- O namespace precisa ser criado antes do deploy. O setup da skill faz isso automaticamente.

### Limites do plano Free
- **100.000 requests por dia** — mais que suficiente pra automacao de DMs
- **KV:** 100.000 leituras/dia, 1.000 escritas/dia
- **Worker:** 10ms CPU time por request (sobra bastante)
