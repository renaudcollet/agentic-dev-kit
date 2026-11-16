---
name: conventional-commits
description: Commit message and commit hygiene conventions (Conventional Commits, English, imperative, atomic commits). Apply whenever writing a commit message, proposing a commit, splitting changes into commits, or naming a branch.
---

# Conventional Commits

If the repository already follows other conventions (agency or client rules, a `CONTRIBUTING.md`, a commitlint config), follow them first.

## Format
```
<type>(<optional scope>): <description>

<optional body: why, not how>

<optional footers: BREAKING CHANGE, Refs, Co-Authored-By>
```

## Types
| Type | Use for |
|---|---|
| `feat` | a new feature for the user |
| `fix` | a bug fix |
| `perf` | a performance improvement |
| `refactor` | a code change that neither fixes a bug nor adds a feature |
| `style` | formatting only (no behaviour change) |
| `test` | adding or fixing tests |
| `docs` | documentation only |
| `build` | build system, dependencies |
| `ci` | CI configuration |
| `chore` | maintenance that fits nowhere else |
| `revert` | reverting a previous commit |

## Description
- English, imperative mood, lowercase start, no final period: `fix(cart): prevent duplicate items on double click`.
- 72 characters at most for the first line.
- Says *what* changes for the project, not which file was edited: `feat(ar): add fallback screen when camera access is denied`, not `update ArScene.vue`.
- Scope: the area concerned (`cart`, `auth`, `ar`, `scene`, `api`, `ci`), short and consistent across the project. Omit it rather than invent a vague one.

## Body and footers
- Body when the *why* is not obvious: the problem, the reason for the chosen solution, a measured gain (`reduces texture memory from 340 MB to 90 MB`).
- Breaking change: `!` after the type or scope (`feat(api)!: ...`) and a `BREAKING CHANGE:` footer describing the migration.
- References: `Refs: #42`, `Closes: #42`.
- Deliberate exceptions introduced in the commit (`perf-exception`, `a11y-exception`...) are mentioned in the body.

## Commit hygiene
- **Atomic commits**: one logical change per commit. Do not mix a feature, a refactor and formatting; split them.
- Each commit leaves the project in a working state (lint, typecheck and tests pass).
- Never commit secrets, `.env` files, local settings (`.claude/settings.local.json`) or build output.
- **Never commit without the developer's approval.** Propose the message (or the split into several commits) and wait.

## Branches
`<type>/<short-description>` in kebab-case: `feat/ar-camera-fallback`, `fix/cart-double-click`, `chore/setup-ci`.
