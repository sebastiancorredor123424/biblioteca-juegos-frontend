import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const API_URL = (import.meta.env.VITE_API_URL ?? "https://biblioteca-juegos-backend-production.up.railway.app")
    .replace(/\/+$/, "") + "/";

    console.log("VITE_API_URL =>", import.meta.env.VITE_API_URL);
    console.log("API_URL FINAL =>", API_URL);

  /*async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
        credentials: "include",
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Error inesperado en la respuesta del servidor.");
      }

      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      localStorage.setItem("gt_user", JSON.stringify(data.user));
      localStorage.setItem("gt_token", data.token);

      if (onLogin) onLogin(data.user);

      alert(`🎮 Bienvenido de nuevo, ${data.user.nombre}!`);
      navigate("/");
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  }*/

    async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
        //credentials: "include",
      });

      const text = await res.text();

      console.log("Login → status:", res.status);
      console.log("Login → url:", res.url);
      console.log(
        "Login → raw response (primeros 300 chars):",
        text.slice(0, 300)
      );

      const contentType = res.headers.get("content-type") || "";

      // Si no viene JSON, mostramos el texto y lanzamos un error entendible
      if (!contentType.includes("application/json")) {
        console.error("Respuesta NO JSON desde el backend:", text);
        throw new Error(
          `El servidor devolvió una respuesta no válida (status ${res.status}).`
        );
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Error al parsear JSON:", text);
        throw new Error("No se pudo interpretar la respuesta del servidor.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      localStorage.setItem("gt_user", JSON.stringify(data.user));
      localStorage.setItem("gt_token", data.token);

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
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn primary full" type="submit">
            Ingresar
          </button>
        </form>

        <div className="auth-links">
          <Link to="/register">¿No tienes cuenta? Crea una</Link>
        </div>

        <button
          className="btn outline full"
          onClick={() => navigate("/")}
          style={{ marginTop: "10px" }}
        >
          🏠 Regresar a Biblioteca
        </button>
      </div>
    </div>
  );
}
