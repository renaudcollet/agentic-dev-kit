---
name: run-evals
description: Runs the agentic-dev-kit evaluation suite (evals/) and produces a results table, to check whether the kit's skills and subagents still improve the work. Run with /run-evals, optionally followed by task ids, a mode and a number of runs.
disable-model-invocation: true
---

# Run the evaluation suite

Used in the agentic-dev-kit repository only. Never copied into projects (excluded by `scripts/sync.ps1` and `evals/scripts/reset-work.mjs`).

## Arguments
- Task ids (default: all folders in `evals/tasks/`), for example `01-confirm-modal 06-glb-viewer`.
- Mode: `with-kit`, `without-kit` or `both` (default: `with-kit`). Use `both` to judge whether a skill still helps.
- Runs per task and mode: default **2** (results vary from one run to the next).
- Model for the runs: default the CLI's default model; pass one to compare models.
Ask nothing if the arguments are clear; otherwise ask once, grouped.

## Before starting
- Check that `claude` (Claude Code CLI) and `node` are available, and that no dev server is already running on port 3000.
- Estimate and announce the cost: tasks × modes × runs agent sessions, plus one grading per run. Wait for approval if more than 12 sessions.
- Note: personal settings in `~/.claude/` apply to every run. For a clean `without-kit` comparison, the kit must not be installed globally.

## For each task, mode and run
1. **Reset**: `node evals/scripts/reset-work.mjs --task <id> --mode <mode>`
2. **Run the task headless** in `evals/work`, with the prompt from `task.json`:
   ```
   claude -p "<prompt>" --output-format json --permission-mode acceptEdits --allowedTools "Bash(npm run *)" "Bash(npx *)" "Bash(git status*)" "Bash(git diff*)" > .eval-run.json
   ```
   Run it from `evals/work` (cwd) so the copied `.claude/` and `CLAUDE.md` are loaded. Add `--model <model>` if requested. Allow up to 10 minutes; run it in the background if needed. Check the exact flags with `claude --help` if a call fails: they may change between versions.
3. **Automated checks**: `node evals/scripts/check.mjs --task <id>`
4. **Save the run** to `evals/runs/<date>/<id>/<mode>-<n>/` (git-ignored):
   - `diff.patch`: all changes including new files (`git -C evals/work add -N . && git -C evals/work diff HEAD`)
   - `final-message.md`: the `result` field of `.eval-run.json`
   - `checks.json`: copy of `evals/work/.eval-checks.json`
   - `meta.json`: task, mode, run number, model, duration and cost if reported in `.eval-run.json`
5. **Grade**: call the `eval-grader` subagent with the paths of the task's `rubric.md` and `task.json` and the run folder. Do not tell it the mode. Save its answer as `grade.md` in the run folder.

Run sequentially: all runs share `evals/work` and port 3000.

## Results
Write `evals/results/<date>[-<label>].md` (committed) with:
- Context: date, model, kit version (`git rev-parse --short HEAD`), tasks, modes, runs.
- A table, one row per task and mode: automated checks (passed/total, per run), rubric score (per run), average, and **"flipped"** when a criterion passes in one run and fails in another.
- Comparison with the previous results file, if any: tasks that improved, regressed or changed outcome.
- With `both`: per task, the difference between `with-kit` and `without-kit`. A skill that brings no difference over several runs is a candidate for removal or rewriting.
- **Human checks to do**: pick 2 or 3 runs (in priority the ones where checks and rubric disagree, or where results flipped) and list their "Human check" items with the path to their folder.

End with a short summary for the developer: what improved, what regressed, what to look at, and what to change in the kit if anything. Do not change the kit yourself.

## After the run
- Leave `evals/work` in place for inspection; it is reset at the next run.
- Do not commit anything without approval. When approved, commit only the results file: `test(evals): add results for <date>`.
