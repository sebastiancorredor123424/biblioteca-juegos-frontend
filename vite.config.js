// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detecta automáticamente si es producción (GitHub Pages) o desarrollo (localhost)
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],
  
  // 📌 Base correcta para GitHub Pages — importante que coincida con tu repo
  // En dev: '/', en prod: '/biblioteca-juegos-frontend/'
  base: isProd ? '/biblioteca-juegos-frontend/' : '/',

  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
