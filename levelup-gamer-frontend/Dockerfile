# --- Etapa 1: Construcción (Build) ---
# Usamos una imagen de Node.js para compilar tu código React
FROM node:18-alpine as build

# Creamos una carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero (para aprovechar caché)
COPY package*.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos todo el resto de tu código al contenedor
COPY . .

# Construimos la aplicación para producción (crea la carpeta build)
RUN npm run build

# --- Etapa 2: Servidor Web (Nginx) ---
# Usamos Nginx, que es un servidor web super ligero
FROM nginx:alpine

# Copiamos lo que construimos en la etapa 1 a la carpeta de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Configuración para que React Router funcione bien (evita error 404 al recargar)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Abrimos el puerto 80 (estándar web)
EXPOSE 80

# Arrancamos Nginx
CMD ["nginx", "-g", "daemon off;"]