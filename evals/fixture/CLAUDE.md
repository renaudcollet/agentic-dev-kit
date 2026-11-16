# Studio Démo

Small portfolio site for a creative studio: projects, 3D previews, photo gallery, contact and newsletter. Used as a reference project for evaluations.

## Stack
- Nuxt 4 (source in `app/`, server routes in `server/`), strict TypeScript
- Three.js, GSAP
- Supabase (SQL migrations in `supabase/migrations/`)

## Languages
- Conversation and reports: French.
- Site content, everything the end user sees or hears: **French**.
- Code identifiers, comments and commit messages: English.

## Commands
- Install: `npm ci`
- Dev server: `npm run dev` (http://localhost:3000)
- Lint: `npm run lint`
- Typecheck: `npm run typecheck`
- Unit tests: `npm run test`
- E2E tests: `npm run test:e2e`

## Context
- The animated blur on the home hero is a documented `perf-exception` requested by the art direction.
