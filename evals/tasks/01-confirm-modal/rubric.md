# Rubric: 01-confirm-modal

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- The dialog has an accessible name (`aria-labelledby` or equivalent).
- Focus moves into the dialog on open and stays trapped inside (native `showModal()` or explicit handling).
- `Escape` and a cancel button close the dialog without deleting.
- Focus returns to the button that opened the dialog.
- All visible texts and accessible names are in French.
- No new dependency for the modal.
- No speculative abstraction (a generic modal system with options nothing uses).
- The agent ran lint and typecheck before concluding.

## Human check
- Open, cancel and confirm with the keyboard only: is the focus always visible?
- Does the modal look right on mobile width?
