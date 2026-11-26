# CSP Seller Core — Functional Gap Map V1

Static map from repo at `6cb9e21d4` / PR #360, corrected with Staging+Production read-only Core checks and Messages/Materials SQL V3.

**Commission rule (confirmed in code):** one-time fixed amount per product, earned on the **2nd verified paid period**; no renewal commission. No monthly-vs-annual distinction in CSP code/docs/migrations.

## Live Core (verified RO)

Staging `auedugihkduoaikfusqe` and Production `qbcqoixhrvhnuwphefvw` both have CSP profiles, audit, and the 15 live `csp_*` RPCs (overview, links, academy, settlements, `csp_apply_paid_period_event`, etc.).

**Missing on both:** messages/materials tables + RPCs + `avatar_url` column.

## Messages / materials / avatar

| Item | Status |
|------|--------|
| V2 tables-only candidate | **SUPERSEDED** |
| V3 SQL+RPC package | **PREPARED_ONLY** — `CSP_MESSAGES_MATERIALS_SQL_RPC_READY_FOR_STAGING_APPROVAL` |
| File | `docs/platform/sql-candidates/csp_selgere_complete_messages_materials_avatar_v3.sql` |
| SHA256 | `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c` |
| Spec | `docs/platform/csp-selgere-complete-messages-materials-sql-rpc-v3.md` |

Do not rebuild message/material RPCs in Seller Core until Staging apply is owner-approved.

## Still open for Seller Core Functional Engine

1. **Stripe → `csp_apply_paid_period_event`** — rewrite `payment-events` to `p_payload jsonb` + service role; wire webhook branch; ordinal from Aipify ledger not payload.
2. **Public attribution capture** — resolve/record RPC for `csp-*` clicks + registration first-wins (tables currently read-only).
3. **Unique visits** — hashed session key + per-link/day dedupe + stats RPC.
4. **Per-link deactivate/reactivate** — today only via partner status side-effect.
5. **Settlement generation** — create monthly settlement + lines from earned sales (Oslo cutoff); transitions already exist.
6. **Refund/clawback settlement handling** — reversal flags exist; adjustment lines / admin review queue do not.
7. **Wire UI to messages/materials RPCs** — after Staging apply of V3 only.

## Out of scope / ZERO DIFF

Kompis Core, Public Chain, Academy pass rules, commission formula changes without owner rule decision.
