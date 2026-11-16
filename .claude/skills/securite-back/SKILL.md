---
name: securite-back
description: Règles de sécurité côté serveur pour Node.js (routes serveur Nuxt/Nitro), Laravel, Prisma/PostgreSQL et Supabase (RLS). À appliquer en écrivant une route d'API, une requête en base, une policy RLS, une migration, un upload de fichier ou de la logique d'authentification et d'autorisation. À utiliser aussi pour un audit sécurité back.
---

# Sécurité back-end

Ces règles n'ont pas de mécanisme d'exception : un contrôle d'autorisation, une validation ou une requête paramétrée ne se remplace pas par un commentaire. Si une contrainte semble l'imposer, Claude s'arrête et en discute avec le développeur avant d'écrire le code.

## Authentification et autorisation
- Chaque route vérifie l'identité, puis le droit de l'utilisateur sur la ressource précise (pas seulement « connecté »). Tester l'accès à la ressource d'un autre utilisateur (IDOR).
- Laravel : Policies et Gates, middleware `auth` sur les groupes de routes, `$fillable` explicite (pas de `$guarded = []`).
- Nitro : vérification dans chaque handler `server/api/*` ou via un utilitaire partagé, jamais supposée.
- Mots de passe : bcrypt ou argon2, jamais de hachage maison.

## Supabase
- RLS activée sur **toutes** les tables exposées, avec des policies distinctes pour `select`, `insert`, `update`, `delete`.
- Policies basées sur `auth.uid()`, jamais sur une valeur envoyée par le client.
- Clé `service_role` uniquement côté serveur, jamais dans un environnement accessible au client.
- Fonctions `security definer` : `search_path` fixé et droits vérifiés à l'intérieur.
- Storage : policies sur les buckets, buckets privés par défaut.

## Injections
- Requêtes paramétrées uniquement. Prisma : éviter `$queryRawUnsafe`, préférer `$queryRaw` avec template tagué. Laravel : pas de `DB::raw` ni `whereRaw` avec concaténation d'entrée utilisateur.
- Pas d'entrée utilisateur dans une commande shell, un chemin de fichier ou un nom de colonne sans liste blanche.
- Twig : échappement automatique conservé, `|raw` seulement sur du contenu maîtrisé.

## Validation des entrées
- Valider chaque entrée côté serveur (zod pour Node, Form Requests pour Laravel) : type, longueur, format.
- Renvoyer uniquement les champs nécessaires (pas d'objet utilisateur complet avec hash ou tokens).

## Fichiers
- Upload : type MIME vérifié côté serveur, taille limitée, nom régénéré, stockage hors du webroot ou dans un bucket privé.
- Pas de service direct des fichiers uploadés avec leur type d'origine sans contrôle.

## Protection des API
- Limitation de débit sur la connexion, l'inscription, la réinitialisation de mot de passe et les endpoints coûteux.
- CORS restreint aux origines connues, pas de `*` avec credentials.
- CSRF : actif sur Laravel, `SameSite` sur les cookies pour Nitro.
- Messages d'erreur génériques en production, détails uniquement dans les logs.

## Secrets et infrastructure
- Secrets dans les variables d'environnement, `.env` dans `.gitignore`, `.env.example` sans valeur réelle.
- Docker : pas de secret dans l'image ni dans le `Dockerfile`, utilisateur non root, base non exposée publiquement.
- GitHub Actions : secrets via `secrets.*`, permissions du `GITHUB_TOKEN` minimales, actions tierces épinglées.

## Format d'audit (si demandé)
Pour chaque point : fichier et ligne, scénario d'attaque en une phrase, gravité, correction en code.
