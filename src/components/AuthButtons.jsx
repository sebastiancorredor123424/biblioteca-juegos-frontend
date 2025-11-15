import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthButtons() {
  const navigate = useNavigate();

  return (
    <div className="auth-buttons">
      <button className="btn outline" onClick={() => navigate("/register")}>
        Crear cuenta
      </button>
      <button className="btn primary" onClick={() => navigate("/login")}>
        Iniciar sesión
      </button>
    </div>
  );
}
