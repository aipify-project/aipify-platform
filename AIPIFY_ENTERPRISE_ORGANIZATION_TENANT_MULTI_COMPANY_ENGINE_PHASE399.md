# AIPIFY — PHASE 399
## Enterprise Organization, Tenant & Multi-Company Management Engine

**Feature owner:** Customer App  
**Route:** `/app/organizations`  
**Migration:** `20261679000000_enterprise_organization_tenant_multi_company_engine_phase399.sql`  
**Helpers:** `_gpeo399_*`

## Purpose

Support complex company structures — holdings, subsidiaries, business units, franchises, regional organizations, and enterprise groups — with governed consolidation and companion advisor signals.

## Distinction

| Engine | Layer | Route |
|--------|-------|-------|
| Multi-Tenant A.1 | Tenant boundary | `/app/multi-tenant` |
| Organization Workspace A.75 | Workspaces within tenant | `/app/organization-workspace-engine` |
| Global Group Phase 263 | Aipify Group AS internal | `/super/group-overview` |
| **Enterprise Organization 399** | Customer enterprise hierarchy | `/app/organizations` |

## Modules

Organization Overview · Structure · Business Units · Subsidiaries · Regional Operations · Shared Services · Analytics · Governance

## Plan gate

Business and Enterprise plans (`_aef_tenant_plan`).

## END OF PHASE
