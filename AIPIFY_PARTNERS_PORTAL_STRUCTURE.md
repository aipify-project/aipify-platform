# Aipify Partners Portal — Official Structure

**Canonical route:** `/partners/*`  
**Legacy redirects:** `/growth/*`, `/growth-partner/*` → `/partners/*`

## Official ecosystem hierarchy

```
SUPER
↓
PLATFORM
├── APP
└── PARTNERS
```

## Purpose

Dedicated workspace for **Aipify Partners** — individuals and businesses that partner with Aipify to promote and sell Aipify products and services.

Partners are **not** employees. Partners operate independently while collaborating through approved partner programs.

## Responsibilities

- Partner Dashboard
- Leads & Customers
- Referral links
- Commissions
- Marketing assets
- Partner Academy & Certifications
- Performance tracking
- Notifications & Account settings

## Terminology

| Use | Do not use |
|-----|------------|
| Aipify Partners | Growth Portal, Growth Partner, Affiliate |
| Partners Portal | Growth Workspace |
| Partner Program | Growth Program |

**Exception:** Legitimate business metrics (Revenue Growth, User Growth, Growth Rate) are unchanged.

## Implementation

| Area | Path |
|------|------|
| Nav & routes | `lib/partners-portal/nav-config.ts` |
| Module | `lib/partners-portal/` |
| UI | `components/partners-portal/` |
| APIs | `/api/partners-portal/*` |
| i18n | `partnersPortal.*` in `locales/{en,no,sv,da,es,pl,uk}/partnersPortal.json` |
| FAQ | `content/knowledge/aipify/partners-portal/faq/` |
| Legacy | `lib/growth-portal/` re-exports + redirects |

## Access roles

Internal DB roles may remain `growth_partner` / `growth_manager` during migration. User-facing terminology is **Partner** and **Partner Manager**.

## Supersedes

[AIPIFY_GROWTH_PORTAL_STRUCTURE_FOUNDATION_PHASE259.md](./AIPIFY_GROWTH_PORTAL_STRUCTURE_FOUNDATION_PHASE259.md) — Growth portal terminology is deprecated.
