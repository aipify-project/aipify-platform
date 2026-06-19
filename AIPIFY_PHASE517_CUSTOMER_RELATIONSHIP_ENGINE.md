# AIPIFY – PHASE 517
## Customer, Contact & Relationship Management Engine

**Aipify Group AS** · Bergen · *From Norway. For the world.*

## Purpose

Universal Customer & Relationship Engine — central customer database for all APP organizations and Business Packs.

## Core principle

Organizations serve customers. Relationships create trust. Trust creates growth. Companion helps maintain relationships.

## Layer

**Feature owner: CUSTOMER APP**

- Routes: `/app/customers`, `/app/leads`
- Business logic: Supabase RPCs — panels are thin clients

## Structure

```
PLATFORM → APP → CUSTOMER ENGINE → CUSTOMERS → RELATIONSHIPS
```

## Database

Migration: `supabase/migrations/20261851700000_customer_contact_relationship_management_engine_phase517.sql`

### Tables

| Area | Tables |
|------|--------|
| Settings | `organization_crm_settings` |
| Customers | `organization_crm_customers` |
| Contacts | `organization_crm_contacts` |
| Leads | `organization_crm_leads` |
| Ownership | `organization_crm_ownership` |
| Domains / packs | `organization_crm_domain_assignments`, `_pack_assignments` |
| Timeline | `organization_crm_timeline_events` |
| Communications | `organization_crm_communications` |
| Documents | `organization_crm_documents` |
| Tasks | `organization_crm_customer_tasks` |
| Audit | `organization_crm_audit_logs` |

### RPCs

- `get_customer_relationship_center`
- `get_lead_management_center`
- `perform_customer_relationship_action`
- `search_customer_relationship_records`
- `get_companion_customer_relationship_context`
- `get_my_customer_relationship_summary`

## Routes

| Surface | Path |
|---------|------|
| Customer Center | `/app/customers` |
| Lead Management | `/app/leads` |
| Mobile summary | `/api/app/customer-relationship/my` |

## Code

| Area | Path |
|------|------|
| Types & labels | `lib/customer-relationship/` |
| UI | `components/app/customer-relationship/` |
| APIs | `/api/app/customer-relationship/*`, `/api/assistant/customer-relationship-context` |

## Integrations

Employees (516) · Domains (505A) · Tasks (506) · Calendar (507) · Documents (508) · Communications (509) · Business Packs · Companion context

## i18n

`customerRelationship.*` in `locales/{en,no,sv,da}/customer-app/settings.json`

## END OF PHASE
