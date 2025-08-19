# 📍 LocalSpot - Projet d'évaluation BLOC 2

**LocalSpot** est une plateforme de recommandations locales qui permet aux utilisateurs de découvrir, sauvegarder et planifier des visites de lieux intéressants autour d'eux.  
Ce projet est développé en **Angular** (frontend), **Spring Boot** (backend) et **PostgreSQL** (base de données relationnelle).

Pour les détails techniques complets, consultez les documentations spécialisées :

📋 **[Backend README](backend/README.md)** - Documentation technique Spring Boot  
📋 **[Frontend README](frontend/README.md)** - Documentation technique Angular  

---

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend API   │───▶│   Database      │
│   (Angular)     │    │  (Spring Boot)  │    │  (PostgreSQL)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  Google Places  │
                       │      API        │
                       └─────────────────┘
```

## Technologies utilisées

### Framework et Langage
- **Java 17** - Langage de programmation
- **Spring Boot 3.4.4** - Framework principal
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Persistence des données

### Base de données
- **PostgreSQL** - Base de données principale (production)
- **H2** - Base de données en mémoire (tests)

### Sécurité
- **JWT (JSON Web Tokens)** - Authentification stateless
- **BCrypt** - Chiffrement des mots de passe

### APIs Externes
- **Google Places API** - Recherche de lieux
- **WebClient** - Client HTTP réactif

### Tests
- **JUnit 5** - Framework de tests
- **Mockito** - Mocking
- **JaCoCo** - Couverture de code (46%)

### DevOps
- **Docker** - Containerisation
- **Maven** - Gestion des dépendances

## 📊 Compétences BLOC 2 évaluées

Pour les détails complets sur la mise en œuvre des compétences du BLOC 2 "CONCEVOIR ET DÉVELOPPER DES APPLICATIONS LOGICIELLES", consultez le document dédié :

**📋 [BLOC2.md](BLOC2.md)** - Compétences évaluées et leur implémentation dans LocalSpot

---

## 🧱 Stack technique

| Côté         | Technologie         | Description                                |
|--------------|---------------------|--------------------------------------------|
| Frontend     | Angular 19          | Application SPA avec gestion d'état        |
| Backend      | Spring Boot 3.4     | API REST sécurisée avec JWT                |
| Base de données | PostgreSQL/MySQL | Stockage des utilisateurs, lieux, etc.     |
| Authentification | Spring Security + JWT | Connexion sécurisée                |
| UI Design    | CSS personnalisé + FontAwesome | Interface moderne et responsive |
| DevOps       | Docker              | Conteneurisation de l'application          |
| Tests        | JUnit (Backend) + Jasmine/Karma (Frontend) | Tests unitaires et d'intégration |
| CI/CD        | Docker Compose      | Déploiement automatisé                     |

---

## ✨ Fonctionnalités principales

- **Authentification complète** (inscription / connexion avec JWT)
- **Recommandation de lieux** via Google Places API
- **Gestion des favoris** personnalisés
- **Création de lieux personnalisés** par les utilisateurs
- **Section communautaire** pour découvrir les lieux partagés
- **Recherche avancée** par catégorie, ville et localisation
- **Affichage sur carte interactive** avec Google Maps
- **Interface responsive** adaptée mobile/desktop
- **Profil utilisateur** avec gestion des lieux créés

---

## 🗂️ Structure du projet

```
LocalSpot/
├── frontend/                    # Application Angular 19
│   ├── src/app/
│   │   ├── core/               # Services, modèles, intercepteurs
│   │   ├── features/           # Composants fonctionnels
│   │   ├── layouts/            # Layouts d'application
│   │   └── testing/            # Utilitaires de test
│   ├── nginx.conf              # Configuration Nginx pour Docker
│   └── Dockerfile              # Image Docker frontend
├── backend/                     # API Spring Boot
│   ├── src/main/java/com/example/demo/
│   │   ├── config/             # Configuration Spring Security
│   │   ├── controllers/        # Contrôleurs REST
│   │   ├── entities/           # Entités JPA
│   │   ├── repositories/       # Repositories Spring Data
│   │   ├── services/           # Services métier
│   │   └── security/           # Gestion JWT et sécurité
│   ├── src/test/               # Tests unitaires et d'intégration
│   └── Dockerfile              # Image Docker backend
├── docker-compose.yml          # Orchestration des services
├── .gitignore                  # Fichiers ignorés par Git
└── README.md                   # Documentation du projet
```

---

## Déploiement et installation

### Prérequis

- [Docker](https://www.docker.com/) et Docker Compose
- [Node.js 18+](https://nodejs.org/) (pour développement local)
- [Java 17+](https://adoptopenjdk.net/) (pour développement local)
- [Git](https://git-scm.com/)

### 🐳 Déploiement avec Docker (Recommandé)

```bash
# Cloner le projet
git clone https://github.com/votre-nom/localspot.git
cd localspot

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec votre clé Google API

# Lancer l'application complète
docker-compose up -d

# Arreter l'application 
docker-compose down

# Accéder à l'application
# Frontend: http://localhost:4200
# Backend API: http://localhost:9091
# Base de données: localhost:5432
```

### 🖥️ Développement local

#### Frontend (Angular)

```bash
cd frontend
npm install
ng serve
# Accès : http://localhost:4200
```

#### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
# Accès API : http://localhost:9091
```

#### Base de données

```bash
# PostgreSQL avec Docker
docker run --name localspot-db -e POSTGRES_DB=localspot -e POSTGRES_USER=localspot_user -e POSTGRES_PASSWORD=localspot_password -p 5432:5432 -d postgres:15-alpine
```

---

## Tests et qualité

### Tests Backend (JUnit)
```bash
cd backend
./mvnw test                    # Tests unitaires
./mvnw jacoco:report           # Rapport de couverture

# Ouvrir le rapport
open target/site/jacoco/index.html
```

### Tests Frontend (Jasmine/Karma)
```bash
cd frontend
npm run test                   # Tests unitaires
# Tests complets avec rapport de couverture (recommandé)
ng test --code-coverage --watch=false --browsers=ChromeHeadless
```

---

---

## Contribution

1.Fork le projet
2.Clone ce repo : git clone https://github.com/votre-nom/localspot.git
3.Crée ta branche : git checkout -b feature/ma-feature
4.Code 💻
5.Push : git push origin feature/ma-feature
6.Crée une Pull Request 

---

## Licence

Ce projet est open-source sous licence MIT.