# Enterprise Organization Engine — FAQ

## How do organizations work?

Aipify treats your paying tenant as the **enterprise root**. The Enterprise Organization Engine adds a governed hierarchy above day-to-day workspaces: group profile, entities, consolidation, and advisor signals. Your root organization (Multi-Tenant Architecture, A.1) remains the billing and isolation boundary. Workspaces (A.75) continue to scope operational work **within** each entity context.

## How do subsidiaries work?

Subsidiaries are **enterprise entities** linked to your group. Each subsidiary can carry leadership, workforce counts, health scores, and optional links to a child tenant when approved. Aipify never merges tenant data silently — subsidiaries remain governed entities with audit history.

## How do business units work?

Business units are entity nodes in your hierarchy — often mapped to Aipify workspaces for operational isolation. Track leadership, revenue metadata, employees, digital employees, business packs, and performance labels at the unit level.

## How is reporting consolidated?

The **Enterprise Consolidation Engine** aggregates approved metadata: entity counts, headcount, digital workforce, active business packs, and revenue fields you maintain. Consolidated reports are logged in the audit trail. Operational records stay within entity boundaries unless explicitly linked.

## How are permissions managed?

Scoped access models include global, regional, business unit, department, local, and custom scopes via `enterprise_org_access_scopes`. Permissions `enterprise_organization.view` and `enterprise_organization.manage` gate the Organization Center. Human administrators assign scopes — Aipify does not auto-expand access.

## How does regional governance work?

Regional operations store country, language, currency, compliance rules, and local governance metadata per region. Regional performance appears in analytics and executive views. Compliance metadata is transparent configuration — not hidden enforcement.

## How is this different from Organization & Workspaces (A.75)?

**A.75** manages workspaces inside one tenant. **Phase 399** manages corporate structure across entities — subsidiaries, regions, shared services, and consolidation. Use both: enterprise hierarchy for group governance, workspaces for daily operations.

## How is this different from Aipify Group AS Super Admin (Phase 263)?

Phase 263 serves **Aipify Group AS internal** multi-entity management at `/super/group-overview`. Phase 399 serves **paying enterprise customers** at `/app/organizations` with full tenant isolation.
