# Support Center — Complete Functional Polish V2

**Status:** `CODE_READY_FOR_MERGE` (browser QA = owner after deploy)  
**Branch:** `polish/support-center-functional-v2-20261126`  
**Base:** `origin/main` @ `899b7178`  
**Core:** Production `qbcqoixhrvhnuwphefvw` (read/write RPCs already LIVE from prior #400 job)  
**When (UTC):** 2026-11-26

## What works (code + existing Production Core)

| Area | State |
|------|--------|
| List / filter / sort (`updated_desc`) | **Activated** |
| Mine tab (client filter by `viewerUserId`) | **Activated** (page-scoped; see residual) |
| Open ticket → detail panel | **Activated** |
| Assign to me / status change | **Activated** (Core write RPCs) |
| Internal note vs customer reply draft (separate fields) | **Activated** |
| Save draft (email OFF, not sent) | **Activated** |
| Templates compact list + preview/edit + archive | **Activated** (workspace store) |
| Signature save/load/reset + dark preview contrast | **Activated** (workspace store) |
| Channel status business copy | **Activated** |
| Intake create | **Blocked** (RPC not applied) |
| Email send | **OFF** |

## Fixed in this job

- Mine vs All distinction; assignee column; unassigned state
- Full-width list until selection; detail close; dirty-navigation guard
- Separate internal note vs customer reply; Save draft (not Send)
- Templates wall → searchable list + one editor; insert requires ticket
- Signature Save confirmation; reset vs reset-and-save; no duplicate signature insert
- Removed development KPI/SoT jargon from primary workflow copy
- i18n parity: en, no, sv, da, pl, uk

## Test evidence

- Unit: `lib/platform-portal/support-center/support-center.test.ts` (+ staging activation)
- Lint: clean on touched Support Center paths
- Browser QA: **not executed by agent** — owner after Production deploy
- Email: not sent (by design)

## Residual SQL package (NOT applied — needs separate owner YES)

| Item | Path | SHA-256 |
|------|------|---------|
| Persist + timeline + Mine filter | `docs/platform/sql-candidates/platform_support_center_persist_and_timeline_rpc_v1.sql` | `6ec7e42693c5ce044cf01468b24e3a5e6f2b4028c507213c56330535c5eaf59e` |
| Intake create (unchanged prior residual) | `docs/platform/sql-candidates/platform_support_center_intake_rpc_v1.sql` | `e987d820b3e0818bd6f2b9b7d0ef64caaf22136f351eced8d19af6b47c3ced0d` |

**Exact approval text (persist/timeline only):**  
`YES apply platform_support_center_persist_and_timeline_rpc_v1.sql SHA 6ec7e42693c5ce044cf01468b24e3a5e6f2b4028c507213c56330535c5eaf59e on Production Core qbcqoixhrvhnuwphefvw only. No Staging foundation. No email/DNS/secrets.`

**Exact approval text (intake, separate):**  
`YES apply platform_support_center_intake_rpc_v1.sql SHA e987d820b3e0818bd6f2b9b7d0ef64caaf22136f351eced8d19af6b47c3ced0d on Production Core qbcqoixhrvhnuwphefvw only.`

## Owner test links (after LIVE deploy)

- Support Center: https://app.aipify.ai/platform/support  
- Public intake (still pending): https://aipify.ai/contact/support  

## Owner can verify

1. Alle saker / Mine saker differ when assignments exist  
2. Open case → assign → note → save draft → change status → reload  
3. Templates: search, edit, archive, insert into draft  
4. Signature: save, reload, dark/light preview readable  
5. Draft never presented as sent  

## Still blocked

- Web/CSP intake create RPC  
- Email send / DNS / secrets  
- Durable Core signature/template CRUD until residual SQL YES  
- Message-backed Activity timeline until residual SQL YES  
