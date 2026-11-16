---
name: performance-memory
description: Memory and rendering performance rules (reflow, repaint, will-change, compositing) for CSS and JS animations, WebGL/Three.js, GSAP, Canvas 2D, Phaser, WebAR and pages that display or load many elements (long lists, galleries, heavy media). Apply when writing a 3D scene, an animation, a component that creates or destroys resources, asset loading, or when diagnosing a memory leak, jank or a tab crashing on mobile.
---

# Performance and memory

Principle: every resource created must have an explicit destruction path, tied to the lifecycle of the component or scene. On mobile and in WebAR, GPU memory is the first limit.

## Rule status
The rules in this skill are the **default** behaviour, not absolute bans. The intended rendering (art direction, effect requested by the client) can justify deviating from them, for example animating a `filter`, a `box-shadow`, a `clip-path` or a height. In that case, deviate deliberately:
1. **Mark it in the code** with a `perf-exception:` comment stating what is done, why, and the expected cost.
   `/* perf-exception: animated blur on the hero, requested by the art direction. Repaint limited to 600x400, paused off-screen and with reduced-motion. */`
2. **Contain the cost**: small area, `contain: paint` around it, short duration rather than looping, paused off-screen (`IntersectionObserver`), lighter version on mobile and with `prefers-reduced-motion`.
3. **Verify** the real impact (Paint flashing, Performance panel) when the exception affects a continuous animation or a large area.
4. **Say so** in the reply when the agent introduces an exception itself, so the developer can approve it.

Never "fix" a documented exception unless asked. Suggesting a cheaper alternative with the same visual result is welcome.

## Lifecycle (Vue/Nuxt and vanilla JS)
- Everything created in `onMounted` is destroyed in `onBeforeUnmount` / `onUnmounted`: renderer, scene, timelines, observers, listeners, intervals, workers.
- Listeners: `AbortController` and `{ signal }` to remove them all at once, rather than scattered `removeEventListener` calls.
- `requestAnimationFrame`: keep the id and call `cancelAnimationFrame`. One render loop per page.
- Pause rendering when not visible: `IntersectionObserver` for an off-screen canvas, `visibilitychange` for a background tab.
- 3D objects, engine instances, large structures: outside Vue reactivity (`shallowRef`, `markRaw`, or plain variables). Never put a Three.js scene in a deep `ref`.
- Navigation between Nuxt pages: make sure the page you leave keeps nothing running (`keepalive` included).

## Browser rendering (reflow, repaint, compositing)
Default rules, whether the animation is CSS, GSAP or vanilla JS (deviations possible as per "Rule status").
- Animate only `transform` and `opacity` (compositing only). Never animate `top`, `left`, `width`, `height`, `margin`, `padding` continuously (reflow), nor `box-shadow`, `filter`, `background-position` on large areas (repaint). For an animated shadow: animate the `opacity` of a pseudo-element that carries the shadow.
- Expanding or collapsing a height: `grid-template-rows: 0fr → 1fr`, `transform: scaleY` or `interpolate-size: allow-keywords`, rather than a JS-animated `height`.
- **No layout thrashing**: within one cycle, all reads (`offsetWidth`, `getBoundingClientRect`, `scrollTop`, `getComputedStyle`) first, then all writes. Never alternate reads and writes in a loop.
- Repeated measurements: `ResizeObserver` and `IntersectionObserver` rather than reading geometry in a `scroll` or `resize` listener.
- `scroll`, `touchmove`, `wheel` listeners: `{ passive: true }`, with visual work batched in a `requestAnimationFrame`.
- Vanilla JS animation: always in `requestAnimationFrame`, never `setInterval` or `setTimeout` for visuals.
- Frequent show and hide (menus, tooltips, hovers): `opacity` + `visibility` (plus `inert` or `aria-hidden` if the content must leave the accessibility tree) rather than toggling `display`, which triggers a reflow each time. Content hidden for a long time: `display: none` or `v-if`.
- Batched DOM writes: `DocumentFragment`, a single insertion, or one class change on the parent rather than styles on each child.
- **`will-change`**: only on elements that will actually animate, set just before (on parent hover, at animation start), removed afterwards. Never as a global CSS rule or on dozens of elements: every layer costs GPU memory, especially on mobile. No decorative `translateZ(0)` for the same reason.
- Isolate areas that change often: `contain: layout paint` (or `contain: strict` with a known size) on widgets, counters, tickers, animated components.
- Simple selectors, no heavy `:has()` on large, frequently modified trees.
- No font or unsized image change after first paint: `font-display: swap` with adjusted fallback fonts (`size-adjust`), `width`/`height` or `aspect-ratio` on media (avoids layout shifts, CLS).
- Many `position: fixed` / `sticky` elements and `backdrop-filter`: keep to a minimum, costly on every scroll frame.
- Verification: DevTools > Rendering, enable "Paint flashing" and "Layer borders". During an animation, nothing but the animated element should flash green; in the Performance panel, no purple "Layout" block repeated every frame.

## Three.js / WebGL
- **Dispose explicitly**: `geometry.dispose()`, `material.dispose()`, every material texture (`map`, `normalMap`, `roughnessMap`, `envMap`...) `.dispose()`, `renderTarget.dispose()`, `controls.dispose()`, post-processing passes, then `renderer.dispose()`. Walk the scene with `traverse` so nothing is missed.
- When the canvas is removed for good: `renderer.forceContextLoss()` to free the context (browsers limit the number of active WebGL contexts).
- Handle `webglcontextlost` / `webglcontextrestored`, common on mobile.
- Check: `renderer.info.memory` (geometries, textures) and `renderer.info.render` (draw calls, triangles) must return to their initial values after unmount.
- **Textures**: GPU memory is roughly width × height × 4 bytes, +33% with mipmaps. A 4096² texture weighs about 85 MB. Size to the real need, compress to KTX2/Basis (`KTX2Loader`), reuse rather than reload.
- **Geometries**: Draco or Meshopt for GLB, `InstancedMesh` for repeated objects, `BufferGeometryUtils.mergeGeometries` for static objects, LOD for large scenes.
- **Draw calls**: share materials and textures (atlases), limit dynamic lights and shadows (`shadowMap` is costly), bake lighting when possible.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, and lower (1 to 1.5) on mobile or in WebAR.
- No allocation in the render loop: reuse `Vector3`, `Matrix4`, `Quaternion` declared once.
- On-demand rendering (`render` only when something changes) for static scenes or interactive ones without continuous animation.

## GSAP
- In a component: `gsap.context()` or `gsap.matchMedia()` created on mount, `ctx.revert()` on unmount. This kills the tweens, timelines and ScrollTriggers created inside.
- ScrollTrigger: `ScrollTrigger.refresh()` after images load or the layout changes, and never an orphan ScrollTrigger after navigation.
- Properties: those from "Browser rendering", in practice `x`, `y`, `scale`, `rotation`, `autoAlpha`.
- `quickTo` / `quickSetter` for mouse- or scroll-driven animations, rather than creating a tween on every event.

## Canvas 2D
- Off-screen canvas (`OffscreenCanvas`, possibly in a worker) for heavy rendering or pre-rendered sprites.
- Clear and redraw only the changed areas when possible, separate layers for static scenery.
- Backing store size = CSS size × capped `devicePixelRatio`. A full-screen canvas at DPR 3 is very expensive.
- Release: `canvas.width = canvas.height = 0` for a discarded canvas, `ImageBitmap.close()` for bitmaps.

## Phaser
- `scene.events.once('shutdown', ...)` to clean up custom listeners and timers.
- `this.textures.remove(key)` and `this.cache` for a level's assets that will not be reused, `game.destroy(true)` when the host component unmounts.
- Object pools (`Group` with `maxSize`, `killAndHide`) rather than constant create and destroy.
- Texture atlases rather than separate images.

## WebAR (8th Wall, Zappar, MindAR)
- The camera feed and tracking already use a large share of the budget: aim for light models (a few hundred thousand triangles in total at most), textures of 1024² or less, reduced pixel ratio.
- Stop the camera and the tracking engine when leaving the experience (`stop()`, stop the `MediaStream` tracks).
- Test on an older iPhone and an entry-level Android: they crash first.

## Many elements to display
- Long lists and grids: virtualization (`@tanstack/vue-virtual`, `vue-virtual-scroller`), pagination or batch loading.
- `content-visibility: auto` with `contain-intrinsic-size` for long off-screen sections.
- Limit the number of DOM nodes (guideline: a few thousand), avoid heavy Vue components repeated hundreds of times.
- `v-memo` for costly list items that rarely change, `v-once` for static content.

## Many elements to load
- Prioritize: what is visible above the fold first (`fetchpriority="high"`, `preload`), the rest deferred (`loading="lazy"`, dynamic import, `<LazyComponent>` in Nuxt).
- Code splitting: Three.js, Phaser and WebAR engines loaded only on the pages that need them.
- Images: AVIF/WebP, `srcset`, appropriate dimensions (`<NuxtImg>`), no 4000 px image displayed at 400 px.
- Videos: `preload="none"` or `metadata`, poster, no off-screen autoplay video.
- 3D assets loaded with a `LoadingManager` and a progress screen, and cached (`THREE.Cache.enabled`, service worker if the experience is revisited).
- Release `URL.createObjectURL` with `URL.revokeObjectURL`.

## Indicative budgets (adjust per project)
- 60 fps on desktop, a stable 30 fps minimum on mobile in 3D or WebAR.
- Draw calls: under 100 on mobile.
- Texture GPU memory: a few hundred MB at most on mobile.
- JS heap stable after several round trips to the same page (no continuous growth).

## Detecting a leak
1. Open the page, take a heap snapshot (DevTools > Memory).
2. Navigate away and back, five to ten times.
3. Force garbage collection, take a new snapshot, compare: look for objects whose count keeps growing (`Detached` DOM, `WebGLTexture`, `Tween`, listener closures).
4. For WebGL, also compare `renderer.info.memory` before and after.
