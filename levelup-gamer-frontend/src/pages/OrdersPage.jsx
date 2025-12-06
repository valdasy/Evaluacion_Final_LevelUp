import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import authService from "../services/authService";
import api from "../services/api"; // ✅ Importamos la conexión real
import { useCarrito } from "../context/CarritoContext";
import "./OrdersPage.css";

export default function OrdersPage({ onLogout }) {
  const user = authService.getCurrentUser();
  const { obtenerCantidadTotal } = useCarrito();
  const cartItemsCount = obtenerCantidadTotal();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      loadOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      // ✅ LLAMADA REAL AL BACKEND
      const response = await api.get(`/ordenes/usuario/${user.id}`);
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("No se pudieron cargar tus pedidos.");
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const statusConfig = {
      PENDIENTE: { color: "#ff9800", icon: "⏳", text: "Pendiente" },
      PROCESANDO: { color: "#2196f3", icon: "🔄", text: "Procesando" },
      ENVIADO: { color: "#9c27b0", icon: "🚚", text: "En camino" },
      ENTREGADO: { color: "#4caf50", icon: "✅", text: "Entregado" },
      COMPLETADA: { color: "#4caf50", icon: "✅", text: "Completada" }, // ✅ Estado que usamos en el backend
      CANCELADO: { color: "#f44336", icon: "❌", text: "Cancelado" },
    };
    return statusConfig[status] || statusConfig["PENDIENTE"];
  };

  if (loading) {
    return (
      <div className="orders-page">
        <Header
          user={user}
          cartItemsCount={cartItemsCount}
          onLogout={onLogout}
        />
        <main className="orders-loading">
          <div className="spinner"></div>
          <p>Cargando tus pedidos...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="orders-page">
        <Header
          user={user}
          cartItemsCount={cartItemsCount}
          onLogout={onLogout}
        />
        <main className="orders-main">
          <div className="orders-container">
            <div className="access-restricted">
              <div className="restricted-icon">🔒</div>
              <h2>Acceso restringido</h2>
              <p>Debes iniciar sesión para ver tus pedidos</p>
              <div className="restricted-actions">
                <Link to="/auth" className="btn-primary">
                  Iniciar sesión
                </Link>
                <Link to="/home" className="btn-secondary">
                  Volver al inicio
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Header user={user} cartItemsCount={cartItemsCount} onLogout={onLogout} />

      <main className="orders-main">
        <div className="orders-container">
          <div className="orders-header">
            <div className="orders-header-content">
              <h1>📦 Mis Pedidos</h1>
              <p>Revisa el estado de todas tus compras</p>
            </div>
            <Link to="/products" className="btn-shop">
              🛍️ Seguir comprando
            </Link>
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️</span>
              <p>{error}</p>
              <button onClick={() => setError("")}>✕</button>
            </div>
          )}

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-orders-card">
                <div className="empty-icon">🛒</div>
                <h2>Aún no tienes pedidos</h2>
                <p>
                  Cuando realices tu primera compra, aparecerá aquí con toda la
                  información de seguimiento
                </p>
                <Link to="/products" className="btn-primary-large">
                  🎮 Explorar Productos
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="orders-count">
                <span>📋 Total de pedidos:</span>
                <strong>{orders.length}</strong>
              </div>

              <div className="orders-list">
                {orders.map((order) => {
                  const statusConfig = getStatusConfig(
                    order.estado || "PENDIENTE"
                  );
                  return (
                    <div key={order.id} className="order-card">
                      <div className="order-card-header">
                        <div className="order-number-section">
                          <span className="order-label">N° Pedido</span>
                          <strong className="order-number">#{order.id}</strong>
                        </div>
                        <div
                          className="order-status-badge"
                          style={{
                            backgroundColor: `${statusConfig.color}20`,
                            color: statusConfig.color,
                          }}
                        >
                          <span>{statusConfig.icon}</span>
                          <span>{statusConfig.text}</span>
                        </div>
                      </div>

                      <div className="order-card-body">
                        <div className="order-info-item">
                          <span className="info-label">📅 Fecha</span>
                          <div className="info-value">
                            <div>
                              {/* ✅ Usamos fechaCreacion que viene de Java */}
                              {new Date(order.fechaCreacion).toLocaleDateString(
                                "es-CL"
                              )}
                            </div>
                            <small>
                              {new Date(order.fechaCreacion).toLocaleTimeString(
                                "es-CL",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </small>
                          </div>
                        </div>

                        <div className="order-info-item">
                          <span className="info-label">💰 Total</span>
                          <strong className="info-value total-amount">
                            ${order.total?.toLocaleString("es-CL") || "0"}
                          </strong>
                        </div>

                        <div className="order-card-actions">
                          {/* Botón simple por ahora */}
                          <button className="btn-view-order" disabled>
                            Ver detalles
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}