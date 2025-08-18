# Frontend LocalSpot

Application Angular pour découvrir et partager des lieux locaux.

---

##Démarrage rapide

### 1. Prérequis

Assurez-vous d'avoir installé :
- [Node.js](https://nodejs.org/) (version 18 ou plus récente)
- [Angular CLI](https://angular.io/cli) : `npm install -g @angular/cli`

### 2. Installation

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd LocalSpot/frontend

# Installer les dépendances
npm install
```

### 3. Configuration

Créer le fichier `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:9091',
  googleApiKey: 'VOTRE_CLE_GOOGLE_MAPS'
};
```

### 4. Lancer l'application

```bash
# Démarrer le serveur de développement
ng serve

# L'application sera accessible sur http://localhost:4200
```

**L'application est maintenant lancée !**

---

## Tests

### Lancer les tests

```bash
# Tests complets avec rapport de couverture (recommandé)
ng test --code-coverage --watch=false --browsers=ChromeHeadless

# Tests en mode interactif (pour développement)
ng test

# Tests spécifiques
ng test --include="**/*.service.spec.ts" --watch=false      # Services seulement
ng test --include="**/features/**/*.spec.ts" --watch=false  # Composants seulement
```

### Résultats attendus

Vous devriez voir :
```
Chrome: Executed 124 of 124 SUCCESS
Coverage: 70%+ statements, 71%+ lines
```

Le rapport détaillé est généré dans `coverage/frontend/index.html`

---

##  Docker

### Option 1 : Docker simple (frontend seulement)

```bash
# Construire l'image
docker build -t localspot-frontend .

# Lancer le conteneur
docker run -p 4200:8080 localspot-frontend
```

### Option 2 : Docker Compose (application complète)

```bash
# Depuis la racine du projet (LocalSpot/)
cd ..

# Lancer tous les services (frontend + backend + database)
docker-compose up

# Ou en arrière-plan
docker-compose up -d

# Arrêter tous les services
docker-compose down
```

**L'application sera accessible sur http://localhost:4200**

---

## 🛠️ Développement

### Commandes utiles

```bash
# Générer un nouveau composant
ng generate component nom-du-composant

# Générer un service
ng generate service nom-du-service

# Build pour production
ng build --configuration=production

# Analyser le bundle
ng build --stats-json
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/frontend/stats.json
```

### Architecture du projet

```
src/app/
├── core/                 # Services et configuration
│   ├── services/        # Services API (auth, places, etc.)
│   └── models/          # Interfaces TypeScript
├── features/            # Pages et fonctionnalités
│   ├── auth/           # Connexion/inscription
│   ├── home/           # Recherche de lieux
│   ├── map/            # Carte interactive
│   ├── profile/        # Profil utilisateur
│   └── favorites/      # Gestion des favoris
└── layouts/            # Mises en page
```

---

## Tests - Informations détaillées

### Couverture actuelle
- **124 tests** passent avec succès
- **70.82%** de couverture des instructions
- **71.57%** de couverture des lignes

### Services testés
- **AuthService** - Authentification et gestion des tokens
- **PlaceService** - Recherche de lieux via Google Places
- **FavoritesService** - Gestion des favoris utilisateur
- **CommunityService** - Places partagées par la communauté
- **MyPlacesService** - Mes propres lieux ajoutés
- **CategoriesService** - Catégories de lieux

### Composants testés
- **LoginComponent** - Formulaire de connexion
- **HomeComponent** - Page d'accueil avec recherche
- **ProfileComponent** - Profil et gestion compte
- **MapComponent** - Intégration Google Maps
- **FavoritesComponent** - Liste des favoris
- **CommunityComponent** - Places communautaires

---

## 🔧 Dépannage

### Problèmes courants

**Erreur lors de `ng serve` :**
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Tests qui échouent :**
```bash
# Vérifier que Chrome est installé pour les tests headless
ng test --browsers=Chrome
```

**Problèmes Docker :**
```bash
# Reconstruire l'image
docker-compose build --no-cache frontend
```

---

## Technologies utilisées

- **Angular 19** - Framework principal
- **TypeScript** - Langage de développement
- **Angular Material** - Composants UI
- **Google Maps API** - Cartes interactives
- **SweetAlert2** - Notifications utilisateur
- **Font Awesome** - Icônes
- **Jasmine + Karma** - Tests unitaires

