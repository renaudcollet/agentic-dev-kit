# <Nom du projet>

<Une phrase : ce qu'est le projet et pour qui.>

## Stack
- <Nuxt 3 / Vue 3 / JS natif / Laravel...>, TypeScript strict
- <Base de données, services : Supabase, PostgreSQL + Prisma...>
- <Particularités : Three.js, GSAP, WebAR...>

## Commandes
- Installer : `<npm ci>`
- Développement : `<npm run dev>` (<URL locale>)
- Lint : `<npm run lint>` / correction : `<npm run lint:fix>`
- Typage : `<npm run typecheck>`
- Tests unitaires : `<npm run test>`
- Tests e2e : `<npm run test:e2e>`
- Docker : `<docker compose up -d>`

## Règles de travail
- Une tâche n'est terminée que si lint, typecheck et tests unitaires passent. Les lancer avant de conclure.
- Ne pas affaiblir la configuration TypeScript, ne pas ajouter de `any`, `@ts-ignore` ou `eslint-disable` sans le signaler et le justifier en commentaire.
- Toute nouvelle logique métier ou fonction utilitaire est accompagnée de tests unitaires.
- Tout parcours utilisateur créé ou modifié est couvert par un test e2e (skill `tests-e2e`).
- Ne pas ajouter de dépendance sans le dire.
- Ne pas commiter sans accord.

## Conventions du projet
- <Organisation des dossiers, nommage, breakpoints, budgets de performance, contraintes client...>

## Contexte
- <CI : GitHub Actions sur push et PR / pas de CI>
- <Exceptions assumées en cours (perf-exception, a11y-exception...) si elles concernent tout le projet>
