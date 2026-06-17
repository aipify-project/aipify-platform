# Manufacturing & Production Operations Pack — FAQ

## How does Manufacturing Pack work?

The Manufacturing Pack is the Industry Pack home for factories, production facilities, and industrial companies at `/app/manufacturing`. It supports production planning, work orders, materials, quality control, equipment, capacity, and manufacturing performance on the shared ABOS foundation. Install via Industry Packs at `/app/industry-packs`.

## How are work orders managed?

Work orders are tracked in `manufacturing_work_orders` with product, quantity, production line, status, priority, and schedule dates. Status flows through planned, approved, in production, paused, delayed, completed, cancelled, and archived. Manage work orders from the Manufacturing Center at `/app/manufacturing/work-orders`.

## How is production capacity measured?

Capacity is measured from `manufacturing_production_lines` — tracking line capacity, output, utilization, downtime, and workforce/equipment availability in the overview and Production Planning module at `/app/manufacturing/planning`.

## How is quality control managed?

Quality inspections in `manufacturing_quality_inspections` track inspection status (passed, failed, under review, corrective action required, rejected, approved), defect counts, severity, root cause, and financial impact. Open Quality Control from `/app/manufacturing/quality`.

## How are material shortages identified?

Materials in `manufacturing_materials` track inventory, consumption rates, costs, and availability status (available, low, shortage, unavailable). Shortages surface in the Manufacturing overview and Companion manufacturing advisor signals.

## How is manufacturing performance measured?

Performance analytics combine production output, capacity utilization, quality score, equipment availability, material availability, and manufacturing health score in the overview and executive dashboard at `/app/manufacturing/intelligence`.

## Production Planning

Track production schedule, capacity, planned output, targets, material requirements, workforce requirements, and production risks from the Production Planning module.

## Work Orders

Manage work order ID, product, quantity, production line, status, priority, start date, and completion date with full audit logging.

## Materials Management

Manage material inventory, usage, shortages, forecasts, costs, and availability including bill of materials foundation for raw materials, components, subassemblies, and finished goods.

## Quality Control

Manage quality inspections, audits, defect tracking, corrective and preventive actions, and compliance reviews.

## Capacity Planning

Measure available and utilized capacity, production throughput, workforce and equipment capacity, and capacity risks.

## Manufacturing Reporting

Track output, yield, defects, downtime, material consumption, production costs, and profitability in Manufacturing Intelligence and executive dashboards.
