import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import authService from "../services/authService";
import productoService from "../services/productoService";
import "./AdminPage.css";

const AdminProductsPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const user = authService.getCurrentUser();
  const cartItemsCount = 0;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productoService.getProductos();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setError(
        "Error al cargar los productos. Verifica que el backend esté corriendo en http://localhost:8080"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;

    try {
      await productoService.eliminarProducto(productId);
      setProducts(products.filter((p) => p.id !== productId));
      alert("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error eliminando producto:", error);
      alert(
        "Error al eliminar el producto: " +
          (error.response?.data || error.message)
      );
    }
  };

  const handleSave = async (productData) => {
    try {
      if (editingProduct) {
        // Actualizar
        const updated = await productoService.actualizarProducto(
          editingProduct.id,
          productData
        );
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? updated : p))
        );
        alert("Producto actualizado exitosamente");
      } else {
        // Crear nuevo
        const newProduct = await productoService.crearProducto(productData);
        setProducts([...products, newProduct]);
        alert("Producto creado exitosamente");
      }

      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error("Error guardando producto:", error);
      alert(
        "Error al guardar el producto: " +
          (error.response?.data || error.message)
      );
    }
  };

  const handleToggleEstado = async (product) => {
    try {
      const updated = await productoService.cambiarEstadoProducto(
        product.id,
        !product.activo
      );
      setProducts(products.map((p) => (p.id === product.id ? updated : p)));
      alert(
        `Producto ${updated.activo ? "activado" : "desactivado"} exitosamente`
      );
    } catch (error) {
      console.error("Error cambiando estado:", error);
      alert(
        "Error al cambiar el estado: " + (error.response?.data || error.message)
      );
    }
  };

  return (
    <div className="admin-page">
      <Header cartItemsCount={cartItemsCount} user={user} />

      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="sidebar-header">
            <h2>🎮 Admin Panel</h2>
          </div>

          <nav className="sidebar-nav">
            <button className="nav-item" onClick={() => navigate("/admin")}>
              <span className="nav-icon">📊</span>
              Dashboard
            </button>
            <button
              className="nav-item active"
              onClick={() => navigate("/admin/products")}
            >
              <span className="nav-icon">🎮</span>
              Productos
            </button>
            <button
              className="nav-item"
              onClick={() => navigate("/admin/categories")}
            >
              <span className="nav-icon">📁</span>
              Categorías
            </button>
            <button
              className="nav-item"
              onClick={() => navigate("/admin/orders")}
            >
              <span className="nav-icon">🛒</span>
              Pedidos
            </button>
            <button
              className="nav-item"
              onClick={() => navigate("/admin/users")}
            >
              <span className="nav-icon">👥</span>
              Usuarios
            </button>
            <button
              className="nav-item"
              onClick={() => navigate("/admin/reports")}
            >
              <span className="nav-icon">📈</span>
              Reportes
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="admin-user-info">
              <div className="admin-avatar">
                {user?.nombreCompleto?.charAt(0) || "A"}
              </div>
              <div className="admin-user-details">
                <strong>{user?.nombreCompleto || "Admin Demo"}</strong>
                <span>Administrador</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="admin-main-content">
          <div className="dashboard-header">
            <div>
              <h1>Gestión de Productos</h1>
              <p>Administra el catálogo de productos de la tienda</p>
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                className="btn-secondary"
                onClick={loadProducts}
                disabled={loading}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  backgroundColor: "white",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                🔄 Actualizar
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setEditingProduct(null);
                  setShowModal(true);
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#4caf50",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                + Nuevo Producto
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                padding: "15px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #ef5350",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {loading ? (
            <div
              className="loading-container"
              style={{ textAlign: "center", padding: "40px" }}
            >
              <p>Cargando productos...</p>
            </div>
          ) : (
            <div
              className="products-table-container"
              style={{
                backgroundColor: "white",
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <table
                className="admin-table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #e0e0e0" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Imagen
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Nombre
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Precio
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Stock
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Categoría
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Estado
                    </th>
                    <th style={{ padding: "12px", textAlign: "left" }}>
                      Destacado
                    </th>
                    <th style={{ padding: "12px", textAlign: "center" }}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      style={{ borderBottom: "1px solid #f0f0f0" }}
                    >
                      <td style={{ padding: "12px" }}>{product.id}</td>
                      <td style={{ padding: "12px" }}>
                        <img
                          src={product.imagenUrl || "/images/placeholder.jpg"}
                          alt={product.nombre}
                          className="product-thumbnail"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "1px solid #e0e0e0",
                          }}
                          onError={(e) => (e.target.src = "/placeholder.png")}
                        />
                      </td>
                      <td style={{ padding: "12px" }}>
                        <strong>{product.nombre}</strong>
                        <br />
                        <small style={{ color: "#666" }}>
                          {product.descripcion?.substring(0, 50)}...
                        </small>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <strong>
                          ${product.precio?.toLocaleString("es-CL")}
                        </strong>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor:
                              product.stock > 10
                                ? "#e8f5e9"
                                : product.stock > 0
                                ? "#fff3e0"
                                : "#ffebee",
                            color:
                              product.stock > 10
                                ? "#2e7d32"
                                : product.stock > 0
                                ? "#e65100"
                                : "#c62828",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {product.stock} unidades
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        {product.categoria?.nombre || "Sin categoría"}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button
                          onClick={() => handleToggleEstado(product)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            border: "none",
                            backgroundColor: product.activo
                              ? "#4caf50"
                              : "#f44336",
                            color: "white",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          {product.activo ? "✓ Activo" : "✗ Inactivo"}
                        </button>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            backgroundColor: product.destacado
                              ? "#ffd700"
                              : "#e0e0e0",
                            color: product.destacado ? "#000" : "#666",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {product.destacado ? "⭐ Destacado" : "Normal"}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          <button
                            onClick={() => handleEdit(product)}
                            title="Editar"
                            style={{
                              padding: "8px 16px",
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "#2196f3",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            ✏️ Editar
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            title="Eliminar"
                            style={{
                              padding: "8px 16px",
                              border: "none",
                              borderRadius: "6px",
                              backgroundColor: "#f44336",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: "bold",
                              fontSize: "14px",
                            }}
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {products.length === 0 && !error && (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: "48px", marginBottom: "20px" }}>
                    📦
                  </div>
                  <h3 style={{ color: "#666", marginBottom: "10px" }}>
                    No hay productos registrados
                  </h3>
                  <p style={{ color: "#999", marginBottom: "30px" }}>
                    Comienza agregando tu primer producto al catálogo
                  </p>
                  <button
                    className="btn-primary"
                    onClick={() => setShowModal(true)}
                    style={{
                      padding: "12px 24px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: "#4caf50",
                      color: "white",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                  >
                    + Crear primer producto
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      <Footer />
    </div>
  );
};

const ProductModal = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    product || {
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      imagenUrl: "",
      destacado: false,
      activo: true,
      categoria: null,
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convertir a números
    const dataToSend = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
    };

    onSave(dataToSend);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            paddingBottom: "15px",
            borderBottom: "2px solid #f0f0f0",
          }}
        >
          <h2 style={{ margin: 0, color: "#333" }}>
            {product ? "✏️ Editar Producto" : "➕ Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "28px",
              cursor: "pointer",
              color: "#999",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Nombre del Producto *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              placeholder="Ej: PlayStation 5"
              required
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              Descripción
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows="3"
              placeholder="Descripción del producto..."
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Precio (CLP) *
              </label>
              <input
                type="number"
                value={formData.precio}
                onChange={(e) =>
                  setFormData({ ...formData, precio: e.target.value })
                }
                placeholder="599990"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "bold",
                  color: "#555",
                }}
              >
                Stock *
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                placeholder="10"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "bold",
                color: "#555",
              }}
            >
              URL de Imagen
            </label>
            <input
              type="text"
              value={formData.imagenUrl}
              onChange={(e) =>
                setFormData({ ...formData, imagenUrl: e.target.value })
              }
              placeholder="https://ejemplo.com/imagen.jpg"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              marginBottom: "25px",
              display: "flex",
              gap: "30px",
              padding: "15px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.destacado}
                onChange={(e) =>
                  setFormData({ ...formData, destacado: e.target.checked })
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                ⭐ Producto destacado
              </span>
            </label>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) =>
                  setFormData({ ...formData, activo: e.target.checked })
                }
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                ✓ Producto activo
              </span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
              paddingTop: "15px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "1px solid #ddd",
                backgroundColor: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                color: "#666",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#4caf50",
                color: "white",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {product ? "💾 Actualizar Producto" : "➕ Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductsPage;
