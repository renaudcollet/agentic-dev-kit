# agentic-dev-kit

[🇫🇷 Français](README.md) · 🇬🇧 English

My kit for developing with AI agents: the rules, procedures and specialized agents that guide AI in my work as a web, real-time 3D and WebAR developer.

It is built for **Claude Code** (`.claude/` format), but the skills follow the open Agent Skills standard and can be used with other tools.

> The skills and agents themselves are written in French. Claude understands and applies them regardless of the language you work in.

## Scope

This repository holds everything that **configures or guides the AI**:
skills, subagents, `CLAUDE.md` templates, MCP configuration, hooks and reusable prompts.

It does **not** hold tool configuration files (ESLint, tsconfig, CI workflows): those live in each project. The kit contains the instructions that let the agent set them up.

## Contents

### Skills applied while writing code
| Skill | Triggers when the agent... |
|---|---|
| `accessibilite` (accessibility) | writes or edits an interactive element, a form, a modal |
| `securite-front` (front-end security) | renders external content, handles client-side auth, adds a dependency |
| `securite-back` (back-end security) | writes an API route, a query, an RLS policy, an upload |
| `simplicite-code` (code simplicity) | writes, refactors or reviews code |
| `responsive` | writes CSS or layout |
| `performance-memoire` (performance and memory) | writes a WebGL scene, a GSAP animation, Canvas, Phaser or WebAR code, a long list, asset loading |
| `tests-e2e` | creates or edits a user journey, writes an e2e test, configures test CI |

Skills have no fixed model: they use the session's model.

### Manual skill
| Skill | Role |
|---|---|
| `init-projet` (project setup) | `/init-projet`: linting, formatting, strict TypeScript, unit tests, GitHub Actions CI and pre-commit checks (on request), project `CLAUDE.md` from `modele-CLAUDE.md`. Never triggers on its own. |

### Subagents: separate context, return only a conclusion
| Agent | Role | Model |
|---|---|---|
| `relecteur` (reviewer) | independent read-only review on every axis, before a commit or PR | `opus` |
| `profileur-perf` (performance profiler) | in-browser measurements (traces, heap, fps, draw calls), leak hunting, quantified diagnosis | `opus` |
| `testeur-e2e` (e2e tester) | runs e2e tests, diagnoses failures, keeps logs out of the conversation | `sonnet` |

Subagents diagnose; the main agent fixes, after the developer's approval.

## Principles

- **Skills for know-how, subagents for independent verification** or for noisy tasks (logs, traces, screenshots). Not one subagent per problem type.
- **Rules by default, deliberate exceptions.** An intentional deviation is marked in the code:

| Marker | Conditions |
|---|---|
| `perf-exception:` | cost contained (area, duration, paused off-screen, mobile, reduced-motion) |
| `a11y-exception:` | non-negotiable baseline kept (alternative, keyboard exit, reduced-motion, no flashing) |
| `responsive-exception:` | clean behaviour outside the target (letterbox or message) |
| `simplicite-exception:` | measured reason or referenced bug, complexity kept local |
| `secu-exception:` | front-end security only, approved by the developer, minimal scope |
| none | back-end security: no exceptions |

The agent flags any exception it introduces, leaves documented ones alone, and the reviewer lists them separately.

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
- records the synced version in `.claude/.kit-sync.json`.

An improvement made in one project that is useful elsewhere goes back into the kit.

On an agency or client repository, ask before committing the `.claude/` folder. Keep `.claude/settings.local.json` out of version control.

## Personal configuration

Copy the content of `templates/CLAUDE-personnel.md` into `~/.claude/CLAUDE.md`: it makes the agent suggest `/init-projet` for every new project.

Do not set the `CLAUDE_CODE_SUBAGENT_MODEL` environment variable: it would override each subagent's model.

## MCP servers

`mcp/.mcp.json` is a sample configuration to copy to a project's root:
- **Playwright**: responsive screenshots for the `relecteur`;
- **Chrome DevTools**: performance traces and heap snapshots for the `profileur-perf`;
- **Context7**: up-to-date library documentation, used by `init-projet`.

On Windows, if `npx` is not found, replace `"command": "npx"` with `"command": "cmd"` and prefix the arguments with `"/c", "npx"`. Check each server's documentation, as the commands change over time.

If the Playwright MCP tool names differ, adjust the `tools:` line in `.claude/agents/relecteur.md`.

## Evolving the kit

- Add a rule when the same issue keeps showing up in the reviewer's reports; remove rules that never fire.
- Don't explain what the agent already knows: short, imperative rules, no theory.
- To judge a change: a few typical tasks, compare before and after, change one thing at a time.
- Log every change in `CHANGELOG.md`.

## License

[MIT](LICENSE): free to reuse, adapt and redistribute these skills and subagents, keeping the copyright notice.
