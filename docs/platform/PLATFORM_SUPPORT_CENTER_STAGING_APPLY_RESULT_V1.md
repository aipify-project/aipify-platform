# Platform Support Center — Staging apply result V1

**Status:** `STAGING_SQL_APPLIED_VERIFIED_GREEN`  
**Target:** `aipify-core-staging` / `auedugihkduoaikfusqe`  
**When (UTC):** 2026-11-26T20:57Z  
**Worktree:** `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b`  
**Branch / HEAD:** `feat/platform-support-center-v1-20261126b` @ `6e19fc0e63a36fb35c4c4c2d99b3083ab425b9d9`

## Scope (owner YES)

Applied **once each**, in order, Staging only:

| # | File | SHA-256 | `apply_migration` | Result |
|---|------|---------|-------------------|--------|
| 1 | `docs/platform/sql-candidates/platform_support_center_staging_foundation_minimal_v1.sql` | `ab258cff0dc1a77cc0ae7e998bc38d2b20c1e523c9c5a9a2499ff7ccf69ba891` | `platform_support_center_staging_foundation_minimal_v1` | success |
| 2 | `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql` | `63ed974a50229e828b34e0eb99be00080a8b84b48258414f64ce802039134291` | `platform_support_tickets_cross_tenant_read_rpc_v1` | success |
| 3 | `docs/platform/sql-candidates/platform_support_center_staging_batch_v1.sql` | `96991c0cccce9ad23f7d6f4696b888aba9a13b4f37ee13e52652bbf715501c95` | `platform_support_center_staging_batch_v1` | success |

**Not applied (explicit):**  
`docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql`  
SHA-256 `247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192`

**Not touched:** Production (`qbcqoixhrvhnuwphefvw`), CRM/Sales Email schema, secrets, DNS, e-postaktivering, code-gate flips (`RPC_CONNECTED` / feature gates).

## Preflight (before apply)

- Repo/worktree and file SHAs matched owner YES.
- Prerequisites for foundation were missing as expected; after step 1: `companies`, `users`, `app_portal_support_requests`, audit logs, `_ppsf258_require_platform_access`, `platform_admins.status` present.
- No executable CSP references in the three approved candidates.

## Verify harness

Object presence: companies, users, tickets, audit_logs, messages, signatures, templates, admin_audit, guest_contacts — **all present**.

| Check | Result |
|-------|--------|
| Support RPC `anon` EXECUTE | **false** (all listed RPCs) |
| Support RPC `authenticated` EXECUTE | **true** |
| Direct table grants to `anon` / `authenticated` / `PUBLIC` on Support tables | **0** |

## Functional tests (disposable fixtures)

Harness: ephemeral `public._psc_staging_verify_v1()` (create → run → drop). JWT simulated via `request.jwt.claim.sub` / `request.jwt.claims`.

| Test | OK |
|------|----|
| `deny_non_admin_list` → `Platform portal access denied` | true |
| `isolation_company_a_filter` (ticket A only) | true |
| `isolation_company_b_filter` (ticket B only) | true |
| `status_transition` open → in_progress | true |
| `internal_note` (`delivery_status=not_applicable`) | true |
| `external_reply_draft_blocked` (`blocked_unconfigured`) | true |
| `no_email_send` (no queued/sent) | true |
| `signature_template_persist` | true |
| `fixture_cleanup` | true |
| `csp_unchanged` (pp=10, em=0, cl=4, sm=0 before=after) | true |

**Overall:** `ok: true`

## Post-cleanup residue

| Metric | Value |
|--------|-------|
| Leftover PSC Verify companies / tickets / auth / templates / signatures | 0 |
| `platform_admins` | 0 |
| Support tickets / messages totals | 0 / 0 |
| Disposable harness function | dropped |

## Email / CRM

- External reply drafts stored as **`blocked_unconfigured`** only — **no provider send**.
- CSP counts unchanged; no Sales Email CRM mutations.

## Next ports (separate owner YES required)

1. **Code-gate flips** — `RPC_CONNECTED` / feature gates for read + intake/write (app deploy).
2. **E-post OFF→ON** — Resend/DNS/secrets (not part of this SQL session).
3. **Production SQL** — same three SHAs, new named Production approval after Staging QA sign-off.
