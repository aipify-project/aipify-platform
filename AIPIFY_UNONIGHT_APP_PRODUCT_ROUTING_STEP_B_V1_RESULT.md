# AIPIFY — UnoNight APP Product Routing / Step B V1 — FINAL RESULT

**Oppgave:** `AIPIFY.UNONIGHT.APP.PRODUCT.ROUTING.STEP.B.V1`  
**Job text:** `AIPIFY_UNONIGHT_APP_PRODUCT_ROUTING_STEP_B_V1_2026_10_14.text`  
**Date:** 2026-10-14  
**Worktree:** `/Users/veltrix/Development/aipify-step-b-product-routing-v1`  
**Branch (local only):** `fix/unonight-app-product-routing-step-b-v1`  
**origin/main:** `ca8da06def7acc053c8fc2af903f55add8fed4fc` (#204)  
**Overall status:** **BLOCKED** — not LIVE · no PR · no Production deploy

---

## Verdict (explicit)

| Gate | Result |
|------|--------|
| Continue existing WIP (no parallel rewrite) | **PASS** |
| Core contract for `kompis_bedrift` (Step A RPCs) | **PASS** (already LIVE #198) |
| Safe to ship fail-closed APP/API gates with **0** platform `kompis_bedrift` grants | **BLOCKED** |
| Layout `pathDenied` + EKE API gates + locales + tests | **NOT COMPLETE** (WIP incomplete; stop before finish-to-merge) |
| Merge / CI / Production deploy | **NOT RUN** |
| Authenticated Production Safari (UnoNight product chrome) | **NOT RUN** |
| Frozen WK Public Chain 46/46 | **PASS** (0 diff vs manifest) |

**STOP reason (owner instruction):** fail-closed on `kompis_bedrift === true` with **platform-wide grants = 0** would remove Bedrift UI/API for **every** APP member that today relies on membership-default Bedrift — including any dual-use orgs. That is an **unclear customer-access transition**, not an ordinary scoped code ship. Owner must choose a transition before LIVE.

---

## 1. Exact file / function inventory

### A. On `origin/main` / Production (unchanged by this job)

Membership-default Bedrift still LIVE:

| File | Behavior on main |
|------|------------------|
| `lib/core/access-control-plane/resolve-snapshot.ts` → `mapBedriftProduct` | Authorizes Bedrift when membership valid unless `bedriftModuleEnabled === false` |
| `lib/core/access-control-plane/load-snapshot.ts` | Queries **`website_kompis` only** — never sets `bedriftModuleEnabled` |
| `lib/core/app-menu-capability/load-bundle.ts` / `resolve.ts` | Bedrift nav has no `kompis_bedrift` entitlement gate; fail-closed allowlist still includes Bedrift dashboard |
| `lib/app-portal/nav-config.ts` → `KOMPIS_BEDRIFT_FLAT_NAV` | No `moduleKey: "kompis_bedrift"` |
| `app/app/layout.tsx` | Computes `authorizeProductContext` but **does not** honor `pathDenied` |
| `app/api/employee-knowledge/**` | Auth user only — **no** `kompis_bedrift` product gate |

### B. Local WIP only (uncommitted · **not pushed · not merged**)

| Path | Functions / change |
|------|-------------------|
| `lib/core/access-control-plane/resolve-snapshot.ts` | `mapBedriftProduct` → require `bedriftModuleEnabled === true`; `resolveModules` for `kompis_bedrift` same |
| `lib/core/access-control-plane/load-snapshot.ts` | `loadAccessControlPlaneSnapshot` → parallel `is_tenant_module_enabled(..., 'kompis_bedrift')` → `bedriftModuleEnabled` |
| `lib/core/app-menu-capability/load-bundle.ts` | Load `kompis_bedrift` / `__kompis_bedrift_denied__` into `activeModuleKeys` |
| `lib/core/app-menu-capability/resolve.ts` | Gate `requiredEntitlement === "kompis_bedrift"`; `FAIL_CLOSED_SAFE_CAPABILITY_IDS` → account-only |
| `lib/app-portal/nav-config.ts` | `KOMPIS_BEDRIFT_FLAT_NAV` items → `moduleKey: "kompis_bedrift"` |
| `lib/core/access-control-plane/require-kompis-bedrift-product.ts` | **New** `requireKompisBedriftProduct()` (untracked) |
| `lib/core/access-control-plane/index.ts` | Re-export helper |

**Not in WIP (still missing for a complete Step B ship):**

- `app/app/layout.tsx` `pathDenied` redirect
- Wiring `requireKompisBedriftProduct` into all `app/api/employee-knowledge/*` routes
- Locale keys for deny/empty product UX (`en,no,sv,da,pl,uk,es`)
- Test updates (`access-control-plane-62`, `app-menu-capability`, bypass scenarios, new matrix test)
- TypeScript / build / CI / Preview / Production

**Diff size (WIP):** 6 modified + 1 untracked · ~104 insertions / 33 deletions · **0** frozen WK files.

---

## 2. How Core rights are supposed to steer APP

| Product | Core truth | APP intended gate (Step B design) |
|---------|------------|-----------------------------------|
| **Kompis Web** | `is_tenant_module_enabled(tenant, 'website_kompis')` → `activeModuleKeys` | Already fail-closed on main for Web nav / control plane |
| **Kompis Bedrift** | `is_tenant_module_enabled(tenant, 'kompis_bedrift')` → `bedriftModuleEnabled === true` | **Intended** fail-closed; **not LIVE** |
| **Not Bedrift** | `employee_knowledge` module | Must **never** alias to Bedrift product access |

**UI data source today (main):**  
`loadAccessControlPlaneSnapshot` + `loadAppMenuCapabilityBundle` → `authorizeProductContext` ∩ `availableProductsFromBundle` → `presentAppNavFromCapabilities`.  
Bedrift still opens because (1) control plane membership-defaults Bedrift when `bedriftModuleEnabled` is unset, and (2) Bedrift nav items lack `moduleKey`, so menu capability treats them as included.

**Platform STATUS/ACTIVATE API/UI job:** no open PR found; not blocking this stop (prep #204 docs only).

---

## 3. Entitlement matrix (expected vs LIVE)

| Case | Expected after Step B LIVE | On Production now |
|------|----------------------------|-------------------|
| Web-only (`website_kompis` · no `kompis_bedrift`) | Web only · Bedrift URL/API deny | Web OK · **Bedrift still visible** (membership-default) |
| Bedrift-only | Bedrift only · Web deny if no WK | **Impossible in Core today** (0 bedrift grants) |
| Both | Product switcher both | Membership shows both even without Bedrift grant |
| No product license | Honest empty / account-safe | Fail-closed path still surfaces Bedrift safe-ids |
| Authenticated without product | Server 403 / redirect | Direct Bedrift pages + EKE APIs still open for members |

Unit/runtime matrix on Production after this job: **NOT RUN** (no ship).

---

## 4. UnoNight — Kompis Web as active product?

| Fact | Evidence |
|------|----------|
| Core `website_kompis` | licensed + enabled (reconfirmed this session RO) |
| Core `kompis_bedrift` | **absent** for UnoNight; platform grants **0** |
| Core `employee_knowledge` | licensed + enabled — **not** a Bedrift product license |
| Install / domains / FAQ | Install active · 2 verified domains · **5** published public-safe FAQs |
| APP after this job | **Unchanged** — Step B **not** on main |

**Viser UnoNight etter jobben Kompis Web i ekte innlogget APP?**  
**Nei — ikke verifisert, og ikke forventet endret.** Authenticated Safari: **NOT RUN**. Under current Production code UnoNight members still get Bedrift via membership-default, so the product chrome is **not** “Web-only from Core.”

---

## 5. Server control of Bedrift APIs / direct URLs

| Control | Status |
|---------|--------|
| `pathDenied` enforced in `app/app/layout.tsx` | **NOT LIVE** (main unused; WIP never applied layout) |
| `requireKompisBedriftProduct` on EKE APIs | **NOT LIVE** (helper local only; routes unwired) |
| Direct `/app/kompis-bedrift/*` / `/app/settings/employee-knowledge` | Still render for org members on Production |
| EKE `/api/employee-knowledge/*` | Still 401-only (no product 403) on Production |

---

## 6. Tests · TypeScript · build · CI · locales

| Check | Result |
|-------|--------|
| Unit tests (matrix / ACP / menu) | **NOT RUN** (incomplete WIP; stop before finish) |
| TypeScript / build | **NOT RUN** |
| CI | **NOT RUN** (no PR) |
| Preview / runtime QA | **NOT RUN** |
| Locales `en,no,sv,da,pl,uk,es` for new deny copy | **NOT STARTED** (0 new keys) |
| Old i18n debt | Separately: fail-closed / path-deny UX strings do not exist yet under `productContext` |

---

## 7. Frozen Website Kompis Public Chain

| Check | Result |
|-------|--------|
| Manifest files | **46** |
| SHA256 match in worktree (including WIP) | **46 / 46** |
| Diff vs frozen paths | **0** |

No Q15 P1, provider cost V2, public index, SQL, secrets, or license value changes in this job.

---

## 8. PR · SHA · Production deploy

| Item | Value |
|------|--------|
| Implementation PR | **None** |
| head SHA (shipped) | N/A — main remains `ca8da06d` |
| merge SHA | N/A |
| Production deploy ID | **N/A** (no Step B deploy) |
| Local WIP | Uncommitted on `fix/unonight-app-product-routing-step-b-v1` @ `ca8da06d` + dirty tree |

Related already-merged (context only, not Step B): #201 RO status · #203 Q15 P1 · #204 prep docs.

---

## 9. Blockers — especially no real Bedrift license yet

**Primary BLOCKED cause:** platform-wide `tenant_modules.module_key = 'kompis_bedrift'` count = **0**. Shipping fail-closed Step B would:

1. Hide Bedrift nav / product switcher for **all** current membership-default users.
2. Break any org currently using `/app/kompis-bedrift` or EKE without an explicit grant.
3. Leave **no** Production tenant able to open Bedrift-only until Platform activate (API/UI still missing per #204) or a named RPC activate.

**Incomplete WIP secondary:** even if owner approved the cutover, layout redirect, API wiring, locales, and tests are still unfinished — must not merge half-secure code.

### Exact owner decisions required (pick one path)

1. **Approve global fail-closed cutover with empty grants** (intentional: Bedrift disappears for everyone until activate) → then finish WIP (layout + EKE + locales + tests) and ship Step B.  
2. **First** create/activate ≥1 real Bedrift-licensed test tenant (separate job; not UnoNight) **then** ship Step B.  
3. **Named transition/backfill policy** (SQL/grant list) — out of scope here; requires separate owner text.

**Do not** treat `employee_knowledge` as Bedrift. **Do not** UnoNight-hardcode.

---

## Confirmations

| Control | Count / status |
|---------|----------------|
| SQL / license / grant writes | **0** |
| Paid provider / public ask | **0** |
| Frozen WK edits | **0 / 46** |
| Bedrift test customer create | **0** |
| Step B code merged | **0** |

---

## Next single job (recommended)

**Owner decision text** naming path **1**, **2**, or **3** above.  
If path **1** or **2** (after grant): resume **same worktree WIP** — finish `pathDenied` layout, EKE `requireKompisBedriftProduct`, locales (all active), tests, then PR/LIVE. Do not restart from scratch.

---

## Final status

# **BLOCKED**

Not PASS/LIVE. Not a successful PARTIAL ship — Production APP product routing is **unchanged**; local WIP is **incomplete and must not merge** until owner resolves the empty-grant customer-access transition.
