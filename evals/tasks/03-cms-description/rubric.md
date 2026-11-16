# Rubric: 03-cms-description

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- The HTML is sanitized before rendering (DOMPurify or a server-side sanitizer), not rendered raw with `v-html`.
- `javascript:` URLs and event handler attributes are removed.
- Legitimate formatting (`<p>`, `<strong>`, links) is kept.
- The sanitizer configuration is restrictive (allowlist rather than defaults when possible).
- The agent announced the dependency it added and why.
- The agent explained the XSS risk to the developer.

## Human check
- Do projects 2 and 3 display correctly with no alert?
