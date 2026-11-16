---
name: security-frontend
description: Client-side security rules for Nuxt/Vue and vanilla JavaScript (XSS, v-html, secrets in the bundle, CSP, token storage, dependencies). Apply when writing front-end code that renders external content, handles authentication, calls an API or adds a dependency. Also use for a front-end security audit.
---

# Front-end security

## Rule status
These rules are not bypassed for convenience. Only an external technical constraint can justify a deviation (for example a WebAR engine that requires `unsafe-eval` in the CSP, a third-party script imposed by the client). In that case:
1. **The agent never introduces the deviation on its own**: it explains the constraint and the risk, proposes the most restrictive option possible, and waits for the developer's approval.
2. Once approved: a `security-exception:` comment stating the constraint, the accepted risk and how it is limited (deviation restricted to the pages concerned, explicitly listed domains, per-route CSP).
3. Review the exception whenever the tool that imposes it is updated.

## XSS
- No `v-html`, `innerHTML` or `insertAdjacentHTML` on content you do not control. If unavoidable: sanitize with DOMPurify, using a restrictive configuration.
- No unvalidated dynamic URL in `href`, `src`, `:href` (block `javascript:` and `data:`).
- No `eval`, `new Function`, or `setTimeout` with a string.
- CMS or Markdown content: rendered by a library that sanitizes.

## Secrets and configuration
- Nothing secret in `runtimeConfig.public`, `NUXT_PUBLIC_*`, `VITE_*` or client code: anything there is readable in the bundle.
- Supabase key on the client: the `anon` key only, never `service_role`.
- Third-party API keys (8th Wall, maps, payment): check they are restricted by domain on the provider side.
- No public source maps in production unless explicitly chosen.

## Authentication and session
- Prefer `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict` cookies over `localStorage` for tokens.
- Never rely on the front end for authorization: hiding a button is not protection. Checks happen on the server or through RLS policies.
- Logout: invalidate the session on the server, not only on the client.

## Headers and CSP
- CSP defined (via `nuxt-security` or server headers): no `unsafe-inline` or `unsafe-eval` unless documented as necessary (some WebAR engines require it: see "Rule status").
- `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy` (camera limited to WebAR pages).
- `target="_blank"`: `rel="noopener noreferrer"`.

## Data and forms
- Front-end validation is a convenience; server-side validation is mandatory.
- No personal data in URLs, console logs or analytics tools.
- `postMessage`: check `event.origin`.

## Dependencies
- Before adding a package: maintenance, adoption, real need (would native code do?).
- `npm audit` (or equivalent) with no unaddressed high or critical vulnerability.
- Third-party scripts from a CDN: SRI (`integrity`).

## Audit format (when asked)
For each point: file and line, concrete risk (one-sentence attack scenario), severity, fix in code.
