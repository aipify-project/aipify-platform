# AIPIFY — Kompis Bedrift D2B Legal Acceptance Evidence Contract Prepare V1

**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-bedrift-d2b-legal-acceptance-evidence-contract-prepare-v1`  
**Branch:** `feat/kompis-bedrift-d2b-legal-acceptance-evidence-contract-prepare-v1`  
**Baseline:** `origin/main` @ `34a7774e`  
**Verdict:** see footer

## Baseline report

| Item | Value |
| --- | --- |
| CWD / root | `/Users/veltrix/Development/aipify-bedrift-d2b-legal-acceptance-evidence-contract-prepare-v1` |
| Branch | `feat/kompis-bedrift-d2b-legal-acceptance-evidence-contract-prepare-v1` |
| HEAD at start | `34a7774e` (= `origin/main`) |
| Stash `step-b-wip-blocked-not-for-merge` | Preserved (not popped/dropped) |
| Shared-panels polish job | Not mixed into this worktree |

## Inspection — sources found

| Source | Role | Usable as Platform MSA evidence? |
| --- | --- | --- |
| D2 `agreement-approval-prepare` | Fail-closed `AGREEMENT_UNVERIFIED` | Already correct gate; no invent |
| `get_platform_portal_customer_agreements_overview` / `subscriptions` | Commercial projection | **No** |
| `business_pack_legal_acceptances` | APP pack legal | **No** (wrong layer; no content hash) |
| Growth Partner agreement tables | Partners | **No** |
| Workspace / partner `terms_accepted` checkboxes | Signup gates | **No** durable evidence |
| Platform customer legal e-sign store | — | **Missing** |

## What this job delivered

1. Canonical evidence contract types + fail-closed probe (`platform_customer_legal_acceptance_evidence_v1`).
2. Wired `evidenceProbe` into D2 prepare plan (still `AGREEMENT_UNVERIFIED`, `evidence: null`).
3. Platform UI copy for evidence readiness (no approve/accept/create/activate).
4. i18n keys in **en / no / sv / da / pl / uk / es**.
5. Focused denial tests (missing, forged actor, mismatched customer, unverified version, duplicate, unrelated tenant, proxy sources).
6. **NOT_APPLIED** SQL draft under `docs/platform/` (not in `supabase/migrations/`).

## Files

- `lib/platform-portal/legal-acceptance-evidence-contract.ts`
- `lib/platform-portal/legal-acceptance-evidence-contract.test.ts`
- `lib/platform-portal/agreement-approval-prepare.ts` (+ test)
- `lib/platform-portal/labels.ts` / `types.ts` / `index.ts`
- `components/platform/platform-portal/PlatformPortalCustomerCreationPanel.tsx`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`
- `docs/platform/NOT_APPLIED_platform_customer_legal_acceptance_evidence_contract_v1.sql`
- this RESULT

## Gates

| Gate | Result |
| --- | --- |
| `PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false` | PASS |
| Probe never returns evidence / never READY | PASS |
| Execute / create / activate / accept-on-behalf false | PASS |
| D2 execute allowlist empty / execute disabled | PASS |
| Proxy sources rejected | PASS |
| Frozen Website Kompis 46/46 | PASS |
| No SQL applied | PASS |
| No UnoNight Bedrift grant / no customer create | PASS |

## Tests

| Suite | Result |
| --- | --- |
| `npx tsx lib/platform-portal/legal-acceptance-evidence-contract.test.ts` | **PASS** |
| `npx tsx lib/platform-portal/agreement-approval-prepare.test.ts` | **PASS** |
| `npm run typecheck` | **NOT RUN** (`tsc` not installed in worktree; no full `npm install` to protect disk) |
| `npm run build` | **NOT RUN** (resource conservation) |
| Authenticated Platform UI runtime | **NOT RUN** |

## OWNER DECISION PACKET

**A. Legal test entity:** **UNKNOWN** — owner must name a real non-UnoNight entity; this job does not invent a registration number or borrow UnoNight.

**B. Canonical agreement identity / acceptance mechanism:**  
- Contract id: `platform_customer_legal_acceptance_evidence_v1`  
- Agreement text/version: `UNKNOWN_UNTIL_OWNER_APPROVES_AGREEMENT_TEXT`  
- Required proof fields: actor ID, customer legal entity ID, agreement ID/version, content hash (SHA-256), acceptance action, UTC timestamp, audit record ID; IP/UA only if legitimately collected.  
- Owner must approve: (1) agreement text + version, (2) Core evidence store design, (3) migration apply, (4) connecting the source flag, (5) how acceptance is recorded (who may accept; no silent accept-on-behalf).

**C. SQL / schema:** Draft only at `docs/platform/NOT_APPLIED_platform_customer_legal_acceptance_evidence_contract_v1.sql`. **Not applied.** Separate owner authorization required before any migration.

**D. Ordered follow-ups before D3:**  
1. Owner names legal test entity  
2. Owner approves agreement text/version  
3. Acceptance evidence source authorized + available in Core  
4. Customer create separately authorized (D1 execute)  
5. Admin invite/accept separately authorized (D3)  
6. License activate separately authorized (D4)  
7. Step B only with cutover gates  

**E. Explicit:** D2B is a **PREPARATION** job — **not** permission for real customer creation or agreement acceptance.

## Footer (after PR)

- PR: https://github.com/aipify-project/aipify-platform/pull/215
- Head SHA: `523ae37c4255c88f5fca97640d996b052d940ac2`
- Merge: not auto-merged (typecheck/build NOT RUN locally; NOT_APPLIED SQL needs owner approval before any Core apply)
- LIVE: **not claimed**
- Isolation note: briefly mixed onto polish branch tip locally; cherry-picked onto D2B branch; polish restored to `82734c39` before any polish push
