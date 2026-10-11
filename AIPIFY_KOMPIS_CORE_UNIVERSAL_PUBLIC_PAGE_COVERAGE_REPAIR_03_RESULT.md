# AIPIFY.KOMPIS.CORE.UNIVERSAL.PUBLIC.PAGE.COVERAGE.REPAIR.03 — Result

Date: 2026-10-11

## Root cause

| Layer | File | Issue |
|-------|------|-------|
| Host #646 | `src/lib/website-kompis/path.ts` | Public coverage decided by UnoNight `HIDDEN_PUBLIC_PREFIXES` (login/register exceptions). Not universal. |
| Host | `WebsiteKompisFrontpageEmbed.tsx` | Mount/tear-down owned path whitelist; Core never saw access class. |
| Core loader | `public/embed/website-kompis.js` | Always showed widget when script loaded; `PRIVATE_PATH_PREFIXES` only gated pageContext, not surface availability. |

## Why the rule is universal now

Core owns activation via `lib/marketing/website-kompis-public-surface-contract.ts` and loader lifecycle (`aipify.websiteKompis.surface` + `data-aipify-kompis-access`). Hosts publish `public` \| `private` \| `unknown` from **their** existing access boundary. Core does not whitelist customer routes, domains, or products. A new public page needs no Core code change if the host marks it `public`.

Integration note: `docs/integrations/website-kompis-public-surface-contract.md`.

Honest limit: Core cannot remount onto pages that never load the loader integration.

## Exact files

### Core
- `lib/marketing/website-kompis-public-surface-contract.ts` (+ test)
- `public/embed/website-kompis.js`
- `lib/marketing/website-kompis-embed.ts` / `.test.ts`
- `components/embed/WebsiteKompisEmbedWidget.tsx`
- `docs/integrations/website-kompis-public-surface-contract.md`
- this result file

### Host (minimal adapter — no login/register special-case)
- `src/lib/website-kompis/access-adapter.ts` (NEW)
- `src/lib/website-kompis/path.ts` (drop HIDDEN list; admin/member only)
- `src/components/website-kompis/WebsiteKompisFrontpageEmbed.tsx` (publish access; keep one loader)
- `src/lib/website-kompis/index.ts`
- `src/lib/website-kompis/website-kompis.contract.test.ts`

## Test / browser matrix

| # | Case | Evidence |
|---|------|----------|
| 1 | Direct public pages incl. login/register + unknown public route | Host contract + Core surface tests (two tenant shapes) |
| 2 | Soft nav / back-forward; one widget | Loader keeps single iframe; access MutationObserver |
| 3 | Logged-in visitor on public page | Access from path boundary, not session |
| 4 | Member/admin private | `private` → inactive, no pageContext |
| 5 | Public→private→public + clear context | `transitionWebsiteKompisPublicSurface` + surface message clears widget context |
| 6 | Kill switch / invalid install | Host enabled gate + Core invalid install reasons |
| 7 | Forms/passwords never in context | SKIP_ANCESTOR unchanged |
| 8 | Desktop/mobile size | REPAIR.02 420×720 / clamp preserved |

Preview browser-QA: code-level contract verified; Production smoke after deploy is separate from code LIVE.

## Deploy

(filled after merge)

| Surface | PR | Merge SHA | Production |
|--------|----|-----------|------------|
| Core | TBD | TBD | TBD |
| Host | TBD | TBD | TBD |

Deploy order: Core first, then Host.

## Out of scope

SQL, secrets, providers, authenticated workspace, shop #9, ingest.
