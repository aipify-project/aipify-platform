# AIPIFY — PHASE 405
## Logistics, Transportation & Fleet Operations Pack Foundation

**Feature owner:** Customer App  
**Route:** `/app/logistics`  
**Migration:** `20261685000000_logistics_transportation_fleet_operations_pack_foundation_phase405.sql`  
**Helpers:** `_gltfo405_*`

## Purpose

Logistics, transportation, and fleet operating system for deliveries, transportation networks, fleets, drivers, routes, warehouses, and supply chain operations. Extends Warehouse Operations into full transportation and logistics management.

## Modules

- Logistics Overview
- Fleet Management
- Drivers
- Routes
- Shipments
- Distribution Centers
- Logistics Intelligence
- Governance

## Tables

`logistics_pack_settings` · `logistics_fleet_vehicles` · `logistics_drivers` · `logistics_routes` · `logistics_shipments` · `logistics_distribution_centers` · `logistics_advisor_signals` · `logistics_audit_logs`

## RPCs

- `get_logistics_transportation_fleet_operations_center()`
- `logistics_transportation_fleet_operations_action()`

## Permissions

- `logistics.view`
- `logistics.manage`

## i18n

`customerApp.logisticsTransportationFleetOperationsPack.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/logistics-transportation-fleet-operations-pack/faq/`

## END OF PHASE
