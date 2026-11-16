---
name: simplicite-code
description: Critères pour garder un code simple et lisible, sans abstraction ni défense superflue. À appliquer en écrivant ou refactorisant du code (TypeScript, Vue, PHP), et pour relire du code généré afin de repérer ce qui est alambiqué.
---

# Simplicité du code

Objectif : le code le plus court et le plus direct qui résout le problème réel, lisible par quelqu'un qui découvre le projet.

## Statut des règles
Ces critères sont le comportement par défaut. Un code moins simple se justifie parfois : boucle de rendu ou calcul chaud optimisé (pools d'objets, vecteurs réutilisés, boucles manuelles), contournement d'un bug de bibliothèque ou de navigateur, contrainte d'une API tierce. Dans ce cas :
1. Commentaire `simplicite-exception:` : pourquoi la version simple ne convient pas (mesure, bug référencé avec lien, contrainte).
2. Garder la complexité localisée : une fonction ou un module, pas répandue dans le code appelant.
3. Si Claude introduit lui-même une exception, il le dit dans sa réponse pour validation.
Ne jamais « simplifier » une exception documentée sans qu'on le demande.

## À éviter
- **Abstraction utilisée une seule fois** : une fonction, un composable, une classe ou une interface qui n'a qu'un appelant et ne clarifie rien. L'intégrer.
- **Généricité anticipée** : options, paramètres de configuration ou points d'extension que rien n'utilise aujourd'hui.
- **Couches de délégation** : une fonction qui ne fait qu'appeler une autre fonction avec les mêmes arguments.
- **Code défensif superflu** : vérifications de `null` sur des valeurs que le typage garantit, `try/catch` qui relance l'erreur sans rien ajouter, valeurs par défaut pour des cas impossibles.
- **Dépendance pour trois lignes** : si le JavaScript natif ou la bibliothèque standard suffit, ne pas ajouter de paquet.
- **Types acrobatiques** : génériques imbriqués ou types conditionnels là où un type simple suffit.
- **Commentaires qui paraphrasent le code**. Garder ceux qui expliquent un *pourquoi* non évident.
- **Code mort** : variables, imports, branches et props inutilisés.

## À privilégier
- Retours anticipés plutôt que conditions imbriquées.
- Noms qui disent ce que fait la chose, sans abréviation obscure.
- Données transformées avec `map`, `filter`, `reduce` quand c'est plus clair qu'une boucle, et l'inverse sinon.
- Vue : état local tant qu'il n'est pas partagé, `computed` plutôt que `watch` qui recopie une valeur, composants découpés quand ils deviennent difficiles à lire, pas par principe.
- Une fonction fait une chose, à un seul niveau d'abstraction.

## Le test
Pour chaque élément ajouté : « Si je le supprime, qu'est-ce qui casse ou devient moins clair ? » Si la réponse est « rien », le supprimer.

## Format de relecture (si demandé)
Pour chaque point : fichier et ligne, ce qui est superflu, version simplifiée en code. Ne pas signaler les préférences de style couvertes par le linter.
