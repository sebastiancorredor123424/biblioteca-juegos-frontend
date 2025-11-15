import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings({ user: propUser }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("cuenta");

  
  // 🔹 URL base del backend (Railway)
  const API_URL = "https://biblioteca-juegos-backend-production.up.railway.app";

  // 🔐 Usuario desde sesión o prop
  const [user, setUser] = useState(() => {
    const localUser = JSON.parse(localStorage.getItem("gt_user"));
    return propUser || localUser || null;
  });

  const [profileData, setProfileData] = useState({
    foto: user?.foto || "",
    nombre: user?.nombre || "",
    username: user?.username || "",
    bio: user?.bio || "",
    birth: user?.birth || "",
    gender: user?.gender || "",
    country: user?.country || "",
    language: user?.language || "Español",
    correo: user?.correo || "",
    phone: user?.phone || "",
    visibility: user?.visibility || "Público",
    showOnline: user?.showOnline ?? true,
  });

  // ✅ Protección de acceso
  useEffect(() => {
    if (!user || !user.correo) {
      alert("⚠️ Debes iniciar sesión o crear una cuenta para acceder a Configuración.");
      navigate("/login");
    }
  }, [user, navigate]);

  // ✅ Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setProfileData({ ...profileData, [name]: checked });
    } else if (type === "file") {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, foto: reader.result });
        const updatedUser = { ...user, foto: reader.result };
        localStorage.setItem("gt_user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };

  // ✅ Guardar cambios de perfil
  const handleSaveProfile = () => {
    const updatedUser = { ...user, ...profileData };
    localStorage.setItem("gt_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    alert("✅ Perfil actualizado correctamente.");
  };

  if (!user) return null;

  return (
    <div className="biblioteca-container">
      <aside className="sidebar">
        <h2>GameTracker 🎮</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>Biblioteca</li>
            <li onClick={() => navigate("/wishlist")}>Lista de deseos</li>
            <li className="active" onClick={() => navigate("/settings")}>
              Configuración
            </li>
            <li onClick={() => navigate("/community")}>Comunidad</li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <h1>⚙️ Configuración</h1>

        <div className="tabs">
          {[
            ["cuenta", "Cuenta"],
            ["seguridad", "Seguridad"],
            ["notificaciones", "Notificaciones"],
            ["privacidad", "Privacidad"],
            ["juego", "Juego"],
            ["audioVideo", "Audio y Video"],
            ["pagos", "Pagos y Facturación"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={`tab-btn ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === "cuenta" && (
            <>
              <h2>👤 Configuración de cuenta</h2>
              <section>
                <h3>Información personal</h3>
                <label>Foto de perfil:</label>
                <input type="file" accept="image/*" onChange={handleChange} />
                {profileData.foto && (
                  <img
                    src={profileData.foto}
                    alt="Perfil"
                    style={{ width: 100, height: 100, borderRadius: "50%", marginTop: 10 }}
                  />
                )}
                <label>Nombre completo:</label>
                <input
                  type="text"
                  name="nombre"
                  value={profileData.nombre}
                  onChange={handleChange}
                />
                <label>Nombre de usuario:</label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                />
                <label>Biografía:</label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                />
                <label>Fecha de nacimiento:</label>
                <input
                  type="date"
                  name="birth"
                  value={profileData.birth}
                  onChange={handleChange}
                />
                <label>Género:</label>
                <select name="gender" value={profileData.gender} onChange={handleChange}>
                  <option>Masculino</option>
                  <option>Femenino</option>
                  <option>Otro</option>
                </select>
                <label>País:</label>
                <input
                  type="text"
                  name="country"
                  value={profileData.country}
                  onChange={handleChange}
                />
                <label>Idioma preferido:</label>
                <select name="language" value={profileData.language} onChange={handleChange}>
                  <option>Español</option>
                  <option>Inglés</option>
                  <option>Portugués</option>
                </select>
              </section>

              <section>
                <h3>Datos de contacto</h3>
                <label>Correo electrónico:</label>
                <input
                  type="email"
                  name="correo"
                  value={profileData.correo}
                  onChange={handleChange}
                />
                <label>Teléfono móvil:</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </section>

              <section>
                <h3>Privacidad</h3>
                <label>Visibilidad del perfil:</label>
                <select name="visibility" value={profileData.visibility} onChange={handleChange}>
                  <option>Público</option>
                  <option>Amigos</option>
                  <option>Solo yo</option>
                </select>
                <label>
                  Mostrar estado en línea:
                  <input
                    type="checkbox"
                    name="showOnline"
                    checked={profileData.showOnline}
                    onChange={handleChange}
                  />
                  Sí
                </label>
              </section>

              <button className="btn primary" onClick={handleSaveProfile}>
                Guardar cambios
              </button>
            </>
          )}

          {activeTab === "seguridad" && (
            <>
              <h2>🔒 Seguridad</h2>
              <section>
                <h3>Cambiar contraseña</h3>
                <input type="password" placeholder="Contraseña actual" />
                <input type="password" placeholder="Nueva contraseña" />
                <input type="password" placeholder="Confirmar nueva contraseña" />
                <button className="btn primary">Actualizar contraseña</button>
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
