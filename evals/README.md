# Evaluations

A small, repeatable test bench to check that the kit still makes the agent's work better, and to decide what to change when models or tools evolve.

## How it works

Each task gives the agent a realistic request on the same reference project (`fixture/`), then checks the result at three levels:

1. **Automated checks**, run by `scripts/check.mjs`: lint, typecheck, tests, pattern checks in the changed files, a behavioural Playwright spec, no commit made, no unexpected dependency.
2. **Rubric**, graded by the `eval-grader` subagent: yes/no criteria with evidence, for what a script cannot judge. The grader never sees which configuration produced the run.
3. **Human check**: a few items per task that only a person can judge (visual result, feel of an animation). The results file tells you which 2 or 3 runs to look at.

The agent that does a task never grades itself.

## Layout

```
evals/
  fixture/            reference project (Nuxt 4, Three.js, GSAP, Supabase migrations)
  tasks/<id>/
    task.json         prompt sent to the agent + automated checks
    rubric.md         yes/no criteria for the grader + human check
    eval.spec.ts      behavioural Playwright spec (optional)
    setup/            files applied after the baseline, as uncommitted changes (optional)
  scripts/
    reset-work.mjs    rebuilds evals/work from the fixture, with or without the kit
    check.mjs         runs the automated checks of a task on evals/work
  results/            one Markdown file per evaluation session (committed)
  work/               working copy (git-ignored)
  runs/               diffs, final messages, checks and grades of each run (git-ignored)
```

## Tasks

| Task | What it tests | Main skills |
|---|---|---|
| `01-confirm-modal` | accessible confirmation dialog | accessibility, code-simplicity |
| `02-contact-validation` | accessible form errors in French | accessibility |
| `03-cms-description` | rendering untrusted HTML | security-frontend |
| `04-avatar-upload` | file upload API route | security-backend |
| `05-comments-table` | Supabase table with RLS | security-backend |
| `06-glb-viewer` | Three.js scene lifecycle | performance-memory, accessibility |
| `07-faq-animation` | GSAP animation without layout cost | performance-memory, accessibility |
| `08-photo-gallery` | 5000 items without 5000 DOM nodes | performance-memory |
| `09-price-format` | small utility without over-engineering | code-simplicity |
| `10-commit-split` | splitting mixed changes into commits | conventional-commits |
| `11-newsletter-e2e` | writing a robust e2e test | e2e-tests |
| `12-respect-exception` | optimizing without breaking a documented exception | performance-memory |
| `13-local-workshops` | indexable location pages with local business data | seo |

Prompts are in French on purpose: it is how the kit is used day to day, and it checks that end-user content stays in French.

## Running

In Claude Code, from the repository root:

```
/run-evals                                  all tasks, with the kit, 2 runs each
/run-evals 06-glb-viewer 07-faq-animation   selected tasks
/run-evals both                             with and without the kit, to measure what the kit brings
```

The first run installs the fixture's dependencies in `evals/work` and copies the generated `package-lock.json` into `fixture/`: commit it, so every later run uses the same versions.

Manual use of the scripts:

```
node evals/scripts/reset-work.mjs --task 01-confirm-modal --mode with-kit
cd evals/work && claude      # do the task by hand or with the prompt from task.json
node evals/scripts/check.mjs --task 01-confirm-modal
```

## When to run

- When a new model generation comes out (compare `with-kit` and `without-kit`: rules the model now follows on its own can go).
- After a significant change to a skill or subagent.
- Every few months otherwise.

## Adding a task

1. Create `tasks/<nn-name>/task.json` with the prompt, the expected skills and the checks.
2. Write `rubric.md`: yes/no criteria verifiable in the code or the agent's reply, plus the human check.
3. Add `eval.spec.ts` when the behaviour can be tested in the browser with role-based selectors.
4. Add what the task needs to `fixture/`, without breaking the other tasks.
5. Run the task twice and read the grades: an ambiguous criterion shows up as a grade that flips.

### Check types in `task.json`

| Field | Effect |
|---|---|
| `commands` | commands run in the working copy; pass if exit code 0 |
| `commands[].changedFiles` | regex: the command only runs on the changed files that match (used for lint, so errors already in the fixture do not hide new ones) |
| `grep[].must` / `mustNot` | regex searched in the files matching `path` (changed files only, or every file with `"scope": "all"`) |
| `grep[].mustNotChange` | the files matching `path` must not be modified |
| `e2e` | Playwright spec copied into `tests/e2e/__eval__/` and run |
| `noNewCommit` | the agent must not have committed |
| `noNewDeps` | no dependency added to `package.json` |
| `overlay` | folder applied after the baseline commit, as uncommitted changes |
