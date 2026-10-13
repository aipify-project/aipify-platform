# AIPIFY APP + PUBLIC VISUAL POLISH COMBINED — 2026-10-13 RESULT

## Baseline

- **origin/main before work:** `663fdbe1644ea0054568d3a41e04c72599f5f149` (PR #164 Total Visual Consistency LIVE)
- **Public deploy baseline:** `dpl_79vdyuNAZTF8vPuNgCPVtMp6Eo37` READY
- **APP deploy baseline:** `dpl_H8vzu9XoSxkb6SbvfKTLq6ibQCmF` READY
- **Branch:** `feature/app-public-visual-polish-2026-10-13`
- **SQL / schema / secrets / frozen WK:** not used / not touched

## Scope delivered

### A — APP Desktop Polish Phase 1

1. **Sidebar icons** — distinct outline icons per Kompis Bedrift/Web nav id in `components/dashboard/nav-icons.tsx` (no shared home icon for all items). Inactive icons use soft blue; active keeps purple highlight.
2. **Dashboard cards** — stronger left tone chips + colored circular chevron chip on `AppIconActionCard`.
3. **Decorative orb** — removed header CTA text “Ansatte og tilgang” from Bedrift dashboard; orb now shows authentic Kompis mascot (`AppDecorativeOrb`).
4. **Feedback dialog** — viewport-safe: scrollable overlay, opens from top with safe padding (never clipped above viewport); submit uses APP primary gradient.
5. **Subpage background** — Team Center / employees panels use `--app-*` tokens (no cold gray page chrome). Shell canvas family unchanged and visible through APP shell.
6. **Typography / buttons** — sidebar labels 14px / icons 20px; page titles/subtitles upsized; primary buttons use purple→blue gradient + larger hit targets.
7. **Visual system version** — `63.3`.

### B — Auth mascot (Tillegg A)

- `PublicAccessAtmosphere`: decorative mascot moved **top-right**, slightly larger, calmer opacity/mask. Bottom-right left clear for future real Kompis Web launcher (no widget mounted; freeze untouched).

### C — Public Home polish (Tillegg B)

- **B1 Product truth:** Kompis Web features = Available now (green ✓). Bedrift chat/presence/doc-in-conversation = Planned (amber ○ + label). APP hubs for employees/knowledge kept as available. Demo Bedrift copy softened to match.
- **B2 Buttons:** larger min hit targets / product CTAs.
- **B3 Spacing:** section padding tightened (products→core, security→addons→CTA) without CLS redesign.
- **B4 Bottom mascot:** repositioned beside CTA (not clipped behind gradient box). Hero + middle mascots unchanged.
- **B5 Nav/footer:** `Business Packs` → `Add-ons` / locale equivalents; footer tagline aligned to Kompis Web/Bedrift/Core. Routes preserved (`/pricing#business-packs`, legal, language, contact).
- **B6 Scroll:** no new fixed/blur/parallax; prior #164 ambient absolute model preserved. Safari = NOT RUN.

## Files touched

- `components/dashboard/nav-icons.tsx`, `FlatSidebar.tsx`
- `components/app/design/AppDecorativeOrb.tsx`, `AppIconActionCard.tsx`
- `components/app/hubs/AppHubShell.tsx`
- `app/app/kompis-bedrift/page.tsx`
- `components/app/voice-of-the-customer/ShareFeedbackDialog.tsx`, `TopbarShareFeedbackButton.tsx`
- `components/app/team/TeamCenterPanel.tsx`
- `components/auth/PublicAccessAtmosphere.tsx`
- `app/globals.css`
- `lib/design/light-enterprise-theme.ts`, `app-visual-system.ts`
- `lib/app-portal/foundation-nav/premium-visual-system-63.test.ts`
- `components/marketing/homepage/approved-home/*`
- `lib/marketing/parse-approved-public-home.ts`
- `locales/{en,no,sv,da,pl,uk}/marketing.json`

## Status sources (B1)

| Claim | Status | Basis |
|-------|--------|-------|
| Web pages/FAQ/approved docs path | Available | Live Website Kompis public chain (frozen) |
| Web sources/feedback/gaps in APP | Available | APP FAQ/feedback/knowledge panels |
| Web domain/install/license | Available | Connection/license APP surfaces |
| Bedrift employees & access APP hub | Available | `/app/kompis-bedrift/employees` + Team Center |
| Bedrift knowledge/FAQ hubs | Available | Bedrift knowledge route + APP hubs |
| Bedrift private chat / presence / online | Planned | No verified live backend proof; APP hub ≠ runtime |
| Bedrift doc share + Kompis-in-conversation | Planned | No verified live backend proof |

## Freeze

- **Protected Website Kompis files touched:** `0`
- **Runtime hash check:** PASS (`premium-visual-system-63.test.ts`)

## QA matrix

| Check | Result |
|-------|--------|
| typecheck (`tsc --noEmit`) | PASS |
| premium-visual-system-63.test.ts | PASS |
| parseApprovedPublicHome feature status | PASS |
| Freeze hashes | PASS |
| Partner form/backend | untouched |
| Auth routes / company_name persist | untouched (visual atmosphere only) |
| Desktop 1366/1440/1920 visual | Preview/Production smoke after LIVE |
| Feedback dialog viewport | Code fix applied; authenticated APP QA may be BLOCKED by login |
| Safari scroll | NOT RUN |
| OWNER VISUAL ACCEPTANCE | PENDING |
| SAFE TO FREEZE APP DESIGN | NO |

## Release IDs

- **Feature head:** `43c08d9797628448051dbd54c8fd23256eb22901`
- **PR:** [#165](https://github.com/aipify-project/aipify-platform/pull/165) MERGED
- **Merge-SHA:** `334f7143d78fff62e994cee6e8d924244a3adff2`
- **Public (aipify.ai / iz5z):** `dpl_2JnYAt8jbBG2iQjfvBVsqk12nHms` READY
- **APP (app.aipify.ai / aipify-platform):** `dpl_s4eNXEArCavzdcfzCMNEES7o5QrY` READY

## Production smoke (2026-10-13)

| URL | Result |
|-----|--------|
| https://aipify.ai/ | 200 — Planned/Available now markers, Add-ons nav, product-cta, mascot present |
| https://aipify.ai/login | 200 — mascot top-right (`top-[-28px]`), avatar present, old bottom position absent |
| https://aipify.ai/register | 200 — field order fullName → companyName → businessEmail |
| https://aipify.ai/growth-partners | 200 |
| https://app.aipify.ai/ | 200 (authenticated APP panel visual = BLOCKED without login) |

**OWNER VISUAL ACCEPTANCE = PENDING**  
**SAFE TO FREEZE APP DESIGN = NO**  
**Safari = NOT RUN**  
**Frozen WK touched = 0**
