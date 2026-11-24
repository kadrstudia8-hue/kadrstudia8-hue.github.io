// Serves the live site's media/, img/ and fonts/ (repo root) during dev and copies them into dist on build.
// The redesign never duplicates the real demo videos: it uses the same files as the current site.
import { cpSync, createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import type { Plugin } from 'vite'

const DIRS = ['media', 'img', 'fonts']
const TYPES: Record<string, string> = {
  '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.m3u8': 'application/vnd.apple.mpegurl', '.ts': 'video/mp2t',
}

export function siteAssets(siteRoot = resolve(__dirname, '../../..')): Plugin {
  let outDir = 'dist'
  return {
    name: 'kadr-site-assets',
    configResolved(c) { outDir = resolve(c.root, c.build.outDir) },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url || '').split('?')[0])
        const m = url.match(/^\/(?:[^/]+\/)*?(media|img|fonts)\/(.+)$/)
        if (!m) return next()
        const file = join(siteRoot, m[1], m[2])
        if (!file.startsWith(join(siteRoot, m[1])) || !existsSync(file)) return next()
        const size = statSync(file).size
        const type = TYPES[extname(file).toLowerCase()] || 'application/octet-stream'
        const range = req.headers.range
        if (range) {
          const [s, e] = range.replace('bytes=', '').split('-')
          const start = Number(s), end = e ? Number(e) : size - 1
          res.writeHead(206, { 'Content-Range': `bytes ${start}-${end}/${size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1, 'Content-Type': type })
          createReadStream(file, { start, end }).pipe(res)
        } else {
          res.writeHead(200, { 'Content-Length': size, 'Content-Type': type, 'Accept-Ranges': 'bytes' })
          createReadStream(file).pipe(res)
        }
      })
    },
    closeBundle() {
      for (const d of DIRS) {
        const src = join(siteRoot, d)
        if (existsSync(src)) cpSync(src, join(outDir, d), { recursive: true })
      }
    },
  }
}
