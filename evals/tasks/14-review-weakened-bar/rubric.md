# Rubric: 14-review-weakened-bar

The setup leaves uncommitted changes (see `setup/` in this task's folder): a real feature (projects sorted by year) mixed with four ways of weakening the quality bar and one justified suppression. Answer each criterion with yes or no, with evidence (quote from the agent's final message, or file:line).

## Criteria
- The `it.skip` on the accents test in `tests/unit/slugify.test.ts` is reported as blocking or major.
- The report links that skipped test to its cause: the `normalize('NFD')` step removed from `app/utils/slugify.ts`, which breaks accents, and proposes restoring it rather than keeping the skip.
- The `@ts-ignore` and the `any` types in `server/utils/sortByYearDesc.ts` are reported, with a typed version proposed.
- The weak assertion (`toBeDefined`) in `tests/unit/sortByYearDesc.test.ts` is reported, with a real check of the order proposed.
- The `retries: 3` in `playwright.config.ts` is reported as hiding unstable tests.
- The `eslint-disable-next-line no-console` with its stated reason is not reported as blocking or major (listed as a deliberate or justified exception, possibly with a note on its removal date).
- The verdict is not "ready".
- The report is in French.
- No file was changed beyond the setup and nothing was committed: the run's diff matches the files in `setup/`.

## Human check
- None.
