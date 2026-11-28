# AIPIFY_VARIANT_COMMISSION_UI_CORE_PERSISTENCE_READY

**Status:** READY for merge (Production remain fail-closed)  
**Date:** 2026-11-28  
**Gates honored:** NO_SQL_APPLY · NO_PRODUCTION_DB_WRITE · NO_STRIPE_CHANGE · NO_PAYMENT · NO_COMMISSION_ACTIVATION

## What shipped

- Shared Core client: `lib/product-catalog/variant-commission-core.ts`
- Env gate: Staging Core `auedugihkduoaikfusqe` may persist; Production `qbcqoixhrvhnuwphefvw` always closed
- API:
  - `GET|POST /api/platform/sellers/products/variants`
  - `GET /api/platform/sellers/commission-rates/variants`
- Opprett/Rediger produkt loads/saves variants + interval commissions via Core when Staging-bound
- Provisjonspriser reads the same Core commission versions (plus unchanged legacy product-level table)
- Commission edits create new versions (skip identical effective rule)
- Free variants support 0 NOK commission
- Missing storage / RPC → clear error, never false success
- `settlement_activated` always false in API payloads

## Tests

```bash
npx tsx --test \
  lib/product-catalog/variant-commission.test.ts \
  lib/product-catalog/variant-commission-core.test.ts \
  lib/product-catalog/variant-commission-persist-flow.test.ts \
  lib/product-catalog/variants-billing.test.ts
```

Result: **17/17 PASS** (unit + mocked Staging persist flow + APP catalog regression).

## Staging Core E2E (auedugihkduoaikfusqe)

| Check | Result |
|---|---|
| All 6 RPCs present | PASS |
| Tables present | PASS |
| Production tables/RPCs absent | PASS (fail-closed) |
| Disposable variant `e2e_ui_free` create + price 0 | PASS |
| Two commission versions (0 → 25); bundle reloads effective **25** | PASS |
| Legacy `csp_commission_rate_versions` count | **3** unchanged |
| Legacy `csp_qualified_sales` count | **4** unchanged |
| `get_effective` / admin list RPCs require platform admin | PASS (`forbidden` without admin session) |
| Stripe / payment / earn path | not touched |

UI login E2E against a Staging-bound deploy still needs an authorized platform admin session (app must use Staging Supabase URL).

## Remaining Production dependencies

1. **Owner YES** to apply variants billing SQL + variant commission SQL on Production Core (exact SHA process).
2. Flip persist gate only after Production SQL is applied **and** explicitly approved (today: Production URL ⇒ `canPersist=false`).
3. Separate task to activate commission earn / payment event wiring (`settlement_activated`).
4. No Stripe product/price creation from this UI path.

## Non-effects

- Historical product commission versions unchanged
- Qualified sales unchanged
- No Stripe objects
- No payment events
- Earn/settlement path not activated
