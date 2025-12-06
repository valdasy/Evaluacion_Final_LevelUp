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
  // Inicializamos carrito. Si no hay login, buscamos en localStorage.
  const [carrito, setCarrito] = useState(() => {
    if (!authService.isAuthenticated()) {
      const saved = localStorage.getItem("carrito_invitado");
      return saved ? JSON.parse(saved) : { items: [], total: 0 };
    }
    return null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Efecto: Cargar carrito de BD si el usuario se loguea
  useEffect(() => {
    if (authService.isAuthenticated()) {
      cargarCarrito();
    }
    // eslint-disable-next-line
  }, []);

  // --- FUNCIONES AUXILIARES PARA INVITADOS ---
  const guardarCarritoLocal = (items) => {
    // Calculamos el total localmente
    const total = items.reduce((acc, item) => {
        return acc + (item.producto.precio * item.cantidad);
    }, 0);

    const carritoLocal = { items, total };
    localStorage.setItem("carrito_invitado", JSON.stringify(carritoLocal));
    setCarrito(carritoLocal);
  };

  // --- ACCIONES ---

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const carritoData = await carritoService.obtenerCarrito();
      setCarrito(carritoData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar carrito:", err);
      // Si falla la carga del backend, no borramos el estado, solo mostramos error
      setError("No se pudo cargar el carrito del servidor");
    } finally {
      setLoading(false);
    }
  };

  // IMPORTANTE: Ahora recibimos el OBJETO producto completo, no solo el ID
  const agregarProducto = async (producto, cantidad = 1) => {
    // 1. Lógica para USUARIO LOGUEADO
    if (authService.isAuthenticated()) {
      try {
        setLoading(true);
        // Al servicio le mandamos solo el ID como siempre
        const carritoActualizado = await carritoService.agregarProducto(
          producto.id,
          cantidad
        );
        setCarrito(carritoActualizado);
        setError(null);
        return carritoActualizado;
      } catch (err) {
        console.error("Error API:", err);
        setError(err.message || "Error al agregar producto");
        throw err;
      } finally {
        setLoading(false);
      }
    } 
    
    // 2. Lógica para INVITADO (Local Storage)
    else {
      const itemsActuales = carrito?.items ? [...carrito.items] : [];
      const index = itemsActuales.findIndex(i => i.producto.id === producto.id);

      if (index >= 0) {
        // El producto ya existe, sumamos cantidad
        itemsActuales[index].cantidad += cantidad;
        // Recalculamos subtotal visual
        itemsActuales[index].subtotal = itemsActuales[index].cantidad * producto.precio;
      } else {
        // Producto nuevo
        itemsActuales.push({
          id: Date.now(), // ID temporal para el item
          producto: producto, // Guardamos toda la info para mostrar foto/nombre
          cantidad: cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * cantidad
        });
      }
      guardarCarritoLocal(itemsActuales);
    }
  };

  const actualizarCantidad = async (itemId, cantidad) => {
    // 1. USUARIO LOGUEADO
    if (authService.isAuthenticated()) {
      try {
        setLoading(true);
        const carritoActualizado = await carritoService.actualizarCantidad(
          itemId,
          cantidad
        );
        setCarrito(carritoActualizado);
      } catch (err) {
        console.error("Error API:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    } 
    
    // 2. INVITADO
    else {
      // Nota: itemId aquí puede ser el ID del producto o el ID temporal
      const itemsActuales = [...carrito.items];
      // Buscamos por ID de item temporal o ID de producto si coincide
      const index = itemsActuales.findIndex(i => i.id === itemId || i.producto.id === itemId);

      if (index >= 0) {
        if (cantidad <= 0) {
            itemsActuales.splice(index, 1);
        } else {
            itemsActuales[index].cantidad = cantidad;
            itemsActuales[index].subtotal = itemsActuales[index].cantidad * itemsActuales[index].producto.precio;
        }
        guardarCarritoLocal(itemsActuales);
      }
    }
  };

  const eliminarItem = async (itemId) => {
    if (authService.isAuthenticated()) {
      try {
        setLoading(true);
        const carritoActualizado = await carritoService.eliminarItem(itemId);
        setCarrito(carritoActualizado);
      } catch (err) {
        console.error("Error API:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // INVITADO
      const itemsActuales = carrito.items.filter(i => i.id !== itemId && i.producto.id !== itemId);
      guardarCarritoLocal(itemsActuales);
    }
  };

  const vaciarCarrito = async () => {
    if (authService.isAuthenticated()) {
      try {
        setLoading(true);
        await carritoService.vaciarCarrito();
        setCarrito({ items: [], total: 0 });
      } catch (err) {
        console.error("Error API:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    } else {
      // INVITADO
      localStorage.removeItem("carrito_invitado");
      setCarrito({ items: [], total: 0 });
    }
  };

  const limpiarCarritoContexto = () => {
    setCarrito(null);
    localStorage.removeItem("carrito_invitado"); // Opcional: limpiar invitado al salir
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
    limpiarCarritoContexto,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};