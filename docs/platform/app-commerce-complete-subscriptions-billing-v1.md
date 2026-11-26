# AIPIFY APP COMMERCE – COMPLETE SUBSCRIPTIONS & BILLING V1

**Status:** CODE_READY (Production checkout closed)  
**Branch:** `feat/app-commerce-complete-subscriptions-billing-v1-20261126`  
**Base:** `origin/main` @ APP Customer Follow-up V3 (#374) + Payment Core Security (#371)

## Architecture map

```
Platform published offer (Core table/RPC PREPARED_ONLY)
  → APP catalog read model (/app/explore + /api/app-commerce/catalog)
  → server checkout (/api/app-commerce/checkout) binds authenticated tenant + offerId
  → Stripe TEST Checkout session (metadata: aipify_customer_id, plan_key, CSP fields)
  → signed webhook (#365/#371 service_role) → handle_payment_webhook_event
  → Core subscription / entitlement
  → APP billing / invoice read (honest empty until issuer bridge)
  → CSP paid-period via existing TEST bridge metadata (no commission rule copy)
```

## Production gates

| Gate | Value |
|------|--------|
| `checkoutEnabled` in Production | **false** always |
| Open TEST checkout | `AIPIFY_APP_COMMERCE_TEST_CHECKOUT=1` and non-production |
| Stripe key mode | `sk_test_*` only for commerce path |
| Client Stripe Price ID | rejected |
| Subscription change/cancel | fail-closed (`policy_not_finalized`) |

## PREPARED_ONLY SQL

| File | Purpose |
|------|---------|
| `docs/platform/sql-candidates/app_commerce_published_catalog_v1.sql` | `app_commerce_published_offers` + `get_app_commerce_published_catalog()` |

Do **not** apply without exact owner Staging/Production approval. SHA is asserted in `lib/app-commerce/app-commerce-v1.test.ts`.

## Parallel agent scope

| Job | Overlap | Handling |
|-----|---------|----------|
| CSP Portal V7 | partners portal / CSP materials | untouched |
| Platform Analytics V2 | `/platform/analytics` | untouched |
| Platform Sellers V3 | product admin editor | APP consumes published contract only; no competing editor |
| APP UX V3 | merged on main | extended explore purchase CTA only |

## Blockers requiring owner decision

1. Apply published-catalog SQL + publish real TEST offers with Stripe Price IDs.  
2. Provide Stripe TEST credentials in approved non-production env.  
3. Finalize upgrade/downgrade/cancel proration policy.  
4. Wire Platform/Stripe invoice PDF issuer for self-serve.  
5. Explicit approval before Production `checkoutEnabled`.
