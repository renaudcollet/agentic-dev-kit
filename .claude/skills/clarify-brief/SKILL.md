---
name: clarify-brief
description: Turns a client or agency brief, or a vague feature request, into a clarified brief before any code is written - one question at a time, a recommended answer for each, and a list of questions to forward to the client. Run with /clarify-brief.
disable-model-invocation: true
---

# Clarify a brief

Goal: before planning or coding, resolve every decision that changes the architecture, the estimate or the acceptance of the work. The output is a clarified brief the developer can estimate from, and a ready-to-send list of questions for the client.

Inspired by the "grilling" approach of Matt Pocock's skills (MIT), adapted to agency and freelance work.

Do not write code during this skill.

## 1. Gather (ask nothing yet)
- Read every source given: pasted text, files (PDF, docx, emails), mockup links, the existing codebase if there is one, its `CLAUDE.md` and `docs/`.
- Whatever the sources answer, do not ask. Note the source of each fact.
- Identify the type of project: website or web app, interactive experience or game, real-time 3D, WebAR, DOOH screen, phygital installation, e-commerce. The type decides which branches below matter.

## 2. Map the open decisions
Go through these branches and keep only those that are unresolved and matter for this project:
- **Goal**: what the client wants to achieve, how success is measured, who validates.
- **Audience and context of use**: devices (mobile share, low-end Android, kiosk, specific screen), browsers, network (offline venue, event Wi-Fi), duration and frequency of use.
- **Scope**: features in and explicitly out, V1 versus later, number of pages, screens or levels.
- **Content**: who provides texts, images, 3D models, videos, translations, and when; formats and quality of 3D assets (poly count, textures); rights and licences (fonts, music, photos).
- **Languages**: content languages, i18n, right-to-left.
- **Technical constraints**: imposed stack, hosting, CMS or back office, third-party services and their accounts (WebAR platform, analytics, CRM, payment), domain, who owns the accounts.
- **Data and legal**: personal data collected, consent and cookies (GDPR), game rules or contest terms, age restrictions.
- **Quality targets**: accessibility level (RGAA / WCAG AA or a stated exception, see the `accessibility` skill), performance budget and target devices (see `performance-memory`), supported screen sizes (see `responsive`).
- **Installation or event** (DOOH, phygital): hardware, screen resolution and orientation, sensors, kiosk mode, recovery after a crash or power cut, on-site support.
- **Delivery**: milestones, deadline and what it depends on, review rounds, acceptance criteria, deliverables (source code, repository access, documentation), maintenance after launch.

Order the open decisions: first those that block the architecture or move the estimate most, then the rest. Dependent decisions come after the one they depend on.

## 3. Ask, one question at a time
For each question:
- State the question in one or two sentences, in the developer's language.
- Give a **recommended answer** and why, based on the brief, the project type and common practice. Offer two or three options when the choice is real.
- If the codebase or sources can answer it, look instead of asking.
- Accept three kinds of answer: a decision, "assumption" (the developer decides provisionally, to confirm with the client), or "ask the client" (goes to the client list, with the recommended answer as a proposal).

Rules:
- One question per message. Use AskUserQuestion when available.
- Do not ask what has no impact on architecture, estimate or acceptance. Cosmetic details wait for the mockups.
- Follow the branches a decision opens; drop those it closes.
- When an answer contradicts the brief or an earlier answer, point it out and settle it.
- Stop when no open decision would change the architecture or the estimate. Say how many questions remain if the developer wants to stop earlier, and list them as open.

## 4. Write the clarified brief
Ask where to save it if the project has no `docs/` folder; default `docs/brief.md`. Structure:

```markdown
# <Project> - clarified brief (<date>)

## Summary
3 to 5 lines: what is built, for whom, by when.

## Decisions
| Topic | Decision | Source |
(Source: brief, client email of <date>, developer, codebase)

## Assumptions to confirm
Provisional decisions taken by the developer.

## Questions for the client
Numbered, short, each with the proposed answer, written in the client's language and ready to paste in an email. Most blocking first.

## Out of scope
What is explicitly excluded, to protect the estimate.

## Risks
Technical or planning risks, each with its impact and a mitigation.

## Impact on the estimate
The items that weigh most on the workload or remain uncertain. No day count unless asked.
```

## General rules
- Never invent a fact about the client, the budget or the deadline: an unknown is a question or an assumption, labelled as such.
- The brief and its answers may be confidential: do not commit them without approval, and on an agency or client repository ask whether `docs/brief.md` belongs in it at all.
- The clarified brief is the reference for the rest of the project: when a later answer from the client changes a decision, update the file and its date.
