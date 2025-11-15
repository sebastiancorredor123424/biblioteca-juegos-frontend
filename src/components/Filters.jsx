import React from "react";

export default function Filters({ filters, onChange, search, onSearch }) {
  const genres = ["Todo", "Acción", "RPG", "Deportes", "Indie", "Aventura", "Terror", "Estrategia", "Carreras"];
  const platforms = ["Todo", "PC", "PlayStation", "Xbox", "Switch", "Móvil"];
  const years = ["Todo", "2025", "2024", "2023", "2022", "2021", "2020", "2019 o anterior"];
  const prices = ["Todo", "Gratis", "Menos de $50.000", "$50.000 - $150.000", "Más de $150.000"];
  const ratings = ["Todo", "⭐ 5 estrellas", "⭐ 4 o más", "⭐ 3 o más", "⭐ 2 o más"];
  const languages = ["Todo", "Español", "Inglés", "Japonés", "Multilenguaje"];
  const modes = ["Todo", "Singleplayer", "Multiplayer", "Cooperativo"];

  return (
    <aside className="filters">
      {/* 🔍 Búsqueda */}
      <div className="search-box">
        <input
          placeholder="Buscar por título (inicia con...)"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* 🎮 Género */}
      <div className="filter-section">
        <h5>Género</h5>
        {genres.map((g) => (
          <button
            key={g}
            className={filters.genre === g ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, genre: g })}
          >
            {g}
          </button>
        ))}
      </div>

      {/* 🖥️ Plataforma */}
      <div className="filter-section">
        <h5>Plataforma</h5>
        {platforms.map((p) => (
          <button
            key={p}
            className={filters.platform === p ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, platform: p })}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ✅ Completado */}
      <div className="filter-section">
        <h5>Completado</h5>
        <button
          className={filters.completed === "Todo" ? "chip active" : "chip"}
          onClick={() => onChange({ ...filters, completed: "Todo" })}
        >
          Todo
        </button>
        <button
          className={filters.completed === "Si" ? "chip active" : "chip"}
          onClick={() => onChange({ ...filters, completed: "Si" })}
        >
          Sí
        </button>
        <button
          className={filters.completed === "No" ? "chip active" : "chip"}
          onClick={() => onChange({ ...filters, completed: "No" })}
        >
          No
        </button>
      </div>

      {/* 📅 Año de lanzamiento */}
      <div className="filter-section">
        <h5>Año de lanzamiento</h5>
        {years.map((y) => (
          <button
            key={y}
            className={filters.year === y ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, year: y })}
          >
            {y}
          </button>
        ))}
      </div>

      {/* 💰 Rango de precio */}
      <div className="filter-section">
        <h5>Precio</h5>
        {prices.map((p) => (
          <button
            key={p}
            className={filters.price === p ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, price: p })}
          >
            {p}
          </button>
        ))}
      </div>

      {/* ⭐ Calificación */}
      <div className="filter-section">
        <h5>Calificación</h5>
        {ratings.map((r) => (
          <button
            key={r}
            className={filters.rating === r ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, rating: r })}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 🌍 Idioma */}
      <div className="filter-section">
        <h5>Idioma</h5>
        {languages.map((l) => (
          <button
            key={l}
            className={filters.language === l ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, language: l })}
          >
            {l}
          </button>
        ))}
      </div>

      {/* 👥 Modo de juego */}
      <div className="filter-section">
        <h5>Modo de juego</h5>
        {modes.map((m) => (
          <button
            key={m}
            className={filters.mode === m ? "chip active" : "chip"}
            onClick={() => onChange({ ...filters, mode: m })}
          >
            {m}
          </button>
        ))}
      </div>
    </aside>
  );
}
