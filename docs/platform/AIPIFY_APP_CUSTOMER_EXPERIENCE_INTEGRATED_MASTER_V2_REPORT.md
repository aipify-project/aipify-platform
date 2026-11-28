# AIPIFY_APP_CUSTOMER_EXPERIENCE_INTEGRATED_MASTER_V2

**Overall:** not COMPLETE (no signed-in E2E) · APP CX integration **CODE_READY / INTEGRATION_READY** on PR #531

| | |
| --- | --- |
| PR | https://github.com/aipify-project/aipify-platform/pull/531 |
| Baseline | `e9d2b8316` |
| Delivery tip | `28db3c26b` (`28db3c26b55e0bc0ccaa3160444d5c3b6daaab28`) |
| Agent 1 (#525/#530) | not edited by Agent 2; merge-from-main for coexistence |
| Agent 3 support/public site | not edited by Agent 2; frozen public chain not touched |
| Production media upload | fail-closed |
| Stripe / SQL apply / product publish | none |
| Staging E2E | **BLOCKED** (no authorized Platform Admin session) — not re-run |

---

## Phase A–J status

| Phase | Status | Notes |
| --- | --- | --- |
| A PR #531 Core locale/media | **CODE_READY** | Writers fail-closed; Staging E2E **BLOCKED** (no session) |
| B Dashboard / nav | **CODE_READY** | Software catalog ungated; Explore→detail; subscription CTAs real |
| C Product journey | **INTEGRATION_READY** | Catalog→detail→subscription/open; checkout fail-closed |
| D/E Kompis Web/Bedrift | **CODE_READY** | Bedrift hub + connection shell gaps filled; no new Core runtime |
| F Appearance / settings | **CODE_READY** | Appearance no longer Domain License; honest hub + existing destinations |
| G Design / i18n | **CODE_READY** | 1560 width; en/no/sv/da/pl/uk/es; Kompis/Buddy naming |
| H Agent 1 contracts | **documented** | Presentational only; no parallel Stripe |
| I Agent 3 contracts | **documented** | Support links reused; no support rewrite |
| J Tests | **CODE_READY** | `app-cx-integrated-master-v2.test.ts` + prior journey/media tests |
| LIVE / E2E_VERIFIED | **BLOCKED** | Needs authorized signed-in QA |

---

## Existing vs new (this job)

**Existing reused:** Core catalog/locale/media, software detail, checkout gate, connection center, FAQ, operator, subscription, support tickets, profile.

**New / fixed:**
- Appearance page = honest presentation hub (not DomainLicenseCenterPanel)
- Bedrift dashboard Connection card
- Bedrift connection hub expanded (modules, software, settings, support)
- Contract test suite for V2 gates

---

## Upstream / downstream

| Contract | Owner |
| --- | --- |
| Locale draft/approve + media paths | Platform / prior Core YES |
| Variant/commission writers | Agent 1 |
| Stripe checkout live | Agent 1 — blocked |
| Support inbox / public site | Agent 3 |
| APP presentation + journey | Agent 2 (this) |

---

## Owner signed-in QA route (no password share)

1. `/app` → Explore products → `/app/software` (works without Web license)  
2. Open product detail → Open only if entitled; else Contact/Subscription  
3. Entitled Web → `/app/website-kompis` → Settings → Appearance (hub, no fake save) → Connection  
4. Entitled Bedrift → `/app/kompis-bedrift` → Connection card → Subscription / Support  
5. Confirm no commission on APP cards; SALE unchanged  

---

## Remaining exact approvals

1. Staging media E2E (prior YES + session)  
2. Production media upload YES  
3. Live checkout / Stripe YES (Agent 1)  
4. Optional: Core-backed visitor widget appearance editor (new contract) — not invented here  


## Known upstream (not this job)

`spanish-bedrift-eke-coverage` frozen-hash check fails on `origin/main` for Website Kompis public-chain files (manifest vs widget). Agent 2 did not modify frozen runtime files; do not “fix” hashes here without Agent 3 / freeze approval.
