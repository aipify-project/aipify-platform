# AIPIFY – PHASE 523

**TITLE:** Inventory, Stock & Warehouse Operations Engine  
**PURPOSE:** Universal Inventory & Warehouse Operations Engine for APP organizations — stock levels, warehouse operations, movements, receiving, fulfillment, and inventory visibility.  
**Feature owner:** CUSTOMER APP

## Routes

| Route | Purpose |
|-------|---------|
| `/app/inventory` | Inventory Center (Overview, Products, Inventory, Warehouses, Movements, Receiving, Transfers, Adjustments, Reports) |
| `/app/inventory/warehouses` | Warehouse management focus |

## APIs

- `GET /api/app/inventory-operations` — `get_inventory_operations_center`
- `POST /api/app/inventory-operations/action` — `perform_inventory_operations_action`
- `GET /api/app/inventory-operations/my` — mobile summary
- `GET /api/assistant/inventory-operations-context` — Companion context

## Module

- **Key:** `inventory`
- **Permissions:** `inventory.view`, `inventory.manage`

## Tables

`organization_inventory_settings` · `organization_inventory_categories` · `organization_inventory_warehouses` · `organization_inventory_locations` · `organization_inventory_products` · `organization_inventory_items` · `organization_inventory_movements` · `organization_inventory_receiving` · `organization_inventory_transfers` · `organization_inventory_reservations` · `organization_inventory_adjustments` · `organization_inventory_reorder_recommendations` · `organization_inventory_audit_logs`

## Integrations

Procurement (522) · Finance (519) · Projects (520) · Tasks (506) · Domains (505A) · Assets · Business Packs

## Principle

What they have. Where it is. Who used it. When it moved.

**Aipify Group AS** · Bergen. Norway. For the world.
