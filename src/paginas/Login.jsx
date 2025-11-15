import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔹 Corregido: usar URL completa del backend
  const API_URL = import.meta.env.VITE_API_URL || "https://biblioteca-juegos-backend-production.up.railway.app";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      // Guardar usuario y token
      localStorage.setItem("gt_user", JSON.stringify(data.user));
      localStorage.setItem("gt_token", data.token);

      // Actualizar estado global
      if (onLogin) onLogin(data.user);

      alert(`🎮 Bienvenido de nuevo, ${data.user.nombre}!`);
      navigate("/"); 
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Iniciar sesión</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn primary full" type="submit">Ingresar</button>
        </form>

        <div className="auth-links">
          <Link to="/register">¿No tienes cuenta? Crea una</Link>
        </div>

        <button className="btn outline full" onClick={() => navigate("/")} style={{ marginTop: "10px" }}>
          🏠 Regresar a Biblioteca
        </button>
      </div>
    </div>
  );
}
