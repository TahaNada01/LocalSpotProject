# Étape 1 : Build de l'application Angular
FROM node:18-alpine AS build
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer TOUTES les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2 : Servir avec Nginx
FROM nginx:1.25-alpine

# Supprimer la page par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/nginx.conf

# Copier les fichiers construits depuis le dossier browser
COPY --from=build /app/dist/frontend/browser/ /usr/share/nginx/html/

# Exposer le port
EXPOSE 8080

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]