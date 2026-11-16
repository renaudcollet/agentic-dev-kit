---
name: tests-e2e
description: Conventions pour écrire et maintenir les tests end-to-end (Playwright par défaut) : quoi tester, sélecteurs, données, authentification, stabilité, accessibilité automatisée, exécution dans GitHub Actions et Docker. À appliquer en créant ou modifiant un parcours utilisateur (formulaire, tunnel d'achat, authentification, navigation), en écrivant ou corrigeant un test e2e, ou en configurant la CI des tests.
---

# Tests end-to-end

Si le projet utilise déjà un autre outil (Cypress...) ou d'autres conventions, suivre l'existant et adapter ces règles.

## Quand écrire un test
- Après avoir créé ou modifié un **parcours critique** : authentification, inscription, tunnel d'achat ou de commande, formulaire de contact ou de candidature, paiement, fonctionnalité centrale du produit.
- Pour chaque bug corrigé sur un parcours : un test qui le reproduit.
- Ne pas tester en e2e ce qu'un test unitaire couvre mieux (calculs, formatage, logique isolée). L'e2e vérifie qu'un utilisateur arrive au bout d'un parcours.
- Expériences 3D, canvas ou WebAR : tester l'enveloppe (chargement, absence d'erreur console, contrôles HTML, écran de repli si WebGL ou caméra indisponible), pas le rendu lui-même.

## Structure
- Un fichier par parcours ou par fonctionnalité dans `tests/e2e/` (ou le dossier existant).
- Un test = un scénario utilisateur lisible, nommé par le comportement attendu : `test("un visiteur peut ajouter un produit au panier et voir le total")`.
- `test.describe` pour regrouper, `test.step` pour rendre les rapports lisibles sur les longs parcours.
- Tests indépendants : aucun test ne dépend d'un autre ni de l'ordre d'exécution.
- Page objects seulement quand un même enchaînement est réutilisé dans plusieurs fichiers (sinon, voir la skill `simplicite-code`). Des fonctions d'aide simples suffisent souvent.

## Sélecteurs
Par ordre de préférence :
1. `getByRole` avec le nom accessible (`getByRole("button", { name: "Valider" })`)
2. `getByLabel`, `getByPlaceholder`, `getByText`
3. `getByTestId` (`data-testid`) quand rien d'accessible ne convient (canvas, éléments purement visuels)
Jamais de sélecteur CSS lié au style ou à la structure (`.btn-primary`, `div > span:nth-child(2)`). Un élément introuvable par son rôle est souvent aussi un problème d'accessibilité : le signaler.

## Stabilité
- Pas de `waitForTimeout`. Utiliser les assertions web-first qui attendent d'elles-mêmes (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`).
- Attendre un état observable (réponse réseau avec `waitForResponse`, élément visible), jamais une durée.
- Animations GSAP ou CSS gênantes : `reducedMotion: "reduce"` dans la configuration, si le site respecte `prefers-reduced-motion` (voir la skill `accessibilite`).
- Un test instable se corrige ou se met en quarantaine (`test.fixme` avec la raison), il ne reste pas en échec aléatoire.

## Données et état
- Chaque test crée ses propres données (via l'API ou des fixtures) et ne dépend pas d'un état laissé par un autre test.
- Base dédiée aux tests (conteneur Docker, projet Supabase de test, `.env.test`), jamais la base de production.
- Authentification : se connecter une seule fois dans un projet `setup` et réutiliser l'état (`storageState`), sauf pour les tests du parcours de connexion lui-même.
- Mocker (`page.route`) uniquement les services tiers hors de contrôle (paiement, cartes, API externes), pas le back-end du projet.

## Assertions utiles en plus du parcours
- Aucune erreur console inattendue : écouter `page.on("console")` et `page.on("pageerror")` sur les parcours critiques.
- Accessibilité automatisée avec `@axe-core/playwright` sur les pages clés (ne remplace pas la vérification clavier manuelle).
- Responsive : projets Playwright mobile (`devices["iPhone 13"]`, `devices["Pixel 7"]`) pour les parcours critiques.
- Régression visuelle (`toHaveScreenshot`) seulement sur des zones stables, jamais sur un canvas animé.

## Configuration et CI
- `webServer` dans `playwright.config` pour démarrer l'application, ou `docker compose up` dans la CI.
- En CI : `retries: 2`, `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"`.
- GitHub Actions : rapport HTML et traces publiés en artefacts en cas d'échec, navigateurs mis en cache, sharding (`--shard`) si la suite devient longue.
- Script `test:e2e` dans `package.json`, utilisable à l'identique en local et en CI.

## Après écriture
Lancer le test au moins deux fois pour vérifier qu'il est stable (le sous-agent `testeur-e2e` peut s'en charger), et le faire échouer volontairement une fois (en cassant l'assertion) pour vérifier qu'il teste réellement quelque chose.
