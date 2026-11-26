# AIPIFY PAYMENT CORE SECURITY V1 — Production Apply Ready

**Status:** `AIPIFY_PAYMENT_CORE_SECURITY_PRODUCTION_APPLY_READY`  
**Date:** 2026-11-26  
**PR:** [#371](https://github.com/aipify-project/aipify-platform/pull/371) (MERGEABLE · Vercel green)  
**SQL not applied to Production** — vulnerability still open until owner-approved apply.

---

## 1. Exact candidate

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql` |
| SHA256 | `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980` |
| Production project | `qbcqoixhrvhnuwphefvw` |
| Staging project | `auedugihkduoaikfusqe` (RPCs normally absent; stub exercise only) |

---

## 2. Production function inventory (RO, pre-apply)

| Function | Overloads | SECURITY DEFINER | Identity args |
|----------|-----------|------------------|---------------|
| `handle_payment_webhook_event` | **1** | yes | `(text, text, jsonb, uuid)` |
| `register_trial_payment_method` | **1** | yes | `(text)` |

### Current Production EXECUTE (vulnerable)

| Function | anon | authenticated | service_role |
|----------|------|---------------|--------------|
| `handle_payment_webhook_event(...)` | **true** | **true** | true |
| `register_trial_payment_method(...)` | **true** | true | true |

Hardening migration **not** recorded on Production.

### Body risk (why grants matter)

- `handle_payment_webhook_event` has **no caller auth check**. Any role with EXECUTE can insert `payment_events` and mutate `subscriptions` for an arbitrary `p_customer_id`.
- Direct table UPDATE on `subscriptions` for `anon` is false — attack path is the DEFINER RPC, not table grants.
- `register_trial_payment_method` scopes via `_pic_require_tenant()` → `_presence_tenant_for_auth()`; updates **caller tenant only**. Does not accept a foreign customer UUID. Keeping `authenticated` EXECUTE is intentional for install/checkout demo path.

SQL candidate matches the **only** Production overloads (no leftover alternate signatures found).

---

## 3. Legitimate call sites + required grants after fix

| Caller | Auth | RPC | Required after apply |
|--------|------|-----|----------------------|
| `app/api/webhooks/stripe/route.ts` | Stripe signature → `createServiceRoleClient()` | both | **service_role** |
| `app/api/webhooks/payment/route.ts` | `AIPIFY_PAYMENT_WEBHOOK_SECRET` → service role | `handle_payment_webhook_event` | **service_role** |
| `app/api/billing/create-checkout-session/route.ts` (demoMode) | user session `createClient()` | `register_trial_payment_method` | **authenticated** |

PR #371 already switches webhook routes off anon/cookie clients. Compatible with Production revoke **if code is LIVE before SQL**.

---

## 4. Safe deploy order (no downtime for legitimate webhooks)

1. **Merge + deploy PR #371** (app.aipify.ai / aipify.ai) so Stripe/manual webhooks use `SUPABASE_SERVICE_ROLE_KEY` after signature/secret checks.  
2. Confirm env present on servers: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_WEBHOOK_SECRET` (existing). Optional: `AIPIFY_PAYMENT_WEBHOOK_SECRET` for `/api/webhooks/payment`.  
3. **Apply Production SQL** (exact candidate, once).  
4. **Verify Production grants** (must be green before calling security closed):
   - `handle_*` anon=false, authenticated=false, service_role=true  
   - `register_*` anon=false, authenticated=true, service_role=true  
5. Smoke: signed Stripe webhook path still reaches Core (no real charge required; use Stripe CLI TEST event if available).  

**Do not** apply SQL before #371 is LIVE — current main Stripe route using a non–service-role client would fail after revoke.

**Do not** mark closed until step 4 grant verification passes on Production.

---

## 5. Isolated contract test (non–no-op)

Environment: Staging (`auedugihkduoaikfusqe`) with **temporary stubs** matching Production signatures + pre-fix leaky grants → exact candidate DO block → behavioral `SET ROLE` tests → **stubs dropped**.

| Check | Result |
|-------|--------|
| Pre: anon/auth EXECUTE true (both) | PASS |
| Post: handle anon=false, auth=false, service=true | PASS |
| Post: register anon=false, auth=true, service=true | PASS |
| anon denied handle / register | PASS (`insufficient_privilege`) |
| authenticated denied handle | PASS |
| service_role handle succeeds | PASS |
| authenticated own-tenant register succeeds | PASS |
| authenticated foreign marker rejected | PASS (`No tenant context`) |
| service_role register succeeds | PASS |
| stubs removed (Staging again has 0 payment RPCs) | PASS |

Local: `payment-rpc-hardening-v1.test.ts` + `stripe-webhook-gate.test.ts` PASS (SHA match).

Official Staging apply of the named migration is still optional/no-op when RPCs absent; the stub exercise above is the security proof, not a false baseline of Production.

---

## 6. Residual risks (honest)

1. **Production still vulnerable until SQL apply** — anon EXECUTE remains true now.  
2. Stripe webhook may pass Stripe `cus_…` into `p_customer_id uuid` — pre-existing type mismatch; Core expects Aipify customer UUID (often via metadata). Not introduced by this fix; may cause RPC cast errors independent of grants.  
3. `register_trial_payment_method` under **service_role** still requires tenant context via `_pic_require_tenant` for real bodies — webhook trial registration may no-op/error without user JWT (pre-existing). Grant lockdown does not worsen authz for that path.  
4. No JWT role assert inside `handle_payment_webhook_event` body — defense is EXECUTE grants only (acceptable minimal fix).  
5. Stripe TEST full funnel / real payment events: **not verified** in this job (out of scope).  
6. Security is **not closed** until post-apply Production grant verification.

---

## 7. Production approval point (do not apply until owner replies)

> **APPROVE PRODUCTION APPLY**  
> File: `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql`  
> SHA256: `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980`  
> Project: `qbcqoixhrvhnuwphefvw` only  
> Prerequisite: PR #371 merged and deployed (service_role webhook callers)  
> Evidence: this document — `AIPIFY_PAYMENT_CORE_SECURITY_PRODUCTION_APPLY_READY`  
> After apply: verify anon EXECUTE false on both RPCs before declaring closed.

No other SQL. No new Stripe secrets. No checkout activation. No CSP commission / APP layout / Kompis Core changes.
