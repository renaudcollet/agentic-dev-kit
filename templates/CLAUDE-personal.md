# Copy into ~/.claude/CLAUDE.md (C:\Users\<me>\.claude\CLAUDE.md on Windows)

## New projects
- When I create a project, or when a project has no linting, strict typing or unit tests, suggest running `/project-setup` before starting to code.
- When I hand you a client or agency brief, or a feature request that leaves architecture or scope decisions open, suggest running `/clarify-brief` before planning.

## Languages
- I talk to you in French: answer in French.
- Code identifiers, comments and commit messages in English, unless the project's CLAUDE.md says otherwise.
- End-user content (UI text, aria-label, alt, error messages) is written in the project's content language, as set in its CLAUDE.md. If it is not set, ask.

## Package manager
- Use the project's package manager, detected from its lockfile (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`). For new projects, use pnpm.

## Up-to-date documentation
- When a specific library API, config format or tool version matters, check the current documentation (Context7 if available) instead of relying on memory.

## Checks
- Never make a check pass by weakening it (suppression, skipped or deleted test, weakened assertion, lowered threshold, loosened config): fix the cause, or stop and explain.

## Commits
- Commit messages follow Conventional Commits, in English. Never commit without my approval.
