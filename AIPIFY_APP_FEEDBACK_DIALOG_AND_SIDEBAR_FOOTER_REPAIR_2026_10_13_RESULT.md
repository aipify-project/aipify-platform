# AIPIFY APP FEEDBACK DIALOG + SIDEBAR FOOTER REPAIR — 2026-10-13 RESULT

## Baseline

- **origin/main before work:** `145aa91a` (RESULT IDs for Desktop Refinement V2 / PR #167)
- **Branch:** `feature/app-feedback-dialog-sidebar-footer-repair-2026-10-13`
- **Scope:** A feedback modal visibility + B sidebar footer / privacy placement only
- **Not touched:** Public Home, login/register, partners, SQL, frozen Website Kompis Public Chain, job 67+

## Root cause — feedback dialog (A)

Dialog was rendered **inside** the sticky APP topbar / `aipify-app-shell` tree. Shell root uses `overflow-x-hidden`. In Safari (and some Chromium paths), that ancestor becomes the containing block for `position: fixed`, so the overlay/dialog clips to a thin white strip at the top instead of covering the viewport.

**Fix:** `createPortal(..., document.body)`, centered viewport overlay `z-[110]`, body scroll lock, Escape, Tab focus trap, return focus to trigger. Feedback fields/submit API unchanged.

## Root cause — sidebar footer (B)

`AnalyticsConsentProvider` owned a **floating** `fixed bottom-4 left-4` privacy button (offset via CSS in V2). That sat outside the license card and looked disconnected / near the viewport edge.

**Fix:** APP layout sets `hideFloatingSettingsTrigger`. `LicenseSidebarPanel` mounts the same `openPrivacySettings()` control under the workspace/license card (`aipify-sidebar-privacy-trigger`). Consent cookie/banner logic unchanged. Marketing/partners keep floating trigger. CSS belt: hide floating trigger under `.aipify-app-shell`.

## Files changed

- `components/app/voice-of-the-customer/ShareFeedbackDialog.tsx`
- `components/app/voice-of-the-customer/TopbarShareFeedbackButton.tsx`
- `components/analytics/AnalyticsConsentProvider.tsx`
- `components/app/license/LicenseSidebarPanel.tsx`
- `components/dashboard/DashboardShell.tsx` (label typing)
- `app/app/layout.tsx`
- `lib/design/light-enterprise-theme.ts` (footer padding)
- `lib/design/app-visual-system.ts` (v63.5)
- `app/globals.css`
- `lib/app-portal/foundation-nav/premium-visual-system-63.test.ts`

## QA

| Gate | Result |
|------|--------|
| premium-visual-system-63.test.ts | PASS |
| consent.test.ts | PASS |
| Frozen WK protected files | **0** touched; hashes asserted in test |
| Feedback fields / submit API | Unchanged |
| Consent cookie / banner | Unchanged |
| Authenticated Safari visual | NOT RUN (agent); owner must confirm |
| Chrome/agent DOM | Portal-to-body + footer button in code |
| FEEDBACK MODAL SAFARI VISIBLE | **NOT RUN** (code fix; Safari owner gate) |
| PRIVACY BUTTON NON-OVERLAPPING | **YES** (code: footer-attached; floating hidden in APP) |
| OWNER VISUAL ACCEPTANCE | PENDING |
| SAFE TO FREEZE APP DESIGN | **NO** |

## Release IDs

- Feature head: `4917d816`
- PR: [#168](https://github.com/aipify-project/aipify-platform/pull/168) MERGED
- Merge-SHA: `502ae64c715eace0be1222315d3f3881c2ee5795`
- APP project: `aipify-platform`
- APP deploy: `dpl_5r4eMdBQm3PidbQ4zeis9XGy3WfD` — **READY**
- Canonical domain: `https://app.aipify.ai` (HTTP 200; Link `dpl=` matches)

## Verdict

**Repair LIVE on APP Production.** Confirm in Safari: full feedback modal + privacy under license card. SAFE TO FREEZE APP DESIGN = NO.
