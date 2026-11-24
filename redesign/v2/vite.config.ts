import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from "node:url"
import { siteAssets } from '../shared/src/vite-site-assets'

export default defineConfig({
  base: './',
  resolve: { alias: { '@kadr/shared': fileURLToPath(new URL('../shared/src', import.meta.url)) } },
  plugins: [react(), tailwindcss(), siteAssets()],
  server: { fs: { allow: ['..'] } },
})
