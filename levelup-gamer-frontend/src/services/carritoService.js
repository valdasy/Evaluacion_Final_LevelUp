import api from "./api"; // Usamos la instancia centralizada

const carritoService = {
  // Obtener carrito del usuario actual
  obtenerCarrito: async () => {
    try {
      // api.js ya tiene la base URL "/api", así que solo agregamos "/carrito"
      const response = await api.get("/carrito");
      return response.data;
    } catch (error) {
      console.error("Error al obtener carrito:", error);
      throw error;
    }
  },

  // Agregar producto al carrito
  agregarProducto: async (productoId, cantidad = 1) => {
    try {
      const response = await api.post("/carrito/agregar", null, {
        params: { productoId, cantidad },
      });
      return response.data;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  },

  // Actualizar cantidad de un item
  actualizarCantidad: async (itemId, cantidad) => {
    try {
      const response = await api.put(
        `/carrito/actualizar/${itemId}`,
        null,
        {
          params: { cantidad },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      throw error;
    }
  },

  // Eliminar item del carrito
  eliminarItem: async (itemId) => {
    try {
      const response = await api.delete(`/carrito/eliminar/${itemId}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar item:", error);
      throw error;
    }
  },

  // Vaciar carrito
  vaciarCarrito: async () => {
    try {
      const response = await api.delete("/carrito/vaciar");
      return response.data;
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      throw error;
    }
  },
};

export default carritoService;