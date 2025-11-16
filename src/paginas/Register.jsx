import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register({ onRegister }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    userName: "",
    correo: "",
    password: "",
    fotoPerfil: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 URL correcta con "/" final
  const API_URL =
    (import.meta.env.VITE_API_URL || "https://biblioteca-juegos-backend-production.up.railway.app/").trim();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (
      !form.nombre.trim() ||
      !form.userName.trim() ||
      !form.correo.trim() ||
      !form.password.trim()
    ) {
      setError("⚠️ Todos los campos obligatorios excepto la foto de perfil.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include",
      });

      // Evitar parsear HTML como JSON
      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Error inesperado en la respuesta del servidor.");
      }

      if (!res.ok) throw new Error(data.error || "Error al registrar usuario");

      localStorage.setItem("gt_user", JSON.stringify(data.user));
      localStorage.setItem("gt_token", data.token);

      if (onRegister) onRegister(data.user);

      alert("✅ Usuario registrado con éxito.");
      navigate("/");
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2>Crear cuenta</h2>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
          />
          <input
            type="text"
            name="userName"
            placeholder="Nombre de usuario"
            value={form.userName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fotoPerfil"
            placeholder="URL foto de perfil (opcional)"
            value={form.fotoPerfil}
            onChange={handleChange}
          />

          <button className="btn primary full" type="submit" disabled={loading}>
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
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
