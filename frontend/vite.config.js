import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const cacheDir = process.env.LOCALAPPDATA
  ? path.join(process.env.LOCALAPPDATA, 'vite-cache', 'desafio-crud-api-frontend')
  : path.join(process.cwd(), '.vite-cache')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir,
  server: {
    proxy: {
      '/tasks': {
        target: 'http://localhost:3333',
        changeOrigin: true,
      },
    },
  },
})
