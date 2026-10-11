# AIPIFY.KOMPIS.CORE.PREVIEW.TO.LIVE.01 — RESULT

Date: 2026-10-11  
Scope: Core only. No Host mutation. No SQL APPLY. No feedback activation. No reuse. No Image-5 purple.

## Verdict

All agreed Kompis Core jobs (#109 / #110 / #112 / #113) are already merged on `origin/main` and already LIVE on canonical Core Production. No re-merge and no new Production deploy were started.

| Task | PR | Tested / feature head | Merge SHA | Main ancestry | Production | Status |
| --- | --- | --- | --- | --- | --- | --- |
| REPAIR.02 FAQ / pageContext / answer relevance | [#109](https://github.com/aipify-project/aipify-platform/pull/109) | `5c9a8364` | `6529f83a` | yes | READY under current Production head | **ALREADY LIVE** |
| REPAIR.03 universal public surface coverage | [#110](https://github.com/aipify-project/aipify-platform/pull/110) | `ee740f06` | `79d34c20` | yes | READY under current Production head | **ALREADY LIVE** |
| ANSWER.FEEDBACK.COPY.V1 | [#112](https://github.com/aipify-project/aipify-platform/pull/112) | `87b67c5c` | `a443fc13` | yes | READY under current Production head | **ALREADY LIVE** (votes fail-closed until SQL) |
| POLISH.01 cold-load / height / contact / new chat | [#113](https://github.com/aipify-project/aipify-platform/pull/113) | `b755702e` | `a9a79ab7` | yes | READY under current Production head | **ALREADY LIVE** |
| Image-5 purple recolor | — | — | — | — | — | **BLOCKED** (screenshot unavailable; out of this delivery) |
| SQL `20261937900000_website_kompis_answer_feedback_v1.sql` | — | proposal SHA256 `81f347c1…9490` | — | file on main | not applied | **BLOCKED** (no apply authorization) |

No unrelated open Preview / PR #80 / Host / SQL work was taken LIVE.

## Production evidence

`origin/main` HEAD = `04a86e9bf21a39bc8c13c0ba00b1564740882e26` (`docs(website-kompis): record polish.01 merge SHAs`). Local workspace matches `origin/main`.

| Project | Deployment | Source SHA | State | Canonical aliases |
| --- | --- | --- | --- | --- |
| `aipify-platform` (canonical Core) | `dpl_2dxgjioS92T4fGgc8x5hbNd9FyRP` (`aipify-platform-exnbedktl-…`) | `04a86e9b` / `main` | ● Ready | `https://app.aipify.ai`, `https://aipify-platform.vercel.app` |
| `aipify` (linked same repo/main) | `dpl_3p5EUqSkT7FL1fKJmvvwSSVfrd2y` (`aipify-8npdme4kc-…`) | `04a86e9b` / `main` | ● Ready | `https://aipify.vercel.app` |

Prior merge SHAs also have Ready Production history on both projects (`a9a79ab7`, `a443fc13`, `79d34c20`, `6529f83a`). Current alias traffic points at `04a86e9b`, which contains all of them.

### LIVE loader asset check (write-free)

Fetched `GET /embed/website-kompis.js` from:

- `https://app.aipify.ai/embed/website-kompis.js` → HTTP 200
- `https://aipify.vercel.app/embed/website-kompis.js` → HTTP 200

Both match local `public/embed/website-kompis.js` SHA256:

`6e686b069ce7b2d990534348048818c4397b6f3365437b1ad06be323871ab6c1`

Markers present LIVE:

- `OPEN_HEIGHT = 800`, `OPEN_HEIGHT_MAX = 900`, `OPEN_HEIGHT_MIN = 560`
- `markShellReady()` opacity gate
- `aipify.websiteKompis.surface` public-surface contract message

Team project alias `aipify-unonight-platform-s-projects.vercel.app` is SSO-protected (302 to Vercel SSO) — Preview/SSO browser QA is **not PASS**.

## QA performed

### Local (same head as Production: `04a86e9b`)

All passed:

- `lib/marketing/website-kompis-embed.test.ts`
- `lib/marketing/website-kompis-public-surface-contract.test.ts`
- `lib/marketing/website-kompis-answer-feedback.test.ts`
- `lib/marketing/website-kompis-public-contact.test.ts`
- `lib/marketing/website-kompis-context-faq-answer-repair-02.test.ts`
- `lib/marketing/website-kompis-visitor-tone.test.ts`
- `lib/website-kompis-feedback/labels.test.ts`

These prove contract/lifecycle behavior on the exact LIVE source SHA: closed cold-load gate, open height 800/max 900, contact URL safety, surface public/private transition, feedback fail-closed + reuse OFF, copy path present.

### Preview SSO browser QA

Not completed. Deployment protection / SSO blocks unauthenticated Preview UI. Documented as blocked, not PASS.

### Not claimed / not run

- Real Production provider ask
- Stored feedback writes
- Host-side customer cache purge / install remount
- Image-5 purple visual match

Customer Host may still serve a cached older loader until their install fetches Core again; this job did not mutate Host.

## Confirmations

- SQL `20261937900000` **NOT APPLIED**
- Feedback votes remain **gated / fail-closed** until schema + `answerId`
- Answer reuse **OFF** (`websiteKompisAnswerReuseEnabled() === false`)
- No Host / UnoNight changes in this job
- No new merge, cherry-pick, rollback, secrets, providers, ingest, or Production loadtest
- No SHIPPED LIVE row — already LIVE; verification only

## Remaining outside this delivery

1. Authorize SQL APPLY for feedback persistence, then verify votes + overview.
2. Provide Image-5 screenshot/element name for purple recolor.
3. Optional Host-side smoke that the customer install points at `app.aipify.ai` loader (cache/CDN on customer origin is Host concern).
