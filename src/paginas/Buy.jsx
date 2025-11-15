import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Buy({ user }) {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Cargar juego desde estado o localStorage
  const [cart, setCart] = useState(() => {
    const stateGame = location.state?.game;
    if (stateGame) {
      localStorage.setItem("gt_cart", JSON.stringify([stateGame]));
      return [stateGame];
    }
    try {
      return JSON.parse(localStorage.getItem("gt_cart")) || [];
    } catch {
      return [];
    }
  });

  const [payment, setPayment] = useState("card");
  const [cardData, setCardData] = useState({ name: "", number: "", exp: "", cvv: "" });

  // ✅ Obtener juegos ya comprados
  const purchased = JSON.parse(localStorage.getItem("gt_purchased")) || [];

  // ✅ Filtrar juegos ya comprados
  const filteredCart = cart.filter(j => !purchased.some(p => p._id === j._id));

  // ✅ Totales
  const subtotal = filteredCart.reduce((sum, j) => sum + (j.precio || 0), 0);
  const taxes = subtotal * 0.19;
  const ahorro = subtotal * 0.1;
  const total = subtotal + taxes - ahorro;

  useEffect(() => {
    if (!user) {
      alert("🔒 Debes iniciar sesión para realizar una compra.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handlePay = () => {
    if (filteredCart.length === 0) {
      alert("⚠️ Todos los juegos del carrito ya han sido comprados.");
      return;
    }

    if (payment === "card" && (!cardData.name || !cardData.number)) {
      alert("Por favor, completa los datos de la tarjeta.");
      return;
    }

    // ✅ Guardar juegos comprados
    const newPurchased = [...purchased, ...filteredCart];
    localStorage.setItem("gt_purchased", JSON.stringify(newPurchased));

    // ✅ Agregar juegos comprados a wishlist si no están ya
    const wishlist = JSON.parse(localStorage.getItem("gt_wishlist")) || [];
    const updatedWishlist = [...wishlist];
    filteredCart.forEach(game => {
      if (!wishlist.some(w => w._id === game._id)) updatedWishlist.push(game);
    });
    localStorage.setItem("gt_wishlist", JSON.stringify(updatedWishlist));

    localStorage.removeItem("gt_cart");

    alert("✅ ¡Compra Exitosa! Tus juegos ya están en tu biblioteca y wishlist.");
    navigate("/wishlist");
  };

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
        <h1>🛒 Resumen de compra</h1>

        {filteredCart.length === 0 ? (
          <p style={{ marginTop: 40 }}>
            Todos los juegos seleccionados ya han sido comprados.
          </p>
        ) : (
          <>
            <div className="lista-juegos">
              {filteredCart.map(j => (
                <div key={j._id} className="juego-card">
                  <img src={j.imagen} alt={j.titulo} />
                  <div>
                    <h3>{j.titulo}</h3>
                    <p>{j.genero} • {j.plataforma}</p>
                    <p>
                      💲 <b>{(j.precio || 0).toLocaleString()}</b>{" "}
                      <span className="discount">(-10%)</span>
                    </p>
                    <p>Edición: Estándar</p>
                    <p>Tamaño descarga: 25 GB</p>
                    <p>Idiomas: Español / Inglés</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="resumen-compra">
              <p><strong>Subtotal:</strong> ${subtotal.toLocaleString()}</p>
              <p><strong>IVA (19%):</strong> ${taxes.toLocaleString()}</p>
              <p><strong>Ahorro total:</strong> ${ahorro.toLocaleString()}</p>
              <h2>Total a pagar: ${total.toLocaleString()}</h2>
            </div>

            <h2>💳 Métodos de pago</h2>
            <div className="pago-opciones">
              <label>
                <input type="radio" name="pay" value="card" checked={payment === "card"} onChange={e => setPayment(e.target.value)} />
                Tarjeta
              </label>
              <label>
                <input type="radio" name="pay" value="paypal" checked={payment === "paypal"} onChange={e => setPayment(e.target.value)} />
                PayPal
              </label>
              <label>
                <input type="radio" name="pay" value="crypto" checked={payment === "crypto"} onChange={e => setPayment(e.target.value)} />
                Criptomonedas
              </label>
            </div>

            {payment === "card" && (
              <div className="form-pago">
                <input type="text" placeholder="Nombre del titular" value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })} />
                <input type="text" placeholder="Número de tarjeta" maxLength={16} value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} />
                <div className="row">
                  <input type="text" placeholder="MM/AA" maxLength={5} value={cardData.exp} onChange={e => setCardData({ ...cardData, exp: e.target.value })} />
                  <input type="text" placeholder="CVV" maxLength={3} value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} />
                </div>
              </div>
            )}

            <div className="botones-compra">
              <button className="btn primary" onClick={handlePay}>Confirmar y pagar</button>
              <button className="btn" onClick={() => navigate("/wishlist")}>Volver a editar pedido</button>
              <button className="btn outline" onClick={() => navigate("/")}>Cancelar compra</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
