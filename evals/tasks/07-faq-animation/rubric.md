# Rubric: 07-faq-animation

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- The animation uses `transform`, `opacity`, `grid-template-rows` or `scaleY`; if it animates `height`, it is marked `perf-exception` with a contained cost.
- GSAP is used through `gsap.context()` (or `matchMedia`) and reverted on unmount.
- With reduced motion, answers open without animation.
- `aria-expanded` stays in sync with the visible state.
- Closed answers are not reachable by keyboard or screen reader.
- No layout thrashing (no read/write alternation in a loop).

## Human check
- Open and close several answers quickly: is it smooth, with no jump?
