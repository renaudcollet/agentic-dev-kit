---
name: e2e-tests
description: Conventions for writing and maintaining end-to-end tests (Playwright by default): what to test, selectors, data, authentication, stability, automated accessibility checks, running in GitHub Actions and Docker. Apply when creating or changing a user journey (form, checkout, authentication, navigation), writing or fixing an e2e test, or configuring test CI.
---

# End-to-end tests

If the project already uses another tool (Cypress...) or other conventions, follow what exists and adapt these rules.

## When to write a test
- After creating or changing a **critical journey**: authentication, sign-up, checkout or ordering, contact or application form, payment, core product feature.
- For every bug fixed on a journey: a test that reproduces it.
- Do not test in e2e what a unit test covers better (calculations, formatting, isolated logic). E2E checks that a user can complete a journey.
- 3D, canvas or WebAR experiences: test the shell (loading, no console errors, HTML controls, fallback screen when WebGL or the camera is unavailable), not the rendering itself.

## Structure
- One file per journey or feature in `tests/e2e/` (or the existing folder).
- One test = one readable user scenario, named after the expected behaviour: `test("a visitor can add a product to the cart and see the total")`.
- `test.describe` to group, `test.step` to make long journeys readable in reports.
- Independent tests: no test depends on another or on execution order.
- Page objects only when the same sequence is reused across several files (otherwise, see the `code-simplicity` skill). Simple helper functions are often enough.

## Selectors
In order of preference:
1. `getByRole` with the accessible name (`getByRole("button", { name: "Submit" })`)
2. `getByLabel`, `getByPlaceholder`, `getByText`
3. `getByTestId` (`data-testid`) when nothing accessible fits (canvas, purely visual elements)
Never a CSS selector tied to style or structure (`.btn-primary`, `div > span:nth-child(2)`). An element that cannot be found by its role is often an accessibility issue too: flag it.

## Stability
- No `waitForTimeout`. Use web-first assertions that wait on their own (`await expect(locator).toBeVisible()`, `toHaveText`, `toHaveURL`).
- Wait for an observable state (network response with `waitForResponse`, visible element), never a duration.
- Disruptive GSAP or CSS animations: `reducedMotion: "reduce"` in the config, if the site respects `prefers-reduced-motion` (see the `accessibility` skill).
- A flaky test is fixed or quarantined (`test.fixme` with the reason); it does not stay as a random failure.

## Data and state
- Each test creates its own data (through the API or fixtures) and does not rely on state left by another test.
- Dedicated test database (Docker container, test Supabase project, `.env.test`), never production.
- Authentication: log in once in a `setup` project and reuse the state (`storageState`), except for tests of the login journey itself.
- Mock (`page.route`) only third-party services out of your control (payment, maps, external APIs), not the project's own back end.

## Useful assertions beyond the journey
- No unexpected console errors: listen to `page.on("console")` and `page.on("pageerror")` on critical journeys.
- Automated accessibility with `@axe-core/playwright` on key pages (does not replace manual keyboard checks).
- Responsive: Playwright mobile projects (`devices["iPhone 13"]`, `devices["Pixel 7"]`) for critical journeys.
- Visual regression (`toHaveScreenshot`) only on stable areas, never on an animated canvas.

## Configuration and CI
- `webServer` in `playwright.config` to start the app, or `docker compose up` in CI.
- In CI: `retries: 2`, `trace: "on-first-retry"`, `screenshot: "only-on-failure"`, `video: "retain-on-failure"`.
- GitHub Actions: HTML report and traces uploaded as artifacts on failure, browsers cached, sharding (`--shard`) when the suite grows long.
- A `test:e2e` script in `package.json`, usable identically locally and in CI.

## After writing
Run the test at least twice to check it is stable (the `e2e-runner` subagent can do this), and make it fail on purpose once (by breaking the assertion) to check it actually tests something.
