import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import productoService from "../services/productoService";
import authService from "../services/authService"; // ✅ Importar authService
import { useCarrito } from "../context/CarritoContext";
import "./HomePage.css";

const HomePage = ({ onLogout }) => {
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Obtener 'obtenerCantidadTotal' del contexto
  const { agregarProducto, obtenerCantidadTotal } = useCarrito();

  // ✅ Obtener usuario y cantidad del carrito aquí
  const user = authService.getCurrentUser();
  const cartItemsCount = obtenerCantidadTotal();

  useEffect(() => {
    cargarProductosDestacados();
  }, []);

  const cargarProductosDestacados = async () => {
    try {
      setLoading(true);
      const productos = await productoService.getProductosDestacados();
      setProductosDestacados(productos || []);
    } catch (err) {
      console.error("Error cargando productos destacados:", err);
      setError("Error al cargar productos destacados");
      setProductosDestacados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = async (productoId) => {
    // ✅ Mejorar la lógica para dar feedback inmediato
    if (!authService.isAuthenticated()) {
      alert("Por favor inicia sesión para agregar productos al carrito");
      return;
    }

    try {
      await agregarProducto(productoId, 1);
      alert("¡Producto agregado al carrito!");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert(error.message || "No se pudo agregar el producto al carrito.");
    }
  };

  return (
    <div className="home-page">
      {/* ✅ Pasar 'user' y 'cartItemsCount' como props al Header */}
      <Header user={user} cartItemsCount={cartItemsCount} onLogout={onLogout} />

      <main className="home-main">
        {/* Hero Section con video o imagen de fondo */}
        <section className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1 className="hero-title">Level UP Gamer</h1>
            <p className="hero-subtitle">Tu destino gaming definitivo</p>
            <p className="hero-description">
              Descubre los últimos lanzamientos, consolas next-gen y accesorios
              premium
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-primary">
                Explorar catálogo
              </Link>
              <Link to="/products" className="btn-secondary">
                Ofertas destacadas
              </Link>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Productos</span>
            </div>
            <div className="stat">
              <span className="stat-number">50K+</span>
              <span className="stat-label">Gamers felices</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Soporte</span>
            </div>
          </div>
        </section>

        {/* Categorías rápidas */}
        <section className="quick-categories">
          <Link to="/products" className="category-card consolas">
            <div className="category-icon">🎮</div>
            <h3>Consolas</h3>
          </Link>
          <Link to="/products" className="category-card juegos">
            <div className="category-icon">🕹️</div>
            <h3>Juegos</h3>
          </Link>
          <Link to="/products" className="category-card accesorios">
            <div className="category-icon">🎧</div>
            <h3>Accesorios</h3>
          </Link>
          <Link to="/products" className="category-card ofertas">
            <div className="category-icon">⚡</div>
            <h3>Ofertas</h3>
          </Link>
        </section>

        {/* Productos Destacados */}
        <section className="destacados-section">
          <div className="section-header">
            <h2>Productos Destacados</h2>
            <Link to="/products" className="view-all">
              Ver todos <span>→</span>
            </Link>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando productos increíbles...</p>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <div className="productos-grid">
              {productosDestacados.length === 0 ? (
                <div className="empty-state">
                  <p>No hay productos destacados en este momento</p>
                  <Link to="/products" className="btn-primary">
                    Ver catálogo completo
                  </Link>
                </div>
              ) : (
                productosDestacados.slice(0, 6).map((producto) => (
                  <div key={producto.id} className="producto-card-modern">
                    <div className="producto-image-container">
                      <img
                        src={producto.imagenUrl || "/placeholder.png"}
                        alt={producto.nombre}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                      />
                      <div className="producto-overlay">
                        <Link
                          to={`/product/${producto.id}`}
                          className="btn-quick-view"
                        >
                          Ver detalles
                        </Link>
                      </div>
                      {producto.destacado && (
                        <span className="badge-hot">🔥 Hot</span>
                      )}
                    </div>
                    <div className="producto-info">
                      <span className="producto-categoria">
                        {producto.categoria?.nombre || "Sin categoría"}
                      </span>
                      <h3 className="producto-nombre">{producto.nombre}</h3>
                      <div className="producto-footer">
                        <div className="precio-container">
                          <span className="precio-actual">
                            ${producto.precio?.toLocaleString("es-CL") || "0"}
                          </span>
                        </div>
                        <button
                          className="btn-add-cart"
                          onClick={() => handleAgregarAlCarrito(producto.id)}
                          title="Agregar al carrito"
                        >
                          <span>🛒</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Banner promocional */}
        <section className="promo-banner">
          <div className="promo-content">
            <h2>¡Ofertas Exclusivas Esta Semana!</h2>
            <p>Hasta 40% de descuento en productos seleccionados</p>
            <Link to="/products" className="btn-promo">
              Aprovecha ahora
            </Link>
          </div>
        </section>

        {/* Características/Ventajas */}
        <section className="features-section">
          <h2 className="features-title">¿Por qué comprar con nosotros?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Envío Gratis</h3>
              <p>En compras sobre $50.000 a todo Chile</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Pago Seguro</h3>
              <p>Múltiples métodos de pago protegidos</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎮</div>
              <h3>Productos Originales</h3>
              <p>100% garantizados y certificados</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Mejor Precio</h3>
              <p>Garantía de mejor precio del mercado</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Devoluciones Fáciles</h3>
              <p>30 días para cambios y devoluciones</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3>Programa de Puntos</h3>
              <p>Acumula puntos en cada compra</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
