# CSP Implementation RPCs V1 — REVIEW CANDIDATE ONLY

**Date:** 2026-11-25
**Branch:** `feat/csp-backend-portal-academy-integration`
**Status:** REVIEW CANDIDATE ONLY — **do NOT apply** to Staging or Production without a named owner Gate S/P approval citing this file and the SHA below.

## Artifact

| Field | Value |
|---|---|
| File | `supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql` |
| SHA-256 | `edbac2b0bf9290a24206567ff53d32903f79b70246240a5a279d96d43cbf45ad` |
| Verified with | `shasum -a 256` |
| Parse check | `pglast` parsed all 55 statements; 17 `CREATE FUNCTION` bodies accepted (syntax only — **not executed against a database**) |

If the file changes by even one byte, this SHA and any approval referencing it are void.

## Prerequisite — foundation must be applied first

Foundation `supabase/migrations/20261941000000_certified_sales_partner_core_v1.sql`
(SHA-256 `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95`) **must already be applied and verified** (`to_regclass('public.csp_partner_profiles')` not null) before this file runs. This migration is additive, does not edit the foundation file, and will fail at the first `ALTER` if the tables are absent. As of the last preflight, foundation is not applied in Staging or Production (see `CSP_SQL_202619410_GATE_SP_PREFLIGHT.md`).

## What the migration changes

1. **Partner status CHECK** widened to: `registered, under_review, needs_information, approved, rejected, suspended, terminated, applied, in_academy, certified, active`.
2. **Channel origin CHECK** widened to: `facebook, instagram, x, snapchat, tiktok, linkedin, email, qr, other, referral_link, partner_code, manual_platform_assignment` plus foundation values `partner_registered_customer, event`.
3. Five stub RPCs replaced with real implementations.
4. Ten RPCs added; two internal helpers added (not callable by any API role).
5. One additive partial index on `csp_audit_events` for paid-event idempotency lookups.
6. Idempotent placeholder seed (see below).

## Function list

Replaced (same signatures as foundation):

| Function | Access |
|---|---|
| `csp_get_backend_status()` | authenticated → `{found:true, ready:true, version:'csp_impl_v1'}` |
| `csp_get_partner_overview()` | authenticated partner (`auth.uid()`) |
| `csp_get_platform_overview()` | `is_platform_admin()` |
| `csp_list_qualified_sales()` | partner: own (customer org omitted); platform admin: all |
| `csp_list_monthly_settlements()` | partner: own; platform admin: all |

Added:

| Function | Access | Notes |
|---|---|---|
| `csp_register_partner_application(p_payload jsonb)` | authenticated | Always `under_review`; never auto-approved; resubmission never changes status |
| `csp_set_partner_status(p_partner_id uuid, p_status text, p_reason text)` | platform admin | Reason required; `terminated` is final; suspended/terminated/rejected deactivate links |
| `csp_upsert_sales_product(p_payload jsonb)` | platform admin | Fixed commission; new rate version row only when amount/currency changes |
| `csp_create_attribution_link(p_product_id uuid, p_channel text)` | partner | Requires approved/active/certified + published product + passed certification; `manual_platform_assignment` not self-issuable |
| `csp_get_academy_answer_key(p_course_id uuid)` | partner | Published course only; each read audited |
| `csp_record_academy_attempt(p_course_id uuid, p_score_pct numeric, p_passed boolean, p_answers jsonb)` | partner | Score **recomputed in SQL**; certification upserted only if passed and partner approved/active/certified |
| `csp_get_partner_bank_profile()` | partner | Masked only |
| `csp_save_partner_bank_profile(p_encrypted_payload jsonb, p_fingerprint text)` | partner | Rejects plaintext bank field names; requires encrypted envelope |
| `csp_apply_paid_period_event(p_payload jsonb)` | platform admin **or service_role** | Idempotent per `eventId`; period 2 earns once; refund/chargeback reverses; no renewal commission |
| `csp_transition_settlement(p_settlement_id uuid, p_to text, p_reason text, p_paid_at timestamptz, p_payment_reference text)` | platform admin | `open→approved→closed→paid`; `voided` needs reason; `paid` needs reference |

Internal (execute revoked from every API role): `_csp_audit(...)`, `_csp_is_service_role()`.

## Security properties

- Tables: RLS enabled + forced, `revoke all` from `public, anon, authenticated` re-asserted; no policies added.
- All functions `SECURITY DEFINER`, `set search_path = public`.
- `EXECUTE` revoked from `public, anon, authenticated, service_role`, then granted to `authenticated`; `service_role` only on `csp_apply_paid_period_event`.
- Auth/permission failures return `{found:false, error:'<code>'}` (no raise, no partial write).
- Every mutating RPC writes `csp_audit_events` (metadata only: no bank data, ciphertext, fingerprint, quiz answers, email/phone).
- Commission amounts come only from the database rate-version snapshot — no RPC accepts an amount from a partner or webhook.
- Ledger remains append-only; earn-once and no-double-commission constraints from the foundation are relied on and not weakened.

## Seed (idempotent, Platform-overridable, NOT live prices)

| Product key | Fixed commission | Currency | Published |
|---|---|---|---|
| `kompis_web` | 500.00 | NOK | true |
| `kompis_bedrift` | 800.00 | NOK | true |
| `aipify_voice` | 0.00 | NOK | false (future) |

These are **placeholder amounts**, not Stripe/billing prices. `ON CONFLICT DO NOTHING` — re-running never overwrites Platform edits. Platform changes them via `csp_upsert_sales_product`. Rate version `effective_from = 2026-01-01T00:00:00Z`.

Academy course `kompis_web_v1` (pass score 80) is seeded **unpublished with no questions**. Both academy RPCs fail closed (`academy_questions_not_loaded`) until questions are loaded and the course is published. Note: because `kompis_web` and `kompis_bedrift` are published but certification cannot be earned yet, no partner can issue links until the academy content is loaded.

## Decisions and gaps the reviewer must confirm

1. **App ↔ RPC signature mismatches (app routes need updating before E2E).**
   - `csp_upsert_sales_product`: app route calls it with `p_product_key, p_title, p_currency, p_fixed_commission_amount, p_published`; this migration (per spec) takes `p_payload jsonb`. `title` has no column and is ignored.
   - `csp_apply_paid_period_event`: app route sends `p_qualified_sale_id, p_paid_periods_count, p_status, p_commission_earned, ...` computed client-side. This migration takes `p_payload` with `eventId, eventType, customerOrgId, productKey, periodOrdinal` and decides status/earnings itself. The client-supplied-state route design should not be wired to a webhook as is.
   - `csp_save_partner_bank_profile`: app route currently sends a **plaintext** IBAN/account payload as `p_payload`. This migration takes `(p_encrypted_payload, p_fingerprint)` and rejects plaintext keys. The route must encrypt via Core before calling.
   - `csp_create_attribution_link`: app route trusts `partner_approved / product_published / certification_passed` booleans from the request body. SQL re-verifies all of them; the route should stop reading them from the body.
2. **Academy scoring is server-authoritative.** `p_score_pct` and `p_passed` are recorded in audit as client values only. Score is recomputed from `p_answers` (object keyed by question id or position) against `answer_key` (or `answer_key->'correct'`). If the app's answer format differs, scores will be 0 (fails safe). Max 10 attempts per partner/course per 24h.
3. **Residual risk: `csp_get_academy_answer_key` exposes keys to any eligible authenticated partner** (as specified). A partner who calls it directly could read the key before an attempt. Consider restricting this RPC to a server-only path in a follow-up.
4. **Application data not stored.** `csp_partner_profiles` only has `display_name` and `country`. Legal business name, registration number, phone, address, email are validated by the app but **not persisted** by this RPC (and intentionally not written to audit). Owner decision needed on where to store them (new table in a separate approved migration).
5. **Link ↔ product binding.** `csp_attribution_links` has no `product_id`; eligibility is checked at issue time only. Returned `path` is `/r/<code>` — placeholder for APP to remap.
6. **Settlement side effects (confirm).**
   - `approved` requires ≥1 line and `sum(lines) = total_amount`.
   - Sales status syncs: approved→`approved_for_payout`, closed→`queued_for_payout`, paid→`paid`.
   - `paid` writes a **negative** `payout` ledger entry (`-total_amount`), key `csp:payout:<id>`; confirm sign convention.
   - `voided` releases sales back to `earned` and **deletes that settlement's lines** (audit retains the transition; lines are not otherwise retained).
   - Paid timestamp, payment reference, and reason are stored in the audit event only (no columns exist).
   - Settlement *generation* (creating settlements/lines) is out of scope here.
7. **Refund/chargeback.** Reverses the sale (status `reversed`, negative `reversal` ledger entry if already earned). Refund of period > 2 is ignored (renewals earn nothing). A reversed sale cannot re-earn for the same partner/customer/product. If the sale was queued/paid, response and audit flag `clawback_required` / `settlement_review_required`; settlement lines are not auto-edited.
8. **Suspended partners still earn** on events; Platform controls payout at settlement approval/void.
9. **Platform admin who is also a partner** sees platform scope in list RPCs.
10. **FORCE RLS dependency.** Definer writes assume the owner role has `BYPASSRLS` (Supabase `postgres`). Verify in Staging before Production.
11. **Not tested against a live database.** Syntax-parsed only. A Staging dry run with seeded partner/org fixtures is required before any Production Gate P.

## Pre-apply verification checklist (read-only)

```sql
select to_regclass('public.csp_partner_profiles');              -- must be non-null
select rolbypassrls from pg_roles where rolname = current_user; -- expect true
select public.is_platform_admin();                              -- helper exists
select to_regprocedure('public.csp_get_backend_status()');      -- foundation stub exists
```

## Post-apply verification (only after approval)

```sql
select public.csp_get_backend_status();  -- {"found":true,"ready":true,"version":"csp_impl_v1"}
select has_function_privilege('anon', 'public.csp_get_partner_overview()', 'execute');            -- false
select has_function_privilege('authenticated', 'public._csp_audit(uuid,text,text,text,uuid,jsonb)', 'execute'); -- false
select has_function_privilege('service_role', 'public.csp_apply_paid_period_event(jsonb)', 'execute');         -- true
select has_function_privilege('service_role', 'public.csp_transition_settlement(uuid,text,text,timestamptz,text)', 'execute'); -- false
select product_key, fixed_commission_amount, published from public.csp_sales_products order by 1;
```

## Rollback / forward

No silent DROP. Rollback would be a separate owner-approved reverse migration (restore stub bodies, restore original CHECK constraints only if no row uses the new values). Prefer leaving schema in place and keeping APP fail-closed.

## Gate S/P approval text template

Owner sends **exactly** (fill in the target):

> Gate S/P APPROVED — Apply `supabase/migrations/20261941100000_certified_sales_partner_impl_rpcs_v1.sql` SHA-256 `edbac2b0bf9290a24206567ff53d32903f79b70246240a5a279d96d43cbf45ad` to **[Staging | Production | both]**. Foundation `20261941000000_certified_sales_partner_core_v1.sql` (SHA-256 `ea676d4a53125114d2aebad5a4f404b8537744a46810db178bf177f2cd993b95`) is confirmed applied in that environment. I have reviewed the decisions and gaps in `docs/security-hardening/CSP_IMPL_RPCS_V1_REVIEW_CANDIDATE.md`.

Until that message exists: **STOP — do not apply.**
