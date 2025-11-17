import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ProfileBox({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="profile-box" onMouseLeave={() => setOpen(false)}>
      <div className="profile-main" onClick={() => setOpen((v) => !v)}>
        <img
          src={user.avatar || "images/default-avatar.png"}
          alt={user.name}
          className="avatar"
        />
        <span>{user.name}</span>
        <span className="caret">▾</span>
      </div>

      {open && (
        <div className="profile-menu">
          <Link to="/settings">Configuración</Link>
          <Link to="/wishlist">Lista de deseos</Link>
          <button onClick={onLogout} className="btn outline">
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
