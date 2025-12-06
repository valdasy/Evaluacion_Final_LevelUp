# 🎮 LEVEL UP GAMER - Frontend

Plataforma e-commerce gaming desarrollada con React, integrada con backend Spring Boot para la Evaluación Parcial 3 de Desarrollo FullStack II.

## 📋 Descripción del Proyecto

Level Up Gamer es una aplicación web full-stack que permite a los usuarios navegar por un catálogo de productos gaming, gestionar su carrito de compras, realizar pedidos y administrar productos (panel admin). El sistema incluye autenticación JWT, gestión de roles y persistencia de sesión.

## ✨ Características Principales

### Para Usuarios
- 🛍️ Catálogo de productos con filtros y búsqueda
- 🛒 Carrito de compras persistente con backend
- 👤 Sistema de registro y login con JWT
- 🔐 Gestión de sesión con persistencia en localStorage
- 📱 Diseño responsivo y moderno
- 💳 Proceso de checkout integrado

### Para Administradores
- 📊 Dashboard con estadísticas en tiempo real
- ➕ Crear, editar y eliminar productos
- 📁 Gestión de categorías
- 👥 Administración de usuarios
- 🎯 Panel de control intuitivo con sidebar

## 🚀 Tecnologías Utilizadas

- **React 18** - Framework principal
- **React Router DOM** - Navegación y rutas protegidas
- **Context API** - Gestión de estado global (Carrito)
- **Axios** - Cliente HTTP para API REST
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JWT** - Autenticación y autorización
- **LocalStorage** - Persistencia de sesión

## 📦 Requisitos Previos

- Node.js (versión 16 o superior)
- npm (versión 8 o superior)
- Backend Spring Boot corriendo en `http://localhost:8081`

## 🔧 Instalación y Ejecución

### 1. Clonar el repositorio

git clone https://github.com/valdasy/levelup-gamer-frontend.git
cd levelup-gamer-frontend

### 2. Instalar dependencias

npm install

### 3. Configurar variables de entorno (opcional)

Crear archivo `.env` en la raíz:

REACT_APP_API_URL=http://localhost:8081

### 4. Ejecutar en modo desarrollo

npm start

La aplicación estará disponible en: `http://localhost:3000`

### 5. Generar build de producción

npm run build

## 🏗️ Estructura del Proyecto

src/
├── components/          # Componentes reutilizables
│   ├── Header/         # Navegación principal
│   ├── Footer/         # Pie de página
│   ├── LoginForm/      # Formulario de login
│   └── RegisterForm/   # Formulario de registro
├── pages/              # Páginas principales
│   ├── HomePage.jsx    # Landing page
│   ├── AuthPage.jsx    # Login/Registro
│   ├── ProductsPage.jsx # Catálogo
│   ├── CartPage.jsx    # Carrito
│   ├── AdminPage.jsx   # Dashboard admin
│   └── AdminProductsPage.jsx # Gestión productos
├── services/           # Servicios de API
│   ├── authService.js  # Autenticación JWT
│   ├── productoService.js # Productos CRUD
│   ├── categoriaService.js # Categorías
│   └── carritoService.js # Carrito
├── context/            # Context API
│   └── CarritoContext.jsx # Estado global carrito
├── App.js             # Configuración de rutas
└── index.js           # Punto de entrada

## 🔐 Autenticación y Autorización

### JWT Token
El sistema utiliza tokens JWT para autenticación:
- Token almacenado en `localStorage`
- Enviado en header `Authorization: Bearer {token}`
- Renovación automática en cada request

### Roles de Usuario
- **USER**: Acceso a catálogo, carrito y checkout
- **ADMIN**: Acceso adicional al panel de administración

### Rutas Protegidas
<ProtectedRoute requiredRole="ADMIN">
  <AdminPage />
</ProtectedRoute>

## 📡 Integración con Backend

### Endpoints Principales

**Autenticación:**
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

**Productos:**
- `GET /api/productos/activos` - Listar productos
- `GET /api/productos/{id}` - Detalle producto
- `POST /api/productos` - Crear producto (Admin)
- `PUT /api/productos/{id}` - Actualizar producto (Admin)
- `DELETE /api/productos/{id}` - Eliminar producto (Admin)

**Carrito:**
- `GET /api/carrito` - Obtener carrito del usuario
- `POST /api/carrito/agregar` - Agregar producto
- `PUT /api/carrito/actualizar` - Actualizar cantidad
- `DELETE /api/carrito/{id}` - Eliminar item

**Categorías:**
- `GET /api/categorias/activas` - Listar categorías

## 🎨 Características de Diseño

### Paleta de Colores
- Primary: `#667eea` → `#764ba2` (Gradiente morado)
- Success: `#43e97b`
- Warning: `#ffc107`
- Danger: `#dc3545`

### Animaciones
- Fade In/Out
- Slide Up
- Hover Effects
- Loading Spinners

### Responsividad
- Mobile First
- Breakpoints: 480px, 768px, 1024px, 1400px

## 🧪 Testing

# Ejecutar tests
npm test

# Con reporte de cobertura
npm run test:coverage

# Tests con Karma/Jasmine
npm run test:karma:single

## 📸 Capturas de Pantalla

### Homepage
- Hero section con gradiente
- Productos destacados
- Categorías rápidas
- Features section

### Panel Admin
- Dashboard con estadísticas
- Sidebar de navegación
- Gestión CRUD de productos
- Modal para crear/editar

### Carrito
- Lista de productos
- Actualización de cantidades
- Cálculo automático de totales
- Botón de checkout

## 🚀 Scripts Disponibles

# Desarrollo
npm start              # Servidor desarrollo (puerto 3000)
npm run build          # Build de producción

# Testing
npm test              # Tests Jest en modo watch
npm run test:coverage # Reporte de cobertura Jest
npm run test:karma    # Tests Karma/Jasmine

# Otros
npm run eject         # Exponer configuración CRA

## 🔒 Seguridad Implementada

- ✅ Autenticación JWT con roles
- ✅ Rutas protegidas por rol
- ✅ Validación de tokens en cada request
- ✅ Gestión segura de sesión
- ✅ Logout con limpieza de datos
- ✅ Restricciones de acceso en frontend y backend

## 🐛 Solución de Problemas

### Error 401 - No autorizado
- Verificar que el token JWT esté en localStorage
- Hacer logout y login nuevamente

### Error 404 - Endpoint no encontrado
- Verificar que el backend esté corriendo en puerto 8081
- Revisar CORS en el backend

### Productos no cargan
- Verificar conexión con MySQL
- Revisar que haya productos activos en la BD

## 📝 Notas de Desarrollo

- El modo DEMO permite probar sin base de datos conectada
- Los datos mock están disponibles para desarrollo
- El token expira después de 24 horas

## 👨‍💻 Autor

**Proyecto Académico** - Evaluación Parcial 3  
Asignatura: DSY1104 - Desarrollo FullStack II  
Institución: DuocUC

## 📄 Licencia

Este proyecto es de uso académico.

## 🔗 Enlaces Relacionados

- [Backend Repository](https://github.com/valdasy/levelup-gamer-backend)
- [Documentación API](http://localhost:8081/swagger-ui.html)

---

⭐ **Desarrollado con React y Spring Boot** ⭐
