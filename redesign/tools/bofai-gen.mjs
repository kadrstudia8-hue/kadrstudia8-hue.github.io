#!/usr/bin/env node
// bofai-gen.mjs — генерация ассетов редизайна через B.AI (Bank of AI).
// Node 24, без зависимостей (sharp — опционально, для webp/ресайза).
//
//   node tools/bofai-gen.mjs --token-file <path> [--slots asset-slots.json]
//        [--dry-run] [--yes] [--max N] [--only id1,id2] [--quality low|medium|high]
//        [--max-usd 15] [--sharp <dir с node_modules/sharp>] [--report <path>] [--force]
//
//   --dry-run  план + тела запросов, без сети.
//   без --yes  план + оценка цены, без сети.
//   --yes      генерация (последовательно; готовые файлы пропускаются).
//
// API (docs: github.com/BofAI/docs, docs/llmservice/api/*):
//   base   https://api.b.ai/v1, auth: Authorization: Bearer <key>
//   image  POST /images/generations (sync, timeout ≤600 s)
//   video  POST /videos -> GET /videos/{id} -> GET /videos/{id}/content
//
// Токен читается из файла в память и никогда не выводится; любые тексты
// ответов, попадающие в лог, проходят через mask().

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const BASE = 'https://api.b.ai/v1';
const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------- args ----------
const argv = process.argv.slice(2);
const flag = (n) => argv.includes(n);
const opt = (n, d) => { const i = argv.indexOf(n); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const DRY = flag('--dry-run');
const YES = flag('--yes') && !DRY;
const FORCE = flag('--force');
const MAX = Number(opt('--max', 'Infinity'));
const ONLY = opt('--only') ? new Set(opt('--only').split(',').map((s) => s.trim())) : null;
const QUALITY_OVERRIDE = opt('--quality');
const MAX_USD = Number(opt('--max-usd', '15'));
const SLOTS = path.resolve(opt('--slots', path.join(HERE, '..', 'asset-slots.json')));
const ROOT = path.dirname(SLOTS);
const REPORT = path.resolve(opt('--report', path.join(ROOT, 'asset-gen-report.json')));
const TOKEN_FILE = opt('--token-file', process.env.BOFAI_TOKEN_FILE);
const SHARP_DIR = opt('--sharp', process.env.BOFAI_SHARP_DIR);

let TOKEN = '';
const mask = (s) => { s = String(s ?? ''); if (TOKEN) s = s.split(TOKEN).join('***'); return s.replace(/(Bearer\s+)\S+/gi, '$1***'); };
const log = (...a) => console.log(...a.map((x) => mask(typeof x === 'string' ? x : JSON.stringify(x, null, 2))));
const die = (m, code = 1) => { console.error(mask('ERROR: ' + m)); process.exit(code); };

// ---------- pricing (B.AI list prices, USD) ----------
// gpt-image-2: $5/1M text in, $30/1M image out. Токены на картинку оцениваются
// по формуле OpenAI gpt-image (база 1024² по качеству) с запасом ×1.5.
const IMG_BASE_TOKENS = { low: 272, medium: 1056, high: 4160, auto: 4160 };
// Seedance: USD / 1M video tokens (без видео на входе), токены ≈ W*H*fps*sec/1024.
const VIDEO_RATE = { 'seedance-2.0-mini': 3.5, 'seedance-2.0-fast': 5.6, 'seedance-2.0': 7.0, 'seedance-2.5': 10.7 };
const VIDEO_RATE_1080 = { 'seedance-2.0': 7.7, 'seedance-2.5': 11.7 };

const IMAGE_SIZES = { // кратно 16, длинная сторона ≤ 1600
  '1:1': [1024, 1024], '16:9': [1536, 864], '9:16': [864, 1536], '3:2': [1536, 1024], '2:3': [1024, 1536],
  '4:3': [1344, 1008], '3:4': [1008, 1344], '21:9': [1600, 688], '5:4': [1280, 1024], '4:5': [1024, 1280],
};
const VIDEO_RATIOS = new Set(['16:9', '4:3', '1:1', '3:4', '9:16', '21:9']);
const VIDEO_DIMS_720 = { '16:9': [1280, 720], '9:16': [720, 1280], '1:1': [960, 960], '4:3': [960, 720], '3:4': [720, 960], '21:9': [1680, 720] };

function normModel(kind, m) {
  m = String(m || '').toLowerCase().trim();
  if (kind === 'image') {
    if (!m || /gpt.?(image.?)?2|^gpt2$/.test(m)) return 'gpt-image-2';
    return m;
  }
  if (!m || m === 'seedance') return 'seedance-2.0';
  return m;
}

const NO_JUNK = 'No text, no letters, no numbers, no captions, no watermarks, no logos, no brand marks, no people, no faces, no hands.';
function bgNote(slot) {
  if (!slot.transparent_bg) return null;
  const bg = String(slot.transparent_bg).toLowerCase() === 'white' ? 'white' : 'black';
  return bg;
}

function buildImage(slot) {
  const model = normModel('image', slot.model);
  const aspect = IMAGE_SIZES[slot.aspect] ? slot.aspect : '1:1';
  const [w, h] = IMAGE_SIZES[aspect];
  const quality = QUALITY_OVERRIDE || slot.quality || 'medium';
  const bg = bgNote(slot);
  let prompt = String(slot.prompt || '').trim();
  if (bg) prompt += ` Isolated single object centered on a perfectly flat, solid pure ${bg} (${bg === 'black' ? '#000000' : '#FFFFFF'}) background, no shadow on the background, no gradient, no floor.`;
  prompt += ' ' + NO_JUNK;
  const body = { model, prompt, n: 1, size: `${w}x${h}`, quality };
  const tokens = Math.ceil(IMG_BASE_TOKENS[quality] ?? 4160) * ((w * h) / (1024 * 1024)) * 1.5;
  const usd = tokens * 30 / 1e6 + (prompt.length / 4) * 5 / 1e6;
  return { model, body, usd, note: bg ? `transparent_bg запрошен, модель не умеет — сгенерировано на чистом ${bg} фоне` : null };
}

function buildVideo(slot) {
  const model = normModel('video', slot.model);
  const ratio = VIDEO_RATIOS.has(slot.aspect) ? slot.aspect : '16:9';
  const duration = Math.min(15, Math.max(4, Number(slot.duration || 5)));
  const resolution = slot.resolution || '720p';
  const bg = bgNote(slot);
  let text = String(slot.prompt || '').trim();
  text += ' Seamless loop: the last frame matches the first frame, continuous slow motion, locked or very slow camera, no cuts.';
  if (bg) text += ` Subject on a perfectly flat solid pure ${bg} background.`;
  text += ' ' + NO_JUNK + ' No subtitles.';
  const content = [{ type: 'text', text }];
  // Optional image-to-video: slot.first_frame = local image path (relative to the repo root).
  // The same frame as first and last frame gives a seamless loop.
  if (slot.first_frame) {
    const fp = path.resolve(path.join(HERE, "..", ".."), slot.first_frame);
    if (fs.existsSync(fp)) {
      const ext = fp.toLowerCase().endsWith('.png') ? 'png' : fp.toLowerCase().endsWith('.jpg') ? 'jpeg' : 'webp';
      const url = `data:image/${ext};base64,${fs.readFileSync(fp).toString('base64')}`;
      content.push({ type: 'image_url', image_url: { url }, role: 'first_frame' });
      if (slot.loop_frames !== false) content.push({ type: 'image_url', image_url: { url }, role: 'last_frame' });
    }
  }
  const body = { model, content, duration, resolution, ratio, generate_audio: false, watermark: false };
  const [w, h] = VIDEO_DIMS_720[ratio] || [1280, 720];
  const scale = resolution === '480p' ? (480 / 720) ** 2 : resolution === '1080p' ? (1080 / 720) ** 2 : 1;
  const tokens = (w * h * scale * 24 * duration) / 1024;
  const rate = (resolution === '1080p' ? VIDEO_RATE_1080[model] : VIDEO_RATE[model]) ?? NaN;
  return { model, body, usd: tokens * rate / 1e6, note: bg ? `transparent_bg запрошен, видео без альфы — сгенерировано на чистом ${bg} фоне` : null };
}

// ---------- sharp (optional) ----------
function loadSharp() {
  const tries = [];
  if (SHARP_DIR) tries.push(path.join(path.resolve(SHARP_DIR), 'package.json'));
  tries.push(path.join(ROOT, 'package.json'), import.meta.url);
  for (const base of tries) {
    try { return createRequire(base)('sharp'); } catch {}
  }
  return null;
}

// ---------- http ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
class HttpError extends Error { constructor(status, text, reqId) { super(`HTTP ${status}: ${mask(text).slice(0, 800)}${reqId ? ` [X-Oneapi-Request-Id ${reqId}]` : ''}`); this.status = status; } }

async function call(method, url, body, { timeoutMs = 600_000, retry = true, raw = false } = {}) {
  for (let attempt = 0; ; attempt++) {
    let res;
    try {
      res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${TOKEN}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(timeoutMs),
      });
    } catch (e) {
      // сетевые/таймаут: НЕ ретраим POST (не идемпотентно, может списать деньги дважды)
      if (method === 'GET' && retry && attempt === 0) { await sleep(5000); continue; }
      throw new Error('network: ' + mask(e.message));
    }
    if (res.ok) return raw ? res : res.json();
    const text = await res.text().catch(() => '');
    const reqId = res.headers.get('x-oneapi-request-id');
    if ((res.status === 429 || res.status >= 500) && retry && attempt === 0) {
      const wait = res.status === 429 ? 65_000 : 10_000;
      log(`  ${res.status}, один ретрай через ${wait / 1000} c`);
      await sleep(wait);
      continue;
    }
    throw new HttpError(res.status, text, reqId);
  }
}

async function download(url, auth) {
  const res = await fetch(url, { headers: auth ? { Authorization: `Bearer ${TOKEN}` } : {}, signal: AbortSignal.timeout(300_000) });
  if (!res.ok) throw new HttpError(res.status, await res.text().catch(() => ''), res.headers.get('x-oneapi-request-id'));
  return Buffer.from(await res.arrayBuffer());
}

// ---------- generators ----------
async function genImage(slot, plan, outFile, sharp) {
  const t0 = Date.now();
  const r = await call('POST', `${BASE}/images/generations`, plan.body);
  const item = (r.data || [])[0] || {};
  if (item.error || (!item.b64_json && !item.url)) throw new Error('image failed: ' + mask(JSON.stringify(item.error || r).slice(0, 500)));
  let buf = item.b64_json ? Buffer.from(item.b64_json, 'base64') : await download(item.url, false);
  const u = r.usage || {};
  const inTok = u.input_tokens ?? 0, outTok = u.output_tokens ?? 0;
  const imgIn = u.input_tokens_details?.image_tokens ?? 0;
  const usd = (inTok - imgIn) * 5 / 1e6 + imgIn * 8 / 1e6 + outTok * 30 / 1e6;
  let saved = outFile;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  const wantWebp = /\.webp$/i.test(outFile);
  if (sharp) {
    let p = sharp(buf).resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });
    if (wantWebp) p = p.webp({ quality: 82, effort: 5 });
    else if (/\.png$/i.test(outFile)) p = p.png({ compressionLevel: 9 });
    else if (/\.jpe?g$/i.test(outFile)) p = p.jpeg({ quality: 85, mozjpeg: true });
    buf = await p.toBuffer();
  } else if (wantWebp && buf.subarray(1, 4).toString() === 'PNG') {
    saved = outFile.replace(/\.webp$/i, '.png'); // sharp нет — оставляем png
  }
  fs.writeFileSync(saved, buf);
  return { file: saved, usd, usage: u, revised_prompt: item.revised_prompt, size: item.size, seconds: (Date.now() - t0) / 1000, sharp: !!sharp };
}

async function genVideo(slot, plan, outFile) {
  const t0 = Date.now();
  const created = await call('POST', `${BASE}/videos`, plan.body);
  const id = created.id;
  if (!id) throw new Error('no task id: ' + mask(JSON.stringify(created).slice(0, 300)));
  log(`  task ${id} (${created.status})`);
  let st;
  for (;;) {
    await sleep(8000);
    st = await call('GET', `${BASE}/videos/${id}`, null, { timeoutMs: 60_000 });
    if (st.status === 'failed') throw new Error(`video failed (task ${id}): ` + mask(JSON.stringify(st.error || {}).slice(0, 400)));
    if (st.metadata?.billing_status === 'review') throw new Error(`billing review, task ${id} — не пересоздаём, обратиться в поддержку`);
    if (st.status === 'completed' && st.metadata?.billing_status === 'settled') break;
    if (Date.now() - t0 > 20 * 60_000) throw new Error(`timeout waiting task ${id}`);
  }
  let buf;
  for (let i = 0; ; i++) {
    try { buf = await download(`${BASE}/videos/${id}/content`, true); break; } catch (e) {
      if (e.status === 409 && i < 5) { await sleep(8000); continue; }
      throw e;
    }
  }
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buf);
  const tok = st.usage?.total_tokens ?? st.metadata?.total_tokens;
  const rate = VIDEO_RATE[plan.model];
  return { file: outFile, task_id: id, usd: tok && rate ? tok * rate / 1e6 : plan.usd, usd_is_estimate: !(tok && rate), seconds: (Date.now() - t0) / 1000, status: st };
}

// ---------- main ----------
if (!fs.existsSync(SLOTS)) die(`нет файла слотов: ${SLOTS}`);
let slots = JSON.parse(fs.readFileSync(SLOTS, 'utf8'));
if (!Array.isArray(slots)) slots = slots.slots || slots.assets || [];
if (ONLY) slots = slots.filter((s) => ONLY.has(s.id));

const rows = slots.map((s) => {
  const kind = /video|mp4/i.test(s.kind) ? 'video' : 'image';
  const plan = kind === 'video' ? buildVideo(s) : buildImage(s);
  const outFile = path.resolve(ROOT, s.file);
  const pngAlt = outFile.replace(/\.webp$/i, '.png');
  const done = !FORCE && (fs.existsSync(outFile) || (kind === 'image' && fs.existsSync(pngAlt)));
  return { slot: s, kind, plan, outFile, done };
});

const todo = rows.filter((r) => !r.done).slice(0, MAX);
const est = todo.reduce((a, r) => a + r.plan.usd, 0);
log(`slots: ${rows.length}, готово: ${rows.filter((r) => r.done).length}, к генерации: ${todo.length}${Number.isFinite(MAX) ? ` (--max ${MAX})` : ''}`);
for (const r of rows) {
  const tag = r.done ? 'SKIP' : todo.includes(r) ? 'GEN ' : 'MAX ';
  log(`${tag} ${r.slot.id} [v${r.slot.version ?? '?'}] ${r.kind} ${r.plan.model} ${r.plan.body.size || `${r.plan.body.ratio} ${r.plan.body.resolution} ${r.plan.body.duration}s`} ~$${r.plan.usd.toFixed(3)} -> ${path.relative(ROOT, r.outFile)}${r.plan.note ? '  (' + r.plan.note + ')' : ''}`);
  if (DRY && !r.done) log(JSON.stringify({ endpoint: r.kind === 'video' ? 'POST /v1/videos' : 'POST /v1/images/generations', body: r.plan.body }, null, 2));
}
log(`оценка стоимости: ~$${est.toFixed(2)} (лимит --max-usd ${MAX_USD})`);
if (Number.isNaN(est)) die('цена неизвестна для одной из моделей — остановка', 3);
if (!YES) { log(DRY ? 'dry-run: сеть не трогали.' : 'план показан; для генерации добавьте --yes'); process.exit(0); }
if (est > MAX_USD) die(`оценка $${est.toFixed(2)} > --max-usd ${MAX_USD}`, 3);
if (!TOKEN_FILE) die('нужен --token-file');
TOKEN = fs.readFileSync(TOKEN_FILE, 'utf8').trim();
if (!TOKEN || /\s/.test(TOKEN)) die('токен-файл пуст или содержит пробелы');

const sharp = todo.some((r) => r.kind === 'image') ? loadSharp() : null;
if (todo.some((r) => r.kind === 'image')) log(sharp ? 'sharp: найден (webp + ресайз ≤1600)' : 'sharp: нет — картинки остаются png');

const report = fs.existsSync(REPORT) ? JSON.parse(fs.readFileSync(REPORT, 'utf8')) : { items: {} };
let spent = 0;
const save = () => { report.updated = new Date().toISOString(); fs.writeFileSync(REPORT, JSON.stringify(report, null, 2)); };
// Баланс в Credits (1 USD = 1e6). gpt-image-2 через B.AI не отдаёт usage,
// поэтому реальная цена = разница баланса до/после.
const balance = async () => { try { const b = await call('GET', `${BASE}/balance`, null, { timeoutMs: 30_000 }); return b?.data?.personal_balance ?? null; } catch { return null; } };
let bal = await balance();
if (bal != null) log(`баланс: $${(bal / 1e6).toFixed(4)}`);
for (const r of todo) {
  if (spent > MAX_USD) die(`потрачено $${spent.toFixed(4)} > --max-usd ${MAX_USD}, остановка`, 3);
  log(`→ ${r.slot.id} (${r.kind}, ${r.plan.model})`);
  try {
    const res = r.kind === 'video' ? await genVideo(r.slot, r.plan, r.outFile) : await genImage(r.slot, r.plan, r.outFile, sharp);
    const after = await balance();
    if (bal != null && after != null && bal - after > 0) { res.usd = (bal - after) / 1e6; res.usd_is_estimate = false; res.usd_source = 'balance-delta'; }
    if (after != null) bal = after;
    spent += res.usd || 0;
    report.items[r.slot.id] = { id: r.slot.id, version: r.slot.version, kind: r.kind, model: r.plan.model, file: path.relative(ROOT, res.file).replace(/\\/g, '/'), usd: +((res.usd || 0).toFixed(4)), usd_is_estimate: !!res.usd_is_estimate, usd_source: res.usd_source || (res.usd_is_estimate ? 'estimate' : 'usage'), note: r.plan.note, background: r.slot.transparent_bg ? bgNote(r.slot) : null, usage: res.usage, task_id: res.task_id, generated: new Date().toISOString() };
    save();
    log(`  ok ${path.relative(ROOT, res.file)}  $${(res.usd || 0).toFixed(4)}  ${res.seconds.toFixed(0)} c`);
  } catch (e) {
    report.items[r.slot.id] = { id: r.slot.id, error: mask(e.message), when: new Date().toISOString() };
    save();
    log(`  FAIL ${r.slot.id}: ${e.message}`);
    if (e.status && e.status >= 400 && e.status < 500) die(`4xx — остановка. Потрачено ~$${spent.toFixed(4)}`, 2);
  }
}
log(`итого потрачено ~$${spent.toFixed(4)}${bal != null ? `, баланс $${(bal / 1e6).toFixed(4)}` : ''}; отчёт: ${REPORT}`);
