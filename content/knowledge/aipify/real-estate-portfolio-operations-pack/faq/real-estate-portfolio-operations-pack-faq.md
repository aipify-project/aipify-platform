# Real Estate & Property Operations Pack — FAQ

## How does Real Estate Pack work?

The Real Estate Pack is the Industry Pack home for property owners, managers, and portfolio operators at `/app/real-estate`. It supports properties, units, tenants, leases, maintenance, vendors, and portfolio financials on the shared ABOS foundation. Install via Industry Packs at `/app/industry-packs`.

## How are leases managed?

Leases are tracked in `real_estate_leases` with statuses: draft, pending, active, renewal due, expired, terminated, and archived. Manage leases from the Real Estate Center Leases module at `/app/real-estate/leases`.

## How are tenants tracked?

Tenant profiles are stored in `real_estate_tenants` with contact details, lease history metadata, and status. View and manage tenants from `/app/real-estate/tenants`.

## How is occupancy calculated?

Occupancy is calculated from active units — the ratio of occupied units to total non-archived units in the portfolio overview via `_grep403_overview_block()`.

## How are maintenance requests handled?

Maintenance requests are tracked in `real_estate_maintenance_requests` with priority, status, vendor assignment, and cost estimates. Open Maintenance from `/app/real-estate/maintenance`.

## How is portfolio performance measured?

Portfolio performance combines property revenue, expenses, market value, occupancy, net operating income, and portfolio health score in the overview and executive dashboard at `/app/real-estate/financials`.

## How does this relate to Hospitality Pack?

Hospitality Pack (`/app/hospitality`) focuses on guest experience and short-term stays. Real Estate Pack (`/app/real-estate`) focuses on long-term assets, tenants, contracts, and portfolio governance.
