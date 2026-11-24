#!/usr/bin/env node
// Compares the live landing pages with redesign/shared/src/content/<lang>.ts.
// For every page it extracts the visible text, the human-readable attributes (alt, aria-label, data-prompt, ...),
// every href/src/poster/data-src and the head metadata, then reports what cannot be found among the string
// literals of the matching .ts file (plus content/index.ts for the shared language list).
// No dependencies. Usage: node redesign/shared/scripts/check-content.mjs [--verbose]
// Exit code 1 when something is missing.
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../../..')
const CONTENT = resolve(HERE, '../src/content')
const ORIGIN = 'https://kadrstudia8-hue.github.io/'
const PAGES = { uk: 'index.html', ru: 'landing.html', en: 'landing-en.html', es: 'landing-es.html', de: 'landing-de.html' }
const VERBOSE = process.argv.includes('--verbose')

/* Deliberately not part of the content model (service markup, not content). */
const IGNORED = {
  'meta[charset], meta[name=viewport]': n => n.tag === 'meta' && ('charset' in n.attrs || n.attrs.name === 'viewport'),
  'link[rel=stylesheet] (fonts.css, kinozal.css, site.css, lang.css)': n => n.tag === 'link' && n.attrs.rel === 'stylesheet',
  'script[src] (site.js, lang.js) and inline <script>': n => n.tag === 'script',
  'inline <style>': n => n.tag === 'style',
  'inline <svg> icon (language-menu globe)': n => n.tag === 'svg',
}

// ---------------------------------------------------------------- tiny HTML parser
const VOID = new Set(['meta', 'link', 'img', 'source', 'br', 'input', 'hr', 'wbr'])
const RAW = new Set(['script', 'style'])
const decode = s => s.replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi, (m, e) => {
  const map = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' }
  if (map[e.toLowerCase()]) return map[e.toLowerCase()]
  if (e[0] === '#') return String.fromCodePoint(/^#x/i.test(e) ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10))
  return m
})
function parse(html) {
  const root = { tag: '#root', attrs: {}, children: [] }, stack = [root]
  const re = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/g
  let m
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1]
    if (m[5] !== undefined) { top.children.push({ text: RAW.has(top.tag) ? m[5] : decode(m[5]) }); continue }
    if (!m[2]) continue
    const tag = m[2].toLowerCase()
    if (m[1]) { const i = stack.map(n => n.tag).lastIndexOf(tag); if (i > 0) stack.length = i; continue }
    const attrs = {}
    for (const a of m[3].matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = decode(a[2] ?? a[3] ?? a[4] ?? '')
    const node = { tag, attrs, children: [] }
    top.children.push(node)
    if (!VOID.has(tag) && !m[4]) stack.push(node)
    if (RAW.has(tag)) { // raw text until the closing tag
      const end = html.toLowerCase().indexOf('</' + tag, re.lastIndex)
      node.children.push({ text: html.slice(re.lastIndex, end) })
      re.lastIndex = end
    }
  }
  return root
}

const norm = s => s.replace(/\s+/g, ' ').trim()
const TEXT_ATTRS = ['alt', 'aria-label', 'title', 'placeholder', 'data-alt', 'data-prompt']
const URL_ATTRS = ['href', 'src', 'poster', 'data-src', 'data-video', 'data-poster']
const isSeparator = s => /^[\s·|—–:,.;()\-]*$/.test(s)

/** Everything on the page that the content model must contain: [{kind, value, where}] */
function extract(html) {
  const doc = parse(html)
  const items = [], ignored = {}
  const push = (kind, value, where) => { value = norm(value).replace(/^[·|]\s*|\s*[·|]$/g, ''); /* "© 2026 KADR Studio ·" → separator dots are layout */ if (value && !isSeparator(value)) items.push({ kind, value, where }) }
  function walk(n, path, inHead) {
    for (const c of n.children) {
      if (c.text !== undefined) {
        if (!inHead || n.tag === 'title') push('text', c.text, path)
        continue
      }
      const ig = Object.entries(IGNORED).find(([, p]) => p(c))
      if (ig) { ignored[ig[0]] = (ignored[ig[0]] || 0) + 1; continue }
      const where = path + ' > ' + c.tag + (c.attrs.id ? '#' + c.attrs.id : c.attrs.class ? '.' + c.attrs.class.split(' ')[0] : '')
      if (c.tag === 'html') push('attr lang', c.attrs.lang, where)
      if (c.tag === 'meta') { if (c.attrs.content) push('meta ' + (c.attrs.name || c.attrs.property), c.attrs.content, where); continue }
      for (const a of TEXT_ATTRS) if (c.attrs[a]) push('attr ' + a, c.attrs[a], where)
      if (c.attrs['data-meta']) c.attrs['data-meta'].split('|').forEach(v => push('attr data-meta', v, where))
      if (c.attrs.hreflang && c.tag === 'link') push('attr hreflang', c.attrs.hreflang, where)
      for (const a of URL_ATTRS) if (c.attrs[a]) push('url ' + a, c.attrs[a], where)
      walk(c, where, inHead || c.tag === 'head')
    }
  }
  walk(doc, '', false)
  return { items, ignored }
}

/** All string and number literals of a TS source file. */
function literals(src) {
  const out = []
  src = src.replace(/^\s*\/\/.*$/gm, '')
  for (const m of src.matchAll(/"((?:[^"\\\n]|\\.)*)"|'((?:[^'\\\n]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g)) {
    if (m[1] !== undefined) out.push(JSON.parse('"' + m[1] + '"'))
    else out.push((m[2] ?? m[3]).replace(/\\(.)/g, '$1'))
  }
  for (const m of src.matchAll(/:\s*(\d+)\b/g)) out.push(m[1])
  return out.map(norm)
}

const read = f => readFileSync(f, 'utf8')
const shared = literals(read(join(CONTENT, 'index.ts')))
let missingTotal = 0
const ignoredTotal = {}

for (const [lang, page] of Object.entries(PAGES)) {
  const { items, ignored } = extract(read(join(REPO, page)))
  for (const [k, v] of Object.entries(ignored)) ignoredTotal[k] = (ignoredTotal[k] || 0) + v
  const pool = [...literals(read(join(CONTENT, lang + '.ts'))), ...shared]
  const exact = new Set(pool)
  const blob = pool.join('\n')
  const found = v => {
    const cands = [v]
    if (/^[\w-]+\.html$/.test(v)) cands.push(ORIGIN + v)
    return cands.some(c => exact.has(c) || blob.includes(c))
  }
  const missing = items.filter(i => !found(i.value))
  missingTotal += missing.length
  const seen = new Set()
  const uniq = items.filter(i => !seen.has(i.kind + i.value) && seen.add(i.kind + i.value))
  console.log(`\n[${lang}] ${page} → content/${lang}.ts: ${items.length} items (${uniq.length} unique), missing ${missing.length}`)
  for (const m of missing) console.log(`  MISSING ${m.kind}: ${JSON.stringify(m.value)}\n          at ${m.where}`)
  if (VERBOSE) for (const i of uniq) console.log(`  ok ${i.kind}: ${i.value.slice(0, 90)}`)
}

console.log('\nDeliberately omitted (service markup), occurrences over all pages:')
for (const [k, v] of Object.entries(ignoredTotal)) console.log(`  - ${k}: ${v}`)
console.log(missingTotal ? `\nFAIL: ${missingTotal} missing` : '\nOK: 0 missing')
process.exit(missingTotal ? 1 : 0)
