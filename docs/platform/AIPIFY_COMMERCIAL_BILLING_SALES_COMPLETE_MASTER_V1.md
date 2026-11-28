# AIPIFY_COMMERCIAL_BILLING_SALES_COMPLETE_MASTER_V1

**Feature owner:** PLATFORM (control plane: mapping, commission policy, overview) + APP (read-only surfaces, consumed by Agent 2) + shared contracts for Agent 3.
**Code:** `lib/commercial-billing-sales/` (pure TypeScript, no I/O, no Stripe SDK, no env reads).
**Status:** foundation contracts only. Stripe LIVE, real payments, live Checkout Session creation, Production SQL and payout are all **off** (compile-time switches in `COMMERCIAL_BILLING_SALES_MASTER.switches`, all `false`).

This module preserves: free Aipify Partner (`partner_identity`, no paid license), `/app/sales-partner`, the `/s/*` and `/p/*` certificate-verify and attribution routes, and the Product Center + commission editor (#525/#530). It builds on #532 `lib/sales-partner-commercial-license/`.

## End-to-end flow

1. Product Center defines product, variant, price per interval and fixed commission rule (#525/#530, unchanged).
2. `planProductCenterStripeMapping` produces immutable, content-addressed price versions (`pv_` + sha256 prefix). Test adapter only; live adapter is disabled.
3. APP browses the catalog without any license. Operating a product requires an active entitlement.
4. `prepareCheckoutIntent`: server-side pricing (VAT in basis points, discount on net ex VAT, first period only), checkout gate closed in Production, idempotent per `tenant::idempotencyKey`, attribution bound to the tenant. The client-claimed total is compared, never trusted.
5. Redirect / success URL is **not** payment proof (`interpretCheckoutReturn`). `checkout.session.completed` only links intent and subscription.
6. Verified webhook (HMAC signature + mapping + tenant + amount + currency) is reduced into the payment ledger (`applyBillingEvent`, pure and idempotent). `livemode:true` events are rejected.
7. Only a captured payment activates the entitlement. Failure moves to grace (3 days: operate yes, expand no), then expiry. Refund / chargeback revokes or suspends. Recovery restores.
8. Payment history / receipt DTO is read from the ledger. Provider-hosted document links only; nothing fabricated, nothing sent.
9. Commission ledger (append-only): monthly is registered after the 1st paid period and earned after the 2nd; yearly and one-time earn on the first capture; renewals never earn; reversals append negative entries.
10. Manual settlement only, approver required. Payout activation is not implemented.

## Agent 2 contracts (APP / Product Center purchase surfaces)

Type: `Agent2CommercialContracts` in `agent-contracts.ts`. All fail closed; none implies a purchase CTA (`purchaseCtaAllowed: false`).

- **License read** — `readSalesPartnerLicenseSnapshots(client, { organizationId, now })` → `SalesPartnerLicenseReadResult`. Calls RPC `get_sales_partner_program_license_snapshot(p_owner_tenant_id)`. Returns `{ ready: false, failClosed: true, reason }` when the RPC is missing/unreachable/forbidden. `rpc_missing` and `csp_backend_not_applied` are expected until the snapshot RPC is approved and applied.
- **Capacity** — `buildLicenseCapacityView(snapshot)` → `{ programId, maxActiveSellers: number | null, activeSellerCount, seatsRemaining: number | null, capacityConfigured, capacityReached, notification }`. `null` means *not configured*, `0` is a real cap.
- **Operation gate** — `authorizeProductOperation({ callerTenantId, operation, productKey, entitlements, dependencies?, now })` with operations `browse_catalog | operate | expand_capacity | manage_billing`. `browse_catalog` and `manage_billing` are always open (billing/recovery stays reachable). Denial reasons: `tenant_required`, `cross_tenant_forbidden`, `entitlement_missing`, `entitlement_not_operational`, `expansion_blocked`, `dependency_missing`, `dependency_not_operational`.
- **Effective entitlement** — `resolveEffectiveEntitlement(record, now)` → `{ state, mayOperate, mayExpand, reason }`. States: `pending_payment | active | grace_period | cancel_scheduled | canceled | expired | suspended | revoked`. Time-driven; grace allows operating but not expanding.
- **Checkout intent** — `prepareCheckoutIntent(request, context)` → `{ ok: true, intent, replayed } | { ok: false, reason }`. Intent carries `intentId`, `priceVersionId`, `providerPriceId`, server `pricing`, `expectedFirstChargeMinor`, `expectedRecurringChargeMinor`, `attribution`, `paymentConfirmed: false`, `liveSessionCreationEnabled: false`. Failure reasons include `checkout_closed`, `already_entitled`, `dependency_missing`, `dependency_not_operational`, `mapping_missing`, `provider_price_not_bound`, `idempotency_key_conflict`, and the pricing failures. A foreign tenant's dependency record is reported as `dependency_missing` (no cross-tenant signal).
- **Payment history** — `buildCustomerPaymentHistory({ callerTenantId, payments, documentLinks? })` → `CustomerPaymentHistoryDto { tenantId, available, items[], doubleBillingSuspected, blocker, fabricatesDocuments: false, sendsEmail: false }`. Items: `paymentId, productKey, variantKey, interval, amountMinor, currency, vatMinor, netExVatMinor, refundedMinor, status, periodOrdinal, documentUrl` (provider link or `null`). Another tenant's rows are never returned. No ledger => `available: false, blocker: "no_authoritative_payment_source"`.
- **Rules (`AGENT_CONTRACT_RULES.agent2`)** — commission is never shown in APP; no purchase CTA is produced by this module; success redirect is never proof; all amounts are integer minor units with explicit currency.

## Agent 3 contracts (support / analytics / notifications)

Type: `Agent3CommercialContracts` → `CommercialNotificationDto`. Produced by `buildCommercialNotifications(effects)` from reducer effects.

- **Fields** — `event, tenantId, intentId, paymentId, detail, dedupeKey, deliveryImplemented: false, containsSensitiveData: false`.
- **Events** — `commercial.payment_succeeded`, `commercial.payment_failed`, `commercial.refund_processed`, `commercial.chargeback_opened`, `commercial.chargeback_won`, `commercial.entitlement_activated`, `commercial.entitlement_state_changed`, `commercial.subscription_cancel_scheduled`, `commercial.subscription_canceled`, `commercial.commission_earned`, `commercial.commission_reversed`.
- **dedupeKey** — `event|tenantId|intentId|paymentId|detail`; stable across replays, so webhook retries never duplicate a notification.
- **Seller-side events** — `commission_earned` and `commission_reversed` satisfy `isSellerSideNotification()` and must **never** be routed to the customer tenant. Registered (not yet earned) commission is intentionally not a notification.
- **Delivery** — not implemented here; Agent 3 owns channels, preferences and quiet hours. No email, card or invoice content is ever in a DTO.

## Open questions

- Stripe invoice vs accounting system of record (`stripe_invoice_vs_accounting_system_of_record`). Until decided, no legal invoice is generated and none is sent.
- VAT rate source: Stripe Tax vs manual table. `vatRateBp: null` fails closed; `0` is valid.
- Legal invoice numbering owner, credit notes for refunds, receipt language/template ownership (`INVOICE_OPEN_QUESTIONS`).
- Percent commission basis and Core contract (percent is CORE_BLOCKED; `percentCommissionIsActivatable()` is `false`).

## Nordic Founder Exchange

Documented hooks only (`NORDIC_FOUNDER_EXCHANGE_HOOKS`): `dataLinked: false`, `productStarted: false`. Reusable contracts: price version mapping plan, checkout intent with idempotency, verified webhook reducer, entitlement authorization, commission ledger, payment history DTO. No data link and no product start in this phase.

## SQL candidates

| Candidate | Status | SHA-256 |
|---|---|---|
| `docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql` | Staging-applied by parent (migration version 20261128201827, aipify-core-staging). **Production NOT applied.** Bytes must not change. | `2ee4239b4566c04a0c136e9fc3a311ba7c6e7664c392ccd18916d6fb9b2dd30d` |
| `docs/platform/sql-candidates/sales_partner_license_snapshot_read_v1.sql` | **PREPARED_ONLY.** Security definer, `revoke all`, no EXECUTE grants. Not applied anywhere. | `57269903f43b080ef3156c41fbf354250a2a20ada66d04e638e8ade9aecb0e0d` |

Both have `.sha256` sidecars. There is exactly one snapshot-read candidate.

## Open owner approvals

Each item below is a separate owner decision. None is implied by this document.

1. `stripe_live_activation_and_secrets`
2. `live_checkout_session_creation`
3. `production_sql_apply_license_foundation`
4. `staging_apply_snapshot_read_rpc_and_execute_grants`
5. `percent_commission_basis_and_core_contract`
6. `vat_rate_source_and_stripe_tax_vs_manual`
7. `stripe_invoice_vs_accounting_system_of_record`
8. `payout_activation_and_settlement_automation`
9. `commission_rate_values_per_variant_interval`
10. `license_levels_and_seat_caps_catalog`

## Verification

`npx --yes tsx --test lib/commercial-billing-sales/*.test.ts` — tests use mocks and fixtures only (fake secret `whsec_FIXTURE_NOT_A_REAL_SECRET`, `price_fixture_*`, `cs_fixture_*`). This is not an end-to-end payment proof; no E2E PASS is claimed.
