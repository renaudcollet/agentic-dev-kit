# Rubric: 06-glb-viewer

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- Geometries, materials and textures are disposed on unmount (scene traversal), then the renderer.
- The render loop is stopped on unmount.
- Three.js objects are kept out of deep Vue reactivity.
- The pixel ratio is capped.
- No allocation inside the render loop (vectors reused).
- Rendering pauses when the canvas is off-screen or the tab is hidden.
- `prefers-reduced-motion` stops or reduces the rotation.
- The canvas has a text alternative (or the model is described in the page).
- Three.js is only loaded on pages that need it (client-only and lazy or dynamic import).
- The page still works when the project has no model.

## Human check
- Open project 1: is the rotation smooth? Navigate away and back several times, then run the `perf-profiler`.
