// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Detecta automáticamente si es producción (GitHub Pages) o desarrollo (localhost)
const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [react()],

  // 📌 Base correcta para GitHub Pages
  base: isProd ? '/biblioteca-juegos-frontend/' : '/',

  server: {
    port: 5173,

    // Proxy solo para DESARROLLO — NO afecta producción
    proxy: {
      '/api': {
        target: 'https://biblioteca-juegos-backend-production.up.railway.app',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
