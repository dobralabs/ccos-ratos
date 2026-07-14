const fs = require("fs");
const path = require("path");

// --- Parse args ---
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { platform: "", images: [], caption: "", accountId: "", draft: false, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--platform") opts.platform = args[++i];
    else if (args[i] === "--images") opts.images = args[++i].split(",").map(s => s.trim());
    else if (args[i] === "--caption") opts.caption = args[++i];
    else if (args[i] === "--account-id") opts.accountId = args[++i];
    else if (args[i] === "--draft") opts.draft = true;
    else if (args[i] === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

const API_KEY = process.env.POSTFORME_API_KEY;
const BASE = "https://app.postforme.dev/api";

async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE}${endpoint}`, {
    ...options,
    headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res.json();
}

async function listAccounts(platform) {
  const data = await apiFetch(`/v1/social-accounts?platform=${platform}`);
  return (data.data || data).filter(a => a.status === "connected");
}

async function uploadImage(filePath) {
  const { upload_url, media_url } = await apiFetch("/v1/media/create-upload-url", { method: "POST" });
  const ext = path.extname(filePath).toLowerCase();
  const contentType = [".jpg", ".jpeg"].includes(ext) ? "image/jpeg" : "image/png";
  const body = fs.readFileSync(filePath);
  const res = await fetch(upload_url, { method: "PUT", headers: { "Content-Type": contentType }, body });
  if (!res.ok) throw new Error(`Upload ${res.status}: ${await res.text()}`);
  return media_url;
}

async function createPost(opts, accountId, mediaUrls) {
  const payload = {
    caption: opts.caption,
    social_accounts: [accountId],
    media: mediaUrls.map(url => ({ url })),
  };
  if (opts.platform === "tiktok") {
    payload.platform_configurations = {
      tiktok: { is_draft: opts.draft, privacy_status: "public", auto_add_music: !opts.draft },
    };
  } else {
    payload.isDraft = opts.draft;
  }
  return apiFetch("/v1/social-posts", { method: "POST", body: JSON.stringify(payload) });
}

async function main() {
  const opts = parseArgs();
  if (!API_KEY) { console.error("POSTFORME_API_KEY nao encontrada no .env"); process.exit(1); }
  if (!opts.platform) { console.error("--platform obrigatorio (instagram, tiktok, linkedin)"); process.exit(1); }
  if (!opts.images.length && opts.platform !== "linkedin") { console.error("--images obrigatorio"); process.exit(1); }

  // Buscar conta
  const accounts = await listAccounts(opts.platform);
  if (!accounts.length) { console.error(`Nenhuma conta ${opts.platform} conectada no Post for Me`); process.exit(1); }
  const accountId = opts.accountId || accounts[0].id;
  console.log(`Conta: ${accounts[0].username || accountId} (${opts.platform})`);

  if (opts.dryRun) {
    console.log(`\nDRY RUN — nao vai publicar`);
    console.log(`Plataforma: ${opts.platform}`);
    console.log(`Imagens: ${opts.images.join(", ")}`);
    console.log(`Legenda: ${opts.caption.slice(0, 100)}...`);
    console.log(`Draft: ${opts.draft}`);
    return;
  }

  // Upload
  console.log(`\nFazendo upload de ${opts.images.length} imagens...`);
  const mediaUrls = [];
  for (const img of opts.images) {
    const url = await uploadImage(img);
    console.log(`  OK: ${path.basename(img)}`);
    mediaUrls.push(url);
  }

  // Publicar
  console.log(`\nPublicando...`);
  const result = await createPost(opts, accountId, mediaUrls);
  console.log(`Publicado! ID: ${result.id || JSON.stringify(result)}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
