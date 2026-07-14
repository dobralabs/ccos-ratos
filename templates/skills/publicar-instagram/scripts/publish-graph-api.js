const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { images: [], caption: "", dryRun: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--images") opts.images = args[++i].split(",").map(s => s.trim());
    else if (args[i] === "--caption") opts.caption = args[++i];
    else if (args[i] === "--dry-run") opts.dryRun = true;
  }
  return opts;
}

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const USER_ID = process.env.INSTAGRAM_USER_ID;
const IMGBB_KEY = process.env.IMGBB_API_KEY;
const GRAPH = "https://graph.facebook.com/v21.0";

async function uploadToImgbb(filePath) {
  const b64 = fs.readFileSync(filePath, "base64");
  const body = new URLSearchParams({ key: IMGBB_KEY, image: b64, name: path.basename(filePath, path.extname(filePath)) });
  const res = await fetch("https://api.imgbb.com/1/upload", { method: "POST", body });
  const json = await res.json();
  if (!json.success) throw new Error(`imgbb: ${JSON.stringify(json)}`);
  return json.data.url;
}

async function createContainer(imageUrl) {
  const params = new URLSearchParams({ image_url: imageUrl, is_carousel_item: "true", access_token: TOKEN });
  const res = await fetch(`${GRAPH}/${USER_ID}/media`, { method: "POST", body: params });
  const json = await res.json();
  if (json.error) throw new Error(`Container: ${json.error.message}`);
  return json.id;
}

async function pollStatus(containerId, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(`${GRAPH}/${containerId}?fields=status_code&access_token=${TOKEN}`);
    const json = await res.json();
    if (json.status_code === "FINISHED") return;
    if (json.status_code === "ERROR") throw new Error(`Container ${containerId} com erro`);
    await new Promise(r => setTimeout(r, 3000));
  }
  throw new Error(`Timeout esperando container ${containerId}`);
}

async function createCarousel(containerIds, caption) {
  const params = new URLSearchParams({
    media_type: "CAROUSEL_ALBUM",
    children: containerIds.join(","),
    caption,
    access_token: TOKEN,
  });
  const res = await fetch(`${GRAPH}/${USER_ID}/media`, { method: "POST", body: params });
  const json = await res.json();
  if (json.error) throw new Error(`Carousel: ${json.error.message}`);
  return json.id;
}

async function publish(carouselId) {
  const params = new URLSearchParams({ creation_id: carouselId, access_token: TOKEN });
  const res = await fetch(`${GRAPH}/${USER_ID}/media_publish`, { method: "POST", body: params });
  const json = await res.json();
  if (json.error) throw new Error(`Publish: ${json.error.message}`);
  return json.id;
}

async function getPermalink(mediaId) {
  const res = await fetch(`${GRAPH}/${mediaId}?fields=permalink&access_token=${TOKEN}`);
  const json = await res.json();
  return json.permalink || "";
}

async function main() {
  const opts = parseArgs();
  if (!TOKEN || !USER_ID || !IMGBB_KEY) { console.error("Faltam variaveis no .env (INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_USER_ID, IMGBB_API_KEY)"); process.exit(1); }
  if (opts.images.length < 2 || opts.images.length > 10) { console.error("Instagram aceita entre 2 e 10 imagens por carrossel"); process.exit(1); }
  if (opts.caption.length > 2200) { console.error("Legenda max 2200 caracteres"); process.exit(1); }

  // Upload pro imgbb
  console.log(`Fazendo upload de ${opts.images.length} imagens pro imgbb...`);
  const imageUrls = [];
  for (const img of opts.images) {
    const url = await uploadToImgbb(img);
    console.log(`  OK: ${path.basename(img)}`);
    imageUrls.push(url);
  }

  // Criar containers
  console.log(`\nCriando containers no Instagram...`);
  const containerIds = [];
  for (const url of imageUrls) {
    const id = await createContainer(url);
    await pollStatus(id);
    console.log(`  OK: ${id}`);
    containerIds.push(id);
  }

  // Criar carrossel
  console.log(`\nMontando carrossel...`);
  const carouselId = await createCarousel(containerIds, opts.caption);
  await pollStatus(carouselId);

  if (opts.dryRun) {
    console.log(`\nDRY RUN — carrossel montado mas nao publicado`);
    console.log(`Carousel ID: ${carouselId}`);
    return;
  }

  // Publicar
  console.log(`\nPublicando...`);
  const mediaId = await publish(carouselId);
  const link = await getPermalink(mediaId);
  console.log(`\nPublicado!`);
  if (link) console.log(`Link: ${link}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
