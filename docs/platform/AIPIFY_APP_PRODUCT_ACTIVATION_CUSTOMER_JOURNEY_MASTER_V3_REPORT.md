# AIPIFY_APP_PRODUCT_ACTIVATION_CUSTOMER_JOURNEY_MASTER_V3

**Overall:** APP activation journey **CODE_READY / INTEGRATION_READY** · whole APP **not** complete (no signed-in E2E) · Release of #531 was **BLOCKED** by typecheck then patched in this job.

| | |
| --- | --- |
| PR | https://github.com/aipify-project/aipify-platform/pull/531 |
| Baseline | `22cb27cbc` |
| Delivery tip | see branch HEAD after push |
| Failed deploys (pre-fix) | `dpl_2mXNXi5hkAW9e2B2mBQdC1TQX2nD` · `dpl_DJPHvbfDsp7J6X2tRwUCqhamqQy4` |
| Agent 1 / 3 | not overwritten; contracts reused |
| SQL / Stripe / media Production | none |

---

## Phase A–L

| Phase | Status | Notes |
| --- | --- | --- |
| A Release #531 | **BLOCKED→fixing** | Vercel failed typecheck; duplicate `openProduct`, Set `.map`, ProcessEnv gate fixed; redeploy after push |
| B Product Center | **INTEGRATION_READY** | Existing Core locale/media/signed URL path preserved |
| C Catalog/detail | **CODE_READY** | Ungated catalog; detail fail-closed checkout; setup next steps when active |
| D Mine products | **CODE_READY** | `/app/software?scope=licensed` + entitlement badges from Core access reads |
| E Subscription/invoices | **INTEGRATION_READY** | Existing `/app/account/subscription` (+ invoices tab); no parallel finance APIs |
| F Onboarding | **CODE_READY** | `resolvePostRegistrationActivationHref` — free browse vs entitled open |
| G Kompis Web | **CODE_READY** | Settings + Appearance hubs link Connection/Support; existing dashboard/connection |
| H Kompis Bedrift | **CODE_READY** | Settings/connection hubs expanded; honest empty elsewhere |
| I Appearance | **BLOCKED** (writer) | Honest hub kept; candidate `AIPIFY_WIDGET_APPEARANCE_EDITOR_APPROVAL_READY_V1.md` |
| J Agent 1 | **documented** | License/subscription/checkout remain Agent 1; APP presents fail-closed |
| K Agent 3 | **documented** | Support tickets linked; no seller inbox on APP start |
| L Design/i18n | **CODE_READY** | 1560 width; en/no/sv/da/pl/uk/es scope/setup keys |

---

## Agent interfaces

| Concern | Owner |
| --- | --- |
| Variant/commission/Stripe writers | Agent 1 |
| Support inbox / public site / freeze hashes | Agent 3 |
| APP catalog, detail, activation UX | Agent 2 (this) |

---

## Owner signed-in QA

1. `/app/software` — All vs Licensed scope  
2. Open product — inactive shows checkout closed / Contact / Subscription / Support  
3. Entitled product — Open + Continue setup (Connection, FAQ, Settings, Support)  
4. Web Settings / Bedrift Settings — Connection + Support present  
5. Appearance — hub only, no fake save  
6. `/app/account/subscription` — authoritative reads; invoices tab  

---

## Remaining exact YES

1. Staging media E2E session  
2. Production media upload  
3. Stripe checkout live (Agent 1)  
4. Widget appearance writer SQL (candidate only)  
5. Confirm Vercel READY on new HEAD before calling LIVE  
