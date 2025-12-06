import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import productoService from "../services/productoService";
import categoriaService from "../services/categoriaService";
import { useCarrito } from "../context/CarritoContext";
import authService from "../services/authService";
import "./ProductPage.css";

const ProductPage = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { agregarProducto, obtenerCantidadTotal } = useCarrito(); // ✅ Agregado obtenerCantidadTotal

  const user = authService.getCurrentUser(); // ✅ Obtener usuario
  const cartItemsCount = obtenerCantidadTotal(); // ✅ Obtener cantidad del carrito

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        productoService.getProductosActivos(),
        categoriaService.getCategoriasActivas(),
      ]);

      setProductos(productosData || []);
      setCategorias(categoriasData || []);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al cargar los productos");
      setProductos([]);
      setCategorias([]);
    } finally {
      setLoading(false);
    }
  };

  const filtrarPorCategoria = async (categoriaId) => {
    try {
      setLoading(true);
      setCategoriaSeleccionada(categoriaId);

      if (categoriaId === null) {
        const productosData = await productoService.getProductosActivos();
        setProductos(productosData || []);
      } else {
        const productosData = await productoService.getProductosPorCategoria(
          categoriaId
        );
        setProductos(productosData || []);
      }
    } catch (err) {
      console.error("Error filtrando productos:", err);
      setError("Error al filtrar productos");
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = async (productoId) => {
    try {
      if (!authService.isAuthenticated()) {
        alert("Por favor inicia sesión para agregar productos al carrito");
        return;
      }

      await agregarProducto(productoId, 1);
      alert("¡Producto agregado al carrito!");
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
      alert(error.message || "Error al agregar producto al carrito");
    }
  };

  return (
    <div className="product-page">
      {/* ✅ Pasando props correctas al Header */}
      <Header cartItemsCount={cartItemsCount} user={user} />

      <main className="product-main">
        <h1>Catálogo de Productos</h1>

        <div className="categorias-filter">
          <button
            className={categoriaSeleccionada === null ? "active" : ""}
            onClick={() => filtrarPorCategoria(null)}
          >
            Todas
          </button>
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              className={categoriaSeleccionada === categoria.id ? "active" : ""}
              onClick={() => filtrarPorCategoria(categoria.id)}
            >
              {categoria.nombre}
            </button>
          ))}
        </div>

        {loading && <div className="loading">Cargando productos...</div>}
        {error && <div className="error">{error}</div>}

        {!loading && !error && (
          <div className="productos-grid">
            {productos.length === 0 ? (
              <p>No hay productos disponibles</p>
            ) : (
              productos.map((producto) => (
                <div key={producto.id} className="producto-card">
                  {producto.destacado && (
                    <span className="badge-destacado">Destacado</span>
                  )}
                  <img
                    src={producto.imagenUrl || "/placeholder.png"}
                    alt={producto.nombre}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                  <h3>{producto.nombre}</h3>
                  <p className="categoria">
                    {producto.categoria?.nombre || "Sin categoría"}
                  </p>
                  <p className="descripcion">{producto.descripcion}</p>
                  <div className="producto-footer">
                    <span className="precio">
                      ${Number(producto.precio || 0).toLocaleString("es-CL")}
                    </span>
                    <span className="stock">Stock: {producto.stock}</span>
                  </div>
                  <Link to={`/product/${producto.id}`} className="btn-ver-mas">
                    Ver detalles
                  </Link>
                  <button
                    className="btn-agregar"
                    onClick={() => handleAgregarAlCarrito(producto.id)}
                    disabled={producto.stock === 0}
                  >
                    {producto.stock === 0 ? "Sin stock" : "Agregar al carrito"}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
