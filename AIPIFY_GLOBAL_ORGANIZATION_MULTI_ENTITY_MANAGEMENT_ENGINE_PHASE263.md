# Aipify — Global Organization & Multi-Entity Management Engine (Phase 263 Group)

**Feature owner:** Super Admin / Aipify Group AS  
**Route:** `/super/group-overview`  
**Migration:** `20261451000000_global_organization_multi_entity_management_engine_phase263.sql`  
**Module:** `lib/group-organization/`

> **Phase numbering note:** Phase 263 is also used for the Enterprise Strategic Execution Engine (`20261419000000_aipify_enterprise_strategic_execution_engine_phase263.sql`). This document covers the **group organization** capability only.

---

## Purpose

Build the foundation that allows **Aipify Group AS** to manage multiple companies, brands, subsidiaries, business units, and future acquisitions from a single Aipify platform — without requiring architectural changes later.

**Guiding principle:** Aipify should never assume that it only serves one company.

**Foundation statement:** Aipify Group AS is the parent organization. Aipify is the operating system. Future ventures are opportunities waiting to be connected. *From Norway. For the world.*

---

## Organizational hierarchy

| Level | Name | Examples |
|-------|------|----------|
| 1 | Aipify Group AS | Parent company |
| 2 | Business entities | Aipify, Unonight, Sportsklær.no, future subsidiaries |
| 3 | Departments | Support, Sales, Marketing, Finance, Operations, Development, HR |
| 4 | Teams | Growth Partners, Support Team Norway, Enterprise Sales |
| 5 | Users | Employees, contractors, partners, administrators |

---

## Components

### Super Admin — Group Overview

Displays:

- Total entities and active users
- Active subscriptions (aggregate)
- Business entity registry with per-entity metrics
- External investments (company and real estate asset classes)
- Shared intelligence signals
- Organizational hierarchy
- Recent audit activity

### Entity management (Super Admin RPC)

Actions via `group_business_entity_action(p_payload)`:

- Create entity
- Archive entity
- Assign administrator
- Transfer ownership
- Connect domain
- Connect payment provider
- Create department
- Create team

### Investment tracking

`upsert_group_investment(p_payload)` registers ownership stakes in external companies (and future real estate investments).

### Shared intelligence

Cross-entity signals: similar support requests, shared best practices, cross-sell opportunities, growth recommendations, operational patterns.

### Permission isolation

Each entity maintains separate data boundaries, settings, branding, and integrations when linked to tenant `company_id` / `customer_id`.

---

## Data model

| Table | Purpose |
|-------|---------|
| `group_corporate_parent` | Level 1 — Aipify Group AS |
| `group_business_entities` | Level 2 — business entities |
| `group_entity_departments` | Level 3 — departments |
| `group_entity_teams` | Level 4 — teams |
| `group_entity_administrators` | Entity admin assignments |
| `group_entity_domains` | Domain connections |
| `group_external_investments` | External ownership stakes |
| `group_shared_intelligence_signals` | Cross-entity intelligence |
| `group_organization_audit_logs` | Immutable audit trail |

---

## APIs

| Method | Route | RPC |
|--------|-------|-----|
| GET | `/api/group-organization/overview` | `get_group_overview_center()` |
| POST | `/api/group-organization/entities/actions` | `group_business_entity_action(jsonb)` |
| POST | `/api/group-organization/investments` | `upsert_group_investment(jsonb)` |

All endpoints require authenticated Super Admin (enforced in RPC via `_gome263_require_super_admin()`).

---

## Permissions

- `group_organization.view` — view hierarchy and group overview
- `group_organization.manage` — create entities, assign administrators, manage structure

---

## UI

- Page: `app/super/group-overview/page.tsx`
- Panel: `components/super-admin/GroupOverviewPanel.tsx`
- Nav: Super Admin section **Group Organization** → **Group Overview**
- i18n: `superAdmin.groupOverview.*`, `superAdmin.modules.groupOverview*` in `en` / `no` / `sv` / `da`

---

## Audit logging

Tracks entity creation, ownership changes, permission changes, administrator assignments, domain connections, payment provider connections, and investment updates.

---

## Security

- Super Admin only + 2FA (via `/super/*` layout guards)
- RLS enabled; tables revoked from `authenticated` / `anon` — access via security definer RPCs only
- No cross-tenant customer data exposure in aggregate views

---

## AIPIFY PRINCIPLES

People First · Technology Second · Self Love · Wisdom before speed · Companionship before replacement · Growth through support · Stewardship through responsibility.

**END OF PHASE.**
