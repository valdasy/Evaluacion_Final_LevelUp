// src/pages/ProductDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import productoService from "../services/productoService";
import { useCarrito } from "../context/CarritoContext";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { agregarProducto } = useCarrito();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const data = await productoService.getProductoPorId(id);
        setProducto(data);
      } catch (e) {
        console.error("Error cargando producto:", e);
        setError("No se pudo cargar el producto");
      } finally {
        setLoading(false);
      }
    };
    cargarProducto();
  }, [id]);

  const handleAgregarAlCarrito = async () => {
    try {
      await agregarProducto(producto.id, quantity);
      alert("¡Producto agregado al carrito!");
    } catch (e) {
      alert("Por favor inicia sesión para agregar productos al carrito");
    }
  };

  const handleChangeQuantity = (delta) => {
    setQuantity((q) => {
      const next = q + delta;
      if (next < 1) return 1;
      if (producto && next > producto.stock) return producto.stock;
      return next;
    });
  };

  return (
    <div className="product-detail-page">
      <Header />

      <main className="product-detail-main container py-4">
        {loading && <p>Cargando producto...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && producto && (
          <div className="row product-detail-container g-4">
            <div className="col-md-6">
              <div className="product-detail-image">
                <img
                  src={producto.imagenUrl || "/placeholder.png"}
                  alt={producto.nombre}
                  onError={(e) => (e.target.src = "/placeholder.png")}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="product-detail-info">
                <h1 className="product-detail-title">{producto.nombre}</h1>
                <p className="categoria text-muted mb-1">
                  {producto.categoria?.nombre || "Sin categoría"}
                </p>
                <p className="product-detail-description">
                  {producto.descripcion}
                </p>

                <div className="d-flex align-items-center justify-content-between mb-3 product-detail-price">
                  <span className="price-amount">
                    ${Number(producto.precio || 0).toLocaleString("es-CL")}
                  </span>
                  {producto.destacado && (
                    <span className="discount-badge">Destacado</span>
                  )}
                </div>

                <p className="stock mb-3">
                  Stock: {producto.stock > 0 ? producto.stock : "Sin stock"}
                </p>

                <div className="d-flex flex-column gap-3 mb-4">
                  <div className="quantity-selector">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleChangeQuantity(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-display">{quantity}</span>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleChangeQuantity(1)}
                      disabled={
                        producto.stock === 0 || quantity >= producto.stock
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleAgregarAlCarrito}
                    disabled={producto.stock === 0}
                  >
                    {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                  </button>
                </div>

                {/* Ejemplo simple de rating fijo */}
                <div className="mb-3">
                  <div className="rating-stars">★★★★☆</div>
                  <small className="text-muted">
                    Valoración referencial de clientes
                  </small>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
