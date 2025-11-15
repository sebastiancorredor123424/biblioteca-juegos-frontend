import React, { useEffect, useMemo, useState } from "react";
import juegos from "../data/juegos";
import Banner from "../components/Banner";
import { useNavigate } from "react-router-dom";

const GENRES = ["", "Acción", "Lucha", "Deportes", "Plataformas"];
const PLATFORMS = ["", "PC", "PlayStation", "Switch", "Xbox"];

export default function BibliotecaJuegos({ user }) {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [genre, setGenre] = useState("");
  const [platform, setPlatform] = useState("");

  const [wishlist, setWishlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gt_wishlist") || "[]");
    } catch {
      return [];
    }
  });

  const [purchased, setPurchased] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gt_purchased") || "[]");
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gt_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("gt_wishlist", JSON.stringify(wishlist));
    localStorage.setItem("gt_purchased", JSON.stringify(purchased));
    localStorage.setItem("gt_favorites", JSON.stringify(favorites));
  }, [wishlist, purchased, favorites]);

  // ✅ Añadir a lista de deseos con validaciones
  function addWishlist(j) {
    if (!user) {
      alert("🔒 Debes iniciar sesión para agregar juegos a tu lista de deseos.");
      navigate("/login");
      return;
    }

    if (wishlist.find((x) => x.id === j.id))
      return alert("⚠️ Este juego ya está en tu lista de deseos.");
    if (purchased.find((x) => x.id === j.id))
      return alert("✅ Ya compraste este juego, no puedes añadirlo a deseos.");

    setWishlist((prev) => [...prev, j]);
    alert(`💖 ${j.titulo} añadido a tu lista de deseos.`);
  }

  // ✅ Añadir a favoritos (solo si el juego está comprado)
  function addFavorite(j) {
    if (!user) {
      alert("🔒 Debes iniciar sesión para agregar a favoritos.");
      navigate("/login");
      return;
    }

    if (!purchased.find((x) => x.id === j.id)) {
      alert("⚠️ Solo puedes marcar como favorito un juego que hayas comprado.");
      return;
    }

    if (favorites.find((x) => x.id === j.id)) {
      alert("⭐ Este juego ya está en tus favoritos.");
      return;
    }

    setFavorites((prev) => [...prev, j]);
    alert(`⭐ ${j.titulo} añadido a tus favoritos.`);
  }

  // ✅ Actualizar horas jugadas
  function updatePlaytime(j, hours) {
    setPurchased((prev) =>
      prev.map((x) =>
        x.id === j.id ? { ...x, horasJugadas: Number(hours) || 0 } : x
      )
    );
  }

  // ✅ Comprar redirige a /buy
  function buy(j) {
    if (!user) {
      alert("🔒 Debes iniciar sesión para comprar juegos.");
      navigate("/login");
      return;
    }

    // Guardar el juego seleccionado temporalmente en localStorage
    localStorage.setItem("gt_cart", JSON.stringify([j]));

    // Redirigir a la página de compra
    navigate("/buy");
  }

  // ✅ Filtros
  const filtered = useMemo(() => {
    return juegos.filter((j) => {
      if (genre && j.genero !== genre) return false;
      if (platform && j.plataforma !== platform) return false;
      if (busqueda.trim()) {
        const s = busqueda.trim().toLowerCase();
        return j.titulo.toLowerCase().includes(s);
      }
      return true;
    });
  }, [genre, platform, busqueda]);

  return (
    <div className="biblioteca-container">
      <aside className="sidebar">
        <h2>GameTracker 🎮</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>Biblioteca</li>
            <li onClick={() => navigate("/wishlist")}>Lista de deseos</li>
            <li onClick={() => navigate("/settings")}>Configuración</li>
            <li onClick={() => navigate("/community")}>Comunidad</li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <Banner />

        <div className="controls-row">
          <input
            placeholder="Buscar juego..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((g) => (
              <option key={g} value={g}>
                {g || "Todos los géneros"}
              </option>
            ))}
          </select>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p || "Todas las plataformas"}
              </option>
            ))}
          </select>
        </div>

        {!user && (
          <p className="warning">
            🔒 Inicia sesión para comprar o agregar juegos a tu lista de deseos.
          </p>
        )}

        <div className="lista-juegos">
          {filtered.map((j) => {
            const comprado = purchased.find((x) => x.id === j.id);
            const esFavorito = favorites.find((x) => x.id === j.id);

            return (
              <div key={j.id} className="juego-card">
                <img src={j.imagen} alt={j.titulo} />
                <h3>{j.titulo}</h3>
                <p className="meta">
                  {j.genero} • {j.plataforma}
                </p>
                <p className="desc">{j.descripcion}</p>

                {comprado && (
                  <div className="playtime-section">
                    <label>
                      ⏱️ Horas jugadas:
                      <input
                        type="number"
                        min="0"
                        value={comprado.horasJugadas || ""}
                        onChange={(e) => updatePlaytime(j, e.target.value)}
                        placeholder="Ej: 12"
                        style={{ width: "80px", marginLeft: "8px" }}
                      />
                    </label>
                  </div>
                )}

                <div className="card-buttons">
                  <button
                    className="btn"
                    onClick={() => navigate(`/game/${j.id}`)}
                  >
                    Ver más
                  </button>

                  {user ? (
                    <>
                      <button className="btn primary" onClick={() => buy(j)}>
                        Comprar
                      </button>
                      <button
                        className="btn outline"
                        onClick={() => addWishlist(j)}
                      >
                        Añadir a deseos
                      </button>

                      {comprado && (
                        <button
                          className={`btn ${
                            esFavorito ? "disabled" : "highlight"
                          }`}
                          onClick={() => addFavorite(j)}
                        >
                          ⭐ {esFavorito ? "En favoritos" : "Añadir a favoritos"}
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="warning">🔒 Inicia sesión para interactuar.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
