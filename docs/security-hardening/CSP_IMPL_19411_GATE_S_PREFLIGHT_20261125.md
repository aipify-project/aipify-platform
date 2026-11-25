# CSP Implementation RPCs 19411 — Gate S (Staging) Preflight

**Date:** 2026-11-25
**Status:** PREFLIGHT ONLY — **this document and the job that produced it do NOT authorize apply.**
**Branch / PR:** `feat/csp-backend-portal-academy-integration` (PR #352)

> Nothing in this file applies, stages, or schedules SQL. Staging apply requires the explicit owner approval text in section 8, pasted verbatim in a separate instruction. Production is not part of this gate.

## 1. Migration under review

| Item | Value |
|---|---|
| Exact file path | `supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql` |
| Lines | 1435 |
| FULL SHA-256 | `edbac2b0bf9290a24206567ff53d32903f79b70246240a5a279d96d43cbf45ad` |
| SHA verified | Yes — `shasum -a 256` on the working tree on 2026-11-25 returned exactly the value above |
| Nature | Additive. Never edits the foundation migration `20261941000000_certified_sales_partner_core_v1.sql` |
| Header status | "REVIEW CANDIDATE ONLY — NOT applied to Staging. NOT applied to Production." |

Re-verify immediately before any approved apply:

```bash
shasum -a 256 supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql
# must print: edbac2b0bf9290a24206567ff53d32903f79b70246240a5a279d96d43cbf45ad
```

If the hash differs by even one character, **stop** — the approval below no longer covers the file.

## 2. Targets

| Environment | Project ref | In this gate? |
|---|---|---|
| Staging | `auedugihkduoaikfusqe` | **Only after explicit owner approval (section 8)** |
| Production | `qbcqoixhrvhnuwphefvw` | **NOT in this gate.** Separate Gate P, separate approval, after Staging verification |

## 3. Preconditions (all must hold before approval is requested as "ready")

1. Foundation `20261941000000` is applied on Staging and the ledger shows it exactly once (**ledger = 1**). Verify read-only:
   `select count(*) from supabase_migrations.schema_migrations where version = '20261941000000';` → `1`.
2. No row for `20261941100000` exists yet on Staging (ledger = 0), so the apply is a first apply.
3. Working tree SHA-256 matches section 1.
4. Foundation file `20261941000000_certified_sales_partner_core_v1.sql` is unmodified in the diff.
5. Review assumption from the file header: the migration/definer role bypasses RLS (Supabase `postgres` has `BYPASSRLS`). Foundation tables use `FORCE ROW LEVEL SECURITY` with no policies, so SECURITY DEFINER writes depend on it. Confirm on Staging before apply.
6. Platform admin helper `public.is_platform_admin()` exists on Staging (used by admin RPCs).
7. Staging organizations repair, if needed, is handled by its own prepared-only script and is **not** part of this gate.
8. Bank saves stay fail-closed in the app until the owner provisions `AIPIFY_CSP_BANK_ENCRYPTION_KEY` (32 bytes, hex or base64) in the Staging app environment. The key is **not** created, shown, or committed by this work. Without it the bank-profile API returns 503 and nothing is sent to Core.
9. Stripe live wiring stays disabled (`CSP_STRIPE_LIVE_WIRING_ENABLED = false`); no Stripe keys are involved in this migration.

## 4. What the migration does (summary)

- Re-asserts RLS lockdown on all 16 CSP tables (enabled + forced; all privileges revoked from `public`, `anon`, `authenticated`). No policies added — access is RPC-only.
- Widens partner status and attribution channel-origin CHECK constraints.
- Replaces the five fail-closed stub RPCs with real implementations.
- Adds the mutating and reading RPCs listed below.
- Idempotent, Platform-overridable **placeholder** product seed (`kompis_web`, `kompis_bedrift`, `aipify_voice`) — not live billing prices; unpublished academy course shell.
- Every RPC is `SECURITY DEFINER` with `set search_path = public`; failures return `jsonb {found:false, error:'<code>'}` and never partial-write; mutating RPCs write `csp_audit_events` (metadata only).
- Commission is a fixed amount snapshotted from the database; no RPC accepts an amount from a partner or webhook payload. One commission, earned after the 2nd paid period, no renewals.

## 5. Function list

Internal helpers (not callable by any API role):

| Function | Purpose |
|---|---|
| `_csp_is_service_role()` | Detects service-role caller |
| `_csp_audit(...)` | Writes a metadata-only audit event |

Public RPCs (EXECUTE revoked from `public`, `anon`, `authenticated`, `service_role`, then re-granted as shown):

| Function | Grant | Role in chain |
|---|---|---|
| `csp_get_backend_status()` | authenticated | Readiness probe (stub replaced) |
| `csp_get_partner_overview()` | authenticated | Partner dashboard (stub replaced) |
| `csp_get_platform_overview()` | authenticated (platform admin check inside) | Platform overview (stub replaced) |
| `csp_list_qualified_sales()` | authenticated | Sales list (stub replaced) |
| `csp_list_monthly_settlements()` | authenticated | Settlement list (stub replaced) |
| `csp_register_partner_application(jsonb)` | authenticated | Applicant registration |
| `csp_set_partner_status(uuid, text, text)` | authenticated (platform admin check inside; reason 3–500 chars required) | Approve / reject / suspend |
| `csp_upsert_sales_product(jsonb)` | authenticated (platform admin) | Product + fixed commission |
| `csp_create_attribution_link(uuid, text)` | authenticated | Sales link (gated on approval, certification, publication, agreement) |
| `csp_get_academy_answer_key(uuid)` | authenticated | Server-side answer key |
| `csp_record_academy_attempt(uuid, numeric, boolean, jsonb)` | authenticated | Exam attempt result |
| `csp_get_partner_bank_profile()` | authenticated | Masked bank profile read |
| `csp_save_partner_bank_profile(jsonb, text)` | authenticated | Accepts only an encrypted envelope + fingerprint; rejects plaintext bank fields |
| `csp_apply_paid_period_event(jsonb)` | authenticated, service_role | Verified paid-period event (earn once on 2nd period; duplicate-safe; refund → reversal review flag) |
| `csp_transition_settlement(uuid, text, text, timestamptz, text)` | authenticated (platform admin) | open → approved → closed → paid / voided, with evidence |

Total: 15 public RPCs + 2 internal helpers.

## 6. App-side readiness (already on the branch, no SQL)

- `lib/certified-sales-partner/bank-crypto.ts` — AES-256-GCM, fail-closed without `AIPIFY_CSP_BANK_ENCRYPTION_KEY`.
- `app/api/certified-sales-partner/bank-profile/route.ts` — encrypts before the RPC call, sends `p_encrypted_payload` (envelope) + `p_fingerprint` matching `csp_save_partner_bank_profile(jsonb, text)`; returns 503 when encryption is unavailable.
- `lib/certified-sales-partner/integration-fixture.ts` — deterministic offline commercial-chain simulation. **Not** proof of a live system.
- Platform sellers action panel uses business labels and fail-closed messaging.

## 7. Post-apply verification checklist (only if the owner later approves and apply is performed)

1. Ledger shows `20261941100000` exactly once.
2. `csp_get_backend_status()` reports ready for an authenticated caller.
3. All 15 public functions exist with the grants in section 5; helpers are not executable by API roles.
4. Tables still `relrowsecurity` and `relforcerowsecurity`, with no privileges for `anon` / `authenticated`.
5. Smoke: unauthenticated and non-admin calls to admin RPCs return `{found:false}` with an error code and write nothing.
6. No data rows other than the placeholder seed were created.
7. Record the result; Production remains untouched pending Gate P.

## 8. Exact owner approval text (template)

The owner pastes this verbatim, with the bracketed fields completed. Anything else is **not** approval.

```text
I, [OWNER NAME], approve Gate S for CSP implementation RPCs.
Apply ONLY this file to Staging project auedugihkduoaikfusqe:
supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql
FULL SHA-256: edbac2b0bf9290a24206567ff53d32903f79b70246240a5a279d96d43cbf45ad
Foundation 20261941000000 is already applied on Staging (ledger = 1) and must stay untouched.
Do NOT apply to Production (qbcqoixhrvhnuwphefvw).
Stop and report if the SHA-256 differs, if any precondition fails, or if any statement errors.
Approved at: [DATE/TIME, TIMEZONE]
```

## 9. Explicit non-authorization

- This job **does not authorize apply** to Staging or Production.
- No SQL was executed, no migration ledger was touched, no environment variable or secret was created, and no Stripe or bank key was invented.
- Production (`qbcqoixhrvhnuwphefvw`) is out of scope until a separate Gate P is approved after Staging verification.
- Website Kompis Public Chain files are untouched.
