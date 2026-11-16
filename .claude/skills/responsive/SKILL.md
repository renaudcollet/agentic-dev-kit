---
name: responsive
description: Responsive design conventions (mobile first, breakpoints, fluid units, images, touch) to apply when writing CSS, layout components or grids, plus a visual check procedure at several widths.
---

# Responsive design

## Rule status
These conventions are the default behaviour. Some projects legitimately set them aside: a DOOH installation or kiosk at a fixed resolution, a desktop-only experience, a game or scene with an imposed aspect ratio. In that case:
1. Add a `responsive-exception:` comment (or a note in the project README if the exception applies to the whole site): chosen target and reason.
2. Still provide clean behaviour outside the target: scaling with bars (letterbox), or a clear message asking to change device or orientation, never a broken layout.
3. When the agent introduces an exception itself, it says so in its reply for approval.
Never "fix" a documented exception unless asked.

## Conventions
- **Mobile first**: base styles for small screens, `min-width` in media queries.
- Project breakpoints (adapt if the project defines others): 360, 768, 1024, 1280, 1440 px. Do not invent new ones for a single component.
- Prefer intrinsic layout: `flex-wrap`, `grid` with `auto-fit` / `minmax()`, `clamp()` for font sizes and spacing.
- Container queries (`@container`) for components reused in contexts of different widths.
- Units: `rem` for typography and spacing, `dvh`/`svh` rather than `vh` on mobile, no fixed `px` width on a container.
- No accidental horizontal scrolling: watch `width: 100vw`, negative margins and long words or URLs (`overflow-wrap: anywhere`).

## Media
- Images: `srcset`/`sizes` or `<NuxtImg>`/`<NuxtPicture>`, `width` and `height` set to avoid layout shifts, `loading="lazy"` below the fold.
- Three.js and Phaser canvases: resize on `resize` (or `ResizeObserver`), `devicePixelRatio` capped (usually 2) for performance.

## Touch and interaction
- 44×44 px touch targets on mobile, with spacing.
- No information available only on hover: provide the touch and keyboard equivalent.
- `@media (hover: hover)` to reserve hover effects for devices that support it.
- Form fields at 16 px minimum to avoid automatic zoom on iOS.

## Visual check procedure
When a browser tool is available (for example the Playwright MCP):
1. Open the page locally.
2. Capture at widths 360, 768, 1024 and 1440 px.
3. At each width, check: horizontal scrolling, truncated or overlapping text, off-screen elements, distorted images, usable navigation.
4. Also test landscape orientation on mobile (for example 740×360).

Without a browser, review the CSS and say so clearly: "theoretical review, not visually verified".
