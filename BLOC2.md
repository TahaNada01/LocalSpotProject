# BLOC 2 - CONCEVOIR ET DÉVELOPPER DES APPLICATIONS LOGICIELLES

---

## Mise en œuvre des compétences dans LocalSpot

### C2.1.1 - Environnements de déploiement et de test
**Compétence :** Mettre en œuvre des environnements de déploiement et de test en y intégrant les outils de suivi de performance et de qualité

**Mise en place dans le projet :**

**Protocole de déploiement continu :**
- Configuration **Docker Compose** avec services backend, frontend, base de données et Redis
- **Dockerfiles** optimisés pour chaque service (multi-stage build pour le frontend)
- Variables d'environnement externalisées (`.env`, `application-docker.properties`)
- **Nginx** configuré comme reverse proxy avec cache et compression

**Environnement de développement détaillé :**
- **Backend :** IntelliJ IDEA / VS Code + Maven + Java 17 + Spring Boot DevTools
- **Frontend :** VS Code + Angular CLI + Node.js 18 + TypeScript
- **Base de données :** PostgreSQL avec scripts d'initialisation
- **Outils :** Git, Docker Desktop, Postman pour tests API

**Critères de qualité et performance :**
- Tests automatisés avec JaCoCo (couverture minimale 80%)
- Configuration Actuator pour monitoring (health, metrics)
- Optimisation des requêtes avec pagination
- Gestion des erreurs et logs structurés

---

### C2.1.2 - Intégration continue
**Compétence :** Configurer le système d'intégration continue dans le cycle de développement

**Mise en place dans le projet :**

**Protocole d'intégration :**
- **Git workflow** avec branches feature → develop → main
- Scripts de build automatisés (`docker-compose up`)
- Tests automatiques avant chaque merge
- Pipeline de validation : Build → Test → Package → Deploy

**Séquences d'intégration :**
1. Développement local avec hot-reload
2. Tests unitaires et d'intégration
3. Build des images Docker
4. Déploiement dans l'environnement de test
5. Validation fonctionnelle avant production

---

### C2.2.1 - Conception de prototype
**Compétence :** Concevoir un prototype de l'application logicielle en tenant compte des spécificités ergonomiques

**Mise en place dans le projet :**

**Architecture structurée :**
- **Backend :** Architecture en couches (Controller → Service → Repository → Entity)
- **Frontend :** Architecture modulaire Angular avec feature modules
- **Séparation des responsabilités :** DTOs, Services, Guards, Interceptors
- **API REST** suivant les standards OpenAPI

**Framework et paradigmes :**
- **Angular 19** avec TypeScript (programmation orientée composants)
- **Spring Boot 3.4** avec annotations (IoC, DI, AOP)
- **JPA/Hibernate** pour la persistance (ORM)
- **JWT** pour l'authentification stateless

**Prototype fonctionnel :**
- Interface responsive avec navigation intuitive
- Gestion complète des utilisateurs (inscription, connexion, profil)
- CRUD complet des lieux avec upload d'images
- Intégration Google Maps et Places API
- Système de favoris et communauté

---

### C2.2.2 - Tests unitaires
**Compétence :** Développer un harnais de test unitaire pour prévenir les régressions

**Mise en place dans le projet :**

**Couverture de tests Backend (JUnit 5) :**
- Tests des contrôleurs avec `@WebMvcTest`
- Tests des services avec mocks Mockito
- Tests des repositories avec `@DataJpaTest`
- Tests des entités avec validation

**Couverture de tests Frontend (Jasmine/Karma) :**
- Tests des composants avec TestBed
- Tests des services avec HttpClientTestingModule
- Mocks des dépendances externes
- Tests des guards et interceptors

**Configuration qualité :**
- JaCoCo configuré avec seuil minimum 80%
- Exclusion des classes de configuration
- Rapports de couverture automatiques

---

### C2.2.3 - Développement sécurisé
**Compétence :** Développer le logiciel en veillant à l'évolutivité et à la sécurisation du code source

**Mise en place dans le projet :**

**Sécurité OWASP Top 10 :**
- **A01 (Injection) :** Requêtes préparées JPA, validation des entrées
- **A02 (Crypto Failures) :** BCrypt pour mots de passe, JWT sécurisé
- **A03 (Injection) :** Spring Security, validation côté serveur
- **A05 (Security Misconfiguration) :** Configuration Spring Security explicite
- **A06 (Vulnerable Components) :** Dépendances à jour via Maven/npm audit

**Accessibilité RGAA :**
- Navigation clavier optimisée (tabindex, focus)
- Contraste des couleurs respectant les ratios AA
- Balises sémantiques HTML5 (nav, main, section)
- Attributs aria-label pour les actions
- Textes alternatifs pour les images


---

### C2.2.4 - Déploiement continu
**Compétence :** Déployer le logiciel à chaque modification de code de façon progressive

**Mise en place dans le projet :**

**Gestion de versions avec Git :**
- Commits conventionnels avec messages clairs
- Branches feature avec pull requests
- Historique complet des modifications

**Déploiement progressif :**
- **Docker Compose** pour orchestration des services
- **Health checks** pour validation du déploiement
- **Rolling updates** avec zéro downtime
- **Rollback** possible via Git et Docker

**Application autonome :**
- Interface utilisateur intuitive sans formation
- Documentation intégrée (tooltips, messages d'aide)
- Gestion d'erreurs avec feedback utilisateur
- Responsive design pour tous supports

---

### C2.3.1 - Cahier de recettes
**Compétence :** Élaborer le cahier de recettes avec scénarios de tests et résultats attendus

**Mise en place dans le projet :**

**Tests fonctionnels couverts :**

| Fonctionnalité | Scénario de test | Résultat attendu |
|---------------|------------------|------------------|
| **Authentification** | Inscription avec email valide | Compte créé, redirection vers login |
| **Authentification** | Connexion avec credentials valides | Token JWT généré, accès aux pages protégées |
| **Gestion des lieux** | Création d'un lieu avec image | Lieu sauvegardé avec URL d'image |
| **Recherche** | Recherche "restaurant Paris" | Liste de restaurants parisiens via Google Places |
| **Favoris** | Ajout d'un lieu en favori | Lieu ajouté à la liste des favoris utilisateur |
| **Navigation** | Clic sur adresse d'un lieu | Redirection vers carte avec lieu centré |

**Tests structurels :**
- Tests d'intégration API avec codes de retour HTTP
- Tests de charge sur les endpoints critiques
- Validation des contraintes base de données
- Tests de compatibilité navigateurs (Chrome, Firefox, Safari)

**Tests de sécurité :**
- Tests d'authentification et autorisation
- Validation des tokens JWT (expiration, signature)
- Tests d'injection SQL et XSS
- Vérification des headers de sécurité

---

### C2.3.2 - Plan de correction
**Compétence :** Élaborer un plan de correction des bogues à partir de l'analyse des anomalies

**Mise en place dans le projet :**

**Détection et qualification des bugs :**
- Logs applicatifs avec niveaux (ERROR, WARN, INFO)
- Monitoring via Spring Boot Actuator
- Tests automatisés révélant les régressions
- Issues GitHub avec labels de priorité

**Processus d'amélioration :**

| Niveau | Type d'anomalie | Action de correction | Délai |
|--------|----------------|---------------------|-------|
| **P1 - Critique** | Sécurité, crash application | Fix immédiat + hotfix | < 24h |
| **P2 - Majeur** | Fonctionnalité principale cassée | Correction prioritaire | < 72h |
| **P3 - Mineur** | Bug UI, performance dégradée | Correction planifiée | < 1 semaine |
| **P4 - Amélioration** | Ergonomie, optimisation | Backlog de développement | Sprint suivant |

**Exemple de plan de correction :**

**Anomalie détectée :** Les favoris ne se synchronisent pas entre sessions
```
1. Analyse : Token JWT expiré lors de la sauvegarde
2. Cause racine : Pas de refresh automatique du token
3. Correction : Implémentation d'un interceptor de refresh
4. Test : Vérification de la persistance après expiration
5. Validation : Session utilisateur de 24h sans perte de favoris
```

**Code de correction - Interceptor JWT :**
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthHeader(req)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && this.hasRefreshToken()) {
          return this.handleTokenRefresh(req, next);
        }
        return throwError(error);
      })
    );
  }
}
```

---

### C2.4.1 - Documentation technique
**Compétence :** Rédiger la documentation technique d'exploitation du logiciel

**Mise en place dans le projet :**

**Manuel de déploiement :**
- Instructions Docker Compose détaillées
- Configuration des variables d'environnement
- Prérequis système et dépendances
- Procédures de sauvegarde et restauration

**Manuel d'utilisation :**
- Interface utilisateur documentée avec captures d'écran
- Workflow complet des fonctionnalités
- Guide de démarrage rapide
- FAQ et résolution des problèmes courants

**Documentation technique :**
- Architecture du système avec diagrammes
- API REST documentée avec exemples
- Choix technologiques justifiés
- Guide de développement et contribution

**Justification des choix technologiques :**

| Technologie | Justification | Alternative considérée |
|-------------|---------------|----------------------|
| **Spring Boot** | Framework mature, grande communauté, sécurité intégrée | Express.js (Node.js) |
| **Angular** | TypeScript natif, architecture scalable, Google Support | React, Vue.js |
| **PostgreSQL** | ACID, performance, extensibilité | MySQL, MongoDB |
| **JWT** | Stateless, scalable, standard industrie | Sessions serveur |
| **Docker** | Portabilité, isolation, CI/CD facilité | VM traditionnelles |

---

## Livrables produits

### Protocoles et procédures
- **Protocole de déploiement continu** (Docker Compose + CI/CD)
- **Protocole d'intégration continue** (Git workflow + Tests automatisés)
- **Plan de correction des bogues** (Processus structuré)

### Architecture et développement
- **Architecture logicielle structurée** (Frontend Angular + Backend Spring Boot)
- **Prototype fonctionnel** (Application complète avec toutes fonctionnalités)
- **Utilisation de frameworks** (Angular + Spring Boot + JPA)

### Tests et qualité
- **Tests unitaires** (JUnit + Jasmine, couverture > 70%)
- **Cahier de recettes** (Tests fonctionnels + sécurité + performance)

### Sécurité et accessibilité
- **Mesures de sécurité OWASP** (Top 10 couvert)
- **Accessibilité RGAA** (Navigation clavier, contraste, sémantique)

### Versioning et déploiement
- **Historique des versions** (Git avec tags sémantiques)
- **Application fonctionnelle** (Déployable via Docker)

### Documentation
- **Manuel de déploiement** (Instructions Docker complètes)
- **Manuel d'utilisation** (Guide utilisateur avec captures)
- **Manuel de mise à jour** (Procédures de maintenance)

