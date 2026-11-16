# Rubric: 04-avatar-upload

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- Anonymous requests are rejected with 401 before reading the file.
- File size is limited.
- File type is checked on the server against an allowlist (ideally from the file content, not only the declared type).
- The stored file name is generated, never taken from the user.
- Files are stored outside `public/` or in a private storage, with no path traversal possible.
- Error messages are generic; no stack trace or internal path is returned.
- The response returns only what the client needs.
- No security shortcut was taken without discussing it with the developer.

## Human check
- Read the route: would you ship it as is?
