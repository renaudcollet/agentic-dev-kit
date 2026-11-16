---
name: performance-memoire
description: Règles d'optimisation mémoire et de performance de rendu (reflow, repaint, will-change, composition) pour les animations CSS et JS, WebGL/Three.js, GSAP, Canvas 2D, Phaser, WebAR et les pages qui affichent ou chargent beaucoup d'éléments (listes longues, galeries, médias lourds). À appliquer en écrivant une scène 3D, une animation, un composant qui crée ou détruit des ressources, un chargement d'assets, ou en diagnostiquant une fuite mémoire, des saccades ou un onglet qui plante sur mobile.
---

# Performance et mémoire

Principe : toute ressource créée doit avoir un chemin de destruction explicite, lié au cycle de vie du composant ou de la scène. Sur mobile et en WebAR, la mémoire GPU est la première limite.

## Statut des règles
Les règles de cette skill sont le comportement **par défaut**, pas des interdits absolus. Le rendu voulu (direction artistique, effet demandé par le client) peut justifier de s'en écarter, par exemple animer un `filter`, un `box-shadow`, un `clip-path` ou une hauteur. Dans ce cas, l'écart doit être fait en connaissance de cause :
1. **Le signaler dans le code** avec un commentaire `perf-exception:` qui dit ce qui est fait, pourquoi, et le coût attendu.
   `/* perf-exception: blur animé sur le hero, demandé par la DA. Repaint limité à 600x400, coupé hors écran et en reduced-motion. */`
2. **Limiter le coût** : surface réduite, `contain: paint` autour, durée courte plutôt qu'en boucle, pause hors écran (`IntersectionObserver`), version allégée sur mobile et avec `prefers-reduced-motion`.
3. **Vérifier** l'effet réel (Paint flashing, onglet Performance) quand l'exception touche une animation continue ou une grande surface.
4. **Le dire** dans la réponse quand Claude introduit lui-même une exception, pour que le développeur valide.

Ne jamais « corriger » une exception documentée sans qu'on le demande. Proposer une alternative moins coûteuse est bienvenu si elle donne le même rendu.

## Cycle de vie (Vue/Nuxt et JS natif)
- Tout ce qui est créé dans `onMounted` est détruit dans `onBeforeUnmount` / `onUnmounted` : renderer, scène, timelines, observers, écouteurs, intervalles, workers.
- Écouteurs : `AbortController` et `{ signal }` pour tout retirer d'un coup, plutôt que des `removeEventListener` dispersés.
- `requestAnimationFrame` : garder l'id et appeler `cancelAnimationFrame`. Une seule boucle de rendu par page.
- Mettre en pause le rendu quand ce n'est pas visible : `IntersectionObserver` pour le canvas hors écran, `visibilitychange` pour l'onglet en arrière-plan.
- Objets 3D, instances de moteur, grandes structures : hors de la réactivité Vue (`shallowRef`, `markRaw`, ou variables non réactives). Ne jamais mettre une scène Three.js dans un `ref` profond.
- Navigation entre pages Nuxt : vérifier que la page quittée ne laisse rien tourner (`keepalive` compris).

## Rendu navigateur (reflow, repaint, composition)
Règles par défaut, que l'animation soit en CSS, GSAP ou JS natif (écarts possibles selon « Statut des règles »).
- Animer uniquement `transform` et `opacity` (composition seule). Jamais `top`, `left`, `width`, `height`, `margin`, `padding` en continu (reflow), ni `box-shadow`, `filter`, `background-position` sur de grandes surfaces (repaint). Pour une ombre animée : animer l'`opacity` d'un pseudo-élément qui porte l'ombre.
- Ouvrir ou fermer une hauteur : `grid-template-rows: 0fr → 1fr`, `transform: scaleY` ou `interpolate-size: allow-keywords`, plutôt que `height` animée en JS.
- **Pas de layout thrashing** : dans un même cycle, toutes les lectures (`offsetWidth`, `getBoundingClientRect`, `scrollTop`, `getComputedStyle`) d'abord, toutes les écritures ensuite. Jamais d'alternance lecture/écriture dans une boucle.
- Mesures répétées : `ResizeObserver` et `IntersectionObserver` plutôt que lire la géométrie dans un écouteur `scroll` ou `resize`.
- Écouteurs `scroll`, `touchmove`, `wheel` : `{ passive: true }`, et le travail visuel regroupé dans un `requestAnimationFrame`.
- Animation en JS natif : toujours dans `requestAnimationFrame`, jamais `setInterval` ou `setTimeout` pour du visuel.
- Masquer et afficher souvent (menus, tooltips, survols) : `opacity` + `visibility` (et `inert` ou `aria-hidden` si le contenu doit sortir de l'accessibilité) plutôt que basculer `display`, qui provoque un reflow à chaque fois. Contenu caché durablement : `display: none` ou `v-if`.
- Écritures DOM par lots : `DocumentFragment`, une seule insertion, ou changement d'une classe sur le parent plutôt que de styles sur chaque enfant.
- **`will-change`** : seulement sur les éléments qui vont réellement s'animer, posé juste avant (au survol du parent, au début de l'animation), retiré après. Jamais en règle CSS globale ni sur des dizaines d'éléments : chaque calque coûte de la mémoire GPU, surtout sur mobile. Pas de `translateZ(0)` décoratif pour la même raison.
- Isoler les zones qui changent souvent : `contain: layout paint` (ou `contain: strict` avec taille connue) sur les widgets, compteurs, tickers, composants animés.
- Sélecteurs simples, pas de `:has()` lourd sur de grands arbres modifiés souvent.
- Pas de changement de police ni d'image sans dimensions après le premier affichage : `font-display: swap` avec polices de repli ajustées (`size-adjust`), `width`/`height` ou `aspect-ratio` sur les médias (évite les décalages de mise en page, CLS).
- `position: fixed` / `sticky` en grand nombre et `backdrop-filter` : à limiter, coûteux à chaque frame de scroll.
- Vérification : DevTools > Rendering, cocher « Paint flashing » et « Layer borders ». Pendant une animation, rien ne doit clignoter en vert à part l'élément animé ; dans l'onglet Performance, pas de bloc violet « Layout » répété à chaque frame.

## Three.js / WebGL
- **Disposer explicitement** : `geometry.dispose()`, `material.dispose()`, chaque texture des matériaux (`map`, `normalMap`, `roughnessMap`, `envMap`...) `.dispose()`, `renderTarget.dispose()`, `controls.dispose()`, passes de post-traitement, puis `renderer.dispose()`. Parcourir la scène avec `traverse` pour ne rien oublier.
- Si le canvas est retiré définitivement : `renderer.forceContextLoss()` pour libérer le contexte (les navigateurs limitent le nombre de contextes WebGL actifs).
- Gérer `webglcontextlost` / `webglcontextrestored`, fréquent sur mobile.
- Contrôle : `renderer.info.memory` (géométries, textures) et `renderer.info.render` (draw calls, triangles) doivent revenir à leur valeur de départ après démontage.
- **Textures** : la mémoire GPU vaut environ largeur × hauteur × 4 octets, +33 % avec les mipmaps. Une 4096² pèse environ 85 Mo. Dimensionner au besoin réel, compresser en KTX2/Basis (`KTX2Loader`), réutiliser plutôt que recharger.
- **Géométries** : Draco ou Meshopt pour les GLB, `InstancedMesh` pour les objets répétés, `BufferGeometryUtils.mergeGeometries` pour les objets statiques, LOD pour les scènes larges.
- **Draw calls** : partager matériaux et textures (atlas), limiter les lumières dynamiques et les ombres (`shadowMap` coûteuse), cuire l'éclairage quand c'est possible.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, et moins (1 à 1.5) sur mobile ou en WebAR.
- Pas d'allocation dans la boucle de rendu : réutiliser des `Vector3`, `Matrix4`, `Quaternion` déclarés une fois.
- Rendu à la demande (`render` seulement quand quelque chose change) pour les scènes statiques ou interactives sans animation continue.

## GSAP
- Dans un composant : `gsap.context()` ou `gsap.matchMedia()` créé au montage, `ctx.revert()` au démontage. Cela tue tweens, timelines et ScrollTriggers créés dedans.
- ScrollTrigger : `ScrollTrigger.refresh()` après chargement des images ou changement de mise en page, et jamais de ScrollTrigger orphelin après navigation.
- Propriétés : celles de la section « Rendu navigateur », soit en pratique `x`, `y`, `scale`, `rotation`, `autoAlpha`.
- `quickTo` / `quickSetter` pour les animations pilotées par la souris ou le scroll, plutôt que créer un tween à chaque événement.

## Canvas 2D
- Canvas hors écran (`OffscreenCanvas`, éventuellement dans un worker) pour le rendu lourd ou les sprites précalculés.
- Effacer et redessiner seulement les zones modifiées quand c'est possible, couches séparées pour le décor statique.
- Taille du backing store = taille CSS × `devicePixelRatio` plafonné. Un canvas plein écran en DPR 3 coûte très cher.
- Libérer : `canvas.width = canvas.height = 0` pour un canvas qu'on abandonne, `ImageBitmap.close()` pour les bitmaps.

## Phaser
- `scene.events.once('shutdown', ...)` pour nettoyer écouteurs et timers personnalisés.
- `this.textures.remove(key)` et `this.cache` pour les assets d'un niveau qui ne servira plus, `game.destroy(true)` au démontage du composant hôte.
- Pools d'objets (`Group` avec `maxSize`, `killAndHide`) plutôt que créer et détruire en continu.
- Atlas de textures plutôt que des images séparées.

## WebAR (8th Wall, Zappar, MindAR)
- Le flux caméra et le tracking consomment déjà une grosse part du budget : viser des modèles légers (quelques centaines de milliers de triangles au total au maximum), textures 1024² ou moins, pixel ratio réduit.
- Arrêter la caméra et le moteur de tracking en quittant l'expérience (`stop()`, arrêt des pistes du `MediaStream`).
- Tester sur un iPhone ancien et un Android d'entrée de gamme : ce sont eux qui plantent en premier.

## Beaucoup d'éléments à afficher
- Listes et grilles longues : virtualisation (`@tanstack/vue-virtual`, `vue-virtual-scroller`) ou pagination ou chargement par lots.
- `content-visibility: auto` avec `contain-intrinsic-size` pour les sections longues hors écran.
- Limiter le nombre de nœuds DOM (repère : quelques milliers), éviter les composants Vue lourds répétés des centaines de fois.
- `v-memo` pour les items de liste coûteux qui changent rarement, `v-once` pour le contenu statique.

## Beaucoup d'éléments à charger
- Prioriser : ce qui est visible au premier écran d'abord (`fetchpriority="high"`, `preload`), le reste en différé (`loading="lazy"`, import dynamique, `<LazyComposant>` dans Nuxt).
- Code splitting : Three.js, Phaser, moteurs WebAR chargés uniquement sur les pages qui en ont besoin.
- Images : AVIF/WebP, `srcset`, dimensions adaptées (`<NuxtImg>`), pas d'image 4000 px affichée en 400 px.
- Vidéos : `preload="none"` ou `metadata`, poster, pas de vidéo en autoplay hors écran.
- Chargement d'assets 3D avec un `LoadingManager` et un écran de progression, et mise en cache (`THREE.Cache.enabled`, service worker si l'expérience est revisitée).
- Libérer les `URL.createObjectURL` avec `URL.revokeObjectURL`.

## Budgets indicatifs (à ajuster par projet)
- 60 fps sur desktop, 30 fps stables au minimum sur mobile en 3D ou WebAR.
- Draw calls : moins de 100 sur mobile.
- Mémoire GPU des textures : quelques centaines de Mo au maximum sur mobile.
- Tas JS stable après plusieurs allers-retours sur une même page (pas de croissance continue).

## Détecter une fuite
1. Ouvrir la page, faire un snapshot du tas (DevTools > Memory).
2. Naviguer ailleurs puis revenir, cinq à dix fois.
3. Forcer le ramasse-miettes, nouveau snapshot, comparer : chercher les objets dont le nombre augmente (`Detached` DOM, `WebGLTexture`, `Tween`, closures d'écouteurs).
4. Pour WebGL, comparer aussi `renderer.info.memory` avant et après.
