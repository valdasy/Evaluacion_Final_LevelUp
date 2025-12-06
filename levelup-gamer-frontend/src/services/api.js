import axios from "axios";

// Usamos la variable de entorno, o el localhost por defecto si no existe
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token JWT a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Solo redirigir si NO estamos en las rutas de auth (login/register)
      const currentPath = window.location.pathname;
      const isAuthPage =
        currentPath.includes("/auth") || currentPath.includes("/login");

      // Solo limpiar y redirigir si el usuario ya estaba autenticado (token expirado)
      // No redirigir si estamos intentando hacer login
      if (!isAuthPage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
