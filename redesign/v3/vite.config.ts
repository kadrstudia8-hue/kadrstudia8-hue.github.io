import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { siteAssets } from '../shared/src/vite-site-assets'

/**
 * `virtual:v3-gen` — which generated objects already exist in public/gen (name → mtime).
 * The page asks this list instead of probing files, so a missing asset never produces a 404 in the console;
 * the mtime is used as a cache-buster (the transparent cut-outs replace files under the same name).
 * In dev the folder is watched: a new / replaced file reloads the page.
 */
function genManifest(): Plugin {
  const ID = 'virtual:v3-gen', RID = '\0' + ID
  const dir = fileURLToPath(new URL('./public/gen', import.meta.url))
  const list = () => {
    const out: Record<string, number> = {}
    if (existsSync(dir)) for (const f of readdirSync(dir)) {
      try { const s = statSync(join(dir, f)); if (s.isFile() && s.size > 0) out[f] = Math.round(s.mtimeMs) } catch { /* skip */ }
    }
    return out
  }
  return {
    name: 'v3-gen-manifest',
    resolveId: (id) => (id === ID ? RID : null),
    load: (id) => (id === RID ? `export default ${JSON.stringify(list())}` : null),
    configureServer(server) {
      server.watcher.add(dir)
      const on = (file: string) => {
        if (!file.replace(/\\/g, '/').includes('/public/gen/')) return
        const mod = server.moduleGraph.getModuleById(RID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', on); server.watcher.on('change', on); server.watcher.on('unlink', on)
    },
  }
}

export default defineConfig({
  base: './',
  resolve: { alias: { '@kadr/shared': fileURLToPath(new URL('../shared/src', import.meta.url)) } },
  plugins: [react(), tailwindcss(), siteAssets(), genManifest()],
  server: { fs: { allow: ['..'] } },
})
