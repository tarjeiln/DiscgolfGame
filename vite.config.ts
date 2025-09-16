import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

// ESM-safe __dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/metrix': {
        target: 'https://discgolfmetrix.com',
        changeOrigin: true,
        secure: false,
        rewrite: p => p.replace(/^\/metrix/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@state':       path.resolve(__dirname, 'src/state'),
      '@models':       path.resolve(__dirname, 'src/types'),
      '@lib':         path.resolve(__dirname, 'src/lib'),
      '@pages':       path.resolve(__dirname, 'src/pages'),
      '@components':  path.resolve(__dirname, 'src/components'),
      '@assets':  path.resolve(__dirname, 'src/assets'),
    }
  }
  
})
