# 📍 LocalSpot

**LocalSpot** est une plateforme de recommandations locales qui permet aux utilisateurs de découvrir, sauvegarder et planifier des visites de lieux intéressants autour d'eux.  
Ce projet est développé en **Angular** (frontend), **Spring Boot** (backend) et **PostgreSQL** (base de données relationnelle).

---

## 🧱 Stack technique

| Côté         | Technologie         | Description                                |
|--------------|---------------------|--------------------------------------------|
| Frontend     | Angular             | Application SPA avec gestion d’état        |
| Backend      | Spring Boot         | API REST sécurisée avec JWT                |
| Base de données | PostgreSQL       | Stockage des utilisateurs, lieux, etc.     |
| Authentification | Spring Security + JWT | Connexion sécurisée                |
| UI Design    | Angular Material ou TailwindCSS | Interface moderne et responsive |
| DevOps       | Docker (à venir)    | Conteneurisation de l'app (optionnel)      |

---

## ✨ Fonctionnalités principales

- 🔐 Authentification (inscription / connexion)
- 📍 Recommandation de lieux
- 💖 Gestion des favoris
- ⭐ Wishlist : lieux à visiter plus tard
- 🔍 Recherche de lieux par catégorie ou localisation
- 🗺️ Affichage sur carte (via Leaflet ou Mapbox - à venir)

---

## 🗂️ Structure du projet

```
LocalSpot/
├── frontend/         # Application Angular
├── backend/          # API Spring Boot
├── database/         # Scripts SQL, MCD
└── README.md
```

---

## 🚀 Lancer le projet en local

### Prérequis

- [Node.js](https://nodejs.org/) (LTS)
- [Angular CLI](https://angular.io/cli)
- [Java 17+](https://adoptopenjdk.net/)
- [Maven](https://maven.apache.org/)
- [PostgreSQL](https://www.postgresql.org/)

---

### 🖥️ Frontend (Angular)

```bash
cd frontend
npm install
ng serve
```

> Accès à l'application : http://localhost:4200

---

### 🛠️ Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

> Accès à l'API : http://localhost:8080/api

---

### 🗃️ Base de données

1. Crée une base PostgreSQL :
   ```sql
   CREATE DATABASE localspot;
   ```

2. Configure `application.yml` :

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/localspot
    username: postgres
    password: votre_mot_de_passe
```

---

## 📌 À venir

- 🌍 Intégration des cartes interactives
- 📱 Version mobile responsive
- 🧪 Tests unitaires (Jest / JUnit)
- 🐳 Dockerisation du projet

---

## 🤝 Contribuer

1. Fork le projet
2. Clone ce repo : `git clone https://github.com/votre-nom/localspot.git`
3. Crée ta branche : `git checkout -b feature/ma-feature`
4. Code 💻
5. Push : `git push origin feature/ma-feature`
6. Crée une Pull Request ✅

---

## 📃 Licence

Ce projet est open-source sous licence MIT.
