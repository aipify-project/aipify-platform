# AIPIFY CORE — Payment Security Complete V1

**Goal status:** `AIPIFY_PAYMENT_CORE_SECURITY_READY_FOR_APPROVAL`  
**Branch:** `feat/payment-core-security-v1-20261126`  
**Baseline:** `origin/main` @ `df43e3013`

---

## Security finding

`public.handle_payment_webhook_event` is `SECURITY DEFINER` and can mutate `subscriptions` / insert `payment_events`.  
Production grants: **anon = true**, **public = true**, authenticated = true, service_role = true.

HTTP signature control (#365) does **not** stop direct PostgREST RPC calls with the publishable key.

Same PUBLIC/anon EXECUTE leakage on `register_trial_payment_method` (body is tenant-gated via `_pic_require_tenant`, but EXECUTE should not be public).

`/api/webhooks/payment` previously accepted JSON with a cookie/anon client and **no** shared secret.

---

## Affected surfaces

| Surface | Change |
|---------|--------|
| SQL candidate | Grant lockdown (PREPARED_ONLY) |
| `app/api/webhooks/stripe/route.ts` | After signature → `createServiceRoleClient()` |
| `app/api/webhooks/payment/route.ts` | Secret header + service role |
| CSP / checkout / commission rules | Unchanged |

---

## Tests (local contracts)

| Check | Result |
|-------|--------|
| Missing/invalid Stripe signature rejected | PASS (`stripe-webhook-gate`) |
| Stripe route uses service role after gate | PASS |
| SQL SHA + revoke/grant markers | PASS (`payment-rpc-hardening-v1`) |
| Manual payment route requires secret | PASS (contract) |
| Checkout not activated by this job | PASS (no checkout enablement) |

Staging fixture mutation tests deferred until Staging SQL apply (RPCs currently absent on Staging).

---

## SQL candidate

- File: `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql`
- SHA256: `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980`
- Docs: `docs/platform/payment-webhook-rpc-hardening-v1.md`

### Staging approval

> **APPROVE STAGING APPLY**  
> File: `docs/platform/sql-candidates/payment_webhook_rpc_hardening_v1.sql`  
> SHA256: `451a0f0ef89b9280bd8da15db6a3abb607209ff9ecc1acbb4387a13914bda980`  
> Project: `auedugihkduoaikfusqe` only

Production requires a separate exact owner approval after Staging.

---

## Legitimate Stripe webhooks after merge

1. Verify `stripe-signature` (unchanged fail-closed).
2. Call Core with **service_role** (new).
3. After Staging/Production SQL apply: anon/authenticated PostgREST cannot call `handle_payment_webhook_event`.

Requires `SUPABASE_SERVICE_ROLE_KEY` on the app server (already used elsewhere). Requires `STRIPE_WEBHOOK_SECRET` (existing). Manual route additionally needs `AIPIFY_PAYMENT_WEBHOOK_SECRET` if used.

---

## Remaining risk

1. SQL not yet applied — Production still has anon EXECUTE until owner-approved apply.
2. Staging lacks payment RPCs — apply is expected no-op until schema parity.
3. Function bodies still trust caller identity only via grants (no JWT role assert inside SQL) — acceptable for minimal fix; optional later defense-in-depth.
4. Checkout route still exists in demo/fallback mode when Stripe keys absent — not activated by this job.
5. CSP V7 / other agents: this job touches only payment webhook routes + billing contracts + SQL candidate.
