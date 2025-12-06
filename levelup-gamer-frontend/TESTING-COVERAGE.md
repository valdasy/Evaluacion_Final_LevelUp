# Documento de Cobertura de Testing

## Proyecto: Level-Up Gamer

### Información del Proyecto

- **Asignatura:** DSY1104 - Desarrollo FullStack II
- **Evaluación:** Parcial 2 (30%)
- **Fecha:** Noviembre 2025

---

## 1. Frameworks de Testing Utilizados

### 1.1 Jest + React Testing Library

- **Versión:** Jest incluido en react-scripts 5.0.1
- **Propósito:** Testing de componentes React y funciones utilitarias
- **Comando:** `npm test` o `npm run test:coverage`

### 1.2 Karma + Jasmine

- **Versión:** Karma 6.4.4, Jasmine 5.12.1
- **Propósito:** Testing de validadores y funciones JavaScript puras
- **Comando:** `npm run test:karma:single`

---

## 2. Resultados de las Pruebas

### 2.1 Jest - Resultados

- Test Suites: 6 passed, 6 total
- Tests: 27 passed, 27 total
- Cobertura Global: 20.68%

**Desglose por Archivo:**

- **FilterBar.jsx:** 100% cobertura (100% statements, 100% branches)
- **ProductReview.jsx:** 100% cobertura (75% branches)
- **RegisterForm.jsx:** 65.51% cobertura
- **validators.js:** 89.47% cobertura
- **ReferralCode.jsx:** 50% cobertura

### 2.2 Karma/Jasmine - Resultados

- Chrome 142.0.0.0 (Windows 10): Executed 8 of 8 SUCCESS
- Total: 8 SUCCESS

---

## 3. Componentes Testeados

### 3.1 Componentes de UI

1. **FilterBar** (FilterBar.test.js)

   - ✅ Renderiza correctamente
   - ✅ Búsqueda funciona correctamente
   - ✅ Filtros por categoría funcionan
   - ✅ Cambio de categoría actualiza el estado

2. **ProductCard** (eliminado temporalmente por conflictos con react-router-dom)

3. **ProductReview** (ProductReview.test.js)

   - ✅ Renderiza el formulario
   - ✅ Maneja cambios en calificación
   - ✅ Envía reseñas correctamente

4. **RegisterForm** (RegisterForm.test.js)

   - ✅ Renderiza campos de registro
   - ✅ Valida edad (mayores de 18)
   - ✅ Valida coincidencia de contraseñas

5. **ReferralCode** (ReferralCode.test.js)
   - ✅ Renderiza código de referido
   - ✅ Muestra el código correctamente

### 3.2 Validadores y Utilidades

1. **validators.js** (validators.test.js + validator.spec.js)
   - ✅ validateEmail: Valida formatos de email
   - ✅ isOver18: Verifica edad mínima
   - ✅ validatePassword: Valida longitud de contraseña
   - ✅ isDuocEmail: Detecta correos @duocuc.cl

---

## 4. Tipos de Pruebas Realizadas

### 4.1 Pruebas Unitarias

- Validación de funciones individuales
- Renderizado de componentes aislados
- Verificación de props y estado

### 4.2 Pruebas de Integración

- Interacción entre componentes y formularios
- Flujo de datos entre padre e hijo
- Eventos de usuario (click, change, submit)

### 4.3 Casos de Prueba Específicos

**Validación de Email:**

- ✅ Acepta: test@example.com, user@duocuc.cl
- ❌ Rechaza: invalid-email, test@, @example.com

**Validación de Edad:**

- ✅ Acepta: Usuarios mayores de 18 años
- ❌ Rechaza: Usuarios menores de 18 años

**Validación de Contraseña:**

- ✅ Acepta: Contraseñas de 6+ caracteres
- ❌ Rechaza: Contraseñas menores a 6 caracteres

---

## 5. Cobertura de Código

### 5.1 Métricas Generales (Jest)

| Métrica    | Porcentaje |
| ---------- | ---------- |
| Statements | 20.68%     |
| Branches   | 12.40%     |
| Functions  | 17.82%     |
| Lines      | 21.42%     |

### 5.2 Archivos con Mayor Cobertura

1. **FilterBar.jsx:** 100%
2. **ProductReview.jsx:** 100%
3. **validators.js:** 89.47%
4. **RegisterForm.jsx:** 65.51%

### 5.3 Áreas sin Cobertura

- Páginas (HomePage, ProductPage, CartPage, etc.)
- Servicios (cartService, productService, userService)
- Algunos componentes (Header, Footer, LoginForm)

---

## 6. Ejecución de las Pruebas

### 6.1 Comandos Disponibles

**Ejecutar tests Jest:**

- npm test

**Ver cobertura Jest:**

- npm run test:coverage

**Ejecutar tests Karma:**

- npm run test:karma:single

### 6.2 Reportes Generados

- **Jest:** Coverage report en `coverage/` (HTML)
- **Karma:** Coverage report en `coverage-karma/` (HTML + text-summary)

---

## 7. Conclusiones

### 7.1 Logros

- ✅ 35 pruebas totales ejecutándose exitosamente
- ✅ Dos frameworks de testing configurados
- ✅ Cobertura aceptable en componentes críticos
- ✅ Validaciones completas para lógica de negocio

### 7.2 Componentes Críticos Validados

- Sistema de validación de usuarios (email, edad, contraseña)
- Formularios de registro
- Sistema de búsqueda y filtrado
- Sistema de reseñas de productos

### 7.3 Recomendaciones Futuras

- Aumentar cobertura de páginas principales
- Agregar tests para servicios HTTP
- Implementar tests E2E con Cypress
- Mejorar cobertura de branches al 50%+

---

## 8. Tecnologías y Dependencias

### 8.1 Testing Frameworks

{
"@testing-library/react": "^16.3.0",
"@testing-library/jest-dom": "^6.9.1",
"jasmine-core": "^5.12.1",
"karma": "^6.4.4",
"karma-jasmine": "^5.1.0",
"karma-chrome-launcher": "^3.2.0",
"karma-webpack": "^5.0.1",
"karma-coverage": "^2.2.1"
}

### 8.2 Configuración

- **Jest:** Configurado automáticamente por create-react-app
- **Karma:** Archivo `karma.conf.js` personalizado
- **Webpack:** Integración con Babel para transpilación

---

**Documento generado:** Noviembre 2025  
**Autor:** Equipo - LevelUP
**Proyecto:** Level-Up Gamer - Tienda Gaming Online
