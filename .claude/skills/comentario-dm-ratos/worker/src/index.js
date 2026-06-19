/**
 * Instagram DM Automation Worker — Ratos de IA
 *
 * Recebe webhooks de comentarios do Instagram.
 * Se o comentario contem a keyword configurada, envia DM (private reply) automaticamente.
 *
 * Automacoes ficam no KV namespace AUTOMATIONS:
 *   key: "post:<MEDIA_ID>" → { keyword, message, comment_replies, active, created_at }
 *   key: "index" → [{ media_id, keyword, message, comment_replies, active, created_at, label }]
 */

const IG_API = "https://graph.instagram.com/v22.0";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- Webhook verification (GET) ---
    if (request.method === "GET" && url.pathname === "/webhook") {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // --- Webhook events (POST) ---
    if (request.method === "POST" && url.pathname === "/webhook") {
      const body = await request.json();
      // Processa em background (Meta espera resposta rapida)
      ctx.waitUntil(this.handleWebhook(body, env));
      return new Response("OK", { status: 200 });
    }

    // --- API: listar automacoes ---
    if (request.method === "GET" && url.pathname === "/automations") {
      const auth = url.searchParams.get("key");
      if (auth !== env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }
      const index = await env.AUTOMATIONS.get("index", "json") || [];
      return Response.json(index);
    }

    // --- API: criar/atualizar automacao ---
    if (request.method === "POST" && url.pathname === "/automations") {
      const auth = url.searchParams.get("key");
      if (auth !== env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }

      const { media_id, keyword, message, comment_replies, label } = await request.json();
      if (!media_id || !keyword || !message) {
        return Response.json({ error: "media_id, keyword e message sao obrigatorios" }, { status: 400 });
      }

      const automation = {
        keyword: keyword.toLowerCase().trim(),
        message,
        comment_replies: comment_replies || [
          "feito, enviado! confere tua DM 📩",
          "pronto, confere tua DM! 🐀",
          "mandei lá na DM!",
          "enviado! olha tua DM 👀",
        ],
        active: true,
        created_at: new Date().toISOString(),
        label: label || "",
      };

      // Salva no KV por media_id
      await env.AUTOMATIONS.put(`post:${media_id}`, JSON.stringify(automation));

      // Atualiza indice
      const index = await env.AUTOMATIONS.get("index", "json") || [];
      const existing = index.findIndex((a) => a.media_id === media_id);
      const entry = { media_id, ...automation };
      if (existing >= 0) {
        index[existing] = entry;
      } else {
        index.push(entry);
      }
      await env.AUTOMATIONS.put("index", JSON.stringify(index));

      return Response.json({ ok: true, automation: entry });
    }

    // --- API: deletar automacao ---
    if (request.method === "DELETE" && url.pathname === "/automations") {
      const auth = url.searchParams.get("key");
      if (auth !== env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
        return new Response("Unauthorized", { status: 401 });
      }

      const { media_id } = await request.json();
      if (!media_id) {
        return Response.json({ error: "media_id obrigatorio" }, { status: 400 });
      }

      await env.AUTOMATIONS.delete(`post:${media_id}`);

      const index = await env.AUTOMATIONS.get("index", "json") || [];
      const filtered = index.filter((a) => a.media_id !== media_id);
      await env.AUTOMATIONS.put("index", JSON.stringify(filtered));

      return Response.json({ ok: true, removed: media_id });
    }

    // --- Politica de privacidade ---
    if (url.pathname === "/privacy") {
      return new Response(this.privacyPage(env.INSTAGRAM_ACCOUNT_ID), {
        status: 200,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Instagram DM Worker", { status: 200 });
  },

  privacyPage(accountId) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Política de Privacidade</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#1a1a1a;background:#fff;line-height:1.7;font-size:16px;max-width:720px;margin:0 auto;padding:48px 24px 80px}
h1{font-size:28px;font-weight:700;margin-bottom:8px}
h2{font-size:20px;font-weight:600;margin-top:40px;margin-bottom:12px}
p,li{color:#333;margin-bottom:12px}
ul{padding-left:24px}
.muted{color:#666;font-size:14px}
a{color:#0066cc}
</style>
</head>
<body>
<h1>Política de Privacidade</h1>
<p class="muted">Automação de DM no Instagram</p>

<h2>1. Introdução</h2>
<p>Este aplicativo utiliza as APIs da plataforma Meta (Instagram) para oferecer respostas automatizadas via mensagens diretas (DMs) a usuários que interagem com publicações do perfil.</p>

<h2>2. Dados coletados</h2>
<p>O aplicativo coleta apenas:</p>
<ul>
<li><strong>Nome de usuário do Instagram</strong> (username) de quem comenta nas publicações</li>
<li><strong>Texto dos comentários</strong> realizados nas publicações do perfil</li>
</ul>
<p><strong>NÃO coletamos:</strong> dados pessoais sensíveis, informações financeiras, localização, documentos, senhas ou qualquer outro dado além dos listados.</p>

<h2>3. Como usamos os dados</h2>
<ul>
<li>Identificar comentários com palavras-chave específicas</li>
<li>Enviar mensagens diretas automatizadas com conteúdo relevante</li>
<li>Responder comentários publicamente</li>
</ul>
<p>Os dados <strong>não são utilizados</strong> para criação de perfis comportamentais ou publicidade direcionada.</p>

<h2>4. Compartilhamento</h2>
<p><strong>Não vendemos, alugamos ou compartilhamos</strong> dados com terceiros.</p>

<h2>5. Armazenamento</h2>
<p>Os dados são processados em tempo real e não são armazenados permanentemente. O sistema retém apenas a configuração das automações (palavra-chave e mensagem), não os dados dos usuários.</p>

<h2>6. APIs do Meta</h2>
<p>O uso da API está em conformidade com os <a href="https://developers.facebook.com/terms/">Termos da Plataforma Meta</a> e a <a href="https://www.facebook.com/privacy/policy/">Política de Privacidade do Meta</a>.</p>

<h2>7. Direitos do usuário</h2>
<p>Você pode, a qualquer momento:</p>
<ul>
<li>Solicitar acesso, correção ou exclusão dos seus dados</li>
<li>Revogar o consentimento para processamento</li>
<li>Deixar de receber mensagens respondendo a DM ou entrando em contato</li>
</ul>

<h2>8. Contato</h2>
<p>Para dúvidas ou solicitações sobre esta política, entre em contato pelo Instagram do perfil que enviou a mensagem.</p>
</body>
</html>`;
  },

  async handleWebhook(body, env) {
    if (!body.entry) return;

    for (const entry of body.entry) {
      if (!entry.changes) continue;

      for (const change of entry.changes) {
        if (change.field !== "comments") continue;

        const { text, id: commentId, media, from } = change.value;
        if (!text || !commentId || !media?.id) continue;

        // Ignora comentarios do proprio perfil
        if (from?.id === env.INSTAGRAM_ACCOUNT_ID) continue;

        // Busca automacao pra esse post
        const automation = await env.AUTOMATIONS.get(`post:${media.id}`, "json");
        if (!automation || !automation.active) continue;

        // Checa keyword (case insensitive, contem a palavra)
        const commentText = text.toLowerCase().trim();
        const keyword = automation.keyword.toLowerCase().trim();
        if (!commentText.includes(keyword)) continue;

        // Envia DM via private reply
        await this.sendPrivateReply(commentId, automation.message, env);

        // Responde o comentario com mensagem rotacionada
        if (automation.comment_replies?.length > 0) {
          const reply = this.pickRandom(automation.comment_replies);
          await this.replyToComment(commentId, reply, env);
          console.log(`Resposta no comentario: "${reply}"`);
        }

        console.log(`DM enviada: comment=${commentId}, user=${from?.username}, keyword="${keyword}"`);
      }
    }
  },

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  async replyToComment(commentId, text, env) {
    const url = `${IG_API}/${commentId}/replies`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Erro ao responder comentario: ${response.status} — ${error}`);
    }

    return response;
  },

  async sendPrivateReply(commentId, messageText, env) {
    const url = `${IG_API}/${env.INSTAGRAM_ACCOUNT_ID}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { comment_id: commentId },
        message: { text: messageText },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Erro ao enviar DM: ${response.status} — ${error}`);
    }

    return response;
  },
};
