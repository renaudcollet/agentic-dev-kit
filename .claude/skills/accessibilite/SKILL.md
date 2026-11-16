---
name: accessibilite
description: Règles d'accessibilité (WCAG 2.2 AA, ARIA, navigation clavier) à appliquer en écrivant ou modifiant un composant Vue/Nuxt, un template Twig ou tout élément interactif (bouton, lien, formulaire, modale, menu, carrousel, onglets). À utiliser aussi pour auditer l'accessibilité d'une page ou d'un composant.
---

# Accessibilité

Appliquer ces règles pendant l'écriture du code, pas seulement en relecture.

## Statut des règles
Ces règles sont le comportement par défaut. Certaines expériences ne peuvent pas toutes les respecter (jeu en canvas, scène 3D, WebAR centrée sur la caméra, contraste imposé par la direction artistique). L'écart doit alors être fait en connaissance de cause :
1. Commentaire `a11y-exception:` dans le code : critère concerné, raison, compensation prévue.
2. **Socle non négociable, même en exception** : information ou alternative équivalente accessible (texte, version simplifiée, contenu hors canvas), possibilité de quitter ou passer l'expérience au clavier, focus jamais piégé sans issue, `prefers-reduced-motion` respecté, pas de flash au-delà de 3 par seconde.
3. Si Claude introduit lui-même une exception, il le dit dans sa réponse pour validation.
Ne jamais « corriger » une exception documentée sans qu'on le demande.

## Sémantique d'abord
- Utiliser l'élément HTML natif avant tout ARIA : `<button>` pour une action, `<a href>` pour une navigation, `<dialog>`, `<details>`, `<fieldset>/<legend>`.
- Jamais de `div` ou `span` cliquable. Si c'est inévitable : `role`, `tabindex="0"`, gestion de `Enter` et `Space`.
- Un seul `<h1>` par page, hiérarchie de titres sans saut.
- Landmarks : `header`, `nav`, `main`, `footer`, un `aria-label` si plusieurs `nav`.

## Clavier et focus (vérification systématique)
- Tout élément interactif est atteignable au clavier et dans un ordre logique.
- Focus visible : ne jamais supprimer `outline` sans le remplacer (`:focus-visible`).
- Modales : focus déplacé à l'ouverture, piégé dans la modale, `Échap` ferme, focus rendu au déclencheur à la fermeture.
- Menus et listes déroulantes : flèches, `Échap`, `Home`/`End` quand le pattern ARIA l'exige.
- Lien d'évitement « Aller au contenu » en début de page.

## ARIA
- `aria-expanded`, `aria-controls` sur les déclencheurs de contenu repliable.
- `aria-current="page"` sur le lien de navigation actif.
- `aria-live="polite"` pour les messages dynamiques (ajout au panier, erreurs, chargement).
- Pas d'`aria-label` qui contredit le texte visible.
- Icônes décoratives : `aria-hidden="true"`. Boutons icône seule : nom accessible obligatoire.

## Formulaires
- Chaque champ a un `<label>` associé (pas de placeholder comme seul libellé).
- Erreurs : texte explicite, liées via `aria-describedby`, `aria-invalid="true"`, focus sur le premier champ en erreur.
- `autocomplete` renseigné sur les champs d'identité, d'adresse et de paiement.

## Visuel
- Contraste : 4.5:1 pour le texte, 3:1 pour le gros texte et les composants d'interface.
- L'information n'est jamais portée par la couleur seule.
- Cibles tactiles d'au moins 24×24 px (viser 44×44 sur mobile).
- `prefers-reduced-motion` respecté, y compris pour GSAP et les animations Three.js : désactiver ou réduire.
- Zoom à 200 % et 400 % sans perte de contenu.

## Médias
- `alt` pertinent sur les images informatives, `alt=""` sur les décoratives.
- Vidéos : sous-titres, pas d'autoplay avec son, contrôles accessibles.
- Canvas (Three.js, Phaser) : alternative textuelle et contrôles clavier, ou contenu équivalent hors canvas.

## Spécificités Vue/Nuxt
- `useHead` pour `lang` sur `<html>` et un `title` unique par page.
- Changement de route : annoncer la nouvelle page (focus sur le `h1` ou région `aria-live`).
- Attributs ARIA dynamiques liés à l'état réel (`:aria-expanded="isOpen"`).

## Format d'audit (si demandé)
Pour chaque problème : fichier et ligne, critère WCAG, gravité (bloquant / majeur / mineur), correction proposée en code.
