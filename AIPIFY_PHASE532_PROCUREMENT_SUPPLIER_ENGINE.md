# AIPIFY – PHASE 532

**TITLE:** Procurement, Purchasing & Supplier Operations Engine  
**Feature owner:** CUSTOMER APP  
**Extends:** Phase 522 (Procurement, Purchase Request & Vendor Operations)

## Purpose

Universal Procurement & Supplier Management Engine — suppliers, purchasing, approvals, quotations, purchase orders, contracts, incoming goods, spend analysis, and risk.

## Principle

Organizations should always know what they buy, who they buy from, why they buy it, who approved it, and what it costs.

Good purchasing reduces waste. Good suppliers create stability. Good procurement creates control.

## Routes

| Route | Surface |
|-------|---------|
| `/app/procurement` | Procurement Center |
| `/app/procurement/suppliers` | Supplier Center |
| `/app/procurement/requests` | Purchase Request Engine |
| `/app/procurement/orders` | Purchase Order Center |
| `/app/procurement/receiving` | Incoming Goods Center |
| `/app/procurement/vendors` | Vendor Center (Phase 522 alias) |

## Database (Phase 532 delta)

**Extended:** `organization_procurement_vendors`, `organization_procurement_purchase_requests`, `organization_procurement_deliveries`

**New tables:**
- `organization_procurement_quotations`
- `organization_procurement_quotes`

## RPCs

- `get_procurement_operations_center` — upgraded with suppliers, quotations, spend analysis, risk, companion insights
- `perform_procurement_operations_action` — RFQ, quotes, receiving, supplier scorecard
- `_proc522_perform_legacy_action` — Phase 522 actions preserved
- `get_companion_procurement_operations_context(p_query)`
- `get_my_procurement_operations_summary` — mobile-ready

## Module

`procurement` · permissions `procurement.view` / `procurement.manage`

## Migration

`supabase/migrations/20261853200000_procurement_purchasing_supplier_operations_engine_phase532.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
