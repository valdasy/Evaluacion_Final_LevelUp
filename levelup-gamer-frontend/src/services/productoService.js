import api from "./api"; // Importamos la instancia configurada (puerto 8080)

const productoService = {
  // Obtener todos los productos (para admin)
  getProductos: async () => {
    try {
      const response = await api.get("/productos");
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener productos:", error);
      throw error;
    }
  },

  // Obtener productos activos
  getProductosActivos: async () => {
    try {
      const response = await api.get("/productos/activos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos activos:", error);
      throw error;
    }
  },

  // Obtener productos destacados
  getProductosDestacados: async () => {
    try {
      const response = await api.get("/productos/destacados");
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos destacados:", error);
      throw error;
    }
  },

  // Obtener productos disponibles
  getProductosDisponibles: async () => {
    try {
      const response = await api.get("/productos/disponibles");
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos disponibles:", error);
      throw error;
    }
  },

  // Obtener producto por ID
  getProductoPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  // Obtener por categoría
  getProductosPorCategoria: async (categoriaId) => {
    try {
      const response = await api.get(`/productos/categoria/${categoriaId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos por categoría:", error);
      throw error;
    }
  },

  // Buscar por nombre
  buscarProductos: async (nombre) => {
    try {
      const response = await api.get("/productos/buscar", {
        params: { nombre },
      });
      return response.data;
    } catch (error) {
      console.error("Error al buscar productos:", error);
      throw error;
    }
  },

  // Crear producto
  crearProducto: async (producto) => {
    try {
      const response = await api.post("/productos", producto);
      return response.data;
    } catch (error) {
      console.error("❌ Error al crear producto:", error);
      throw error;
    }
  },

  // Actualizar producto
  actualizarProducto: async (id, producto) => {
    try {
      const response = await api.put(`/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar producto:", error);
      throw error;
    }
  },

  // Eliminar producto
  eliminarProducto: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al eliminar producto:", error);
      throw error;
    }
  },

  // Cambiar estado
  cambiarEstadoProducto: async (id, activo) => {
    try {
      const response = await api.patch(`/productos/${id}/estado`, null, {
        params: { activo },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      throw error;
    }
  },

  // Actualizar stock
  actualizarStockProducto: async (id, cantidad) => {
    try {
      const response = await api.patch(`/productos/${id}/stock`, null, {
        params: { cantidad },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error al actualizar stock:", error);
      throw error;
    }
  },
};

export default productoService;