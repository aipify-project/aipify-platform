# AIPIFY — KOMPIS WEB PLAN COMMUNICATION & UPGRADE READINESS — BUILD RESULT 2026-10-13

## Release

| Item | Value |
|------|--------|
| Baseline `origin/main` (pre-job) | `6454e59a` |
| Branch | `feature/kompis-web-plan-communication-2026-10-13` |
| PR | [#176](https://github.com/aipify-project/aipify-platform/pull/176) — MERGED |
| Merge commit | `1390e499e35611238e38852b7350f905f1304241` |
| Production deploy (APP / `aipify-platform`) | `dpl_49c8SqSet6AD7ucex4aMs6GsejcJ` — **READY** · aliases include `app.aipify.ai` |
| Production deploy (`aipify`) | `dpl_71pkDHL38zxRRek3k3ycU9xcufrx` — GitHub status **success** |
| Production deploy (`aipify-platform-iz5z`) | `dpl_DErZBaKgLV1UCZMyZts8wVPmqXsB` — GitHub status **success** |

## Delivered (safe presentation only)

### Canonical catalog — `lib/website-kompis-plans/`

- Typed Free / Standard / Pro catalog: 150 lifetime · 2500 @ NOK 599/5 990 · 10000 @ NOK 1 199/11 990
- `offerStatus: planned`, `checkoutEnabled: false`, `vatStatus: unknown`
- Annual = pay 10 for 12; `annualRenewsAnswersMonthly: true`
- `WEBSITE_KOMPIS_USAGE_METER_AVAILABLE = false`
- Draft communication template IDs + localized preview builder
- Upgrade-readiness contract / future gates A–E + Stripe trial isolation note
- Unit test: `lib/website-kompis-plans/catalog.test.ts` — PASS

### APP UI

- `WebsiteKompisPlansPanel` mounted on `/app/software`
- Honest **Answer usage is not available yet** — no fake 70/150 meters
- Planned badge + no Buy / Stripe checkout CTAs
- Links to existing Subscription + Invoices (read-only paths)

### Platform UI

- `/platform/communications/website-kompis-plans`
- Nav: `platform.nav.websiteKompisPlans` (product group)
- Catalog cards + draft email template selector/preview
- Banner: never sends customer email; never mutates Stripe/entitlements
- Readiness gates A–E listed as `blocked_until_owner_auth`

### Locales

- `customerApp.websiteKompisPlans.*` in `locales/{en,no,sv,da,pl,uk}/customer-app/core.json`
- `platform.websiteKompisPlans.*` + nav label + preview subjects/bodies in `locales/{en,no,sv,da,pl,uk}/platform.json`

### Audit artifact included

- `AIPIFY_KOMPIS_WEB_FREE150_PAID2500_BILLING_LICENSE_AUDIT_V1_RESULT.md` (read-only audit at `6454e59a`)

## Ownership matrix (discovery)

| Concern | Status | Owner / source |
|---------|--------|----------------|
| Planned product catalog (presentation) | **DELIVERED** | `lib/website-kompis-plans/` |
| Platform communication preview | **DELIVERED** | `/platform/communications/website-kompis-plans` |
| APP plan presentation | **DELIVERED** | `/app/software` + `WebsiteKompisPlansPanel` |
| Answer ledger / usage meter | **MISSING** | Requires SQL + possibly frozen ask reopen (Gate A) |
| Multisite APP site selector + knowledge ACL | **PARTIAL/MISSING** | Install/domain foundation exists; secure selector not delivered (Gate B) |
| Stripe WK SKU / checkout / webhooks | **MISSING** | Shared Stripe shell exists; no new WK SKUs; 14d trial conflict noted (Gate C) |
| Customer transactional email send | **MISSING** | Draft preview only; no Resend/event pipeline for these templates (Gate D) |
| Invoice lines per website | **MISSING** | APP invoices remain read-only receive (Gate E) |
| Frozen Website Kompis public chain | **UNTOUCHED** | Overlap = 0 protected files |

## Product rules vs active commerce

| Rule | Owner decision | Active in Stripe / entitlements |
|------|----------------|----------------------------------|
| Free 150 lifetime / site | Yes | **No** — planned presentation only |
| Standard 2500 / mo · 599 / 5990 | Yes | **No** |
| Pro 10000 / mo · 1199 / 11990 | Yes (post-audit) | **No** |
| Annual pay-10-get-12 + monthly answer renew | Yes | **No** |
| VAT / B2B tax display | Unknown | **UNKNOWN** — labeled in UI |

## Hard counters

| Metric | Count |
|--------|------:|
| Customer emails sent | **0** |
| Stripe mutations | **0** |
| SQL / migration changes | **0** |
| Frozen WK public-chain file diffs | **0** |

## QA

| Check | Result |
|-------|--------|
| `npx tsx lib/website-kompis-plans/catalog.test.ts` | PASS |
| `tsc --noEmit` | PASS |
| Locale JSON structure en/no/sv/da/pl/uk | PASS |
| Vercel PR preview checks | PASS |
| Production deploy READY (`aipify-platform`) | PASS |
| Owner visual acceptance (screenshots) | **PENDING** |
| `SAFE TO FREEZE APP DESIGN` | **NO** |

## Gap-prioritized next authorizations (not started)

1. **A** — Server answer ledger SQL/RLS + named frozen-ask reopen if enforcement touches public chain  
2. **B** — Multisite server-bound site context + knowledge ACL  
3. **C** — Isolated WK Stripe SKUs/checkout/webhooks; trialDays=0 path (do not change global 14-day trial blindly)  
4. **D** — Platform email delivery events + transport for quota/billing templates  
5. **E** — Invoice site lines + optional Stripe→enterprise_invoices sync  

## Acceptance flags

- **OWNER VISUAL ACCEPTANCE** = PENDING  
- **SAFE TO FREEZE APP DESIGN** = NO  

---

Stop. No next build job started.
