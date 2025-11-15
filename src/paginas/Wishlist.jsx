import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Wishlist({ user }) {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [sort, setSort] = useState("");
  const [platform, setPlatform] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(true);

  // 🚀 Cargar wishlist solo si hay usuario
  useEffect(() => {
    async function loadWishlist() {
      try {
        setLoading(true);

        if (user && user._id) {
          const res = await fetch(`/api/users/${user._id}/wishlist`);
          const data = await res.json();
          setWishlist(data || []);
        } else {
          setWishlist([]);
        }
      } catch (err) {
        console.error("❌ Error al cargar wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, [user]);

  const stats = useMemo(() => {
    if (wishlist.length === 0) return { total: 0, sum: 0, avg: 0 };

    const precios = wishlist.map((j) => j.precio || 0);
    const sum = precios.reduce((a, b) => a + b, 0);

    return {
      total: wishlist.length,
      sum,
      avg: (sum / wishlist.length).toFixed(2),
    };
  }, [wishlist]);

  const filtered = useMemo(() => {
    let list = [...wishlist];

    if (platform) list = list.filter((j) => j.plataforma === platform);
    if (genre) list = list.filter((j) => j.genero === genre);

    if (sort === "priceAsc") list.sort((a, b) => a.precio - b.precio);
    if (sort === "priceDesc") list.sort((a, b) => b.precio - a.precio);

    return list;
  }, [wishlist, sort, platform, genre]);

  async function removeGame(juego) {
    const idJuego = juego._id || juego.id;

    setWishlist((prev) => prev.filter((x) => (x._id || x.id) !== idJuego));

    if (user && user._id) {
      try {
        await fetch(`/api/users/${user._id}/wishlist/${idJuego}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.error("Error eliminando del servidor:", err);
      }
    }
  }

  function buyGame(j) {
    if (!user || !user._id) {
      alert("🔒 Debes iniciar sesión para comprar juegos.");
      navigate("/login");
      return;
    }

    navigate("/buy", { state: { game: j } });
  }

  if (loading) return <p style={{ textAlign: "center" }}>Cargando tu lista...</p>;

  return (
    <div className="biblioteca-container">
      <aside className="sidebar">
        <h2>GameTracker 🎮</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>Biblioteca</li>
            <li className="active" onClick={() => navigate("/wishlist")}>
              Lista de deseos
            </li>
            <li onClick={() => navigate("/community")}>Comunidad</li>
            <li onClick={() => navigate("/settings")}>Configuración</li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <h1>💖 Tu lista de deseos</h1>

        {wishlist.length > 0 && (
          <div className="wishlist-stats">
            <p>
              <strong>Total:</strong> {stats.total} juegos
            </p>
            <p>
              <strong>Precio total:</strong> ${stats.sum.toLocaleString()}
            </p>
            <p>
              <strong>Promedio:</strong> ${stats.avg}
            </p>
          </div>
        )}

        {wishlist.length === 0 ? (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <h3>💭 Aún no tienes juegos en tu lista de deseos.</h3>
            <p>¡Anímate a añadir tus favoritos desde la biblioteca! 🎮</p>
            <button className="btn primary" onClick={() => navigate("/")}>
              ← Volver a Biblioteca
            </button>
          </div>
        ) : (
          <div className="lista-juegos">
            {filtered.map((j) => (
              <div key={j._id || j.id} className="juego-card">
                <img src={j.imagen} alt={j.titulo} />
                <h3>{j.titulo}</h3>
                <p>
                  {j.genero} • {j.plataforma}
                </p>
                <p>
                  💲{j.precio === 0 ? "Gratis" : j.precio.toLocaleString("es-CO")}
                </p>

                <div className="card-buttons">
                  <button
                    className="btn"
                    onClick={() => navigate(`/game/${j._id || j.id}`)}
                  >
                    Ver más
                  </button>

                  <button className="btn primary" onClick={() => buyGame(j)}>
                    Comprar
                  </button>

                  <button
                    className="btn outline danger"
                    onClick={() => removeGame(j)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
