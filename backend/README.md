# LocalSpot Backend

Une API REST moderne développée avec **Spring Boot** pour la plateforme LocalSpot - une application permettant de découvrir et partager des lieux locaux.

## 📋 Table des matières

- [Installation et configuration](#installation-et-configuration)
- [Lancement de l'application](#lancement-de-lapplication)
- [API Documentation](#api-documentation)
- [Tests](#tests)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Sécurité](#sécurité)
- [Contribution](#contribution)


### Couches de l'application

- **Controllers** - Endpoints REST et gestion des requêtes HTTP
- **Services** - Logique métier et règles d'affaires
- **Repositories** - Accès aux données et persistence
- **Entities** - Modèles de données JPA
- **Security** - Configuration de sécurité et JWT
- **DTOs** - Objets de transfert de données

## Installation et configuration

### Prérequis

- **Java 17+**
- **Maven 3.6+**
- **Docker & Docker Compose**
- **Clé API Google Places**

### 1. Cloner le projet

```bash
git clone <repository-url>
cd LocalSpot/backend
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Modifiez le fichier `.env` :

```env
GOOGLE_API_KEY=votre_clé_google_places_api
POSTGRES_DB=localspot
POSTGRES_USER=localspot_user
POSTGRES_PASSWORD=votre_mot_de_passe_sécurisé
FRONTEND_PORT=4200
BACKEND_PORT=9091
DB_PORT=5433
REDIS_PORT=6379
```

### 3. Configuration pour le développement local

Créez le fichier `src/main/resources/application.properties` :

```properties
# Base de données MySQL locale
spring.datasource.url=jdbc:mysql://localhost:3306/localspotdb
spring.datasource.username=root
spring.datasource.password=votre_mot_de_passe

# Google API
google.api.key=votre_clé_google_places_api

# Upload directory
app.upload.dir=uploads/places
```

## Lancement de l'application

### Option 1 : Avec Docker (Recommandé)

```bash
# Lancement complet (Backend + Database + Frontend)
docker-compose up --build

# Backend uniquement
docker-compose up backend database
```


L'API sera accessible sur : `http://localhost:9091`

### Option 2 : En mode développement

```bash
# Installation des dépendances
./mvnw clean install

# Lancement de l'application
./mvnw spring-boot:run
```

### Vérification du démarrage

```bash
# Health check
curl http://localhost:9091/actuator/health

# Page d'accueil API
curl http://localhost:9091/
```

## API Documentation

### Authentification

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/auth/register` | Inscription d'un nouvel utilisateur |
| `POST` | `/auth/login` | Connexion utilisateur |
| `POST` | `/auth/refresh` | Renouvellement du token |
| `GET` | `/auth/me` | Informations utilisateur connecté |
| `PUT` | `/auth/update` | Mise à jour du profil |
| `DELETE` | `/auth/delete` | Suppression du compte |

### Places Google

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/places?ville={ville}&type={type}` | Recherche de lieux |
| `GET` | `/api/places/details?placeId={id}` | Détails d'un lieu |
| `GET` | `/api/places/photo?photoreference={ref}` | Photo d'un lieu |

### Places utilisateur

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/places/user/mine` | Mes lieux créés |
| `POST` | `/api/places/user` | Créer un nouveau lieu |
| `PUT` | `/api/places/user/{id}` | Modifier un lieu |
| `DELETE` | `/api/places/user/{id}` | Supprimer un lieu |

### Community

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/api/places/public` | Lieux publics (paginés) |
| `GET` | `/api/places/public/{id}` | Détail d'un lieu public |

### Favoris

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/favorites` | Liste des favoris |
| `POST` | `/favorites` | Ajouter un favori |
| `DELETE` | `/favorites/{placeId}` | Supprimer un favori |

### Exemples de requêtes

#### Inscription

```bash
curl -X POST http://localhost:9091/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "John Doe",
    "email": "john@example.com",
    "motDePasse": "motdepasse123",
    "ville": "Paris",
    "role": "USER"
  }'
```

#### Connexion

```bash
curl -X POST http://localhost:9091/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "motDePasse": "motdepasse123"
  }'
```

#### Recherche de lieux

```bash
curl "http://localhost:9091/api/places?ville=Paris&type=restaurant"
```

#### Création d'un lieu (avec authentification)

```bash
curl -X POST http://localhost:9091/api/places/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F 'data={"name":"Mon Restaurant","category":"Restaurant","addressLine":"123 Rue de la Paix","city":"Paris","postalCode":"75001","country":"France","shortDescription":"Un excellent restaurant"}' \
  -F 'photo=@restaurant.jpg'
```

## Tests

### Lancement des tests

```bash
# Tous les tests
./mvnw test

# Tests par catégorie
./mvnw test -Dtest="*ServiceTest"
./mvnw test -Dtest="*ControllerTest"
./mvnw test -Dtest="*RepositoryTest"
./mvnw test -Dtest="*EntityTest"
```

### Rapport de couverture

```bash
# Génération du rapport JaCoCo
./mvnw clean test jacoco:report

# Ouvrir le rapport
open target/site/jacoco/index.html
```

**Couverture actuelle : 46%**

### Suite de tests

- **20 tests de Services** - Logique métier
- **12 tests d'Entités** - Modèles de données  
- **9 tests de Contrôleurs** - API REST
- **12 tests de Repositories** - Persistence
- **8 tests d'Exceptions** - Gestion d'erreurs (100%)
- **13 tests JWT/Security** - Authentification

## Structure du projet

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/example/demo/
│   │   │   ├── controllers/          # Endpoints REST
│   │   │   ├── services/             # Logique métier
│   │   │   ├── repositories/         # Accès aux données
│   │   │   ├── entities/             # Modèles JPA
│   │   │   ├── dto/                  # Objets de transfert
│   │   │   ├── security/             # Configuration sécurité
│   │   │   ├── config/               # Configuration Spring
│   │   │   └── exceptions/           # Exceptions personnalisées
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-docker.properties
│   └── test/                         # Tests unitaires et intégration
├── target/                           # Fichiers compilés
├── Dockerfile                        # Image Docker
├── pom.xml                          # Configuration Maven
└── README.md                        # Documentation
```

## Fonctionnalités

### Authentification & Autorisation
- Inscription/connexion sécurisée
- JWT avec refresh tokens
- Chiffrement BCrypt des mots de passe
- Gestion des rôles (USER, ADMIN)

### Gestion des lieux
- Intégration Google Places API
- CRUD complet des lieux utilisateur
- Upload et gestion d'images
- Système de validation et modération

### Système de favoris
- Ajout/suppression de favoris
- Persistance des favoris par utilisateur
- Synchronisation avec Google Places

### Communauté
- Partage public de lieux
- Système de pagination
- Filtres par ville et catégorie
- Modération des contenus

### API RESTful
- Design REST standard
- Gestion des erreurs HTTP
- CORS configuré pour le frontend
- Documentation Swagger/OpenAPI

## Sécurité

### Mesures implémentées

- **Authentification JWT** avec expiration
- **Chiffrement des mots de passe** avec BCrypt
- **Protection CSRF** désactivée (API stateless)
- **CORS** configuré pour le domaine frontend
- **Validation des entrées** avec Bean Validation
- **Gestion des erreurs** centralisée
- **Endpoints protégés** par rôles

### Configuration sécurisée

- Variables d'environnement pour les secrets
- Exclusion des fichiers sensibles (.gitignore)
- Tokens JWT avec durée limitée
- Refresh tokens pour le renouvellement

## Contribution

### Workflow de développement

1. **Fork** le projet
2. Créer une **branche feature** (`git checkout -b feature/AmazingFeature`)
3. **Commiter** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Standards de code

- **Java 17** avec conventions Oracle
- **Tests unitaires** obligatoires (couverture > 40%)
- **Documentation** des APIs publiques
- **Gestion des erreurs** appropriée
- **Logging** structuré avec SLF4J

**LocalSpot Backend** 