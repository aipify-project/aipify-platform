# AIPIFY — KOMPIS BEDRIFT D2D INTERNAL SANDBOX IDENTITY & ADMIN CONTRACT PREPARE V1 — RESULT

| Field | Value |
|---|---|
| Verdict | **BLOCKED** (prepare contract delivered; onboarding **not** executable) |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2d-internal-sandbox-identity-and-admin-contract-prepare-v1` |
| Branch | `docs/kompis-bedrift-d2d-internal-sandbox-identity-and-admin-contract-prepare-v1` |
| Base HEAD | `eba9674b1637528b1aa7ff236f0eafbea4100d02` (`origin/main`) |
| Code | Read-only prepare contract + tests + proposed legal-exception doc (no UI/endpoint) |
| Production writes | **None** |

## Owner inputs absorbed (prepare only — not execution auth)

| Input | Status |
|---|---|
| Legal entity: Aipify Group AS | Accepted as **intended name** |
| Norwegian orgnr | **NOT PROVIDED / UNKNOWN** — not invented |
| Classification: INTERNAL SANDBOX | Accepted as owner intent; **not enforced** in Core create today |
| Admin: admin@aipify.tech | Accepted as intended; **domain ownership gap** |
| No public site / billing / paying customer | Recorded as constraints |

## Verified facts (read-only)

| Fact | Evidence |
|---|---|
| `create_platform_portal_customer` requires orgnr/legalName/displayName/slug/country; hardcodes `environment_type = 'production'` | `supabase/migrations/20261934400000_platform_portal_customer_creation_global_identity.sql` |
| Customers `environment_type` check allows `internal` among others | `20261935700000_…` constraint |
| Existing `slug=aipify-group` is **`is_platform=true`**, not a Bedrift sandbox tenant; orgnr not nine-digit present; 0 Bedrift module rows | Core read-only probe |
| `admin@aipify.tech` auth.users count | **0** |
| Owned email domains today | **`aipify.ai` only** (`lib/aipify-domain-ownership/policy.ts`); canonical provision email `admin@aipify.ai` |
| Legal source connected | **false** → **AGREEMENT_UNVERIFIED** |
| Create / admin / Bedrift execute allowlists | All **empty**; invite delivery **false** |
| `invite_organization_user` | Stub (log + `{status:'invited'}` only) |
| Bedrift licensed+enabled grants | **0** |
| Frozen WK public chain | **46/46** |
| Step B stash | `step-b-wip-blocked-not-for-merge` **untouched** |
| NOT_APPLIED legal SQL draft | Still draft-only; SHA-256 `9ca51a1052d2cb19138aa3646b683bff72952248380f86600db5879625b1837b` |
| UnoNight | Not used as Bedrift tenant |

## Proposed design (not live)

| Proposal | Status |
|---|---|
| `lib/platform-portal/internal-sandbox-onboarding-contract.ts` prepare packet | **Implemented (fail-closed)** |
| `INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL` + `docs/platform/PROPOSED_NOT_APPROVED_internal_sandbox_legal_exception_v1.md` | **PROPOSED_NOT_APPROVED** |
| Enforced INTERNAL / DEMO / NOT BILLABLE controls | **not_enforced** today — needs separate schema/policy job |
| Automatic legal waiver | **Rejected** — owner must choose MSA path or approve exception |

## Ordered owner decision packet

### A. Verified legal identity
- Provide verified Norwegian **organization number** for Aipify Group AS + legitimate verification source (`operator` / `brreg`)
- Choose ordinary-customer **slug** (not reserved; not `aipify-group` platform company)

### B. Legal policy for INTERNAL SANDBOX
Choose exactly one:
1. **Require verified acceptance source** (D2B SQL/source/acceptance jobs), or  
2. **Explicitly approve** `INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL` (with expiry + legal confirmation)  
No assumed automatic waiver. **AGREEMENT_UNVERIFIED** must not be reported as PASS.

### C. Create payload (PREVIEW ONLY — not executed)

```
country: NO
organizationNumber: <OWNER VERIFIED — currently UNKNOWN>
legalName / displayName: Aipify Group AS
slug: <OWNER CHOSEN — non-reserved>
verificationSource: operator
```

Today’s create RPC would set `environment_type='production'` — not `internal`. Duplicate/idempotency: Core uniqueness on orgnr + slug; platform company must not be reused.

### D. Admin identity / invite / accept
- Resolve **admin@aipify.tech** domain ownership **or** switch to owned-domain email (`admin@aipify.ai`)
- Auth identity currently **absent** (0 matches)
- Required handshake: verified identity → invite/token binding → explicit accept → `organization_users` membership → role after permission checks
- Stub invite / email-alone / auto-link: **rejected**

### E. Future approval checkpoints (separate jobs)
1. Schema/SQL for sandbox classification and/or legal source  
2. Customer create execute (allowlist + enable)  
3. Auth invite + membership accept  
4. Kompis Bedrift activate  

### F. Success evidence / abort (later)
See contract `successEvidenceWhenLaterExecuted` / `abortConditions`.  
**Today:** no test org and no Bedrift APP access exist for this sandbox.

## Exact missing owner decisions (numbered)

1. Verified orgnr for Aipify Group AS  
2. Ordinary sandbox slug  
3. Legal path: MSA source **or** approve exception proposal  
4. Admin email: authorize `aipify.tech` as owned **or** use `aipify.ai`  
5. Separate yes/no later for SQL / create / invite / Bedrift grant  

## Artifacts

- `lib/platform-portal/internal-sandbox-onboarding-contract.ts`
- `lib/platform-portal/internal-sandbox-onboarding-contract.test.ts`
- `docs/platform/PROPOSED_NOT_APPROVED_internal_sandbox_legal_exception_v1.md`
- Export via `lib/platform-portal/index.ts`

## Gates

| Gate | Result |
|---|---|
| Contract unit test | **PASS** (run locally via `npx tsx …`) |
| Frozen 46/46 | **PASS** |
| Step B stash | **PASS** (untouched) |
| typecheck / production build | **NOT RUN** (no local typescript install) |
| Auth UI / invite send / create | **NOT RUN** (forbidden) |
| SQL apply | **NOT RUN** / not authorized |

## Next single implementable job (do not start)

Contingent on owner answers **1–4**:

**`AIPIFY_KOMPIS_BEDRIFT_D2E_INTERNAL_SANDBOX_OWNER_INPUTS_AND_CREATE_AUTHORIZE_PREPARE_V1`**  
— only after orgnr + slug + legal path + admin domain are written; still a prepare/authorize design that may enable a later create job, **not** silent Production create.

Do **not** start Bedrift grant or Step B.
