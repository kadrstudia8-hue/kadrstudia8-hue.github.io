// Publishes the two site themes into a checkout of the live site (the `main` branch):
//   dark  = V4 → index.html (uk), landing-uk.html, landing.html (ru), landing-en.html, landing-es.html, landing-de.html
//   light = V2 → light.html (uk), light-ru.html, light-en.html, light-es.html, light-de.html
// Usage (from redesign/):  node tools/publish.mjs <path to the site checkout> [--no-build]
// It builds both apps, copies their assets to <site>/redesign/v4|v2/assets and <site>/gen, and writes the page shells.
// Old preview pages (v1–v4.html, design-switch.js, redesign/v1, redesign/v3) are removed.
import { execSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')
const site = process.argv[2] && !process.argv[2].startsWith('--') ? resolve(process.argv[2]) : null
if (!site || !existsSync(join(site, 'sitemap.xml'))) {
  console.error('Usage: node tools/publish.mjs <path to the site checkout> [--no-build]')
  process.exit(1)
}
const noBuild = process.argv.includes('--no-build')

const LANGS = ['uk', 'ru', 'en', 'es', 'de']
const DARK = { uk: 'index.html', ru: 'landing.html', en: 'landing-en.html', es: 'landing-es.html', de: 'landing-de.html' }
const LIGHT = { uk: 'light.html', ru: 'light-ru.html', en: 'light-en.html', es: 'light-es.html', de: 'light-de.html' }
const APPS = { dark: 'v4', light: 'v2' }
const meta = JSON.parse(readFileSync(join(here, 'page-meta.json'), 'utf8'))
const NOSCRIPT = {
  uk: 'Для цієї сторінки потрібен JavaScript.', ru: 'Для этой страницы нужен JavaScript.', en: 'This page needs JavaScript.',
  es: 'Esta página necesita JavaScript.', de: 'Diese Seite benötigt JavaScript.',
}
const SUPPORT = { uk: 'support-uk.html', ru: 'support.html', en: 'support-en.html', es: 'support-es.html', de: 'support-de.html' }

// ---------------------------------------------------------------- build
for (const app of Object.values(APPS)) {
  if (noBuild) continue
  console.log(`build ${app}`)
  execSync('npx tsc --noEmit', { cwd: join(root, app), stdio: 'inherit' })
  execSync(`npx vite build --base /redesign/${app}/`, { cwd: join(root, app), stdio: 'inherit' })
}

// ---------------------------------------------------------------- assets
function built(app) {
  const html = readFileSync(join(root, app, 'dist', 'index.html'), 'utf8')
  const tags = [...html.matchAll(/<(?:script type="module"|link rel="(?:stylesheet|modulepreload)")[^>]*>(?:<\/script>)?/g)].map(m => m[0])
  if (!tags.some(t => t.startsWith('<script'))) throw new Error(`${app}: no module script in dist/index.html`)
  const htmlAttrs = (html.match(/<html\b([^>]*)>/) || [, ''])[1].replace(/\s*lang="[^"]*"/, '').trim()
  const style = (html.match(/<style>[\s\S]*?<\/style>/) || [''])[0]
  const theme = (html.match(/<meta name="theme-color" content="([^"]+)"/) || [, '#000'])[1]
  const preload = [...html.matchAll(/<link rel="preload"[^>]*>/g)].map(m => m[0])
  return { tags, htmlAttrs, style, theme, preload }
}
for (const app of Object.values(APPS)) {
  const dst = join(site, 'redesign', app, 'assets')
  rmSync(join(site, 'redesign', app), { recursive: true, force: true })
  mkdirSync(dst, { recursive: true })
  cpSync(join(root, app, 'dist', 'assets'), dst, { recursive: true })
  const gen = join(root, app, 'public', 'gen')
  if (existsSync(gen)) cpSync(gen, join(site, 'gen'), { recursive: true })
}

// ---------------------------------------------------------------- old previews
for (const f of ['v1.html', 'v2.html', 'v3.html', 'v4.html', 'design-switch.js']) rmSync(join(site, f), { force: true })
for (const d of ['redesign/v1', 'redesign/v3']) rmSync(join(site, d), { recursive: true, force: true })
if (existsSync(join(site, 'gen'))) {
  for (const f of readdirSync(join(site, 'gen'))) if (/^v[13]-/.test(f)) rmSync(join(site, 'gen', f), { force: true })
}

// ---------------------------------------------------------------- page shells
const pick = (lang, re) => meta[lang].head.filter(l => re.test(l))
const text = (lang, re) => (meta[lang].head.find(l => re.test(l)) || '').replace(/<[^>]+>/g, '').trim()
const attr = (lang, re) => ((meta[lang].head.find(l => re.test(l)) || '').match(/content="([^"]*)"/) || [, ''])[1]

function shell(theme, lang) {
  const app = APPS[theme]
  const b = built(app)
  const dark = theme === 'dark'
  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    ...pick(lang, /^<title>|^<meta name="description"|^<link rel="canonical"/),
    // the light page is the same content in another design: it points at the dark page and stays out of the index
    ...(dark ? pick(lang, /^<link rel="alternate"/) : ['<meta name="robots" content="noindex,follow">']),
    `<meta name="theme-color" content="${b.theme}">`,
    `<meta name="color-scheme" content="${dark ? 'dark' : 'light'}">`,
    ...pick(lang, /^<meta property="og:|^<meta name="twitter:/),
    '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
    // dark is the default; a visitor who chose the light theme is taken to it before anything is painted
    ...(dark ? [`<script>try{if(localStorage.getItem("kadr-theme")==="light")location.replace("${LIGHT[lang]}"+location.hash)}catch(e){}</script>`] : []),
    ...(b.style ? [b.style] : []),
    ...b.preload,
    ...b.tags,
  ]
  const htmlAttrs = [`lang="${meta[lang].htmlLang}"`, 'data-site', `data-theme="${theme}"`, `data-page-lang="${lang}"`, b.htmlAttrs].filter(Boolean).join(' ')
  return `<!doctype html>
<html ${htmlAttrs}>
<head>
${head.join('\n')}
</head>
<body>
<div id="root"></div>
<noscript>
<h1>${text(lang, /^<title>/)}</h1>
<p>${attr(lang, /^<meta name="description"/)}</p>
<p>${NOSCRIPT[lang]} <a href="${SUPPORT[lang]}">KADR Studio</a></p>
</noscript>
</body>
</html>
`
}

for (const lang of LANGS) {
  writeFileSync(join(site, DARK[lang]), shell('dark', lang))
  writeFileSync(join(site, LIGHT[lang]), shell('light', lang))
}
writeFileSync(join(site, 'landing-uk.html'), shell('dark', 'uk')) // same page as the index, kept for old links
console.log(`published to ${site}: ${LANGS.length * 2 + 1} pages`)
