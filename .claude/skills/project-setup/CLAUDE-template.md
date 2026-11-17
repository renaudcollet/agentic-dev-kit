# <Project name>

<One sentence: what the project is and who it is for.>

## Stack
- <Nuxt / Vue / vanilla JS / Laravel...>, strict TypeScript
- <Database, services: Supabase, PostgreSQL + Prisma...>
- <Specifics: Three.js, GSAP, WebAR...>

## Languages
- Conversation and reports: the developer's language (<French>).
- Site or app content, everything the end user sees or hears (UI text, `alt`, `aria-label`, error messages, SEO metadata, emails): **<French>**. <Other languages and i18n setup, if any.>
- Code identifiers: English.
- Code comments and documentation: <English>.
- Commit messages and branch names: English (Conventional Commits).
- Never write end-user content in English by default because the code or the instructions are in English.

## Commands
- Install: `<npm ci>`
- Dev server: `<npm run dev>` (<local URL>)
- Lint: `<npm run lint>` / fix: `<npm run lint:fix>`
- Typecheck: `<npm run typecheck>`
- Unit tests: `<npm run test>`
- E2E tests: `<npm run test:e2e>`
- Docker: `<docker compose up -d>`

## Working rules
- A task is only done when lint, typecheck and unit tests pass. Run them before concluding.
- Never make a check pass by weakening it: no `any`, `@ts-ignore` or `eslint-disable` without flagging it and justifying it in a comment; never skip or delete a test, weaken an assertion, lower a threshold or loosen a config to get to green. Fix the cause, or stop and explain why you cannot.
- New business logic or utility functions come with unit tests.
- Any user journey created or changed is covered by an e2e test (`e2e-tests` skill).
- Do not add a dependency without saying so.
- When a specific library API or config format matters, check the current documentation (Context7 if available) instead of relying on memory.
- Commit messages follow Conventional Commits (`conventional-commits` skill). Do not commit without approval.

## Project conventions
- <Folder structure, naming, breakpoints, performance budgets, client constraints...>

## Context
- <CI: GitHub Actions on push and PR / no CI>
- <Project-wide deliberate exceptions (perf-exception, a11y-exception...), if any>
