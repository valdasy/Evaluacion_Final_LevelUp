# Etapa 1: Compilar el código (Usa Maven)
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compila y genera el archivo .jar (saltando los tests para ir más rápido)
RUN mvn clean package -DskipTests

# Etapa 2: Crear la imagen ligera para ejecutarlo
FROM eclipse-temurin:17-jdk-alpine
VOLUME /tmp
# Copia el archivo .jar generado en la etapa anterior
COPY --from=build /app/target/*.jar app.jar
# Comando de inicio
ENTRYPOINT ["java","-jar","/app.jar"]