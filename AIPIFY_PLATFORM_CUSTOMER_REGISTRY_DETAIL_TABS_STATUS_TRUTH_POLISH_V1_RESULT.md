# AIPIFY — PLATFORM CUSTOMER REGISTRY + DETAIL TABS, STATUS TRUTH & COPY POLISH V1 — RESULT

**Feature owner:** PLATFORM ADMIN  
**Branch:** `fix/platform-customer-registry-detail-tabs-status-truth-polish-v1`  
**PR:** https://github.com/aipify-project/aipify-platform/pull/232  
**Head:** `05911b41`  
**Scope:** `/platform/customers`, `/platform/customers/[id]` (+ view contracts, locales, tests)  
**Out of scope:** Customer APP, Core writes, Bedrift grants, Website Kompis Public Chain, Step B stash

## Verdict

**PARTIAL — PR open; visual QA NOT RUN (auth-gated); LIVE merge held.**

Status-truth mapper, registry filter layout, detail tabs, lavender canvas token reuse, and 7-locale copy are implemented and unit-tested. Authenticated browser QA and Production LIVE merge are blocked until visual QA can run.

## Status source matrix (read-only)

| UI signal | Authoritative source | Must not derive from |
|---|---|---|
| Customer agreement / APP subscription badge | `commercial.subscriptionStatus`, `commercial.lifetime` | Membership count, Bedrift entitlement |
| Website Kompis product chip | Overlay `GET …/website-kompis` when loaded; else detail entitlements/licenses matching `website_kompis`; install/domain counts → **pending** (not hard unavailable) | Legacy alias “Kompis Web” chip |
| Web install / domain / runtime | Delivery tab panels (`AppKompisDelivery`, `CustomerWebsiteRuntime`) + domain/install tables | Product chip inventing “Unavailable” when install exists |
| Kompis Bedrift product chip | Overlay `GET …/kompis-bedrift` (`active` + licensed/enabled) or Core entitlement `kompis_bedrift` | Membership, lifetime, general APP license, eligible-only gate |
| Membership ready (control plane metric) | `usage.memberCount > 0` | Bedrift / Website Kompis product status |
| Overall control-plane status | Membership + license rows + provisioning signals | Single product chip |

**Contract:** `lib/platform-portal/product-status-truth.ts` → `buildProductStatusTruth()`  
**Wired into:** `buildPlatformCustomerControlPlaneSummary()` (chips only: `website_kompis` + `kompis_bedrift`)

### Before → after (UnoNight Web-only class of bug)

| Before | After |
|---|---|
| Bedrift chip **Active** from membership | Bedrift **Unavailable** / unverified without Core entitlement |
| Extra **Kompis Web · Unavailable** with install present | No duplicate Web chip; Website Kompis **Pending** when install/domain signal exists |
| Conflicting greens without entitlement proof | Fail-closed; note explains agreement ≠ Bedrift grant |

## UX delivered

1. **Registry:** Narrow search (`lg:max-w-[14rem]`), flex-wrap filters with `pr-8` + `appearance-auto` so dropdown arrows remain visible; APP canvas `#F3F5FB`.
2. **Detail:** Header + control-plane summary stay visible; content under `?tab=` tabs (overview / agreement / licenses / domains / delivery / admin) with keyboard arrow navigation and Suspense for `useSearchParams`.
3. **Full-width tab content** (no empty sticky aside column).
4. **i18n:** `detailTabs.*` + `controlPlane.productTruthNote` in en/no/sv/da/pl/uk/es.

## Tests

| Check | Result |
|---|---|
| `npx tsx lib/platform-portal/product-status-truth.test.ts` | **PASS** (7) |
| `npx tsx lib/core/access-control-plane/access-control-plane-62.test.ts` | **PASS** |
| Locale keys detailTabs + productTruthNote (7 locales) | **PASS** |
| Website Kompis Public Chain frozen files in diff | **PASS** (none) |
| Authenticated visual QA (desktop + narrow) | **NOT RUN** |
| Read-only Core field check on live UnoNight | **NOT RUN** |
| CI on PR | Pending after open |

## Touched files

- `app/platform/customers/[id]/page.tsx`
- `components/platform/platform-portal/PlatformPortalCustomerDetailPanel.tsx`
- `components/platform/platform-portal/PlatformPortalCustomersPanel.tsx`
- `lib/platform-portal/product-status-truth.ts` *(new)*
- `lib/platform-portal/product-status-truth.test.ts` *(new)*
- `lib/platform-portal/index.ts`, `labels.ts`, `types.ts`
- `lib/core/access-control-plane/platform-summary.ts`
- `lib/core/access-control-plane/access-control-plane-62.test.ts`
- `locales/{en,no,sv,da,pl,uk,es}/platform.json`

## LIVE gate

Pre-approved merge only if: clean diff, green CI, **and** authenticated visual/runtime QA. Visual QA is **NOT RUN** → **do not merge to Production LIVE** until that gate is completed or explicitly waived by owner.

## Screenshots

Not captured (auth browser unavailable in this session).
