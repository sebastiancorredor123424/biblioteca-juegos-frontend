import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function GameDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isFavorite, setIsFavorite] = useState(false);
  const [hoursPlayed, setHoursPlayed] = useState("");
  const [completed, setCompleted] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "https://biblioteca-juegos-backend-production.up.railway.app";
  const token = localStorage.getItem("gt_token");

  // === CARGAR JUEGO + DATOS DEL USUARIO ===
  useEffect(() => {
    async function loadGame() {
      try {
        setLoading(true);

        const res = await fetch(`${API_URL}/api/games/${id}`);
        if (!res.ok) throw new Error("Juego no encontrado");
        const data = await res.json();
        setJuego(data);

        if (user?._id && token) {
          const favRes = await fetch(`${API_URL}/api/users/${user._id}/favorites`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            setIsFavorite(favData.some((g) => g._id === id));
          }

          const compRes = await fetch(`${API_URL}/api/users/${user._id}/completed`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (compRes.ok) {
            const compData = await compRes.json();
            setCompleted(compData.some((g) => g._id === id));
          }

          const hoursRes = await fetch(`${API_URL}/api/users/${user._id}/hours/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
          });
          if (hoursRes.ok) {
            const hoursData = await hoursRes.json();
            setHoursPlayed(hoursData?.hours || 0);
          }
        }

      } catch (err) {
        console.error("❌ Error cargando datos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGame();
  }, [id, user, token, API_URL]);

  if (loading) return <p>Cargando...</p>;
  if (!juego) return <h1>Juego no encontrado</h1>;

  const precio = juego.precio || 100000;

  // 🔹 RUTA CORRECTA → NO modificar, usar tal cual viene del backend
  const bannerUrl = juego.banner;

  // === FAVORITO ===
  async function toggleFavorite() {
    if (!user?._id || !token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/favorites`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: juego._id }),
      });

      if (!res.ok) throw new Error("Error actualizando favoritos");

      const data = await res.json();
      setIsFavorite(data.favorite);
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo actualizar favoritos");
    }
  }

  // === COMPLETADO ===
  async function toggleCompleted() {
    if (!user?._id || !token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/completed`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: juego._id }),
      });

      if (!res.ok) throw new Error("Error actualizando completados");

      const data = await res.json();
      setCompleted(data.completed);
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo actualizar completados");
    }
  }

  // === HORAS ===
  async function saveHours() {
    if (!user?._id || !token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/hours`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          gameId: juego._id,
          hoursPlayed: Number(hoursPlayed),
        }),
      });

      if (!res.ok) throw new Error("Error guardando horas");

      alert("⏱️ Horas guardadas");
    } catch (err) {
      console.error(err);
      alert("❌ Error al guardar horas");
    }
  }

  function handleBuy(j) {
    if (!user) return navigate("/login");
    navigate("/buy", { state: { game: { ...j, precio } } });
  }

  async function addWishlist(j) {
    if (!user?._id || !token) return navigate("/login");

    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/wishlist`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ gameId: j._id }),
      });

      if (!res.ok) throw new Error("Error agregando a wishlist");
      alert("💖 Añadido a deseos");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo agregar a deseos");
    }
  }

  return (
    <div className="game-detail">
      <div className="detail-top">
        <img className="detail-banner" src={bannerUrl} alt={juego.titulo} />

        <div className="detail-card">
          <h1>{juego.titulo}</h1>
          <p><strong>Género:</strong> {juego.genero}</p>
          <p><strong>Plataforma:</strong> {juego.plataforma}</p>
          <p><strong>Precio:</strong> ${precio.toLocaleString("es-CO")} COP</p>
          <p><strong>Descripción:</strong> {juego.descripcion}</p>

          <button className="btn favorite" onClick={toggleFavorite}>
            {isFavorite ? "⭐ Quitar de favoritos" : "⭐ Marcar como favorito"}
          </button>

          <button className="btn completed" onClick={toggleCompleted}>
            {completed
              ? "✔ Juego completado (clic para quitar)"
              : "✔ Marcar como completado"}
          </button>

          <div className="hours-box">
            <h3>⏱️ Registrar horas jugadas</h3>
            <input
              type="number"
              min="0"
              value={hoursPlayed}
              onChange={(e) => setHoursPlayed(e.target.value)}
              placeholder="Ej: 20"
              className="input-hours"
            />
            <button className="btn save-hours" onClick={saveHours}>
              Guardar horas
            </button>
          </div>

          <button
            className="btn comment"
            onClick={() => navigate(`/community?game=${juego._id}`)}
          >
            💬 Añadir comentario
          </button>

          <div className="actions-box">
            <button className="btn buy" onClick={() => handleBuy(juego)}>
              🛒 Comprar
            </button>

            <button
              className="btn wishlist"
              onClick={() => addWishlist(juego)}
            >
              💖 Añadir a deseos
            </button>
          </div>

          <Link to="/" className="btn return">← Volver a la biblioteca</Link>
        </div>
      </div>
    </div>
  );
}
