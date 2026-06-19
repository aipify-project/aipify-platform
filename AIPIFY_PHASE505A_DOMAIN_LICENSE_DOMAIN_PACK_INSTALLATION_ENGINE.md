# AIPIFY – PHASE 505A
## TITLE: Domain License & Domain Pack Installation Engine

**PURPOSE:** Allow APP organizations to connect multiple domains with Business Packs installed and licensed **per domain** — not org-wide by default.

**OBJECTIVES:**

- 1 Domain License included with every APP; additional licenses purchasable
- Domain Management Center at `/app/domains`
- Business Pack installation requires domain selection in App Store
- Per-domain pack records — Support on `firma.no` does not auto-activate on `firma.se`
- Supported platforms: WordPress, Shopify, WooCommerce, Custom, Enterprise, Future
- Domain permissions: view, create, manage, delete, install_pack, assign
- Companion domain context for guided install flows
- Full audit logging

**REQUIREMENTS:**

- Migration: `20261850510000_domain_license_domain_pack_installation_engine_phase505a.sql`
- Lib: `lib/domain-license/`
- Routes: `/app/domains`, `/api/app/domains`, `/api/app/domains/action`, `/api/assistant/domain-context`
- Updated: `perform_app_store_action`, `get_app_store_pack_detail`, App Store install UI

**KEY RPCs:**

- `get_domain_license_center()` — overview, active/pending domains, licenses, packs
- `perform_domain_license_action()` — create domain, purchase license, assign users
- `activate_business_pack_modules_for_domain()` — domain-scoped pack activation
- `remove_business_pack_from_domain()` — remove from one domain; deactivate modules only when no domains remain
- `get_companion_domain_context()` — Companion domain awareness
- `_dl505_available_domains()` — domain dropdown for Marketplace

**TABLES:**

- Extended `organization_domains` — status, platform, license, primary flag
- `organization_domain_license_pool` — included + purchased slots
- `domain_business_pack_installations` — pack × domain
- `domain_user_assignments` — managers and members per domain
- `domain_license_audit_logs`

**ACCEPTANCE CRITERIA:**

- ✅ Domain License system created
- ✅ First domain included with APP
- ✅ Additional Domain License product created
- ✅ Domain Management Center created
- ✅ Domain dropdown required during pack installation
- ✅ Business Packs installed per domain
- ✅ Pack installation flow updated
- ✅ Marketplace updated
- ✅ Domain permissions created
- ✅ Companion understands domain context
- ✅ Audit logging added
- ✅ Domain reporting added

**PRINCIPLE:** PLATFORM → APP → DOMAIN LICENSES → BUSINESS PACKS → EMPLOYEES · One APP · Many Domains · Many Business Packs · Full control.

END OF PHASE.
