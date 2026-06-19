# AIPIFY – PHASE 531

**TITLE:** Customer Relationship & Account Management Engine  
**Feature owner:** CUSTOMER APP  
**Extends:** Phase 517 (Customer, Contact & Relationship Management)

## Purpose

Universal Customer Relationship Engine for APP organizations — prospects, customers, accounts, opportunities, relationships, renewals, and customer lifecycle operations. The customer intelligence layer of Aipify.

## Principle

Customers are the reason organizations exist. Every customer interaction should be organized, searchable, measurable, and actionable.

Customers create revenue. Relationships create trust. Trust creates growth.

## Routes

| Route | Surface |
|-------|---------|
| `/app/customers` | Customer Center |
| `/app/customers/opportunities` | Opportunity Engine |
| `/app/customers/contracts` | Contract Center |
| `/app/leads` | Lead Management (Phase 517) |

## Database (Phase 531 delta)

**Extended tables:** `organization_crm_customers`, `organization_crm_contacts`

**New tables:**
- `organization_crm_opportunities`
- `organization_crm_contracts`
- `organization_crm_renewals`

## RPCs

- `get_customer_relationship_center` — upgraded with opportunities, contracts, renewals, health, executive metrics
- `perform_customer_relationship_action` — new actions: opportunity, contract, renewal, health
- `_crm517_perform_legacy_action` — Phase 517 actions preserved
- `get_companion_customer_relationship_context(p_query)` — Companion integration
- `get_my_customer_relationship_summary` — mobile-ready summary

## Module

`customers` · permissions `customers.view` / `customers.manage`

## Acceptance criteria

- ✅ Customer Center (`/app/customers`)
- ✅ Organization & contact management (Phase 517 + Phase 531 fields)
- ✅ Opportunity Engine (`/app/customers/opportunities`)
- ✅ Activity timeline & communication center
- ✅ Renewal Engine
- ✅ Customer health score
- ✅ Contract Center (`/app/customers/contracts`)
- ✅ Companion integration
- ✅ Growth Partner scaffold (`partner_owned` on opportunities)
- ✅ Subscription awareness section
- ✅ Domain & Business Pack fields on opportunities/contracts
- ✅ Executive dashboard metrics in overview
- ✅ Mobile access via `get_my_customer_relationship_summary`
- ✅ Audit logging

## Migration

`supabase/migrations/20261853100000_customer_relationship_account_management_engine_phase531.sql`

Apply: `node scripts/supabase-apply-sql.mjs apply --file supabase/migrations/20261853100000_customer_relationship_account_management_engine_phase531.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
