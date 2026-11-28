# Sales Partner commercial license foundation V1

**Status:** TypeScript foundation LIVE-ready · Core SQL **PREPARED_ONLY**  
**Module:** `lib/sales-partner-commercial-license/`  
**SQL:** `docs/platform/sql-candidates/sales_partner_commercial_license_foundation_v1.sql`

## Split

| Program | Access | Purchase |
|--------|--------|----------|
| **Aipify Partner** (CSP) | `partner_identity` / `userHasCspPartnerAccess` | No — internal system license |
| **Sales Partner (commercial)** | Tenant-owned program + license | Yes (when payment integration exists) |

`/app/sales-partner/*` routes and free CSP behavior are preserved. No portal rename.

## Capacity

- Configurable `max_active_sellers` per license level — **never** hardcode seats or prices in Core.
- `null` = unset → fail-closed for commercial activation.
- Explicit `0` = zero seats (valid).
- Activation is atomic (compare `active + 1` ≤ max). Concurrent races reject when exhausted.
- Capacity-reached notification is a **contract only** (`deliveryImplemented: false`) — no fake delivery or purchase CTA.

## Isolation

- Multiple program memberships per seller allowed (`program_id + seller_user_id`).
- No cross-tenant access.
- Aipify `csp_*` ledger must not mix with tenant commercial settlement.

## Apply gates

1. Owner Staging YES + QA  
2. Separate Production YES  

`APPLY_BLOCKED_UNTIL_OWNER_YES` — do not apply with this task.
