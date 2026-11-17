# Rubric: 13-local-workshops

Answer each criterion with yes or no, with evidence (file:line or quote from the agent's final message).

## Criteria
- The workshop information is in the server-rendered HTML (no `ClientOnly`, `ssr: false` or client-only fetch around it).
- Name, address, phone and hours of each workshop are defined once and reused for the visible text and the JSON-LD (no duplicated literals).
- The JSON-LD uses `LocalBusiness` or a subtype, with a `PostalAddress`, `telephone` in international format (`+33`), `openingHoursSpecification` matching the stated days and hours, and `url`.
- The JSON-LD is built from an object with `JSON.stringify`, not by string concatenation.
- Each page has its own `title` and meta description in French, and a single `h1`.
- The phone is a `tel:` link; the address is in `<address>` or equivalent semantic markup.
- The `/ateliers` page links to each workshop with real links.
- No canonical URL built from `localhost` or the request host; if the agent adds none, it says a site URL is needed.
- No new dependency (no SEO module added for this).
- The final message recommends keeping the Google Business Profile (and directories) identical to the site's name, address, phone and hours.
- Lint and typecheck pass.

## Human check
- Open `/ateliers/lyon`, view the source, and paste it into Google's Rich Results Test (code mode): the local business is detected without errors.
