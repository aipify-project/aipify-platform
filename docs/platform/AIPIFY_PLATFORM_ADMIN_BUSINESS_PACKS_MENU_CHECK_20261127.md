# AIPIFY_PLATFORM_ADMIN_BUSINESS_PACKS_MENU_CHECK

| Field | Value |
|-------|--------|
| Date | 2026-11-27 |
| Production host | `app.aipify.ai` |
| Production deploy | `dpl_g7R6Yy5cdmPd3JY73VL8eBBQv3xy` · commit `75a7c247` · `main` · READY |
| Verdict | **Active code** — not stale browser cache |

## Findings

1. `app.aipify.ai` aliases production deploy of `main` at `75a7c247` (matches `origin/main` at check time).
2. «Business Packs» under MODULER is defined in `lib/platform/nav-groups.ts` → item `businessPacks` → href `/platform/business-pack-factory` via `lib/platform/nav-config.ts`.
3. Daily product/license catalogue is **License registry** (`/platform/licenses`). Billing copy already states Business Packs/licenses belong under product concerns; factory remains a deep-link builder, not the daily catalogue.
4. Change: remove `businessPacks` from `PLATFORM_NAV_GROUPS` modules only. Keep route, panel, APIs, and `nav-config` entry for direct URL / search.
5. No SQL · no payment · no Support · no Growth Partners changes.

## Result

Sidebar Moduler: License registry · Marketplace · Kompis Web plans (no Business Packs).
