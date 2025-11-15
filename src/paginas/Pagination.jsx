import React from "react";

export default function Pagination({ currentPage, totalPages, setPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
      {/* Botones Inicio / Anterior */}
      <button
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
      >
        ⏮ Inicio
      </button>
      <button
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ◀ Anterior
      </button>

      {/* Botones de página */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all transform hover:scale-105 ${
            currentPage === num
              ? "bg-blue-600 shadow-blue-400"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
          onClick={() => setPage(num)}
        >
          {num}
        </button>
      ))}

      {/* Botones Siguiente / Fin */}
      <button
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Siguiente ▶
      </button>
      <button
        className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-shadow shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
      >
        ⏭ Fin
      </button>
    </div>
  );
}
