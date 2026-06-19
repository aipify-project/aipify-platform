# AIPIFY – PHASE 564

**TITLE:** Companion Enterprise Network, Organization Collaboration & Trusted Business Exchange

**PURPOSE:** Create the Enterprise Network that allows organizations using Aipify to collaborate, communicate, exchange information, and conduct approved business interactions through a governed and trusted network — the inter-organization layer of Aipify.

**Feature owner:** CUSTOMER APP

**Routes:**
- `/app/network` — Enterprise Network Center
- `/app/network/workspaces` — Shared Workspace Engine

## Objectives

- Enterprise Network Center (Overview, Organizations, Connections, Invitations, Collaborations, Shared Workspaces, Trust, Reports)
- Organization Registry with verification, relationship types, trust scores, and Business Pack links
- Connection workflow with permission review and audit logging
- Trust Network Engine with reputation tracking
- Shared Workspace Engine for cross-organization projects
- Data Sharing Framework — no automatic sharing; explicit approval required
- Document Exchange Center, Network Messaging, Reputation Engine
- Growth Partner Network and Marketplace integration
- Companion Network Advisor, executive dashboard, mobile access, audit logging

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261856400000_companion_enterprise_network_organization_collaboration_trusted_business_exchange_phase564.sql` |
| Library | `lib/customer-enterprise-network-operations/` |
| APIs | `/api/app/enterprise-network-operations/*`, `/api/assistant/companion-network-advisor-context` |
| UI | `components/app/enterprise-network-operations/` |
| Pages | `app/app/network/page.tsx`, `app/app/network/workspaces/page.tsx` |
| i18n | `enterpriseNetworkOperations.*` in en/no/sv/da |

## Integration

- Phase 563 Marketplace: `/app/companion/marketplace`
- Phase 561 Ecosystem: `/app/companion/ecosystem`
- Legacy Phase 445 Global Business Network tables remain — Phase 564 uses `organization_enterprise_network_*` tables

## RPCs

- `get_organization_enterprise_network_center(p_section)`
- `perform_organization_enterprise_network_action(p_payload)`
- `get_organization_enterprise_network_mobile_summary()`
- `get_assistant_companion_network_advisor_context()`

## Principle

Organizations do not operate alone. Companion should help organizations build trusted relationships and collaborate safely.

One Enterprise Network. One Collaboration Framework. One Trusted Business Exchange Layer.

**END OF PHASE.**
