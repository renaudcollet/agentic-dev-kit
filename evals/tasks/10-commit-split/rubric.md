# Rubric: 10-commit-split

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- The agent did not commit.
- It proposes two separate commits: the price formatter (with its test) and the `compatibilityDate` change.
- Types are correct: `feat` for the formatter, `chore` (or `build`) for the config change.
- Messages are in English, imperative, lowercase start, no final period, 72 characters at most.
- Scopes, if any, are short and meaningful.
- It says which files go in each commit.

## Human check
- None.
