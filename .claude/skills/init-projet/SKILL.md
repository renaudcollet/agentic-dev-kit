---
name: init-projet
description: Met en place le socle qualité d'un nouveau projet ou d'un projet qui n'en a pas (lint, formatage, TypeScript strict, tests unitaires, CI GitHub Actions, CLAUDE.md). À lancer avec /init-projet.
disable-model-invocation: true
---

# Initialisation du socle qualité

Objectif : qu'un projet ait, dès le départ, du lint, un typage strict, des tests unitaires, une CI optionnelle et un CLAUDE.md à jour. Travailler étape par étape, en montrant ce qui est fait.

## 1. État des lieux (sans rien modifier)
- Identifier la stack : `package.json`, `nuxt.config.*`, `vite.config.*`, `composer.json`, `artisan`, `docker-compose.yml`.
- Gestionnaire de paquets : présence de `package-lock.json`, `pnpm-lock.yaml` ou `yarn.lock`. Utiliser celui du projet.
- Ce qui existe déjà : config ESLint/Prettier, `tsconfig.json`, tests, `.github/workflows/`, `CLAUDE.md`, hooks Git.
- Présenter un résumé court : ce qui est en place, ce qui manque, ce qui sera proposé.

## 2. Questions (une seule fois, regroupées)
Poser avec AskUserQuestion si disponible, sinon en texte :
1. **CI GitHub Actions** : lancer lint, typecheck et tests unitaires à chaque push et pull request ? (oui / non / plus tard)
2. **Tests e2e dans la CI** : les ajouter maintenant, plus tard, ou non ? (s'appuyer sur la skill `tests-e2e` si oui)
3. **Vérification avant commit** (Husky + lint-staged) : oui ou non ?
4. **Dépôt d'agence ou de client** : y a-t-il des conventions imposées à respecter ? Si oui, les suivre en priorité.
Ne pas reposer une question dont la réponse est évidente dans le projet.

## 3. Lint et formatage
- **Nuxt** : `@nuxt/eslint` (config plate `eslint.config.mjs` générée par le module).
- **Vue/Vite ou JS/TS natif** : ESLint en config plate avec `typescript-eslint` (et `eslint-plugin-vue` si Vue).
- **Prettier** ou formatage via ESLint stylistic : en choisir un seul, ne pas faire cohabiter deux formateurs en conflit (`eslint-config-prettier` si Prettier).
- **Laravel** : Laravel Pint pour le PHP, PHPStan/Larastan (niveau 5 au départ, à monter ensuite).
- Ajouter `eslint-plugin-vuejs-accessibility` sur les projets Vue (cohérent avec la skill `accessibilite`).
- Scripts : `lint`, `lint:fix`, `format`.
- Lancer `lint:fix` une fois et signaler ce qui reste à corriger à la main, sans désactiver de règle pour faire passer le lint.

## 4. TypeScript strict
- `"strict": true`, plus `"noUncheckedIndexedAccess": true` et `"noImplicitOverride": true`.
- Nuxt : options dans `nuxt.config` (`typescript.strict`, `typescript.tsConfig`), vérification avec `nuxi typecheck` (installer `vue-tsc` si demandé par Nuxt).
- Vue/Vite : `vue-tsc --noEmit`. TS natif : `tsc --noEmit`.
- Script `typecheck`.
- Projet existant avec beaucoup d'erreurs : ne pas tout corriger d'un coup ni affaiblir la config. Proposer d'activer `strict` et de corriger par lots, ou de lister les erreurs pour décision.

## 5. Tests unitaires
- **Vitest** pour Nuxt, Vue, Vite et JS natif (`@nuxt/test-utils` pour Nuxt, `@vue/test-utils` pour les composants, environnement `happy-dom`).
- **Pest** (ou PHPUnit si déjà présent) pour Laravel.
- Créer un premier test réel sur une fonction existante du projet, pas un test vide `1 + 1`.
- Scripts : `test` (une passe, pour la CI) et `test:watch`.
- Couverture disponible (`test:coverage`) sans seuil bloquant au départ.

## 6. CI GitHub Actions (si validée à l'étape 2)
Fichier `.github/workflows/ci.yml` :
- Déclencheurs : `push` et `pull_request`.
- Jobs : installation (`npm ci` ou équivalent, avec cache), `lint`, `typecheck`, `test`. Ajouter le job e2e si demandé, selon la skill `tests-e2e`.
- `permissions: contents: read`, actions épinglées sur une version majeure, `concurrency` pour annuler les exécutions obsolètes sur une même branche.
- Version de Node lue depuis `.nvmrc` ou `engines` (créer `.nvmrc` si absent).
- Laravel : job PHP avec `composer install`, Pint en mode test, PHPStan, Pest.

## 7. Avant commit (si validé)
Husky + lint-staged : lint et formatage sur les fichiers indexés uniquement. Le typecheck et les tests restent dans la CI pour garder les commits rapides.

## 8. CLAUDE.md du projet
Créer ou compléter `CLAUDE.md` à la racine à partir du modèle `modele-CLAUDE.md` de cette skill. Remplir les commandes réelles du projet, retirer les sections sans objet. Si un CLAUDE.md existe, ajouter seulement ce qui manque.

## 9. Vérification finale
- Lancer `lint`, `typecheck` et `test` : tout doit passer, ou les restes doivent être listés.
- Récapitulatif : fichiers créés ou modifiés, paquets ajoutés, commandes disponibles, ce qui reste à faire.
- Ne pas commiter sans accord.

## Règles générales
- Versions : installer les versions courantes des paquets, vérifier la documentation (Context7 si disponible) plutôt que des configurations de mémoire, les formats de config ESLint et Nuxt ayant changé ces dernières années.
- Rester minimal : n'ajouter que les outils listés ici ou demandés (voir la skill `simplicite-code`).
- Ne jamais désactiver une règle ou affaiblir le typage pour faire passer une vérification sans le signaler.
