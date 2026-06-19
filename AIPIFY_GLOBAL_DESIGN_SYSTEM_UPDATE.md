# AIPIFY — Global Design System Update

**TITLE:** Light Enterprise, Premium & Wow Experience  
**PURPOSE:** One unified Aipify design system across public website, APP, Platform, Super Admin, Growth Partner, Business Packs, and system pages.  
**Feature owner:** SHARED (design tokens + UI components)

## Core principle

Aipify must look professional, premium, elegant, calm, modern, and enterprise-ready — not like a generic admin template or dark cyberpunk dashboard.

> *Unonight owns the night. Aipify owns the workday.*

## Default theme

**Light Enterprise Theme** — warm off-white canvas (`#F7F6F3`), Companion Purple (`#7C3AED`), Soft Blue-Purple (`#6366F1`).

## Implementation map

| Area | Path |
|------|------|
| CSS tokens | `app/globals.css` |
| TypeScript tokens & classes | `lib/design/light-enterprise-theme.ts` |
| Status system (icon + text) | `lib/design/status-system.ts`, `components/ui/aipify-status-badge.tsx` |
| Page header | `components/ui/aipify-page-header.tsx` |
| Premium cards | `components/ui/aipify-premium-card.tsx` |
| Metric widgets | `components/ui/aipify-metric-widget.tsx` |
| Command Center snapshot | `components/ui/aipify-command-center-snapshot.tsx` |
| System pages (404, 403, access denied) | `components/ui/aipify-system-notice.tsx` |
| APP / Platform shell | `components/dashboard/DashboardShell.tsx` |
| Public website | `app/(marketing)/layout.tsx`, `components/marketing/*` |
| Growth Partner portal | `components/partner-portal/`, `components/growth-partner-portal/` |
| Super Admin | `components/super-admin/SuperAdminShell.tsx` |
| Command Center | `components/app/presence/CommandCenterPanel.tsx` |
| Design Standard V1 doc | `AIPIFY_DESIGN_STANDARD_V1_LIGHT_ENTERPRISE.md` |
| Cursor rule | `.cursor/rules/light-enterprise-design-standard.mdc` |

## Navigation grouping (public)

Product · Business Packs · Solutions · Partners · Resources · Company · Get Started — implemented in `MarketingNavbar` with dropdown groups.

## Status system

Always icon + text — never color alone. See `AipifyStatusBadge`.

## Acceptance criteria

- Light Enterprise Theme as default across major surfaces
- Warm off-white canvas (not pure white page background)
- Companion Purple visible in nav and CTAs
- Grouped public navigation
- Command Center opens with executive snapshot widgets
- Premium card components shared
- Branded system notice pages
- Partner and Super Admin shells aligned

**Aipify Group AS** · Bergen. Norway. For the world.
