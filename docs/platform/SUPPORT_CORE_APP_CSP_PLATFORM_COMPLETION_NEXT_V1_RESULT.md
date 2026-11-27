# Support Core APP/CSP/Platform completion — CODE-ONLY result

**Job:** `AIPIFY_SUPPORT_CORE_APP_CSP_PLATFORM_COMPLETION_NEXT_V1_20261127`  
**Date:** 2026-11-27  
**Branch:** `fix/support-core-app-csp-platform-completion-next-v1-20261127`  
**Base:** `origin/main` @ `f1f370e28` (PR #423 lineage)

## LIVE vs CORE_BLOCKED (ledger-verified)

| Surface | Status | Notes |
|---------|--------|-------|
| APP create (Production Core) | **LIVE** | `create_app_portal_support_request`; SoT `app_portal_support_requests` (4 tickets observed on Production) |
| APP create (Staging Core) | **MISSING RPCs** | Table exists; customer create/list RPCs not present on Staging |
| Platform Admin read/write | **LIVE when URL-bound** | Staging+Production RPCs/tables present; gates via `resolveSupportCenterLiveGates` |
| CSP Kontakt Aipify | **CORE_BLOCKED** | Honest warning + mailto/messages; no purple fake-ready submit |
| Public `/contact/support` | **CORE_BLOCKED** | 503/gate → blocked panel, not success |
| Unified intake create RPCs | **NOT_APPLIED / not implemented** | Placeholder SHA `e987d820…` only |
| Email SEND | **OFF** | |

## SQL A/B

**Already APPLIED** on Staging and Production — see owner gate doc. **Do not re-apply.**

## CODE-ONLY in this job

- `lib/support-intake/categories.ts` — shared categories + priority mappers
- CSP contact: categories, priority, session name/email display, no disabled primary CTA while blocked
- Softened locales (en/no/sv/da/pl/uk/es)
- Web intake: blocked ≠ done on 503
- `APP_PORTAL_SUPPORT_CREATE_LIVE` honesty constant
- Tests: gates closed for intake; SQL A/B SHA pins; category maps

## Invoice / module fields

`app_portal_support_requests` has `related_module` (used by APP create) but **no invoice column**. Invoice storage requires a new migration candidate before claiming invoice context on tickets.

## Tests run

`./node_modules/.bin/tsx lib/support-intake/support-intake.test.ts` → ok

## Next exact owner action

`docs/platform/SUPPORT_CORE_APP_CSP_PLATFORM_COMPLETION_NEXT_V1_OWNER_STAGING_GATE.md` — browser QA **or** new intake RPC implementation job (not A/B re-apply).
