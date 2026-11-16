---
name: accessibility
description: Accessibility rules (WCAG 2.2 AA, ARIA, keyboard navigation) to apply when writing or editing a Vue/Nuxt component, a Twig template or any interactive element (button, link, form, modal, menu, carousel, tabs). Also use to audit the accessibility of a page or component.
---

# Accessibility

Apply these rules while writing code, not only during review.

## Rule status
These rules are the default behaviour. Some experiences cannot meet all of them (canvas game, 3D scene, camera-centred WebAR, contrast imposed by the art direction). Deviate only deliberately:
1. Add an `a11y-exception:` comment in the code: criterion concerned, reason, planned compensation.
2. **Non-negotiable baseline, even with an exception**: equivalent accessible information or alternative (text, simplified version, content outside the canvas), a keyboard way to leave or skip the experience, focus never trapped without an exit, `prefers-reduced-motion` respected, no more than 3 flashes per second.
3. When the agent introduces an exception itself, it says so in its reply for approval.
Never "fix" a documented exception unless asked.

## Semantics first
- Use the native HTML element before any ARIA: `<button>` for an action, `<a href>` for navigation, `<dialog>`, `<details>`, `<fieldset>/<legend>`.
- No clickable `div` or `span`. If unavoidable: `role`, `tabindex="0"`, handle `Enter` and `Space`.
- One `<h1>` per page, heading hierarchy without skipped levels.
- Landmarks: `header`, `nav`, `main`, `footer`, with an `aria-label` when there are several `nav`.

## Keyboard and focus (always checked)
- Every interactive element is reachable by keyboard, in a logical order.
- Visible focus: never remove `outline` without a replacement (`:focus-visible`).
- Modals: focus moved in on open, trapped inside, `Escape` closes, focus returned to the trigger on close.
- Menus and dropdowns: arrow keys, `Escape`, `Home`/`End` when the ARIA pattern requires them.
- "Skip to content" link at the start of the page.

## ARIA
- `aria-expanded` and `aria-controls` on triggers of collapsible content.
- `aria-current="page"` on the active navigation link.
- `aria-live="polite"` for dynamic messages (added to cart, errors, loading).
- No `aria-label` that contradicts the visible text. Accessible names, `alt` texts and announcements are written in the site's content language (see the project's CLAUDE.md), never in English by default.
- Decorative icons: `aria-hidden="true"`. Icon-only buttons: accessible name required.

## Forms
- Every field has an associated `<label>` (a placeholder is never the only label).
- Errors: explicit text, linked via `aria-describedby`, `aria-invalid="true"`, focus on the first invalid field.
- `autocomplete` set on identity, address and payment fields.

## Visual
- Contrast: 4.5:1 for text, 3:1 for large text and UI components.
- Information is never conveyed by colour alone.
- Touch targets of at least 24×24 px (aim for 44×44 on mobile).
- `prefers-reduced-motion` respected, including GSAP and Three.js animations: disable or reduce them.
- Zoom to 200% and 400% without loss of content.

## Media
- Meaningful `alt` on informative images, `alt=""` on decorative ones.
- Videos: captions, no autoplay with sound, accessible controls.
- Canvas (Three.js, Phaser): text alternative and keyboard controls, or equivalent content outside the canvas.

## Vue/Nuxt specifics
- `useHead` for `lang` on `<html>` and a unique `title` per page.
- Route change: announce the new page (focus on the `h1` or an `aria-live` region).
- Dynamic ARIA attributes bound to the real state (`:aria-expanded="isOpen"`).

## Audit format (when asked)
For each issue: file and line, WCAG criterion, severity (blocking / major / minor), proposed fix in code.
