import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from "node:url"
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { siteAssets } from '../shared/src/vite-site-assets'

/** `virtual:v1-gen` — names of the generated decor files present in public/gen (no 404 probing at runtime).
 *  In dev a new / removed file reloads the page, so a freshly generated asset appears without a restart. */
function genManifest(): Plugin {
  const id = 'virtual:v1-gen', rid = '\0' + id
  const dir = resolve(__dirname, 'public/gen')
  const list = () => (existsSync(dir) ? readdirSync(dir).filter((f) => /\.(webp|mp4|jpg|png)$/i.test(f)) : [])
  return {
    name: 'v1-gen-manifest',
    resolveId: (s) => (s === id ? rid : undefined),
    load: (s) => (s === rid ? `export default ${JSON.stringify(list())}` : undefined),
    configureServer(server) {
      server.watcher.add(dir)
      const onChange = (file: string) => {
        if (!resolve(file).startsWith(dir)) return
        const mod = server.moduleGraph.getModuleById(rid)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}

export default defineConfig({
  base: './',
  resolve: { alias: { '@kadr/shared': fileURLToPath(new URL('../shared/src', import.meta.url)) } },
  plugins: [react(), tailwindcss(), siteAssets(), genManifest()],
  server: { fs: { allow: ['..'] } },
})
