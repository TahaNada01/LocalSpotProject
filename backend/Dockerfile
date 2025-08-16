# Étape 1 : Build
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app

# Copier les fichiers de configuration Maven
COPY pom.xml .
COPY src ./src

# Construire l'application
RUN mvn clean package -DskipTests

# Étape 2 : Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Créer le répertoire pour les uploads
RUN mkdir -p /app/uploads && \
    chown -R appuser:appgroup /app

# Copier le JAR depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Changer vers l'utilisateur non-root
USER appuser

# Exposer le port
EXPOSE 9091

# Variables d'environnement par défaut
ENV SPRING_PROFILES_ACTIVE=docker
ENV UPLOAD_DIR=/app/uploads

# Commande de démarrage
ENTRYPOINT ["java", "-jar", "app.jar"]