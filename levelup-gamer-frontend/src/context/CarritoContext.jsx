import React, { createContext, useState, useContext, useEffect } from "react";
import carritoService from "../services/carritoService";
import authService from "../services/authService";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  // 1. Inicialización inteligente: Si no hay login, busca en localStorage
  const [carrito, setCarrito] = useState(() => {
    if (!authService.isAuthenticated()) {
      const saved = localStorage.getItem("carrito_invitado");
      return saved ? JSON.parse(saved) : { items: [], total: 0 };
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authService.isAuthenticated()) cargarCarrito();
  }, []);

  // --- FUNCIONES INTERNAS ---
  const guardarLocal = (items) => {
    // Calculamos total localmente para invitados
    const total = items.reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
    const cart = { items, total };
    localStorage.setItem("carrito_invitado", JSON.stringify(cart));
    setCarrito(cart);
  };

  // --- ACCIONES PÚBLICAS ---
  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const data = await carritoService.obtenerCarrito();
      setCarrito(data);
    } catch (err) {
      console.error(err);
      setCarrito({ items: [], total: 0 }); // Fallback seguro
    } finally {
      setLoading(false);
    }
  };

  // ✅ AQUÍ ESTÁ LA MAGIA: Acepta invitados
  const agregarProducto = async (producto, cantidad = 1) => {
    // A. USUARIO LOGUEADO -> API
    if (authService.isAuthenticated()) {
      try {
        setLoading(true);
        const data = await carritoService.agregarProducto(producto.id, cantidad);
        setCarrito(data);
      } catch (err) {
        setError("Error al agregar al servidor");
      } finally {
        setLoading(false);
      }
    } 
    // B. INVITADO -> LOCALSTORAGE
    else {
      const items = carrito?.items ? [...carrito.items] : [];
      const index = items.findIndex(i => i.producto.id === producto.id);
      
      if (index >= 0) {
        items[index].cantidad += cantidad;
        items[index].subtotal = items[index].cantidad * producto.producto.precio;
      } else {
        items.push({
          id: Date.now(), // ID temporal
          producto: producto, // Guardamos TODO el objeto para la foto/precio
          cantidad: cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * cantidad
        });
      }
      guardarLocal(items);
    }
  };

  const vaciarCarrito = async () => {
    if (authService.isAuthenticated()) {
      await carritoService.vaciarCarrito();
    } else {
      localStorage.removeItem("carrito_invitado");
    }
    setCarrito({ items: [], total: 0 });
  };

  const eliminarItem = async (itemId) => {
    if (authService.isAuthenticated()) {
      const data = await carritoService.eliminarItem(itemId);
      setCarrito(data);
    } else {
      // Para invitados, el itemId puede ser el ID del producto o el temporal
      const items = carrito.items.filter(i => i.id !== itemId && i.producto.id !== itemId);
      guardarLocal(items);
    }
  };

  const value = {
    carrito,
    agregarProducto,
    vaciarCarrito,
    eliminarItem,
    obtenerCantidadTotal: () => carrito?.items?.reduce((acc, i) => acc + i.cantidad, 0) || 0,
    calcularTotal: () => carrito?.total || 0,
    loading
  };

  return <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>;
};