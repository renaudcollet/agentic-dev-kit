# Changelog

## 2026-11-16: initial release
- Skills: `accessibility`, `security-frontend`, `security-backend`, `code-simplicity`, `responsive`, `performance-memory`, `e2e-tests`, `conventional-commits`.
- Manual skill: `project-setup` with `CLAUDE-template.md`.
- Subagents: `reviewer` (opus), `perf-profiler` (opus), `e2e-runner` (sonnet).
- Deliberate exception markers (`perf-`, `a11y-`, `responsive-`, `simplicity-`, `security-exception:`).
- `scripts/sync.ps1`, sample `mcp/.mcp.json`, `templates/CLAUDE-personal.md`.
- Evaluation suite in `evals/`: reference Nuxt project, 12 tasks with automated checks, rubrics and Playwright specs, `reset-work.mjs` and `check.mjs` scripts, `/run-evals` skill and `eval-grader` subagent (kit-internal, excluded from sync).
- Languages section in the project template; content language asked by `project-setup`.
- English README with a French version (`README.fr.md`). Maintenance guidelines. MIT license.
