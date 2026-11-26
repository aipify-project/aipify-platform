# CSP — Deactivate attribution link SQL V4 (PREPARED_ONLY)

**Status:** `PREPARED_ONLY` — do **not** apply until explicit owner approval naming Staging, then Production.

| Field | Value |
|-------|--------|
| Candidate file | `docs/platform/sql-candidates/csp_deactivate_attribution_link_v4.sql` |
| SHA256 | `b06db68bfab047c0385e5d7af636042aaa2933070a09dc17e0fedfe46e2815b3` |
| Function | `public.csp_deactivate_attribution_link(p_code text)` |
| Grant | `authenticated` only |
| Staging project | `auedugihkduoaikfusqe` |
| Production project | `qbcqoixhrvhnuwphefvw` |

## Behaviour

- Partner may deactivate **own** link by code.
- Suspended / rejected / under_review → `partner_not_active`.
- Other partner’s code → `forbidden`.
- Already inactive → `found=true`, `changed=false` (idempotent).
- Never deletes history; audits `attribution_link_deactivated`.

## App wiring (fail-closed until applied)

- `PATCH /api/certified-sales-partner/links` with `{ action: "deactivate", code }`
- Partner UI: sales links table deactivate control
- Missing RPC → 503 / honest unavailable (no fake success)

## Apply order (owner-gated)

1. Approve Staging apply with exact SHA above.
2. Verify function exists + partner self-test on Staging fixture only.
3. Approve Production apply with same SHA.
4. Re-verify Production; no mass deactivation.
