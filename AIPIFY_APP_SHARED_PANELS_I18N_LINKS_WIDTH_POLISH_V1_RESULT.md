# AIPIFY APP — SHARED PANELS I18N, LINKS & WIDTH POLISH V1 — RESULT

Date: 2026-10-14  
Branch: `feat/app-shared-panels-i18n-links-width-polish-v1`  
Base: `origin/main` @ `34a7774e`

## Verdict

**PARTIAL — code PASS; authenticated runtime browser QA NOT RUN; no LIVE claim.**

Ordinary UI/i18n polish shipped for PR. Bedrift entitlement Step B, fake-green product status, and FAQ multilingual schema remain deferred.

## Isolation

- Worktree: `/Users/veltrix/Development/aipify-app-shared-panels-i18n-links-width-polish-v1`
- Recovered from accidental checkout of D2 branch tip; WIP moved onto polish branch with **zero file overlap** vs D2 commit.
- Stash `step-b-wip-blocked-not-for-merge` **not** touched.
- Website Kompis Public Chain protected files **not** modified.

## Changes

### Links

| Surface | Before | After |
|---|---|---|
| License back link | `/app` (ambiguous) | `/app/command-center` via `resolveAppHref` |
| License billing CTA | `/app/billing` | `/app/account/subscription` |

Labels remain locale-driven (`license.center.backToApp`).

### Width

| Route / panel | Before | After |
|---|---|---|
| `/app/license` | `max-w-3xl` panel, loose page padding | `AppLayoutClasses` page shell + `w-full` panel |
| `/app/account/integrations` | Hub panel `max-w-4xl` | `w-full` inside `AppHubShell` / `AppContentWidth` (1560) |
| Modules admin (non-embedded) | `max-w-5xl` | `AppLayoutClasses` page width |
| Bedrift communications / meetings / employees | Already `AppHubShell` + embedded `w-full` | Unchanged (already canonical) |

### i18n (en / no / sv / da / pl / uk / es)

- Full `locales/*/license.json` translations (created `locales/es/license.json`).
- `shell.licenseSidebar.workspace` (+ related sidebar labels) localized; ES organization-context strings filled.
- `commercialPackages.modules` retry / unnamedModule / loadError (+ pl/uk/es module titles).
- `companionBriefing` keys added for pl / uk / es (license page loads companion split).
- Modules panel no longer falls back to raw technical keys; uses `unnamedModule`.

### Tests

| Gate | Result |
|---|---|
| `npx tsx lib/app/shared-panels-i18n-links-width-polish.test.ts` | **PASS** |
| `npx tsx lib/app-portal/software-catalog/software-catalog.test.ts` | **PASS** |
| Full `tsc --noEmit` | **NOT RUN** (project `tsc` binary not wired via npx package) |
| Authenticated browser QA (5 routes × locales) | **NOT RUN** |
| CI | Pending PR |

## Screenshot issue resolution

1. **Back link “Tilbake til kontrollsenteret”** → navigates to Command Center (`/app/command-center`).  
2. **License English blocks in NO (and other locales)** → translated via `license.json` for all 7 locales.  
3. **Integrations missing width** → removed `max-w-4xl` cap.  
4. **Modules raw identifiers** → presentation helper + `unnamedModule` fallback (no raw snake_case titles).  
5. **Sidebar “Workspace:”** → localized in shell.  
6. **Companion briefing on license** → companion split loaded; briefing keys present for all 7 locales.

## Deferred / blocked (Step B — not this job)

- Kompis Bedrift dashboard/settings showing workspace “active/Klar” vs missing `kompis_bedrift` entitlement (do **not** fake green; needs entitlement-aware copy in Step B).
- Module enable/disable entitlement controls for non-entitled products.
- Employee FAQ multilingual Core schema/RPC authorization warning (translate-only already in scope elsewhere; no schema invented).
- Broader portalStructure English leftovers outside license/modules/shell (e.g. some form `Description` labels) — report only, not expanded.

## Safety

- No SQL / RLS / secrets / entitlement grants / UnoNight hardcoding.
- No Product Step B permission rewrite.
- D2 agreement-approval job kept separate.

## PR / deploy

- PR: https://github.com/aipify-project/aipify-platform/pull/214  
- Head SHA: `13aa1f97` (feature commit `475db10d`)  
- Merge: not auto-merged (runtime QA NOT RUN)  
- LIVE deploy: **not claimed**
