# AIPIFY – PHASE 563

**TITLE:** Companion Marketplace, Extensions Platform & Developer Ecosystem

**PURPOSE:** Create the Companion Marketplace that allows Aipify, Growth Partners, customers, and future developers to publish, distribute, and manage Companion Extensions — the extension layer of Companion.

**Feature owner:** CUSTOMER APP (marketplace) · PLATFORM ADMIN (developer portal)

**Routes:**
- `/app/companion/marketplace` — Marketplace Center
- `/app/companion/marketplace/extensions` — Extension discovery
- `/platform/developers` — Developer Portal

## Objectives

- Companion Marketplace Center (Overview, Extensions, Installed, Updates, Publishers, Reviews, Categories, Reports, Executive)
- Extension Registry with permissions, dependencies, Business Pack integration, and certification
- Extension installation workflow with governance and audit logging
- Permission framework (data access, capabilities, knowledge sources, actions, integrations, domains)
- Developer Portal (Overview, Documentation, APIs, SDKs, Testing, Publishing, Analytics)
- Extension SDK surface for skills, dashboards, widgets, workflows, knowledge, reports, notifications, integrations
- Certification engine (security, governance, localization, performance, companion, marketplace reviews)
- Localization requirements (en, no, sv, da)
- Companion Extension Advisor, extension analytics, Growth Partner publishing, mobile access

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261856300000_companion_marketplace_extensions_platform_developer_ecosystem_phase563.sql` |
| Customer library | `lib/customer-companion-marketplace-operations/` |
| Platform library | `lib/platform-developer-ecosystem/` |
| Customer APIs | `/api/app/companion-marketplace-operations/*`, `/api/assistant/companion-marketplace-advisor-context` |
| Platform APIs | `/api/platform-developer-ecosystem/*` |
| Customer UI | `components/app/companion-marketplace-operations/` |
| Platform UI | `components/platform/developer-ecosystem/` |
| Pages | `app/app/companion/marketplace/`, `app/platform/developers/` |
| i18n | `companionMarketplaceOperations.*` (en/no/sv/da), `platform.developerEcosystem.*` (en/no/sv/da) |

## Integration

- Phase 561 Ecosystem: `/app/companion/ecosystem`
- Phase 560 Governance: `/app/companion/governance`
- Legacy marketplace (Phase 113): `/app/companion-marketplace` — distinct from Phase 563 extension marketplace

## RPCs

**Customer**
- `get_organization_companion_marketplace_center(p_section)`
- `perform_organization_companion_marketplace_action(p_payload)`
- `get_organization_companion_marketplace_mobile_summary()`
- `get_assistant_companion_marketplace_advisor_context()`

**Platform**
- `get_platform_developer_ecosystem_portal(p_section)`
- `perform_platform_developer_ecosystem_action(p_payload)`
- `get_platform_developer_ecosystem_mobile_summary()`

## Principle

A platform becomes powerful through its ecosystem. Companion should not be limited to what Aipify builds — it should grow through trusted extensions.

One Companion Marketplace. One Extension Ecosystem. One Developer Platform.

**END OF PHASE.**
