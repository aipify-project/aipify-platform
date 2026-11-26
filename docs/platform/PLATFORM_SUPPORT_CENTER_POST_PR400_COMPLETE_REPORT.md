# Support Center post-PR400 complete — short report

| Field | Value |
|-------|-------|
| REPO | `aipify-project/aipify-platform` |
| WORKTREE | `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b` |
| MAIN | `53a23a230486d740b198478ba55122e39f312f2b` (at branch start) |
| BRANCH | `feat/platform-support-center-v1-20261126b` |
| PR | https://github.com/aipify-project/aipify-platform/pull/400 |
| HEAD | *(this commit)* |
| MERGE SHA | — |
| PROD READY | **CODE_LIVE_CORE_PENDING** (not operational tickets) |

## Data sources

| Source | Role |
|--------|------|
| `app_portal_support_requests` | Canonical ticket SoT |
| `usage_statistics.support_requests_handled` | **Forbidden** as tickets (was “47”) |
| CSP `csp_sales_email_*` | **Separate** — never mixed |

## Delivery status

| Capability | Status |
|------------|--------|
| Platform saksliste / filtre / detalj | CODE_READY (reads CORE_BLOCKED until RPC apply) |
| Interne notater / status / tildeling / svar-API | CODE_READY / CORE_BLOCKED |
| Svarmaler create/edit/archive + 10 NO starters | CODE_READY (persist CORE_BLOCKED) |
| Firmasignatur + logo preview | CODE_READY / TESTED |
| Web intake `/contact/support` + API | CODE_READY / CORE_BLOCKED (mailto fallback kept) |
| CSP intake API | CODE_READY / CORE_BLOCKED |
| APP create (existing RPC) | LIVE for APP tenants; Platform unified write gated |
| E-post ut/inn | **OFF** |

## SQL (FULL SHA-256) — NOT_RUN

1. Read RPCs: `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql`  
   `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291`
2. Staging batch: `docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql`  
   `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95`

**Next owner action:** one Staging APPLY YES for both files in order — see `PLATFORM_SUPPORT_CENTER_STAGING_OWNER_DECISION_V1.md`.

## Tests

- GREEN: support-center, support-intake, read-adapter, cross-tenant contract (support assertions)
- UNRELATED: Website Kompis frozen 42/46 on base
- OWNER_AUTH_VISUAL_QA_PENDING
- Typecheck: `node_modules` absent in this worktree (tsx suites green)

## FINAL_STATUS

**CODE_LIVE_CORE_PENDING**
