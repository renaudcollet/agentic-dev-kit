# agentic-dev-kit

🇬🇧 English · [🇫🇷 Français](README.fr.md)

My kit for developing with AI agents: the rules, procedures and specialized agents that guide AI in my work as a web, real-time 3D and WebAR developer.

It is built for **Claude Code** (`.claude/` format), but the skills follow the open Agent Skills standard and can be used with other tools. The agents reply in the language you work in.

## Scope

This repository holds everything that **configures or guides the AI**:
skills, subagents, `CLAUDE.md` templates, MCP configuration, hooks and reusable prompts.

It does **not** hold tool configuration files (ESLint, tsconfig, CI workflows): those live in each project. The kit contains the instructions that let the agent set them up.

## Contents

### Skills applied while working
| Skill | Triggers when the agent... |
|---|---|
| `accessibility` | writes or edits an interactive element, a form, a modal |
| `security-frontend` | renders external content, handles client-side auth, adds a dependency |
| `security-backend` | writes an API route, a query, an RLS policy, an upload |
| `code-simplicity` | writes, refactors or reviews code |
| `responsive` | writes CSS or layout |
| `performance-memory` | writes a WebGL scene, a GSAP animation, Canvas, Phaser or WebAR code, a long list, asset loading |
| `e2e-tests` | creates or edits a user journey, writes an e2e test, configures test CI |
| `conventional-commits` | writes a commit message, splits changes into commits, names a branch |

Skills have no fixed model: they use the session's model.

### Manual skill
| Skill | Role |
|---|---|
| `project-setup` | `/project-setup`: linting, formatting, strict TypeScript, unit tests, GitHub Actions CI, pre-commit and commit message checks (on request), project `CLAUDE.md` from `CLAUDE-template.md`. Never triggers on its own. |

### Subagents: separate context, return only a conclusion
| Agent | Role | Model |
|---|---|---|
| `reviewer` | independent read-only review on every axis before a commit or PR, with a proposed commit message | `opus` |
| `perf-profiler` | in-browser measurements (traces, heap, fps, draw calls), leak hunting, quantified diagnosis | `opus` |
| `e2e-runner` | runs e2e tests, diagnoses failures, keeps logs out of the conversation | `sonnet` |

Subagents diagnose; the main agent fixes, after the developer's approval.

### Kit maintenance (used in this repository only, never copied into projects)
| Item | Role |
|---|---|
| `run-evals` skill | `/run-evals`: runs the evaluation suite and writes a results table |
| `eval-grader` subagent | grades each evaluation run against its rubric (`opus`) |

## Principles

- **Skills for know-how, subagents for independent verification** or for noisy tasks (logs, traces, screenshots). Not one subagent per problem type.
- **Rules by default, deliberate exceptions.** An intentional deviation is marked in the code:

| Marker | Conditions |
|---|---|
| `perf-exception:` | cost contained (area, duration, paused off-screen, mobile, reduced-motion) |
| `a11y-exception:` | non-negotiable baseline kept (alternative, keyboard exit, reduced-motion, no flashing) |
| `responsive-exception:` | clean behaviour outside the target (letterbox or message) |
| `simplicity-exception:` | measured reason or referenced bug, complexity kept local |
| `security-exception:` | front-end security only, approved by the developer, minimal scope |
| none | back-end security: no exceptions |

The agent flags any exception it introduces, leaves documented ones alone, and the reviewer lists them separately.
- **Nothing is committed without the developer's approval.**

## Installing in a project

The kit is the reference version; each project gets a copy in its `.claude/` folder.

```powershell
# Preview without changing anything
.\scripts\sync.ps1 -Target "D:\projects\my-project" -DryRun

# Copy or update
.\scripts\sync.ps1 -Target "D:\projects\my-project"
```

The script:
- adds missing files and updates those that were not modified in the project;
- **never overwrites a locally adapted file** (it reports it; use `-Force` to overwrite anyway);
- skips paths listed in the project's `.claude/.kit-ignore` (one path per line, e.g. `skills/responsive`);
- records the synced version in `.claude/.kit-sync.json`, with a hash of each copied file. On the next sync, a file that no longer matches its hash was adapted in the project and is kept. Commit this file with `.claude/` and do not edit it by hand: without it, every file that differs from the kit is treated as adapted and no longer updated without `-Force`.

**New project**: the target folder must already exist. Create the project first (for example `pnpm create nuxt my-project`), run `sync.ps1` on it, then run `/project-setup` in Claude Code to add linting, unit tests, CI and the project `CLAUDE.md`.

**Existing project**: always start with `-DryRun` to see which files would be added and which conflict with an existing `.claude/` folder.

An improvement made in one project that is useful elsewhere goes back into the kit.

On an agency or client repository, ask before committing the `.claude/` folder. Keep `.claude/settings.local.json` out of version control.

## Personal configuration

Copy the content of `templates/CLAUDE-personal.md` into `~/.claude/CLAUDE.md`: it makes the agent suggest `/project-setup` for every new project.

Do not set the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable: it would override each subagent's model.

## MCP servers

`mcp/.mcp.json` is a sample configuration to copy to a project's root:
- **Playwright**: responsive screenshots for the `reviewer`;
- **Chrome DevTools**: performance traces and heap snapshots for the `perf-profiler`;
- **Context7**: up-to-date library documentation, used by `project-setup`.

On Windows, if `npx` is not found, replace `"command": "npx"` with `"command": "cmd"` and prefix the arguments with `"/c", "npx"`. Check each server's documentation, as the commands change over time.

If the Playwright MCP tool names differ, adjust the `tools:` line in `.claude/agents/reviewer.md`.

## Evaluations

`evals/` holds 12 reference tasks on a small Nuxt project (accessible modal, form validation, untrusted HTML, upload route, Supabase RLS, Three.js lifecycle, GSAP animation, large gallery, utility function, commit split, e2e test, documented exception). Each run is checked by scripts, graded against a yes/no rubric by a separate agent, and a few items are left for a human check. See [evals/README.md](evals/README.md).

```
/run-evals            all tasks, with the kit
/run-evals both       with and without the kit, to measure what it brings
```

## Maintenance

The kit is meant to evolve. Review it:
- **at each new model generation**: run `/run-evals both`. Rules the model now follows on its own cost context for nothing: remove them. Reconsider the subagents' models;
- **after a significant change** to a skill or subagent: run the related tasks, twice;
- **every six months** otherwise: check the version-sensitive details (config formats, library APIs, MCP commands, Claude Code frontmatter fields) against current documentation.

Guidelines:
- Add a rule when the same issue keeps showing up in the reviewer's reports; remove rules that never fire.
- Don't explain what the agent already knows: short, imperative rules, no theory.
- Change one thing at a time and compare results before and after.
- Log every change in `CHANGELOG.md`, with Conventional Commits.

## License

[MIT](LICENSE): free to reuse, adapt and redistribute these skills and subagents, keeping the copyright notice.
