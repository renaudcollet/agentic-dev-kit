# Rubric: 02-contact-validation

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- Every field is required and the e-mail format is checked.
- Each error is linked to its field with `aria-describedby`, and invalid fields get `aria-invalid="true"`.
- Focus goes to the first invalid field on submit.
- Error messages are explicit and in French.
- The success message is not shown when the form is invalid.
- Labels are kept (no placeholder used as the only label).
- No new dependency unless announced and justified.

## Human check
- Submit the empty form with a screen reader or the accessibility tree: are errors announced?
