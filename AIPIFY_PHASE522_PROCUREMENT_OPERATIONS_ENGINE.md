# AIPIFY – PHASE 522

**TITLE:** Procurement, Purchase Request & Vendor Operations Engine  
**PURPOSE:** Universal Procurement & Vendor Operations Engine for APP organizations — purchase requests, suppliers, approvals, contracts, orders, deliveries, and operational spending.  
**Feature owner:** CUSTOMER APP

## Routes

| Route | Purpose |
|-------|---------|
| `/app/procurement` | Procurement Center (Overview, Requests, Approvals, Vendors, Contracts, Orders, Deliveries, Reports) |
| `/app/procurement/requests` | Purchase request focus |
| `/app/procurement/vendors` | Vendor Center focus |
| `/app/procurement/orders` | Purchase order focus |

## APIs

- `GET /api/app/procurement-operations` — `get_procurement_operations_center`
- `POST /api/app/procurement-operations/action` — `perform_procurement_operations_action`
- `GET /api/app/procurement-operations/my` — mobile summary
- `GET /api/assistant/procurement-operations-context` — Companion context

## Module

- **Key:** `procurement`
- **Permissions:** `procurement.view`, `procurement.manage`

## Tables

`organization_procurement_settings` · `organization_procurement_categories` · `organization_procurement_vendors` · `organization_procurement_purchase_requests` · `organization_procurement_approvals` · `organization_procurement_contracts` · `organization_procurement_purchase_orders` · `organization_procurement_deliveries` · `organization_procurement_audit_logs`

## Integrations

Finance Engine (519) · Tasks (506) · Domains (505A) · Business Packs · Companion

## Principle

Employees request. Managers approve. Organizations purchase.

**Aipify Group AS** · Bergen. Norway. For the world.
