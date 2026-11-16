---
name: securite-front
description: Règles de sécurité côté client pour Nuxt/Vue et JavaScript natif (XSS, v-html, secrets dans le bundle, CSP, stockage de tokens, dépendances). À appliquer en écrivant du code front qui affiche du contenu externe, gère l'authentification, appelle une API ou ajoute une dépendance. À utiliser aussi pour un audit sécurité front.
---

# Sécurité front-end

## Statut des règles
Ces règles ne se contournent pas par commodité. Seule une contrainte technique externe peut justifier un écart (par exemple un moteur WebAR qui exige `unsafe-eval` dans la CSP, un script tiers imposé par le client). Dans ce cas :
1. **Claude n'introduit jamais l'écart de lui-même** : il explique la contrainte et le risque, propose l'option la plus restrictive possible, et attend la validation du développeur.
2. Une fois validé : commentaire `secu-exception:` avec la contrainte, le risque accepté et sa limitation (écart restreint aux seules pages concernées, domaines listés explicitement, CSP séparée par route).
3. Revoir l'exception à chaque mise à jour de l'outil qui l'impose.

## XSS
- Pas de `v-html`, `innerHTML`, `insertAdjacentHTML` sur du contenu non maîtrisé. Si indispensable : assainir avec DOMPurify, avec une configuration restrictive.
- Pas d'URL dynamique non validée dans `href`, `src`, `:href` (bloquer `javascript:`, `data:`).
- Pas de `eval`, `new Function`, `setTimeout` avec une chaîne.
- Contenu CMS ou Markdown : rendu par une bibliothèque qui assainit.

## Secrets et configuration
- Rien de secret dans `runtimeConfig.public`, `NUXT_PUBLIC_*`, `VITE_*` ni dans le code client : tout ce qui y figure est lisible dans le bundle.
- Clé Supabase côté client : uniquement la clé `anon`, jamais la `service_role`.
- Clés d'API tierces (8th Wall, cartes, paiement) : vérifier qu'elles sont restreintes par domaine côté fournisseur.
- Pas de sourcemaps publiques en production sauf choix explicite.

## Authentification et session
- Préférer les cookies `HttpOnly`, `Secure`, `SameSite=Lax` ou `Strict` au `localStorage` pour les tokens.
- Ne jamais se fier au front pour les autorisations : masquer un bouton n'est pas une protection. Le contrôle se fait côté serveur ou via les policies RLS.
- Déconnexion : invalider la session côté serveur, pas seulement côté client.

## En-têtes et CSP
- CSP définie (via `nuxt-security` ou les en-têtes serveur) : pas de `unsafe-inline` ni `unsafe-eval` sauf nécessité documentée (certains moteurs WebAR l'exigent : le noter).
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (caméra limitée aux pages WebAR).
- `target="_blank"` : `rel="noopener noreferrer"`.

## Données et formulaires
- La validation front est un confort, la validation serveur est obligatoire.
- Pas de données personnelles dans les URL, les logs console ou les outils d'analytics.
- `postMessage` : vérifier `event.origin`.

## Dépendances
- Avant d'ajouter un paquet : maintenance, popularité, nécessité réelle (le natif suffit-il ?).
- `npm audit` (ou équivalent) sans vulnérabilité haute ou critique non traitée.
- Scripts tiers : SRI (`integrity`) quand ils viennent d'un CDN.

## Format d'audit (si demandé)
Pour chaque point : fichier et ligne, risque concret (scénario d'attaque en une phrase), gravité, correction en code.
