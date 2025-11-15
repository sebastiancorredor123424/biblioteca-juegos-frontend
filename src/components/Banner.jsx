import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🔀 Función para mezclar el orden de los juegos aleatoriamente
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function Banner() {
  const [juegos, setJuegos] = useState([]);
  const [shuffledGames, setShuffledGames] = useState([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🌍 URL del backend (Railway)
  const API_URL = "https://biblioteca-juegos-backend-production.up.railway.app";

  // 🔁 Cargar juegos desde el backend
  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/games`);
        if (!res.ok) throw new Error("Error al cargar los juegos");
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const shuffled = shuffleArray(data);
          setJuegos(data);
          setShuffledGames(shuffled);
        } else {
          console.warn("⚠️ No se encontraron juegos en la base de datos.");
        }
      } catch (err) {
        console.error("❌ Error cargando juegos del backend:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  // ⏱ Cambiar automáticamente cada 5 segundos
  useEffect(() => {
    if (!shuffledGames.length) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % shuffledGames.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [shuffledGames]);

  // ⏳ Mostrar mensaje mientras carga
  if (loading) {
    return (
      <div className="banner loading">
        <p>Cargando juegos destacados...</p>
      </div>
    );
  }

  // 🚫 Si no hay juegos, mostrar aviso
  if (!shuffledGames.length) {
    return (
      <div className="banner empty">
        <p>No hay juegos disponibles en la base de datos.</p>
      </div>
    );
  }

  const j = shuffledGames[index];

  return (
    <div
      className="banner"
      onClick={() => navigate(`/game/${j._id || j.id}`)}
      role="button"
    >
      <img src={j.banner} alt={j.titulo} />
      <div className="banner-info">
        <h2>{j.titulo}</h2>
        <p>{j.descripcion}</p>
      </div>

      <div className="banner-controls">
        {shuffledGames.map((_, i) => (
          <button
            key={i}
            className={i === index ? "dot active" : "dot"}
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
          />
        ))}
      </div>
    </div>
  );
}
