import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'

// ✅ Verificación del entorno y del .env
console.log("✅ Entorno actual:", import.meta.env.MODE)
console.log("✅ VITE_API_URL =", import.meta.env.VITE_API_URL)

// 🧩 Detecta automáticamente si estás en desarrollo o producción
const baseName = import.meta.env.DEV ? "/" : "/biblioteca-juegos-frontend/"

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
