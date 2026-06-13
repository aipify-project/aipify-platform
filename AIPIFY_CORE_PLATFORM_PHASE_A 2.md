# Aipify Core Platform Foundation — Phase A

## Vision

**Aipify Core is the foundational operating system that powers all future Aipify modules.**

Built as an independent SaaS platform — not functionality inside Unonight — with multi-tenant architecture, secure AI-assisted actions, and reusable infrastructure for future modules.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260705000000_aipify_core_platform_phase_a.sql` |
| Prefix | `_acp_` · decision type: `aipify_core_platform` |
| Lib | `lib/aipify/core-platform/` |
| API | `/api/aipify/core-platform/*`, `/api/core/*` |
| UI | `/app/aipify-core` |
| KC FAQ | `content/knowledge/aipify/aipify-core-platform/faq/aipify-core-platform-faq.md` |

## Core components

1. **Multi-Tenant Architecture** — organization isolation, tenant settings, subscription awareness
2. **Authentication & Identity** — secure login, roles (Owner, Administrator, Manager, Support Agent, Viewer)
3. **Permission Engine** — granular permissions, module-level access, approval workflows
4. **Audit Logging** — immutable history of user, AI, and approval actions
5. **AI Action Framework** — risk-categorized actions (low / medium / high) with approval gates
6. **Module Framework** — plug-and-play modules with per-tenant activation
7. **API Layer** — tenant-aware endpoints, API keys, rate limiting
8. **Integration Framework** — Unonight pilot, email, Knowledge Center; future Shopify/WooCommerce/CRM
9. **Knowledge Center Foundation** — structured articles, FAQs, AI retrieval support
10. **Dashboard Foundation** — Since Last Login, Pending Tasks, Active Alerts, Support Overview, Recommended Actions

## RPCs

- `get_aipify_core_platform_dashboard()` — full core platform dashboard
- `get_aipify_core_platform_card()` — summary card for home/overview
- `toggle_tenant_core_module(text, boolean)` — enable/disable modules per tenant

## API endpoints

- `GET /api/aipify/core-platform/dashboard`
- `GET /api/aipify/core-platform/card`
- `GET /api/core/dashboard`
- `GET /api/core/modules`
- `GET /api/core/permissions`
- `GET /api/core/audit`
- `GET /api/core/integrations`

## Unonight pilot principles

- Unonight acts as the first customer
- Unonight validates workflows
- Aipify remains independent
- Improvements occur centrally within Aipify

## Success criteria

Phase A is complete when multiple tenants can be created, roles and permissions function correctly, audit logs capture activity, AI suggestions follow approval workflows, modules can be enabled per tenant, and Unonight operates as a connected pilot customer.

## Principle

Aipify suggests actions and coordinates intelligence — organizations remain responsible for decisions. Only low-risk actions may automate; medium and high-risk require human approval.
