# AIPIFY_APP_CUSTOMER_EXPERIENCE_COMPLETE_MASTER_V1

**Overall:** not COMPLETE (full E2E unverified) · safe APP journey code delivered on PR #531

| | |
| --- | --- |
| PR | https://github.com/aipify-project/aipify-platform/pull/531 |
| Baseline preserved | `0329c8555` |
| Delivery tip | see branch HEAD after push |
| Agent 1 / #525/#530 | untouched |
| Agent 3 Support | untouched |
| Production upload | fail-closed |
| Stripe / financial writes | none |
| SQL apply | none |

---

## Phase status

| Phase | Status | Notes |
| --- | --- | --- |
| A PR #531 read paths + locale editor | **CODE READY** | Locale/media read paths; writers fail-closed; Staging E2E **BLOCKED** (no admin session) |
| B Product Center coherence | **INTEGRATION READY** (contract) | Publication readiness + editor; Agent 1 owns price/commission writers |
| C Dashboard / nav 1560 | **CODE READY** | Home quick action → `/app/software`; width tokens preserved |
| D `/app/software` + detail | **CODE READY** | Detail route `/app/software/[productKey]`; Core catalog + approved content; checkout fail-closed |
| E Mine produkter / subscription | **INTEGRATION READY** | Links to subscription + billing; entitlement states honest; no client-invented access |
| F Kompis Web/Bedrift journey | **CODE READY** (links) | Open → existing `/app/website-kompis` / `/app/kompis-bedrift`; no Core runtime change |
| G UX / i18n | **CODE READY** | Detail keys en/no/sv/da/pl/uk/es |
| H Integration fixtures | **CODE READY** | `app-customer-journey.test.ts` + prior media/presentation tests |
| I Release / LIVE | **BLOCKED** for writers/checkout; read-path code mergeable when CI green | Do not activate Production upload / checkout |

---

## End-to-end flow (intended)

1. Product Center (Platform) locale/media → Core approved content + registered paths  
2. APP `/app/software` — `csp_list_app_store_products` + authoritative variants + approved overlay  
3. Detail `/app/software/[productKey]` — benefits, dependencies, entitlement, fail-closed purchase  
4. If active → Open Kompis Web/Bedrift; else → Contact / Subscription / Billing  
5. SALE reuses same catalog card without buy  

**Not E2E VERIFIED** — no authorized Staging/Production APP session in this job.

---

## Remaining contracts / approvals

1. Owner-assisted Staging media E2E (prior YES scope only)  
2. Separate YES: Production media upload  
3. Separate YES: live checkout / Stripe  
4. Agent 1 coordination if price/commission writer UX must change  

## Owner-assisted QA (browser, no password share)

1. Sign in to APP → Home → Explore/products → `/app/software`  
2. Open a product detail → confirm no fake Buy; Open only when entitled  
3. From detail → Website Kompis / Bedrift when active  
4. Subscription + Billing links resolve; no seller messages in APP  

## Test evidence (local)

- `npx tsx lib/product-catalog/app-customer-journey.test.ts`  
- Prior: locale-media, content-media-presentation, product-media-bytes, app-storefront-view-model, product-center-ui-contract  
