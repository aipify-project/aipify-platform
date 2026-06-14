# Aipify Command Bar Engine — Phase 259

## Purpose

Global command experience for navigating, searching, and performing actions across Aipify. Users should never need to remember where something is — they simply ask Aipify.

**Feature owner:** Shared UI (`components/command-bar/`) with portal-specific registries in Customer App, Platform Admin, and Super Admin layouts.

## Triggers

| Method | Behavior |
|--------|----------|
| `⌘K` (Mac) | Toggle command bar |
| `Ctrl+K` (Windows) | Toggle command bar |
| Topbar search button | Opens command bar (Customer + Platform shells) |
| Super Admin header trigger | Opens command bar |

## Portals

| Portal | Route prefix | Provider |
|--------|--------------|----------|
| Customer | `/app/*` | `app/app/layout.tsx` → `DashboardShell` |
| Platform Admin | `/platform/*` | `app/platform/layout.tsx` |
| Super Admin | `/super/*` | `SuperAdminShell` |
| Legacy dashboard | `/dashboard/*` | `app/dashboard/layout.tsx` |

## Architecture

```
components/command-bar/
  CommandBarProvider.tsx   — keyboard shortcut, recent history, role context
  AipifyCommandBar.tsx     — modal UI, search, keyboard navigation

lib/command-bar/
  registry.ts              — navigation + action commands per portal
  permissions.ts           — role-aware filtering
  server-search.ts         — customers, tickets, knowledge, skills, team, modules
  recommendations.ts       — since-last-login + contextual suggestions
  recent.ts                — localStorage command history

app/api/command-bar/
  context/route.ts         — recommendations
  search/route.ts          — dynamic search results
```

## Sections

1. **Navigation** — from nav config / search index
2. **Actions** — approve, create automation, install wizard, etc.
3. **Search** — server-backed entity search
4. **Recommendations** — since last login + pending approvals + executive summary
5. **Recent** — recently visited destinations (localStorage)

## Role awareness

- Customer roles: `owner` → `read_only` hierarchy
- Platform roles: `super_admin` > `platform_support`
- `superAdminOnly` commands hidden from platform support and customers

## Performance targets

- Open: instant (client modal, no network on open)
- Search: 200ms debounce, parallel RPC queries, ≤300ms typical

## i18n

`locales/{en,no,sv,da}/commandBar.json`

## Core principle

> "I don't need to know where things are. I just ask Aipify."

People First. Technology Second.
