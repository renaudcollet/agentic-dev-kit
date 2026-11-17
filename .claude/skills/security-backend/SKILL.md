---
name: security-backend
description: Server-side security rules for Node.js (Nuxt/Nitro server routes), Laravel, Prisma/PostgreSQL and Supabase (RLS). Apply when writing an API route, a database query, an RLS policy, a migration, a file upload, authentication and authorization logic, a server fetch of a user-supplied URL, an AI or LLM feature, a new dependency, or code that stores personal data. Also use for a back-end security audit.
---

# Back-end security

These rules have no exception mechanism: an authorization check, a validation step or a parameterized query is never replaced by a comment. If a constraint seems to require it, the agent stops and discusses it with the developer before writing the code.

## Authentication and authorization
- Every route checks the identity, then the user's right to that specific resource (not just "logged in"). Test access to another user's resource (IDOR).
- Laravel: Policies and Gates, `auth` middleware on route groups, explicit `$fillable` (no `$guarded = []`).
- Nitro: check in every `server/api/*` handler or through a shared utility, never assumed.
- Passwords: bcrypt or argon2, never a home-made hash.

## Supabase
- RLS enabled on **every** exposed table, with separate policies for `select`, `insert`, `update`, `delete`.
- Policies based on `auth.uid()`, never on a value sent by the client.
- `service_role` key on the server only, never in an environment reachable by the client.
- `security definer` functions: fixed `search_path` and rights checked inside.
- Storage: policies on buckets, private buckets by default.

## Injections
- Parameterized queries only. Prisma: avoid `$queryRawUnsafe`, prefer `$queryRaw` with a tagged template. Laravel: no `DB::raw` or `whereRaw` concatenating user input.
- No user input in a shell command, a file path or a column name without an allowlist.
- Twig: keep auto-escaping, `|raw` only on trusted content.

## Input validation
- Validate every input on the server (zod for Node, Form Requests for Laravel): type, length, format.
- Return only the fields needed (no full user object with hash or tokens).

## Files
- Uploads: MIME type checked on the server, size limited, file renamed, stored outside the web root or in a private bucket.
- Never serve uploaded files directly with their original type without checks.

## API protection
- Rate limiting on login, sign-up, password reset and expensive endpoints.
- CORS restricted to known origins, no `*` with credentials.
- CSRF: enabled on Laravel, `SameSite` cookies for Nitro.
- Generic error messages in production, details only in logs.

## Server-side requests (SSRF)
- Any URL the user influences (webhook, import from URL, image proxy, link preview): allowlist the scheme (`https`) and the hosts when possible.
- Otherwise resolve the host and reject private, loopback and link-local addresses (`169.254.169.254` included), in IPv4 and IPv6; do not follow redirects; set a timeout and a size limit.

## AI and LLM features
- Model output is untrusted input: validated against a schema before use, never passed to SQL, a shell, a file path, `eval` or `v-html` as is.
- Text given to the model (user messages, fetched pages, PDFs, images) can carry instructions: permissions are enforced in code, never by the prompt. Tools exposed to the model are minimal, their arguments validated, destructive actions confirmed by the user.
- No secrets, other users' data or full system prompt in the context. Limit tokens, request rate and cost per user.

## Dependencies
- Lockfile committed, `npm ci` (or equivalent) in CI. Before adding a package, check its exact name (typosquatting), maintainer, age and install scripts.
- Dependency install scripts: approve only those needed (pnpm blocks them by default; npm: `--ignore-scripts` where possible).
- `npm audit`: triage by real exposure; never run `npm audit fix --force` without reading what it changes.

## Personal data (GDPR)
- Collect only what a stated purpose needs. Biometric data (face recognition), health data and the like are special categories: tell the developer before storing them (explicit consent, impact assessment).
- Every store of personal data has a retention period and a working deletion path: database, storage buckets, caches, analytics, third-party services. Design the schema so a user's data can be found, exported and deleted.
- Personal data sent to a third party (analytics, email, LLM API) is processing by a subcontractor: tell the developer (contract, consent, hosting region).
- No personal data in logs.

## Secrets and infrastructure
- Secrets in environment variables, `.env` in `.gitignore`, `.env.example` without real values.
- Docker: no secret in the image or the `Dockerfile`, non-root user, database not publicly exposed.
- GitHub Actions: secrets through `secrets.*`, minimal `GITHUB_TOKEN` permissions, third-party actions pinned.

## Audit format (when asked)
For each point: file and line, one-sentence attack scenario, severity, fix in code.
