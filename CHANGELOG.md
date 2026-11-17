# Changelog

## Unreleased
- Manual skill `clarify-brief`: clarifies a brief one question at a time and writes `docs/brief.md` with decisions, assumptions and questions for the client. Suggested by `templates/CLAUDE-personal.md`.
- Skill `seo`: technical SEO and generative search (server-rendered content, metadata, canonical, hreflang, sitemap, AI crawlers, structured data, local business pages) and recommendations outside the code for the client. `clarify-brief` gains a search visibility branch.
- Evaluation task `13-local-workshops`.
- `reviewer` flags any weakened quality bar in the diff (suppressions, skipped or deleted tests, weakened assertions, lowered thresholds, loosened config). Same rule in `CLAUDE-template.md` and `templates/CLAUDE-personal.md`. Evaluation task `14-review-weakened-bar`.
- `security-backend`: SSRF, AI and LLM features, dependency supply chain, personal data (GDPR).
- `performance-memory`: 3D asset rules (KTX2 with ETC1S or UASTC, texture size, Draco or Meshopt, merged meshes, USDZ for iOS AR Quick Look) and regression guards: dependency-free `scripts/check-assets.mjs` with `assets-budget.example.json`, Size Limit, 3D leak test, Lighthouse CI as a warning. `project-setup` asks about performance budgets; `e2e-tests` points to the leak test.
- `reviewer`: correctness axis (does what was asked, edge cases, tests that really test), reads the tests first.

## 2026-11-16: initial release
- Skills: `accessibility`, `security-frontend`, `security-backend`, `code-simplicity`, `responsive`, `performance-memory`, `e2e-tests`, `conventional-commits`.
- Manual skill: `project-setup` with `CLAUDE-template.md`.
- Subagents: `reviewer` (opus), `perf-profiler` (opus), `e2e-runner` (sonnet).
- Deliberate exception markers (`perf-`, `a11y-`, `responsive-`, `simplicity-`, `security-exception:`).
- `scripts/sync.ps1`, sample `mcp/.mcp.json`, `templates/CLAUDE-personal.md`.
- Evaluation suite in `evals/`: reference Nuxt project, 12 tasks with automated checks, rubrics and Playwright specs, `reset-work.mjs` and `check.mjs` scripts, `/run-evals` skill and `eval-grader` subagent (kit-internal, excluded from sync).
- Languages section in the project template; content language asked by `project-setup`.
- English README with a French version (`README.fr.md`). Maintenance guidelines. MIT license.
