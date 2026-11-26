# Payment Webhook RPC Hardening V1 (PREPARED_ONLY)

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql` |
| SHA256 | `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980` |
| Status | PREPARED_ONLY — Staging/Production apply needs exact owner approval |

## Finding (Production RO)

| Function | SECURITY DEFINER | anon | authenticated | public | service_role |
|----------|------------------|------|---------------|--------|--------------|
| `handle_payment_webhook_event(text,text,jsonb,uuid)` | yes | **true** | true | **true** | true |
| `register_trial_payment_method(text)` | yes | **true** | true | **true** | true |

HTTP Stripe signature gate is already fail-closed (#365). Direct PostgREST EXECUTE remained open — separate issue.

Staging (`auedugihkduoaikfusqe`): these RPCs are **absent** (`payment_proc_count=0`). Candidate uses existence-gated DO blocks (safe no-op there).

## Minimal fix

1. **SQL:** revoke `public/anon/authenticated` (and re-grant narrowly):
   - `handle_payment_webhook_event` → **service_role only**
   - `register_trial_payment_method` → **authenticated + service_role** (tenant gate `_pic_require_tenant` retained)
2. **App:** Stripe webhook uses `createServiceRoleClient()` after signature verify.
3. **App:** `/api/webhooks/payment` requires `AIPIFY_PAYMENT_WEBHOOK_SECRET` + service role (no unsigned cookie/anon path).

No subscription body changes. No CSP commission rule changes. No checkout activation. No new LIVE Stripe secrets in this job.

## Production approval point (preferred — RPCs live only on Production today)

> **APPROVE PRODUCTION APPLY**  
> File: `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql`  
> SHA256: `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980`  
> Project: `qbcqoixhrvhnuwphefvw` only  
> Prerequisite: PR #371 deployed (service_role webhook callers)  
> Full package: `docs/platform/payment-core-security-v1-production-apply-ready.md`

Isolated stub exercise on Staging verified the exact revoke/grant DO block (stubs removed). Named Staging apply remains optional no-op while RPCs are absent.
