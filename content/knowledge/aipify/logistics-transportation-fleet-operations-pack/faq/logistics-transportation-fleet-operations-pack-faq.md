# Logistics & Fleet Operations Pack — FAQ

## How does Logistics Pack work?

The Logistics Pack is the Industry Pack home for organizations managing deliveries, transportation networks, fleets, drivers, routes, warehouses, and supply chain operations at `/app/logistics`. It extends Warehouse Operations into full transportation and logistics management on the shared ABOS foundation. Install via Industry Packs at `/app/industry-packs`.

## How are routes managed?

Routes are tracked in `logistics_routes` with stops, distance, estimated time, assigned driver and vehicle, costs, and performance. Route status flows through planned, assigned, in progress, delayed, completed, and cancelled. Manage routes from the Logistics Center at `/app/logistics`.

## How are shipments tracked?

Shipments are tracked in `logistics_shipments` with origin, destination, vehicle, driver, status, tracking metadata, and delivery confirmation. Status includes scheduled, loaded, in transit, delayed, delivered, returned, exception, and archived. Open Shipments from the Logistics Center overview.

## How are drivers managed?

Driver profiles in `logistics_drivers` store licenses, certifications, training, assignments, safety records, availability, and performance metadata. Driver safety management supports training, incidents, violations, inspections, compliance status, and safety scores.

## How is fleet utilization measured?

Fleet utilization is calculated from vehicle records in `logistics_fleet_vehicles` — tracking trucks, vans, trailers, and special equipment with status (available, assigned, in transit, maintenance, inspection due, out of service, retired) and utilization percentage in the Logistics overview.

## How are transportation costs tracked?

Transportation cost metadata aggregates fuel, labor, vehicle, maintenance, tolls, third-party costs, and cost per delivery in the center bundle. Cost records are audited via `logistics_audit_logs` when updated from the Logistics Center.

## Fleet Management

Vehicles, trailers, vans, trucks, and special equipment are managed with fleet value, status, and utilization. Fleet maintenance integrates with asset management, inspections, certification tracking, and downtime records.

## Driver Management

Store driver profiles, licenses, certifications, training, assignments, safety records, availability, and performance from the Drivers module in the Logistics Center.

## Shipment Tracking

Track shipment ID, origin, destination, vehicle, driver, status, tracking, and delivery confirmation with full audit logging for creation and delivery events.

## Route Management

Plan routes with stops, distance, estimated time, assigned resources, costs, and performance metrics. Route optimization foundation supports distance, time, cost, load, and regional optimization.

## Transportation Costs

Monitor fuel, labor, vehicle, maintenance, tolls, and third-party costs with cost-per-delivery analytics in the Logistics overview and executive dashboard.

## Distribution Centers

Track warehouses, cross-docks, distribution hubs, and regional centers with capacity, utilization, and performance in `logistics_distribution_centers`.
