import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Community({ user }) {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [games, setGames] = useState([]); // AHORA VIENE DE MONGO

  const [gameFilter, setGameFilter] = useState("");
  const [platformFilter, setPlatformFilter] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [newReview, setNewReview] = useState({
    gameId: "",
    title: "",
    body: "",
    score: 5,
  });

  const [formError, setFormError] = useState("");
  const [commentText, setCommentText] = useState({});

  // ============================
  // 🔵 Cargar juegos desde Mongo
  // ============================
  async function loadGames() {
    try {
      const res = await fetch("http://localhost:4000/api/games");
      const data = await res.json();
      setGames(data); // Cada juego tiene: _id, titulo, plataforma, imagen, etc
    } catch (err) {
      console.log("❌ Error cargando juegos", err);
    }
  }

  // ============================
  // 🔵 Cargar reseñas
  // ============================
  async function loadReviews() {
    try {
      const res = await fetch("biblioteca-juegos-backend-production.up.railway.app");
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.log("❌ Error cargando reseñas", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGames();
    loadReviews();
  }, []);

  // ============================
  // 🟡 Crear reseña
  // ============================
  async function handleNewReviewSubmit(e) {
    e.preventDefault();
    setFormError("");

    if (!user) {
      alert("Debes iniciar sesión");
      return navigate("/login");
    }

    if (!newReview.gameId)
      return setFormError("Selecciona un juego.");
    if (newReview.title.trim().length < 5)
      return setFormError("El título debe tener mínimo 5 caracteres.");
    if (newReview.body.trim().length < 50)
      return setFormError("La reseña debe tener mínimo 50 caracteres.");

    const payload = {
      gameId: newReview.gameId, // AHORA ES UN ObjectId válido
      userName: user.name || user.username || user.correo,
      title: newReview.title.trim(),
      body: newReview.body.trim(),
      score: Number(newReview.score),
    };

    console.log("Payload enviado:", payload);

    try {
      const res = await fetch("http://localhost:4000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error creando reseña");
      }

      const created = await res.json();
      setReviews((prev) => [created, ...prev]);
      setNewReview({ gameId: "", title: "", body: "", score: 5 });
    } catch (err) {
      console.log("❌ Error creando reseña", err);
      setFormError(err.message);
    }
  }

  // ============================
  // 🟣 Eliminar reseña
  // ============================
  async function removeReview(id, author) {
    if (!user || (user.name || user.username) !== author)
      return alert("Solo el autor puede borrar su reseña.");

    if (!confirm("¿Eliminar reseña?")) return;

    try {
      await fetch(`http://localhost:4000/api/reviews/${id}`, { method: "DELETE" });
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log("❌ Error eliminando reseña", err);
    }
  }

  // ============================
  // 🔵 Comentar reseña
  // ============================
  async function handleAddComment(id) {
    if (!user) return alert("Inicia sesión.");

    const body = commentText[id]?.trim();
    if (!body || body.length < 2) return;

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: user.name, text: body }),
      });

      const data = await res.json();

      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, replies: data.replies } : r))
      );

      setCommentText((s) => ({ ...s, [id]: "" }));
    } catch (err) {
      console.log("❌ Error comentando", err);
    }
  }

  // ============================
  // ❤️ Like
  // ============================
  async function toggleLike(id) {
    if (!user) return alert("Inicia sesión.");

    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName: user.name }),
      });

      const data = await res.json();
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, likes: data.likes } : r))
      );
    } catch (err) {
      console.log("❌ Error dando like", err);
    }
  }

  // ============================
  // 🧮 Filtros y orden
  // ============================
  const filtered = useMemo(() => {
    let list = [...reviews];

    if (gameFilter)
      list = list.filter((r) => r.gameId?._id === gameFilter);

    if (platformFilter)
      list = list.filter((r) => {
        const g = games.find((x) => x._id === r.gameId?._id);
        return g && g.plataforma === platformFilter;
      });

    if (sortBy === "recent")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (sortBy === "top")
      list.sort((a, b) => b.score - a.score);

    return list;
  }, [reviews, games, gameFilter, platformFilter, sortBy]);

  if (loading) return <p style={{ padding: 20 }}>Cargando reseñas...</p>;

  return (
    <div className="biblioteca-container">
      <aside className="sidebar">
        <h2>GameTracker 🎮</h2>
        <nav>
          <ul>
            <li onClick={() => navigate("/")}>Biblioteca</li>
            <li onClick={() => navigate("/wishlist")}>Lista de deseos</li>
            <li onClick={() => navigate("/settings")}>Configuración</li>
            <li className="active" onClick={() => navigate("/community")}>Comunidad</li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <h1>📣 Comunidad — Reseñas</h1>

        {/* FILTROS */}
        <div style={{ display: "flex", gap: 10 }}>
          <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)}>
            <option value="">Todos los juegos</option>
            {games.map((g) => (
              <option key={g._id} value={g._id}>
                {g.titulo}
              </option>
            ))}
          </select>

          <select value={platformFilter} onChange={(e) => setPlatformFilter(e.target.value)}>
            <option value="">Todas las plataformas</option>
            {[...new Set(games.map((g) => g.plataforma))].map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Más recientes</option>
            <option value="top">Mejor puntuadas</option>
          </select>
        </div>

        {/* FORMULARIO RESEÑA */}
        <div style={{ marginTop: 20, padding: 15, background: "#1112", borderRadius: 10 }}>
          <h2>✍️ Escribir reseña</h2>

          <form onSubmit={handleNewReviewSubmit}>
            <select
              value={newReview.gameId}
              onChange={(e) => setNewReview((s) => ({ ...s, gameId: e.target.value }))}
            >
              <option value="">Selecciona un juego</option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>{g.titulo}</option>
              ))}
            </select>

            <input
              placeholder="Título"
              value={newReview.title}
              onChange={(e) => setNewReview((s) => ({ ...s, title: e.target.value }))}
            />

            <textarea
              placeholder="Escribe tu reseña..."
              value={newReview.body}
              onChange={(e) => setNewReview((s) => ({ ...s, body: e.target.value }))}
              rows={4}
            />

            <select
              value={newReview.score}
              onChange={(e) =>
                setNewReview((s) => ({ ...s, score: Number(e.target.value) }))
              }
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>

            {formError && <p style={{ color: "red" }}>{formError}</p>}

            <button className="btn primary" type="submit">Publicar</button>
          </form>
        </div>

        {/* LISTA DE RESEÑAS */}
        <div style={{ marginTop: 20 }}>
          {filtered.map((r) => (
            <article key={r._id} style={{ background: "rgba(255,255,255,0.05)", padding: 15, borderRadius: 10, marginBottom: 15 }}>
              <header>
                <strong>{r.userName}</strong> — {new Date(r.createdAt).toLocaleString()}
                <div>{r.gameId?.titulo}</div>
              </header>

              <h3>{r.title}</h3>
              <p>{r.body}</p>
              <p>⭐ {r.score}/5</p>

              <button onClick={() => toggleLike(r._id)}>👍 {r.likes || 0}</button>

              {user?.name === r.userName && (
                <button className="btn danger" onClick={() => removeReview(r._id, r.userName)}>Eliminar</button>
              )}

              {/* comentarios */}
              <div style={{ marginTop: 15 }}>
                {(r.replies || []).map((c) => (
                  <div key={c.createdAt + c.userName} style={{ padding: 8, background: "#0004", borderRadius: 8, marginBottom: 5 }}>
                    <strong>{c.userName}</strong> — {new Date(c.createdAt).toLocaleString()}
                    <div>{c.body}</div>
                  </div>
                ))}

                <div style={{ display: "flex", gap: 10 }}>
                  <input
                    value={commentText[r._id] || ""}
                    onChange={(e) => setCommentText((s) => ({ ...s, [r._id]: e.target.value }))}
                    placeholder="Comentar..."
                    style={{ flex: 1 }}
                  />
                  <button className="btn" onClick={() => handleAddComment(r._id)}>Enviar</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
