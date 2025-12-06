========================================
LEVEL UP GAMER - Frontend
========================================

Plataforma e-commerce gaming desarrollada con React, integrada con backend Spring Boot para la Evaluacion Parcial 3 de Desarrollo FullStack II.

========================================
DESCRIPCION DEL PROYECTO
========================================

Level Up Gamer es una aplicacion web full-stack que permite a los usuarios navegar por un catalogo de productos gaming, gestionar su carrito de compras, realizar pedidos y administrar productos (panel admin). El sistema incluye autenticacion JWT, gestion de roles y persistencia de sesion.

========================================
CARACTERISTICAS PRINCIPALES
========================================

Para Usuarios:
- Catalogo de productos con filtros y busqueda
- Carrito de compras persistente con backend
- Sistema de registro y login con JWT
- Gestion de sesion con persistencia en localStorage
- Diseno responsivo y moderno
- Proceso de checkout integrado

Para Administradores:
- Dashboard con estadisticas en tiempo real
- Crear, editar y eliminar productos
- Gestion de categorias
- Administracion de usuarios
- Panel de control intuitivo con sidebar

========================================
TECNOLOGIAS UTILIZADAS
========================================

- React 18 - Framework principal
- React Router DOM - Navegacion y rutas protegidas
- Context API - Gestion de estado global (Carrito)
- Axios - Cliente HTTP para API REST
- CSS3 - Estilos modernos con gradientes y animaciones
- JWT - Autenticacion y autorizacion
- LocalStorage - Persistencia de sesion

========================================
REQUISITOS PREVIOS
========================================

- Node.js (version 16 o superior)
- npm (version 8 o superior)
- Backend Spring Boot corriendo en http://localhost:8081

========================================
INSTALACION Y EJECUCION
========================================

1. Clonar el repositorio

git clone https://github.com/valdasy/levelup-gamer-frontend.git
cd levelup-gamer-frontend

2. Instalar dependencias

npm install

3. Configurar variables de entorno (opcional)

Crear archivo .env en la raiz:

REACT_APP_API_URL=http://localhost:8081

4. Ejecutar en modo desarrollo

npm start

La aplicacion estara disponible en: http://localhost:3000

5. Generar build de produccion

npm run build

========================================
ESTRUCTURA DEL PROYECTO
========================================

src/
├── components/          # Componentes reutilizables
│   ├── Header/         # Navegacion principal
│   ├── Footer/         # Pie de pagina
│   ├── LoginForm/      # Formulario de login
│   └── RegisterForm/   # Formulario de registro
├── pages/              # Paginas principales
│   ├── HomePage.jsx    # Landing page
│   ├── AuthPage.jsx    # Login/Registro
│   ├── ProductsPage.jsx # Catalogo
│   ├── CartPage.jsx    # Carrito
│   ├── AdminPage.jsx   # Dashboard admin
│   └── AdminProductsPage.jsx # Gestion productos
├── services/           # Servicios de API
│   ├── authService.js  # Autenticacion JWT
│   ├── productoService.js # Productos CRUD
│   ├── categoriaService.js # Categorias
│   └── carritoService.js # Carrito
├── context/            # Context API
│   └── CarritoContext.jsx # Estado global carrito
├── App.js             # Configuracion de rutas
└── index.js           # Punto de entrada

========================================
AUTENTICACION Y AUTORIZACION
========================================

JWT Token:
El sistema utiliza tokens JWT para autenticacion:
- Token almacenado en localStorage
- Enviado en header Authorization: Bearer {token}
- Renovacion automatica en cada request

Roles de Usuario:
- USER: Acceso a catalogo, carrito y checkout
- ADMIN: Acceso adicional al panel de administracion

========================================
INTEGRACION CON BACKEND
========================================

Endpoints Principales:

AUTENTICACION:
- POST /api/auth/login - Iniciar sesion
- POST /api/auth/register - Registrar usuario

PRODUCTOS:
- GET /api/productos/activos - Listar productos
- GET /api/productos/{id} - Detalle producto
- POST /api/productos - Crear producto (Admin)
- PUT /api/productos/{id} - Actualizar producto (Admin)
- DELETE /api/productos/{id} - Eliminar producto (Admin)

CARRITO:
- GET /api/carrito - Obtener carrito del usuario
- POST /api/carrito/agregar - Agregar producto
- PUT /api/carrito/actualizar - Actualizar cantidad
- DELETE /api/carrito/{id} - Eliminar item

CATEGORIAS:
- GET /api/categorias/activas - Listar categorias

========================================
CARACTERISTICAS DE DISENO
========================================

Paleta de Colores:
- Primary: #667eea -> #764ba2 (Gradiente morado)
- Success: #43e97b
- Warning: #ffc107
- Danger: #dc3545

Animaciones:
- Fade In/Out
- Slide Up
- Hover Effects
- Loading Spinners

Responsividad:
- Mobile First
- Breakpoints: 480px, 768px, 1024px, 1400px

========================================
TESTING
========================================

Ejecutar tests:
npm test

Con reporte de cobertura:
npm run test:coverage

Tests con Karma/Jasmine:
npm run test:karma:single

========================================
CAPTURAS DE PANTALLA
========================================

Homepage:
- Hero section con gradiente
- Productos destacados
- Categorias rapidas
- Features section

Panel Admin:
- Dashboard con estadisticas
- Sidebar de navegacion
- Gestion CRUD de productos
- Modal para crear/editar

Carrito:
- Lista de productos
- Actualizacion de cantidades
- Calculo automatico de totales
- Boton de checkout

========================================
SCRIPTS DISPONIBLES
========================================

Desarrollo:
npm start              # Servidor desarrollo (puerto 3000)
npm run build          # Build de produccion

Testing:
npm test              # Tests Jest en modo watch
npm run test:coverage # Reporte de cobertura Jest
npm run test:karma    # Tests Karma/Jasmine

Otros:
npm run eject         # Exponer configuracion CRA

========================================
SEGURIDAD IMPLEMENTADA
========================================

- Autenticacion JWT con roles
- Rutas protegidas por rol
- Validacion de tokens en cada request
- Gestion segura de sesion
- Logout con limpieza de datos
- Restricciones de acceso en frontend y backend

========================================
SOLUCION DE PROBLEMAS
========================================

Error 401 - No autorizado:
- Verificar que el token JWT este en localStorage
- Hacer logout y login nuevamente

Error 404 - Endpoint no encontrado:
- Verificar que el backend este corriendo en puerto 8081
- Revisar CORS en el backend

Productos no cargan:
- Verificar conexion con MySQL
- Revisar que haya productos activos en la BD

========================================
NOTAS DE DESARROLLO
========================================

- El modo DEMO permite probar sin base de datos conectada
- Los datos mock estan disponibles para desarrollo
- El token expira despues de 24 horas

========================================
AUTOR
========================================

Proyecto Academico - Evaluacion Parcial 3
Asignatura: DSY1104 - Desarrollo FullStack II
Institucion: DuocUC

========================================
LICENCIA
========================================

Este proyecto es de uso academico.

========================================
ENLACES RELACIONADOS
========================================

- Backend Repository: https://github.com/vichinho/levelup-gamer-backend
- Documentacion API: http://localhost:8081/swagger-ui.html

========================================
Desarrollado con React y Spring Boot
========================================
