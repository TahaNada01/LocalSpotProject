-- Script d'initialisation de la base de données LocalSpot
-- Ce script sera exécuté automatiquement lors du premier démarrage de PostgreSQL

-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE localspot'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'localspot')\gexec

-- Se connecter à la base de données
\c localspot;

-- Extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Index pour améliorer les performances de recherche textuelle
-- Ces index seront créés après que Hibernate ait créé les tables

-- Commentaires pour documentation
COMMENT ON DATABASE localspot IS 'Base de données pour l''application LocalSpot';

-- Créer un utilisateur applicatif avec les permissions limitées
-- (optionnel, déjà géré par POSTGRES_USER dans docker-compose)

-- Afficher le statut
SELECT 'Base de données LocalSpot initialisée avec succès!' as status;