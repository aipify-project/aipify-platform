# CSP Public Attribution Capture SQL V6 (PREPARED_ONLY)

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/csp_public_attribution_capture_v6.sql` |
| SHA256 | `454bf3a3c065b577e5a10d88016b8240c0130b8cfb058644eb55a326b24079c5` |
| Status | PREPARED_ONLY — Staging/Production apply needs exact owner approval |

## Functions

- `csp_capture_public_attribution_click(jsonb)` — anon/authenticated EXECUTE; no table grants
- `csp_attribute_customer_registration(jsonb)` — authenticated + service_role
- `csp_apply_paid_period_event(jsonb)` — additive `billingInterval` (annual → earn at 1)

## Dependencies

Existing CSP tables/RPCs from V1 impl + deactivate V4: links, events, registrations, products, certifications, `_csp_audit`, `_csp_is_service_role`.
