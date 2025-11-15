import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import Pagination from "./Pagination";

export default function BibliotecaJuegos({ user }) {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [genre, setGenre] = useState("");
  const [tag, setTag] = useState("");
  const [platform, setPlatform] = useState("");
  const [juegosApi, setJuegosApi] = useState([]);

  const [wishlist, setWishlist] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [completados, setCompletados] = useState([]);

  const [loading, setLoading] = useState(true);

  // 🔵 toggles
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [soloCompletados, setSoloCompletados] = useState(false);

  // 🔵 Modal agregar/editar
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [newGame, setNewGame] = useState({
    clave: "",
    titulo: "",
    genero: "",
    plataforma: "",
    imagen: "",
    banner: "",
    descripcion: "",
    historia: "",
    requisitosMinimos: "",
    precio: 0,
    descargas: 0,
    completado: false,
    calificacion: 0,
  });

  // 🎭 Géneros y etiquetas
  const genres = [
    "Acción","Aventura","RPG","Shooter","Estrategia","Simulación",
    "Carreras","Deportes","Peleas","Survival Horror","Sandbox",
    "Mundo Abierto","Puzzle","Plataformas","MMORPG","Roguelike",
    "Roguelite","Metroidvania","Terror","Indie","Casual",
    "Battle Royale","RTS","Turnos","Narrativo","Musical"
  ];

  const etiquetas = [
    "Multijugador","Cooperativo","Historia profunda","Pixel Art",
    "Mundo Abierto","Difícil","Realista","Retro","Anime",
    "Ciencia Ficción","Fantasía","Espacio","Supervivencia",
    "Zombis","Construcción","Sigilo","Táctico","Velocidad",
    "Magia","Artes Marciales","Rompecabezas","Vehículos",
    "Cyberpunk","Steampunk","Detectives","Exploración","VR",
    "Guerra","Futurista","Antiguo","Mitología","Robots",
    "Hack & Slash","Espadas","Armas","Cartoon","Cute",
    "Medieval","Horror Psicológico","Puzzle 3D","Puzzle 2D",
    "Narrativa fuerte","Sandbox total","Ultradifícil"
  ];

  // 🔹 URL y token (✅ actualizada para producción)
  const API_URL = "https://biblioteca-juegos-backend-production.up.railway.app";
  const token = localStorage.getItem("gt_token");

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 8;

  // 🔹 Cargar juegos
  useEffect(() => {
    async function loadGames() {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/games`);
        const data = await res.json();
        setJuegosApi(data);
      } catch (err) {
        console.error("Error al cargar juegos:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGames();
  }, []);

  // 🔹 Cargar datos del usuario
  useEffect(() => {
    if (!user?._id || !token) return;

    async function loadUserData() {
      try {
        const wishlistRes = await fetch(`${API_URL}/api/users/${user._id}/wishlist`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (wishlistRes.ok) setWishlist(await wishlistRes.json() || []);

        const favRes = await fetch(`${API_URL}/api/users/${user._id}/favorites`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (favRes.ok) setFavoritos(await favRes.json() || []);

        const compRes = await fetch(`${API_URL}/api/users/${user._id}/completed`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (compRes.ok) setCompletados(await compRes.json() || []);
      } catch (err) {
        console.error("❌ Error cargando datos del usuario:", err);
      }
    }

    loadUserData();
  }, [user, token]);

  // 🔹 Añadir a wishlist
  async function addWishlist(juego) {
    if (!user || !token) {
      alert("🔒 Debes iniciar sesión para agregar juegos.");
      navigate("/login");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/users/${user._id}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ gameId: juego._id }),
      });
      if (res.ok) {
        const data = await res.json();
        setWishlist(data.wishlist || [...wishlist, juego]);
        alert("💖 Añadido a tu lista de deseos.");
      } else alert("⚠️ Error al añadir.");
    } catch (err) {
      console.error("Error al añadir a wishlist:", err);
    }
  }

  // 🔹 Crear o editar juego
  async function handleSaveGame(e) {
    e.preventDefault();
    if (!token) return alert("Debes iniciar sesión.");

    const method = showEditModal ? "PUT" : "POST";
    const url = showEditModal ? `${API_URL}/api/games/${selectedGame._id}` : `${API_URL}/api/games`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(newGame)
      });
      if (!res.ok) throw new Error("Error guardando juego");
      const saved = await res.json();

      if (showEditModal) {
        setJuegosApi(prev => prev.map(j => j._id === saved._id ? saved : j));
        setShowEditModal(false);
        setSelectedGame(null);
      } else {
        setJuegosApi(prev => [...prev, saved]);
        setShowAddModal(false);
      }

      setNewGame({
        clave: "", titulo: "", genero: "", plataforma: "",
        imagen: "", banner: "", descripcion: "", historia: "",
        requisitosMinimos: "", precio: 0, descargas: 0,
        completado: false, calificacion: 0,
      });

      alert("🎮 Juego guardado con éxito!");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo guardar el juego.");
    }
  }

  // 🔹 Eliminar juego
  async function handleDeleteGame(juego) {
    if (!token) return alert("Debes iniciar sesión.");
    if (!window.confirm(`¿Seguro que quieres eliminar "${juego.titulo}"?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/games/${juego._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error eliminando juego");
      setJuegosApi(prev => prev.filter(j => j._id !== juego._id));
      alert("🗑️ Juego eliminado correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ No se pudo eliminar el juego.");
    }
  }

  // 🔹 Filtros
  const filtered = useMemo(() => {
    return juegosApi.filter(j => {
      if (genre && j.genero !== genre) return false;
      if (tag && (!j.etiquetas || !j.etiquetas.includes(tag))) return false;
      if (platform && j.plataforma !== platform) return false;
      if (busqueda.trim() && !j.titulo.toLowerCase().includes(busqueda.trim().toLowerCase())) return false;
      if (soloFavoritos && !favoritos.some(f => f._id === j._id)) return false;
      if (soloCompletados && !completados.some(c => c._id === j._id)) return false;
      return true;
    });
  }, [juegosApi, genre, tag, platform, busqueda, soloFavoritos, soloCompletados, favoritos, completados]);

  // 🔹 Paginación
  const totalPages = Math.ceil(filtered.length / gamesPerPage);
  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filtered.slice(indexOfFirstGame, indexOfLastGame);

  function isInWishlist(id) {
    return wishlist.some(w => w._id === id);
  }

  function openEditModal(juego) {
    setSelectedGame(juego);
    setNewGame({ ...juego });
    setShowEditModal(true);
  }

  return (
    <div className="biblioteca-container">
      <aside className="sidebar">
        <h2>GameTracker 🎮</h2>
        <nav>
          <ul>
            <li className="active" onClick={() => navigate("/")}>Biblioteca</li>
            <li onClick={() => navigate("/wishlist")}>Lista de deseos</li>
            <li onClick={() => navigate("/community")}>Comunidad</li>
          </ul>
        </nav>
      </aside>

      <main className="contenido">
        <Banner />

        {/* 🔵 Filtros y botones */}
        <div className="flex gap-4 mb-4 mt-2">
          <button onClick={() => setSoloFavoritos(s => !s)} className={`btn ${soloFavoritos ? "primary" : "outline"}`}>⭐ Favoritos</button>
          <button onClick={() => setSoloCompletados(s => !s)} className={`btn ${soloCompletados ? "success" : "outline"}`}>✔ Completados</button>
          {user && token && <button className="btn outline" onClick={() => setShowAddModal(true)}>➕ Añadir Juego</button>}
        </div>

        {/* 🔹 Modal añadir/editar */}
        {(showAddModal || showEditModal) && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>{showEditModal ? "Editar juego" : "Agregar nuevo juego"}</h3>
              <form onSubmit={handleSaveGame} className="flex flex-col gap-2">
                <input type="text" placeholder="Clave" value={newGame.clave} onChange={(e) => setNewGame({...newGame, clave: e.target.value})} required />
                <input type="text" placeholder="Título" value={newGame.titulo} onChange={(e) => setNewGame({...newGame, titulo: e.target.value})} required />
                <input type="text" placeholder="Género" value={newGame.genero} onChange={(e) => setNewGame({...newGame, genero: e.target.value})} required />
                <input type="text" placeholder="Plataforma" value={newGame.plataforma} onChange={(e) => setNewGame({...newGame, plataforma: e.target.value})} required />
                <input type="text" placeholder="URL Imagen" value={newGame.imagen} onChange={(e) => setNewGame({...newGame, imagen: e.target.value})} required />
                <input type="text" placeholder="URL Banner" value={newGame.banner} onChange={(e) => setNewGame({...newGame, banner: e.target.value})} required />
                <input type="text" placeholder="Descripción" value={newGame.descripcion} onChange={(e) => setNewGame({...newGame, descripcion: e.target.value})} required />
                <input type="text" placeholder="Historia" value={newGame.historia} onChange={(e) => setNewGame({...newGame, historia: e.target.value})} required />
                <input type="text" placeholder="Requisitos mínimos" value={newGame.requisitosMinimos} onChange={(e) => setNewGame({...newGame, requisitosMinimos: e.target.value})} required />
                <input type="number" placeholder="Precio" value={newGame.precio} onChange={(e) => setNewGame({...newGame, precio: Number(e.target.value)})} required />
                <input type="number" placeholder="Descargas" value={newGame.descargas} onChange={(e) => setNewGame({...newGame, descargas: Number(e.target.value)})} required />
                <input type="number" placeholder="Calificación" value={newGame.calificacion} step="0.1" onChange={(e) => setNewGame({...newGame, calificacion: Number(e.target.value)})} required />
                <div className="flex gap-2 mt-2">
                  <button className="btn primary" type="submit">Guardar</button>
                  <button className="btn outline" type="button" onClick={() => { setShowAddModal(false); setShowEditModal(false); setSelectedGame(null); }}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 🔍 Barra de búsqueda */}
        <div className="filtros flex gap-2 mb-4">
          <input type="text" placeholder="Buscar juego..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="buscador-input flex-1" />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            <option value="">Todos los géneros</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">Todas las etiquetas</option>
            {etiquetas.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <p>Cargando juegos...</p>
        ) : (
          <>
            <div className="lista-juegos grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300">
              {currentGames.map(j => {
                const enDeseos = isInWishlist(j._id);
                return (
                  <div key={j._id} className="juego-card bg-gray-900 p-3 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
                    <img src={j.imagen} alt={j.titulo} className="rounded-lg mb-2 w-full h-40 object-cover"/>
                    <h3 className="text-lg font-semibold mb-1">{j.titulo}</h3>
                    <p className="text-sm text-gray-400 mb-1">{j.genero} • {j.plataforma}</p>
                    <p className="text-sm text-green-400 mb-2">💲{j.precio?.toLocaleString("es-CO")} COP</p>

                    <div className="card-buttons">
                      <button className="btn ver" onClick={() => navigate(`/game/${j._id}`)}>Ver más</button>
                      {enDeseos ? (
                        <button className="btn deseos gold" disabled>★ En deseos</button>
                      ) : (
                        <button className="btn deseos outline" onClick={() => addWishlist(j)}>Añadir a deseos</button>
                      )}
                      <button className="btn comprar success" onClick={() => navigate("/buy", { state: { game: j } })}>Comprar</button>
                      {user && token && (
                        <>
                          <button className="btn editar primary" onClick={() => openEditModal(j)}>Editar</button>
                          <button className="btn eliminar outline" onClick={() => handleDeleteGame(j)}>Eliminar</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 🔹 Paginación */}
            <Pagination currentPage={currentPage} totalPages={totalPages} setPage={setCurrentPage} />
          </>
        )}
      </main>
    </div>
  );
}
