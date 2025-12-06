import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useCarrito } from "../context/CarritoContext";
import authService from "../services/authService";
import "./CartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const {
    carrito,
    loading,
    error,
    cargarCarrito,
    actualizarCantidad,
    eliminarItem,
    vaciarCarrito,
    obtenerCantidadTotal,
  } = useCarrito();

  // Obtener datos para el Header
  const user = authService.getCurrentUser();
  const cartItemsCount = obtenerCantidadTotal();

  // Cargar carrito al montar si no existe
  useEffect(() => {
    if (!carrito && authService.isAuthenticated()) {
      cargarCarrito();
    }
  }, [carrito, cargarCarrito]);

  const handleCantidadChange = async (itemId, nuevaCantidad) => {
    if (nuevaCantidad < 1) return;
    try {
      await actualizarCantidad(itemId, nuevaCantidad);
    } catch (err) {
      alert("Error al actualizar cantidad: " + (err?.message || ""));
    }
  };

  const handleEliminarItem = async (itemId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await eliminarItem(itemId);
      } catch (err) {
        alert("Error al eliminar item: " + (err?.message || ""));
      }
    }
  };

  const handleVaciarCarrito = async () => {
    if (window.confirm("¿Estás seguro de vaciar el carrito?")) {
      try {
        await vaciarCarrito();
      } catch (err) {
        alert("Error al vaciar carrito: " + (err?.message || ""));
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  // Extraer items de forma segura
  const items = Array.isArray(carrito?.items) ? carrito.items : [];
  const isEmpty = !loading && items.length === 0;

  // Renderizado de carga
  if (loading && !carrito) {
    return (
      <div className="cart-page">
        <Header user={user} cartItemsCount={cartItemsCount} />
        <main className="cart-main">
          <div className="loading-container">
            <p>Cargando tu carrito...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Header user={user} cartItemsCount={cartItemsCount} />

      <main className="cart-main">
        <h1>Mi Carrito</h1>

        {error && <div className="error-message">{error}</div>}

        {isEmpty ? (
          <div className="cart-empty">
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>🛒</div>
            <p>Tu carrito está vacío</p>
            <button
              onClick={() => navigate("/products")}
              className="btn-seguir-comprando"
            >
              Ir a productos
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              <div className="cart-header">
                <h2>Productos ({items.length})</h2>
                <button onClick={handleVaciarCarrito} className="btn-vaciar">
                  Vaciar carrito
                </button>
              </div>

              {items.map((item) => (
                <div key={item.id} className="cart-item">
                  <img
                    src={item.producto?.imagenUrl || "/placeholder.png"}
                    alt={item.producto?.nombre || "Producto"}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />

                  <div className="item-info">
                    <h3>{item.producto?.nombre || "Producto"}</h3>
                    <p className="item-categoria">
                      {item.producto?.categoria?.nombre || "Sin categoría"}
                    </p>
                    <p className="item-precio">
                      $
                      {Number(item.precioUnitario || 0).toLocaleString("es-CL")}{" "}
                      c/u
                    </p>
                  </div>

                  <div className="item-cantidad">
                    <button
                      onClick={() =>
                        handleCantidadChange(item.id, item.cantidad - 1)
                      }
                      disabled={item.cantidad <= 1}
                    >
                      -
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                      onClick={() =>
                        handleCantidadChange(item.id, item.cantidad + 1)
                      }
                      disabled={
                        item.producto?.stock
                          ? item.cantidad >= item.producto.stock
                          : false
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    <p className="subtotal-label">Subtotal:</p>
                    <p className="subtotal-precio">
                      ${Number(item.subtotal || 0).toLocaleString("es-CL")}
                    </p>
                  </div>

                  <button
                    onClick={() => handleEliminarItem(item.id)}
                    className="btn-eliminar"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Resumen del pedido</h2>

              <div className="summary-row">
                <span>Subtotal:</span>
                <span>
                  ${Number(carrito?.total || 0).toLocaleString("es-CL")}
                </span>
              </div>

              <div className="summary-row">
                <span>Envío:</span>
                <span>Calculado en el siguiente paso</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>
                  ${Number(carrito?.total || 0).toLocaleString("es-CL")}
                </span>
              </div>

              <button onClick={handleCheckout} className="btn-checkout">
                Proceder al pago
              </button>

              <button
                onClick={() => navigate("/products")}
                className="btn-seguir-comprando"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;
