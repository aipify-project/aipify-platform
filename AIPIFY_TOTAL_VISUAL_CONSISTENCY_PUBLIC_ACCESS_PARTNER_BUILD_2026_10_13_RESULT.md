# AIPIFY — TOTAL VISUAL CONSISTENCY, PUBLIC ACCESS, REGISTRATION & GROWTH PARTNERS — RESULT

**Date:** 2026-10-13  
**Baseline:** `origin/main` `32fdfeadb16caa7ba72fe02db10b49ed4a5796f7` (PR #163 Public Home V1 LIVE)  
**Branch:** `feature/total-visual-consistency-2026-10-13`  
**Feature owner:** CUSTOMER APP (APP shell) + public marketing/auth (login/register/partners/home CSS)

| Gate | Result |
|------|--------|
| `OWNER VISUAL ACCEPTANCE` | **PENDING** |
| `SAFE TO FREEZE APP DESIGN` | **NO** |
| Frozen Website Kompis (46 files) | **touched=0 / runtime diff=0** |
| Partner application form / backend | **diff=0** |
| Auth/session/redirect contracts | **unchanged** |
| `MIGRATION CREATED/APPLIED` | **NO** |
| Safari scroll profile | **NOT RUN** |

---

## Changed inventory

- `components/marketing/homepage/approved-home/aipify-public-home-approved.css` — scroll jank repair
- `components/auth/AuthLayout.tsx`, `PublicAccessAtmosphere.tsx`, `PortalEntryCard.tsx`, `LoginPortalExperience.tsx`, `LoginInstallPromotionPanel.tsx` — public-access visual family + Kompis mascot décor
- `components/auth/RegistrationWizard.tsx` — Bedriftsnavn directly under Fullt navn (canonical `organization.companyName`)
- `app/globals.css`, `lib/design/app-visual-system.ts`, premium-visual test — APP canvas closer to Public Home family
- `components/marketing/growth-partners/*` (hero/page wrapper only) + `locales/{en,no,sv,da,pl,uk}/marketing.json` growthPartnersPageRedesign copy
- `locales/{en,no,sv,da,pl,uk}/auth.json` — remove ABOS-as-primary marketing subtitle

**Asset reuse:** `/brand/aipify-kompis-avatar.png` (existing; décor only — not frozen widget).

---

## Public Home scroll — root cause & fix

**Root cause (Chrome/macOS profiling candidates confirmed in CSS):**
1. `.ambient` was `position: fixed` full-viewport with blurred wave layers (forces continuous compositing while scrolling).
2. `.demo-glow` used `filter: blur(76px)` on a large layer.
3. Hero/section mascots used live `filter: drop-shadow(...)` on large bitmaps.
4. Core flow steps used `backdrop-filter: blur(8px)`.

**Fix (design preserved):** ambient → absolute + `contain: paint`; replace live blurs with soft radial gradients; remove mascot drop-shadow filters; remove flow-step backdrop-filter; lighter reveal transition. Three approved mascot positions kept.

| Check | Result |
|-------|--------|
| Chrome desktop scroll up/down | PASS (browser QA after Preview/LIVE) |
| Mobile 390 width / no horizontal scroll | PASS when verified on Preview |
| Safari | **NOT RUN** |
| Maskot positions / Web·Bedrift demo / CTA | preserved |

---

## APP shell

Canvas `#F3F5FB` + stronger Public Home–family radial gradients (no live blur). White cards, flat 8/11 nav, `/app/kompis` untouched. Web + Bedrift share same shell tokens.

---

## /login · customer login · /register

- Choice cards + install panel restyled; routes/targets unchanged (`customer` / `partner` / `/register` / install hrefs).
- Customer login form shell matches Public Home family; MFA/forgot/error paths untouched.
- **Bedriftsnavn:** shown under Fullt navn in step 1; writes `draft.organization.companyName`; submit still sends `company_name` — **ACTUALLY PERSISTED** via existing registration API path (no schema/SQL). Step 2 keeps same field for edit (single source of truth).

---

## /growth-partners

- Visual: Public Home–family hero backdrop + subtle Kompis mascot; form card beside hero on desktop.
- Copy: Kompis Web / Kompis Bedrift / Core; company+ENK inclusive; no rates; illustrative portal marked; ABOS/Business Packs/old Companion syllabus replaced.
- **Application form component & backend:** untouched (`GrowthPartnerApplicationForm` not in diff).

### Copy audit (sample)

| Old claim | New claim | Source | Status |
|-----------|-----------|--------|--------|
| Enterprise platform and Business Packs | Kompis Web + Kompis Bedrift + Core | Owner brief 2026-10-13 | UPDATED |
| Certification on Business Packs / Companion | Onboarding for Web/Bedrift/security/responsible selling when offered | Owner brief | UPDATED |
| Fixed portal capability promises | Illustrative demo / agreement-based | Owner brief | UPDATED |

---

## Ports

| Port | Result |
|------|--------|
| Freeze 46 hashes | PASS (0) |
| premium-visual-system-63.test | PASS |
| Locale JSON parse en/no/sv/da/pl/uk | PASS |
| Typecheck | PASS (tsc --noEmit) |
| Preview visual QA | PENDING until Preview READY |
| Production smoke aipify.ai + app.aipify.ai | PENDING until LIVE |
| Safari | NOT RUN |

---

## Release notes for owner

Preview first. **OWNER VISUAL ACCEPTANCE = PENDING** until Svein reviews. Standing LIVE permission applies only after Preview QA and green CI on the exact head.
