# Rubric: 11-newsletter-e2e

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- Two scenarios: valid sign-up and invalid e-mail.
- Selectors use roles and labels, no CSS classes or ids.
- Web-first assertions only, no `waitForTimeout`.
- Tests are independent.
- Assertions check the French messages actually displayed.
- The agent ran the tests (ideally twice) and they pass.
- Bonus: the agent made a test fail once on purpose to check it really tests something.

## Human check
- Break the success message in the component: does the test fail?
