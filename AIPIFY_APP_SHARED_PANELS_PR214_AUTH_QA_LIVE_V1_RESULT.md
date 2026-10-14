# AIPIFY — APP Shared Panels PR #214 — Authenticated QA & Controlled LIVE V1

**Date:** 2026-10-14  
**Job:** Continuation / verification of PR #214 only  
**Verdict:** **PARTIAL — STOP before LIVE** (authenticated APP QA NOT RUN)

## Isolation / state

| Item | Value |
| --- | --- |
| Worktree | `/Users/veltrix/Development/aipify-app-shared-panels-i18n-links-width-polish-v1` |
| Branch | `feat/app-shared-panels-i18n-links-width-polish-v1` |
| Reviewed head | `82734c39` (matches `origin` / PR head) |
| `origin/main` | `34a7774e` (PR still open; not merged) |
| Stash `step-b-wip-blocked-not-for-merge` | Preserved |
| PR #215 D2B | Untouched (`d0b6249b` on its worktree) |
| Website Kompis frozen chain | **46/46 PASS** |

Note: worktrees had briefly swapped branch checkouts during prior recovery; restored before QA — polish path again at `82734c39`.

## PR #214 state

| Field | Value |
| --- | --- |
| URL | https://github.com/aipify-project/aipify-platform/pull/214 |
| State | **OPEN** |
| Head | `82734c3919411b7adac0c87e3938bc8f1aec4c84` |
| Merge SHA | none |
| Files / +/- | 30 files · +1135 / −314 |
| Vercel – aipify | **pass** (Ready) |
| Vercel – aipify-platform | **pass** (Ready) |
| Vercel – aipify-platform-iz5z | **pass** (Ready) |

### Preview (verified READY for head-era deploy)

| Project | Preview |
| --- | --- |
| aipify-platform | https://aipify-platform-itcevxay2-unonight-platform-s-projects.vercel.app |
| aipify-platform-iz5z | https://aipify-platform-iz5z-6fj79kxjj-unonight-platform-s-projects.vercel.app |
| aipify | https://aipify-ch69rprug-unonight-platform-s-projects.vercel.app |

Production LIVE deploy ID / canonical `app.aipify.ai` SHA: **not verified** (no merge).

## Automated gates

| Gate | Result |
| --- | --- |
| `npx tsx lib/app/shared-panels-i18n-links-width-polish.test.ts` | **PASS** |
| `npx tsx lib/app-portal/software-catalog/software-catalog.test.ts` | **PASS** (10/10) |
| Static: license back → `/app/command-center` | **PASS** |
| Static: billing → `/app/account/subscription` | **PASS** |
| Static: no `max-w-3xl` / `max-w-4xl` on license/integrations panels | **PASS** |
| Locale parity license + shell workspace + modules retry + companionBriefing (7 locales) | **PASS** (sampled) |
| Frozen Website Kompis 46/46 | **PASS** |
| `npm run typecheck` / `build` | **NOT RUN** (no local `tsc` / resource conservation) |
| CI beyond Vercel project Ready | Vercel Ready **PASS**; no separate GitHub Actions suite observed on PR |

## Authenticated browser QA

| Check | Result | Evidence |
| --- | --- | --- |
| Vercel Deployment Protection bypass | **PASS** (share link) | Landing homepage loaded on preview |
| `/app/license` unauthenticated | Redirects to `/login?next=%2Fapp%2Flicense` | Observed 2026-10-14 |
| Authenticated session (UnoNight Web or other entitled account) | **NOT RUN** | No legitimate credentials / session available to agent |
| `/app/license` links, i18n, width (auth) | **NOT RUN** | Blocked by login |
| `/app/account/integrations` width (auth) | **NOT RUN** | Blocked by login |
| `/app/kompis-bedrift/{communications,meetings,employees,modules}` | **NOT RUN / BLOCKED** for Bedrift assertion | No entitled Bedrift test tenant; UnoNight must not be used to assert Bedrift UI |
| UnoNight Web-only isolation sample | **NOT RUN** | Requires owner session |
| Language switch + refresh in APP | **NOT RUN** | Requires owner session |
| Desktop + narrow viewport in APP | **NOT RUN** | Requires owner session |

Per contract: **do not claim PASS for QA not executed**; **STOP before LIVE**.

### Known Step B (excluded — not greenwashed)

UnoNight Bedrift nav showing active/Klar despite missing entitlement remains deferred to Step B. Not fixed and not asserted as OK.

## Merge / LIVE decision

| Action | Status |
| --- | --- |
| Merge PR #214 | **STOPPED** — authenticated runtime QA NOT RUN |
| Production LIVE | **not claimed** |
| Owner preauthorization for auto LIVE | Not applied (gate B failed open as NOT RUN) |

## Owner checklist (reproducible)

Use Preview `aipify-platform-itcevxay2-…` (or Production after intentional merge) with a **legitimate** APP session:

1. **Web / common (UnoNight OK for Web-only):**  
   - `/app/license` — NO: “Tilbake til kontrollsenteret” → `/app/command-center`; billing → `/app/account/subscription`; sections not English; sidebar “Arbeidsområde:”.  
   - Switch locale to en/sv/da/pl/uk/es; refresh; confirm license + workspace labels.  
   - `/app/account/integrations` — content uses full APP width (not narrow 4xl).  
   - Viewports 375 / 768 / 1440 — no overflow / clipped CTAs.
2. **Modules (settings/modules or entitled surface):** friendly names; retry/loadError localized; no raw `snake_case` titles.
3. **Bedrift routes:** only if a **legitimately entitled** Bedrift tenant exists — otherwise leave **BLOCKED**. Do **not** use UnoNight to assert Bedrift, and do **not** create an internal demo tenant in this job.
4. After auth QA green: merge #214 at exact head `82734c39` (re-verify head/diff unchanged), confirm Production deploy SHA, then mark LIVE.

## Explicit non-claims

- No LIVE Production verification  
- No merge performed  
- No SQL / secrets / entitlements / customer create  
- No D2B (#215) changes  
- No public demo-tenant connection  
- No Bedrift grant to UnoNight
