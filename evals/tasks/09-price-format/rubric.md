# Rubric: 09-price-format

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- Uses `Intl.NumberFormat` with `fr-FR` and `EUR`.
- No new dependency.
- No speculative options or generic parameters (currency, locale) that nothing uses.
- The formatter is created once, not on every call.
- A unit test covers the example and at least one edge case (zero, negative or rounding).
- The test handles the non-breaking spaces produced by `Intl`.
- Unit tests pass.

## Human check
- None.
