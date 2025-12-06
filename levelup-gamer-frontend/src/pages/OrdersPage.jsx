import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import authService from "../services/authService";
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
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      // TODO: Llamar al backend para obtener pedidos del usuario
      // const data = await pedidoService.getMisPedidos();
      // setOrders(data);

      // Simulación de carga
      setTimeout(() => {
        setOrders([]);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
      setError("Error al cargar tus pedidos");
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const statusConfig = {
      PENDIENTE: { color: "#ff9800", icon: "⏳", text: "Pendiente" },
      PROCESANDO: { color: "#2196f3", icon: "🔄", text: "Procesando" },
      ENVIADO: { color: "#9c27b0", icon: "🚚", text: "En camino" },
      ENTREGADO: { color: "#4caf50", icon: "✅", text: "Entregado" },
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
                    order.status || "PENDIENTE"
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
                              {new Date(order.createdAt).toLocaleDateString(
                                "es-CL"
                              )}
                            </div>
                            <small>
                              {new Date(order.createdAt).toLocaleTimeString(
                                "es-CL",
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </small>
                          </div>
                        </div>

                        <div className="order-info-item">
                          <span className="info-label">📦 Productos</span>
                          <strong className="info-value">
                            {order.items?.length || 0} items
                          </strong>
                        </div>

                        <div className="order-info-item">
                          <span className="info-label">💰 Total</span>
                          <strong className="info-value total-amount">
                            ${order.total?.toLocaleString("es-CL") || "0"}
                          </strong>
                        </div>

                        <div className="order-card-actions">
                          <Link
                            to={`/order/${order.id}`}
                            className="btn-view-order"
                          >
                            Ver detalles →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-card-icon">🚚</div>
              <div className="info-card-content">
                <h3>Envío Gratis</h3>
                <p>En compras sobre $50.000</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">🛡️</div>
              <div className="info-card-content">
                <h3>Compra Protegida</h3>
                <p>Garantía de satisfacción</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-card-icon">💬</div>
              <div className="info-card-content">
                <h3>Soporte 24/7</h3>
                <p>Estamos para ayudarte</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
