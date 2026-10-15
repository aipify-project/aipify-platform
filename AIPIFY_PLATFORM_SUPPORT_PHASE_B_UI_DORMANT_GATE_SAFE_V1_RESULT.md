# AIPIFY — PLATFORM SUPPORT PHASE B UI DORMANT GATE SAFE V1 — RESULT

**Date:** 2026-10-15  
**Job:** `AIPIFY_PLATFORM_SUPPORT_PHASE_B_UI_DORMANT_GATE_SAFE_V1`  
**Feature owner:** PLATFORM ADMIN  
**Base:** `origin/main` @ `be213df2`  
**Branch:** `feat/platform-support-phase-b-ui-dormant-gate-safe-v1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/238  
**Feature tip:** `cb61040b`

## Verdict

**PARTIAL — WAITING_FOR_AUTHENTICATED_VISUAL_QA** — dormant Support workspace UI + label cleanup on PR #238 with gates **OFF**.  
CI / Vercel preview **green**. Authenticated desktop/mobile QA **blocked** at Platform login (no operator session in agent).  
**Do not claim LIVE Support inbox.** Merge deferred until owner completes visual QA.  
**No Production SQL apply. No live APP ticket binding. No Customer APP design changes.**

## What shipped

| Artifact | Role |
|----------|------|
| `PlatformSupportInboxDormantPanel` | Full-width lavender shell, 4 channel tabs, disabled filters/search, unavailable status cards, detail scaffold (original / NO translation / notes / approve-before-send) |
| `support-inbox-ui-contract.ts` | Documents missing contracts; asserts dormant |
| `support-inbox-labels.ts` | Label builder |
| `/platform/support` page | Composes dormant shell + embedded legacy queue |
| Locale keys `platform.supportInbox.*` | **en/no/sv/da/pl/uk/es** |
| Legacy label cleanup | Empty + counters + since-login / briefing copy no longer imply APP SoT or “since login” ticket volume |

## Gates (unchanged OFF)

- `PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED = false`
- `PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE = false`
- `PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED = false`
- SQL `docs/platform/NOT_APPLIED_…sql` SHA `63ed974a…134291` **NOT_APPLIED**

## Channel honesty

| Tab | Status |
|-----|--------|
| Aipify website | NOT_LINKED |
| Kompis Web | NOT_LINKED |
| Kompis Bedrift | LINKED_SOT (when activated) |
| Selgere | NOT_LINKED |

## Tests

| Gate | Status |
|------|--------|
| `support-inbox-ui-contract.test.ts` | **PASS** |
| Prior read-adapter / SQL contract tests | **PASS** |
| Website Kompis frozen | **46/46** |
| Authenticated visual QA desktop/mobile | **BLOCKED** — preview redirects to `/login?next=/platform/support` |
| CI / Vercel (aipify, aipify-platform, iz5z) | **PASS** |
| Preview deployment | `dpl_HW98KUd8v2wVTczh8Z3kNHkYih1W` (`aipify-platform`) |

## LIVE / NOT LIVE

| Surface | State |
|---------|-------|
| Dormant Support workspace chrome on `/platform/support` | **NOT LIVE on main** (open on PR #238 preview only) |
| APP ticket list/detail/counts | **NOT LIVE** |
| Legacy queue | Still present in branch, clearly labelled |
| Production SQL | **NOT_APPLIED** |

## Next (separate jobs)

1. Named YES → Core SQL apply (`AIPIFY_PLATFORM_SUPPORT_APP_SOT_READ_RPC_APPLY_V1`)  
2. Feature gate + UI wire job after apply verification  
3. Ingest for public site / Kompis Web / Selgere  
4. Locale column + translation/reply send with human approval  
