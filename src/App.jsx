import React, { createContext, useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// 📄 Páginas
import BibliotecaJuegos from "./paginas/BibliotecaJuegos";
import GameDetail from "./paginas/GameDetail";
import Settings from "./paginas/Settings";
import Wishlist from "./paginas/wishlist";
import Login from "./paginas/Login";
import Register from "./paginas/Register";
import Buy from "./paginas/Buy";
import Community from "./paginas/Community"; 

// ⚙️ Componentes
import AuthButtons from "./components/AuthButtons";
import ProfileBox from "./components/ProfileBox";

// 🔹 Crear contexto de usuario
export const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

export default function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("gt_user")) || null
  );

  function handleLogin(u) {
    localStorage.setItem("gt_user", JSON.stringify(u));
    setUser(u);
  }

  function handleLogout() {
    localStorage.removeItem("gt_user");
    localStorage.removeItem("gt_token");
    setUser(null);
  }

  return (
    <UserContext.Provider value={{ user, setUser, handleLogin, handleLogout }}>
      <header className="topbar">
        <div className="brand">GameTracker</div>
        <div className="top-actions">
          {user ? (
            <ProfileBox user={user} onLogout={handleLogout} />
          ) : (
            <AuthButtons />
          )}
        </div>
      </header>

      <Routes>
        {/* 🏠 Biblioteca principal */}
        <Route path="/" element={<BibliotecaJuegos user={user} />} />

        {/* 💖 Lista de deseos */}
        <Route
          path="/wishlist"
          element={
            user ? (
              <Wishlist user={user} />
            ) : (
              <Navigate to="/biblioteca-juegos-frontend/login" />
            )
          }
        />

        {/* 🎮 Detalle de juego */}
        <Route path="/game/:id" element={<GameDetail user={user} />} />

        {/* ⚙️ Configuración */}
        <Route path="/Settings" element={<Settings user={user} />} />

        {/* 🌍 Comunidad */}
        <Route path="/Community" element={<Community user={user} />} />

        {/* 💰 Compra de juegos */}
        <Route path="/Buy" element={<Buy user={user} />} />

        {/* 🔐 Autenticación */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleLogin} />} />
      </Routes>
    </UserContext.Provider>
  );
}
