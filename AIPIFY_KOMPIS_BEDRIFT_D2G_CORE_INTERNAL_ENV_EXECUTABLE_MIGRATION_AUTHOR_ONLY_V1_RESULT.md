# AIPIFY — KOMPIS BEDRIFT D2G — CORE INTERNAL ENV EXECUTABLE MIGRATION — AUTHOR ONLY V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PASS (author-only)** — executable NOT_APPLIED SQL authored + static contracts green; **SQL NOT APPLIED**; internal create **still not live** |
| Code | PR opened for docs/tests/prepare-only contract updates (cannot activate create path) |
| Applied to Staging/Production | **No** |
| Worktree | `/Users/veltrix/Development/aipify-bedrift-d2g-core-internal-env-executable-migration-author-only-v1` |
| Branch | `feat/kompis-bedrift-d2g-core-internal-env-executable-migration-author-only-v1` |
| Base HEAD | `5f41b643` (`origin/main`, PR #217) |

This RESULT is **not** owner approval to APPLY SQL.

---

## 1. New SQL artifact

| Item | Value |
|---|---|
| Path | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql` |
| SHA-256 | `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b` |
| Under `supabase/migrations/` | **No** |
| Non-comment lines | **350** |
| Approx DDL | 5 `CREATE OR REPLACE FUNCTION`, 1 `DROP FUNCTION` (5-arg), 6 drop+create triggers, grants/revokes |
| Parser / dry-run against DB | **NOT RUN** (no local disposable DB apply; apply forbidden) |
| Prior comment-only sketch | Preserved unchanged at SHA `91eb68b5511c5d940abd6d00d949831a1ab295ca6d6277cea198b622e36f7c5f` |
| Apply plan | `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1_APPLY_PLAN.md` |

---

## 2. Core RPC contract (authored; not live until apply)

**Signature after apply:**

`create_platform_portal_customer(p_organization_number, p_legal_name, p_display_name, p_slug, p_country default null, p_environment_type default 'production') → jsonb`

| Caller / path | Production create | Internal create |
|---|---|---|
| Anonymous / public | Denied (no grant; platform access required) | Denied |
| `platform_support` | Allowed (existing `_ppsf258_require_platform_access`) | **Denied** → `INTERNAL_ENVIRONMENT_SUPER_ADMIN_REQUIRED` |
| `super_admin` + helper false | Allowed | **Denied** → `INTERNAL_ENVIRONMENT_NOT_AUTHORIZED` |
| `super_admin` + helper true (future job) | Allowed | Allowed (persists `internal`) |
| Client body forgery alone | N/A at Core; Platform prepare still rejects | Rejected |

Helper `_platform_portal_internal_customer_create_authorized()` = **`select false`** (fail-closed).

---

## 3. Billing / public-site / domain guards

| Control | Today (pre-apply) | After this SQL apply | Still separate |
|---|---|---|---|
| Create writes no license/domain/payment | **ENFORCED** | **ENFORCED** | — |
| Subscriptions / license links for `internal` | Not gated by env | **ENFORCED** (BEFORE INSERT/UPDATE triggers) | Stripe/provider customer objects |
| Domains + installations for `internal` | Not gated by env | **ENFORCED** (triggers) | Website CMS / public runtime publish beyond these tables |
| `environment_type` mutation after create | Possible via UPDATE | **ENFORCED** immutable | — |
| Platform UI “INTERNAL” badge | Not present | Not present | UI follow-up |
| Platform RPC connect (`p_environment_type` from APP) | Flags false | Flags remain false until connect job | Platform connect job |

Honest claim: after apply, Core blocks ordinary commercial/public exposure tables for `internal`, but **does not** claim Stripe-level or every CMS path covered.

---

## 4. Tests

| Test | Result |
|---|---|
| `customer-environment-type-contract.test.ts` | **PASS** |
| `internal-environment-enforcement-sql.contract.test.ts` | **PASS** (static) |
| `create-customer-prepare.test.ts` | **PASS** |
| Frozen Website Kompis | **46/46 MATCH** |
| DB integration (super_admin / platform_support / forge / audit) | **NOT RUN** — requires disposable DB + apply (forbidden here) |
| SQL parser/sqlfluff | **NOT RUN** (tools unavailable) |
| `typecheck` / full `build` | **NOT RUN** (docs + narrow TS; optional) |

---

## 5. Safety confirmations

| Item | Status |
|---|---|
| SQL applies to Staging/Production | **0** |
| Customer creates | **0** |
| Admin invites / users | **0** |
| License / Bedrift grants | **0** |
| Legal acceptance | **0** |
| Sandbox identity hardcoded in SQL | **None** (no orgnr/slug/email/legal name) |
| Step B stash `step-b-wip-blocked-not-for-merge` | **Preserved** |
| Frozen WK 46/46 | **Preserved** |
| Platform execute / internal authorize flags | Remain **false** |

---

## 6. OWNER APPLY YES/NO PACKET (future — not granted now)

**Question:** Do you authorize a **separate named apply job** to apply exactly:

- File: `docs/platform/NOT_APPLIED_platform_customer_create_internal_environment_enforcement_v1.sql`
- SHA-256: `83056fb8fbf9c80293da68237ef8a4045ddfae96257669c8de7e5a4b6890733b`

**Dependencies:** schema env check from `20261935700000_…`; current 5-arg create from `20261934400000_…`.

**Risks:** replaces create RPC overload; adds triggers that would block commercial rows for any future `internal` customer; grant/revoke on new arity.

**Compensating controls after apply:** helper still false → no internal tenant can be created; production default preserved; Platform flags still false.

**Post-apply RO checks:** see APPLY_PLAN (function arity, support denied for internal, super_admin blocked by helper, zero rows created by apply).

**Explicit excludes from apply YES:** sandbox create, admin invite, Bedrift grant, helper flip, Platform RPC connect, legal acceptance, UnoNight, frozen WK edits.

---

## 7. Next SINGLE execution step

**Owner decide APPLY YES/NO** for the SHA above (Core SQL apply job only) — **or** request a disposable-DB dry-run validation job first.

Do **not** combine with sandbox creation, admin invitation, Bedrift grant, helper authorize, Platform connect, or Step B.
