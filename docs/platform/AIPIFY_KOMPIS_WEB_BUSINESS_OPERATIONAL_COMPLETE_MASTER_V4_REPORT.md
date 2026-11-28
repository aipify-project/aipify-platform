# AIPIFY_KOMPIS_WEB_BUSINESS_OPERATIONAL_COMPLETE_MASTER_V4

**Overall:** Operational Web/Bedrift journey **CODE_READY / INTEGRATION_READY** · whole product **not COMPLETE** without signed-in E2E

| | |
| --- | --- |
| Branch | `agent/kompis-web-business-operational-complete-v4-20261128` |
| Baseline main | includes #531 merge + commercial #536 |
| #531 Production | verified in main ancestry; app.aipify.ai serving |
| Agent 1 (#525/#530/#536) | read-only reuse; no Stripe activation |
| Agent 3 | support links only |
| Public-chain freeze | untouched |
| SQL / Stripe / provision / media upload | none |

---

## Phase A–L

| Phase | Status | Evidence |
| --- | --- | --- |
| A #531 + catalog journeys | **LIVE** (prior) / preserved | Catalog ungated; Web/Bedrift ops gated |
| B Kompis Web ops | **CODE_READY** | Dashboard wires connection, knowledge, feedback, usage quota, settings, support |
| C Kompis Bedrift | **CODE_READY** | License status from `loadSubscriptionProductReads`; real panels for docs/comms/meetings/employees |
| D Connection/domains | **INTEGRATION_READY** | Existing connection summary; provision remains fail-closed |
| E Appearance | **BLOCKED** (writer) | Honest hub retained; prior approval-ready candidate stands |
| F Knowledge | **INTEGRATION_READY** | Web FAQ + Bedrift → employee knowledge; no new ingestion |
| G Operator/feedback | **INTEGRATION_READY** | Feedback overview + operator link; no new inbox |
| H Usage/capacity | **CODE_READY** | `/app/website-kompis/usage` + hub signals via `loadWebsiteKompisLicenseQuotaRead` (null≠0 / unavailable) |
| I Onboarding states | **CODE_READY** | Licensed vs not_licensed vs unknown on Bedrift; Web aggregate + quota kinds |
| J Agent 1 contracts | **documented** | APP reads existing quota/license; commercial checkout stays Agent 1 fail-closed |
| K Agent 3 | **documented** | Support ticket links on hubs |
| L Premium APP / i18n | **CODE_READY** | 1560 width; en/no/sv/da/pl/uk/es; Kompis NO/SV/DA |

---

## Changed surfaces

- `app/app/website-kompis/usage/page.tsx` (new)
- `app/app/website-kompis/page.tsx` — quota signals + usage action
- `app/app/website-kompis/settings/page.tsx` — usage card
- `app/app/kompis-bedrift/page.tsx` — authoritative license status + support/subscription
- bindings/nav + portalStructure locales
- `lib/product-catalog/kompis-operational-complete-v4.test.ts`

---

## Owner signed-in QA

1. Without Web license: `/app/software` OK; `/app/website-kompis` gated  
2. With Web license: dashboard shows connection aggregate + plan/remaining (or honest unavailable)  
3. `/app/website-kompis/usage` — plan facts; no buy button  
4. Appearance — hub only  
5. Bedrift dashboard — licensed / not licensed / unknown status; open Employees / Knowledge / Connection  
6. Support from hubs → `/app/support/requests`  

---

## Remaining exact YES

1. Signed-in E2E session  
2. Widget appearance Core writer  
3. Site provision live  
4. Stripe/checkout live (Agent 1)  
5. Staging media E2E (unchanged blocker)  
