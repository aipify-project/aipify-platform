# AIPIFY APP DESKTOP REFINEMENT V2 — 2026-10-13 RESULT

## Baseline

- **origin/main before work:** `334f7143d78fff62e994cee6e8d924244a3adff2` (PR #165 APP+Public polish LIVE)
- **Prior polish kept:** distinct sidebar icons, colored chevrons, orb mascot, feedback viewport fix, APP canvas family
- **Branch:** `feature/app-desktop-refinement-v2-2026-10-13`
- **Public Home / auth / partners:** not touched (out of scope)
- **SQL / frozen WK:** not used / not touched

## Gap closed (vs owner screenshot after V1)

| Gap | Fix |
|-----|-----|
| Double arrows on cards | Left = semantic `HubFeatureIcon`; right chevron only |
| Typo too small on large desktop | Sidebar 15px, cards ~18px titles / 15–16px body, page title ~28–30px |
| Sidebar width | 280 → **256px** (within 240–260) + taller nav rows (min-h-12) |
| Mascot small in orb | Orb 13.5rem; mascot ~92% fill |
| Flat cool canvas | Stronger wave opacities + translucent main column so waves read through |
| License footer cramped + privacy overlap | Label/value hierarchy; footer padding; privacy trigger offset `lg:left calc(256px+1rem)` via CSS class (provider logic unchanged) |
| Limited features marketed as ready | Bedrift microcopy honesty for docs/comms/meetings (6 locales) |
| Feedback popup | **PASS — verified code already viewport-safe from #165; no further code** |

## Icon map (dashboard cards)

**Bedrift:** users · document · faq · messages · calendar · modules  
**Web hub:** qa · faq · connection · modules  
**Shared pattern:** settings/connection/account hubs use same `HubFeatureIcon` set

## Shared owners changed

- Tokens: `lib/design/light-enterprise-theme.ts`, `lib/design/app-visual-system.ts` (v**63.4**)
- Shell CSS: `app/globals.css` (canvas, orb, privacy offset)
- Cards: `AppIconActionCard`, `HubFeatureIcon` (new)
- Nav: `FlatSidebar`
- Footer: `LicenseSidebarPanel`
- Privacy trigger class only: `AnalyticsConsentProvider` (no consent/cookie behavior change)
- Hubs: Bedrift/Web/Account pages

## Before → after sizes

| Token | Before | After |
|-------|--------|-------|
| Sidebar width | 280px | 256px |
| Nav label | 14px | 15px |
| Nav icon | 20px | 22px |
| Nav row | min-h-11 / py-2 | min-h-12 / py-2.5 |
| Page title | ~27–29px | ~28–30px |
| Card title | ~17–18px | ~18–19px |
| Card body | ~15px | 15–16px |
| Orb | 11rem / mascot 72% | 13.5rem / mascot 92% |

## QA

| Gate | Result |
|------|--------|
| typecheck | PASS |
| premium-visual-system-63.test.ts (incl. freeze hashes) | PASS |
| Frozen protected files touched | **0** |
| Feedback viewport | **PASS** (no code change this job) |
| Authenticated APP visual 1366/1440/1920 | BLOCKED without login for agent |
| Safari | NOT RUN |
| Public Home / login / register | NOT IN SCOPE |
| OWNER VISUAL ACCEPTANCE | PENDING |
| SAFE TO FREEZE APP DESIGN | NO |

## Release IDs

_(filled after merge/deploy)_

- Feature head:
- PR:
- Merge-SHA:
- APP project / deploy / READY / domain:
