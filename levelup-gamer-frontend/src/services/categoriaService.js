import api from "./api"; // Usamos la configuración central (8080)

const categoriaService = {
  // Obtener todas las categorías
  getCategorias: async () => {
    try {
      const response = await api.get("/categorias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      throw error;
    }
  },

  // Obtener categorías activas (para el filtro de la tienda)
  getCategoriasActivas: async () => {
    try {
      const response = await api.get("/categorias/activas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener categorías activas:", error);
      throw error;
    }
  },

  // Obtener por ID
  getCategoriaPorId: async (id) => {
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener categoría:", error);
      throw error;
    }
  },

  // Crear categoría
  crearCategoria: async (categoria) => {
    try {
      const response = await api.post("/categorias", categoria);
      return response.data;
    } catch (error) {
      console.error("Error al crear categoría:", error);
      throw error;
    }
  },

  // Actualizar categoría
  actualizarCategoria: async (id, categoria) => {
    try {
      const response = await api.put(`/categorias/${id}`, categoria);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      throw error;
    }
  },

  // Eliminar categoría
  eliminarCategoria: async (id) => {
    try {
      const response = await api.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      throw error;
    }
  },

  // Cambiar estado
  cambiarEstadoCategoria: async (id, activo) => {
    try {
      const response = await api.patch(`/categorias/${id}/estado`, null, {
        params: { activo },
      });
      return response.data;
    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
      throw error;
    }
  },
};

export default categoriaService;