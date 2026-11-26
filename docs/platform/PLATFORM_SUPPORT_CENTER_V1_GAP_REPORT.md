# Platform Support Center V1 — Gap report (Phase A)

**Date:** 2026-11-26  
**Repo:** `aipify-project/aipify-platform`  
**Branch:** `feat/platform-support-center-v1-20261126b`  
**Worktree:** `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b`

## Canonical ticket source

| Decision | Detail |
|----------|--------|
| SoT | `public.app_portal_support_requests` (+ audit logs) |
| Platform read | Prepared RPCs in `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` |
| Adapter / API | `lib/platform-portal/support-tickets-read-adapter.ts`, `/api/platform-portal/support-requests*` |
| Live? | **No** — `RPC_CONNECTED=false`, `FEATURE_GATE=false`; UI wired fail-closed (`UI_WIRED=true`) |

## Why “47 support requests resolved” appeared

Seeded demo KPI, **not** tickets:

1. `seed_phase7_pilot_data()` sets `usage_statistics.support_requests_handled = 47` for `AIP-000001`.
2. `get_since_last_login_engine` / `get_platform_dashboard_snapshot.support_resolved` surface that counter.
3. Legacy `PlatformSupportPanel` showed Since-last-login + snapshot counters beside an empty `list_platform_support_queue` (“Ingen supportsaker ennå”).

**Action in V1 UI:** those legacy KPIs are removed from `/platform/support`. Counts only from APP SoT counts RPC when activated.

## Must stay separate

- CSP sales email / CRM (`csp_sales_email_*`)
- Seller partner messages
- `organization_support_cases` / Support AI engine
- ASO / self-support engine tables
- VoC product feedback center
- Legacy `support_cases` / `list_platform_support_queue`

## Gaps closed in Phase A (code)

- Support Center UI with tabs: Alle saker, Mine saker, Svarmaler, Signatur, Kanaler
- Norwegian starter reply templates (10) + safe variable render
- Firm signature builder with official logo URL + HTML/text preview
- Honest channel activation status
- Email send disabled without provider gate
- SQL candidate for messages / signatures / templates / admin audit (not applied)

## Gaps remaining (owner Phase B/C)

| Gap | Status |
|-----|--------|
| Apply cross-tenant read RPCs | OWNER APPLY YES required |
| Flip `FEATURE_GATE` / `RPC_CONNECTED` | Separate activation job |
| Apply messages/signature/templates SQL | Hash `247f4635…f192` — owner apply |
| Outbound email (Resend/DNS/secrets) | Separate approval |
| Web / partner / Kompis intake | Not activated |
| Message thread RPCs | Follow-up after schema apply |
| Kunder horizontal hub consolidation | Avoided collision with Drift/Kunder parallel jobs; `/platform/support` kept as deeplink |

## Security notes

- Ticket reads remain role-gated via `_ppsf258_require_platform_access` after apply
- Candidate tables revoke `public`/`anon`/`authenticated` direct access
- No production SQL executed in this job
- No secrets introduced
