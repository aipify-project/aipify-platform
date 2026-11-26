# CSP Messages/Materials V3 — Production Apply Report

**Status:** `CSP_MESSAGES_MATERIALS_V3_PRODUCTION_APPLIED_VERIFIED`  
**Project:** `qbcqoixhrvhnuwphefvw` (`Aipify Core`, eu-west-1, ACTIVE_HEALTHY)  
**SHA256:** `5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c`  
**Staging prerequisite:** `CSP_MESSAGES_MATERIALS_V3_STAGING_APPLIED_VERIFIED`  
**Applied:** migration `csp_selgere_complete_messages_materials_avatar_v3` (once)

## Database verification

| Check | Result |
|-------|--------|
| 4 tables | present |
| `avatar_url` | present |
| RLS + FORCE | true |
| Table SELECT for authenticated/anon | false |
| anon EXECUTE on RPCs | false |
| authenticated EXECUTE | true |
| 8 RPCs | all present with expected signatures |

## Gentle Production controls (no seller/customer impact)

Read-only JWT probes against live partners:

- Unauthorized → `unauthorized`
- Suspended partner → `partner_not_active` (messages, materials, avatar)
- Approved partner → `found` + `backend_ready` list (empty inbox / empty Core materials)
- Partner upsert material → `forbidden`
- Partner counts unchanged: **2** (`approved` + `suspended`)
- Message/material row counts after probe: **0**
- Suspended/approved statuses unchanged; suspended `avatar_url` remains null

## Untouched

- Academy RPCs present
- `csp_apply_paid_period_event` / commission ledger present
- No Stripe / payment / email / secrets changes
- Kompis Public Chain not modified

## Application activation (authorized thin clients)

| Surface | Status |
|---------|--------|
| `GET/POST /api/certified-sales-partner/messages` | LIVE — Core RPC |
| `POST /api/certified-sales-partner/messages/read` | LIVE |
| `GET /api/certified-sales-partner/materials` | LIVE — published only |
| `GET/POST /api/platform/sellers/messages` | LIVE — Platform Admin |
| `GET/POST /api/platform/sellers/materials` | LIVE — list/upsert/publish/withdraw |
| Partner messages UI | Wired to API (empty until admin sends) |
| Platform SELGERE messages/materials ops | Wired to API (`backendReady` no longer hard-false) |
| Avatar upload | Best-effort `csp_set_partner_avatar_url` sync |
| `callCspRpc` | Handles `partner_not_active` as Core denial (403), not “backend missing” |

## Remaining blockers / next ops

1. **No Core-published materials yet** — partner Core list is empty until Platform Admin upserts + publishes; catalog remains fallback only when RPC list is unavailable.
2. **Admin compose UI** — send message API exists; richer compose UX can follow without further SQL.
3. **App deploy** — code wiring must ship to Production app hosts to light up UI against Core (DB already LIVE).
