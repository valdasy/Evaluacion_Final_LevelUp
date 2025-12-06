import React, { createContext, useState, useContext, useEffect } from "react";
import carritoService from "../services/carritoService";
import authService from "../services/authService";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe ser usado dentro de CarritoProvider");
  }
  return context;
};

export const CarritoProvider = ({ children }) => {
  // Estado inicial null para diferenciar "cargando" de "vacío"
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar carrito inicial si hay sesión
  useEffect(() => {
    if (authService.isAuthenticated()) {
      cargarCarrito();
    }
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const carritoData = await carritoService.obtenerCarrito();
      // Guardamos todo el objeto { id, items: [], total: 0 }
      setCarrito(carritoData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar carrito:", err);
      setError("Error al cargar el carrito");
      // Si falla, dejamos el carrito como null o estructura vacía segura
      setCarrito({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const agregarProducto = async (productoId, cantidad = 1) => {
    if (!authService.isAuthenticated()) {
      throw new Error("Debes iniciar sesión para agregar productos al carrito");
    }
    try {
      setLoading(true);
      // El servicio debe devolver el carrito actualizado completo
      const carritoActualizado = await carritoService.agregarProducto(
        productoId,
        cantidad
      );
      setCarrito(carritoActualizado);
      setError(null);
      return carritoActualizado;
    } catch (err) {
      console.error("Error al agregar producto:", err);
      setError(err.message || "Error al agregar producto al carrito");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const actualizarCantidad = async (itemId, cantidad) => {
    try {
      setLoading(true);
      const carritoActualizado = await carritoService.actualizarCantidad(
        itemId,
        cantidad
      );
      setCarrito(carritoActualizado);
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      setError("Error al actualizar la cantidad");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const eliminarItem = async (itemId) => {
    try {
      setLoading(true);
      const carritoActualizado = await carritoService.eliminarItem(itemId);
      setCarrito(carritoActualizado);
    } catch (err) {
      console.error("Error al eliminar item:", err);
      setError("Error al eliminar el producto");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const vaciarCarrito = async () => {
    try {
      setLoading(true);
      await carritoService.vaciarCarrito();
      // Reseteamos a estructura vacía
      setCarrito({ items: [], total: 0 });
    } catch (err) {
      console.error("Error al vaciar carrito:", err);
      setError("Error al vaciar el carrito");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Función para limpiar el estado al cerrar sesión (sin llamar al backend)
  const limpiarCarritoContexto = () => {
    setCarrito(null);
  };

  const calcularTotal = () => {
    return carrito?.total || 0;
  };

  const obtenerCantidadTotal = () => {
    if (!carrito || !Array.isArray(carrito.items)) return 0;
    return carrito.items.reduce(
      (total, item) => total + (item.cantidad || 0),
      0
    );
  };

  const value = {
    carrito,
    loading,
    error,
    agregarProducto,
    actualizarCantidad,
    eliminarItem,
    vaciarCarrito,
    cargarCarrito,
    calcularTotal,
    obtenerCantidadTotal,
    limpiarCarritoContexto, // ✅ Importante para el logout
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};
