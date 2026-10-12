# AIPIFY APP — FLOATING COMPANION DECOMMISSION.57 — RESULT

**Job:** `AIPIFY_APP_FLOATING_COMPANION_DECOMMISSION_57`  
**Source map:** `AIPIFY_APP_PANEL_CURRENT_STATE_LICENSE_COMPANION_READ_56_RESULT.md`  
**Status:** LIVE on Customer APP · **READY FOR OWNER APP UI TEST**

---

## Flags

| Flag | Result |
|------|--------|
| `FROZEN WEBSITE KOMPIS FILES TOUCHED` | **0** |
| `WEBSITE KOMPIS RUNTIME DIFF` | **0** (no protected runtime path in diff; manifest SHA256 all match) |
| `APP FLOATING COMPANION MOUNT` | **ABSENT** |
| `/app/kompis OPERATOR` | **PRESERVED** |
| `DB/SQL/CONFIG MUTATION` | **0** |

---

## 1. Authoritative mount (why this was the decommission point)

| Concern | Exact location | Class |
|---------|----------------|-------|
| APP shell mount | `components/dashboard/DashboardShell.tsx` wrapped customer `/app*` UI in `CompanionShell` when `companionExperienceLabels` was set | `VERIFIED` (job 56 + pre-edit source) |
| Top-bar launcher | Same file → `CompanionTopBarButton` into `Topbar.companionButton` | `VERIFIED` |
| Label enablement | `app/app/layout.tsx` → `companionExperienceLabels={buildLayoutCompanionExperienceLabels(t)}` | `VERIFIED` |
| Floating UI tree | `CompanionShell` → `CompanionExperienceProvider` + `CompanionDrawer` + `CompanionFloatingButton` + toast | `VERIFIED` |
| Route remount | Client shell persists across SPA navigations; provider lived for entire `/app` session once mounted | `VERIFIED` |
| Shell-started network | Persistent chat queue client mounts inside provider (`use-companion-persistent-chat`) — removed with shell unmount | `VERIFIED` / `INFERRED` for post-ship idle |

**Why correct point:** Job 56 proved the floating surface is owned solely by Customer APP `DashboardShell` + layout labels. It is **not** Website Kompis, **not** `/app/kompis` operator, and **not** in the freeze manifest (`frozen=false` for both edited paths).

**Freeze boundary proof (before edit):** Manifest `protectedRuntimeFiles` (46 paths) contains zero `DashboardShell` / `app/app/layout` entries. Decommission did not require touching any protected file → not `DECOMMISSION BLOCKED`.

---

## 2. Ship record

| Field | Value |
|-------|-------|
| PR | [#149](https://github.com/aipify-project/aipify-platform/pull/149) |
| Feature commit | `de1adef4e4c8fc8419daedcb9069a876ca350b7b` |
| Merge commit | `dde57795d08e871602fe52a6afafbf2ae0aa3f5d` |
| Vercel project | **`aipify-platform`** (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`) |
| Domain | **`app.aipify.ai`** (verified production domain on this project) |
| Production deploy | `dpl_CZC2qsWE1DswuZxK7v1ekXsPWwHS` |
| Deploy state | **READY** |
| Deploy SHA | `dde57795d08e871602fe52a6afafbf2ae0aa3f5d` |
| Aliases include | `app.aipify.ai`, `aipify-platform.vercel.app` |

Apex Website Kompis project (`aipify-platform-iz5z` / `aipify.ai`) was **not** the target of this APP decommission. Protected Website Kompis file bytes unchanged → `WEBSITE KOMPIS RUNTIME DIFF = 0`.

---

## 3. Exact files changed

| File | Change |
|------|--------|
| `components/dashboard/DashboardShell.tsx` | Removed `CompanionShell` / `CompanionTopBarButton` imports, prop, top-bar button, and shell wrap |
| `app/app/layout.tsx` | Stopped building/passing `companionExperienceLabels` |
| `lib/app/companion/floating-companion-decommission-57.test.ts` | **Added** contract test (mount absent, kompis preserved, frozen hashes) |

No other runtime files modified.

---

## 4. Tests and bundle / import proof

**Passed**

- `npx tsx lib/app/companion/floating-companion-decommission-57.test.ts`
- `companion-surface-unification.test.ts`
- Website Kompis: FAQ regression 54, protected-route lifecycle, white-startup, public-surface-contract
- `lib/kompis-operator/kompis-operator.test.ts`

**Contract assertions (shell source)**

- `DashboardShell` must not contain: `CompanionShell`, `CompanionTopBarButton`, `CompanionFloatingButton`, `CompanionDrawer`, `companion-experience`, `companionExperienceLabels`, `withCompanionExperience`
- Layout must not contain: `buildLayoutCompanionExperienceLabels`, `companionExperienceLabels`
- Nav still has `kompisOperator` → `/app/kompis`; `app/app/kompis/page.tsx` exists
- Every frozen manifest SHA256 matches on-disk file

**Import graph:** APP shell no longer imports `@/components/app/companion-experience`. Floating UI cannot load via shell remount on SPA transitions.

**Note:** `companion-experience.test.ts` still fails on an unrelated `es` locale title gap (`experience.title` undefined) — pre-existing; not caused by this diff; not required for mount absence.

---

## 5. Dormant / preserved backend (not deleted)

Left in repo for later cleanup / full-page use (not mounted by APP shell):

- `components/app/companion-experience/*` (including `CompanionShell`, drawer, floating button)
- `lib/app/companion/**` queue client, session, labels
- `app/api/aipify/companion/**` APIs
- Companion chat/queue tables and RPCs
- Full-page `/app/companion` route (sidebar nav item retained — not floating)
- `/app/kompis` Kompis Operator
- Frozen Website Kompis public chain
- Command Brief card that called `useOptionalCompanionExperience()` now no-ops drawer open (`null` context) — dormant UX, no new FAB/placeholder added

---

## 6. Owner APP UI test (required)

Authenticated browser was `BLOCKED` in job 56 and remains unavailable here (no SSO bypass, no test user).

**READY FOR OWNER APP UI TEST**

1. Log in to `https://app.aipify.ai`
2. Open several `/app/*` routes (dashboard, settings, notifications, intelligence)
3. Hard refresh and SPA-navigate between routes
4. Confirm: **no** floating Companion button, drawer, or top-bar Companion control
5. Open sidebar **Kompis** → `/app/kompis` still loads the operator surface

---

## Stop

No navigation rebuild, license work, or new Platform-Kompis started.
