# Professional Services Pack — FAQ

## How does Professional Services Pack work?

The Professional Services Pack is the Industry Pack home for consulting firms, agencies, accounting firms, advisory companies, implementation partners, and professional service organizations at `/app/professional-services`. It coordinates clients, projects, consultants, service delivery, profitability, utilization, and client success on ABOS. Install via Industry Packs at `/app/industry-packs`.

## How are projects managed?

Projects are tracked in `professional_services_projects` with project name, client, owner, budget, revenue, costs, gross margin, timeline metadata, status (planned, approved, in progress, awaiting feedback, completed, cancelled, archived), and customer satisfaction. Manage projects from the Professional Services Center at `/app/professional-services/projects`.

## How is consultant utilization measured?

Consultant utilization is calculated from allocated billable and non-billable hours against available capacity, stored on `professional_services_consultants` as `utilization_percent`. Aipify aggregates utilization across the consultant portfolio for capacity planning, workload balancing, and forecasting at `/app/professional-services/consultants`.

## How is profitability calculated?

Project profitability uses revenue minus project and consultant costs to derive gross margin and net margin trends. Overview metrics aggregate portfolio revenue, profitability percentage, and margin trends in the Services Overview and Profitability modules at `/app/professional-services/profitability`.

## How is client health measured?

Client health score combines satisfaction, retention signals, revenue contribution, engagement, project success, relationship strength, and expansion potential. Scores are stored on `professional_services_clients` and updated via `update_client_health` actions with full audit logging.

## How are expansion opportunities identified?

Aipify analyzes engagement trends, project success, satisfaction, and revenue patterns to surface expansion opportunities in `professional_services_expansion_opportunities`. Companion services advisor signals highlight renewals, upsell potential, and strategic accounts requiring attention.

## Client Management

Track client profiles, organizations, contacts, projects, contracts, invoices, communications, and relationship history with statuses: prospect, active, strategic, at risk, inactive, and archived.

## Project Delivery

Track deliverables, milestones, approvals, dependencies, risks, issues, and customer feedback through the Service Delivery module at `/app/professional-services/delivery`.

## Resource Planning

Support capacity planning, project allocation, workload balancing, skills matching, forecasting, and utilization planning across the consultant portfolio.

## Profitability Management

Monitor project revenue, project costs, consultant costs, gross margin, net margin, and profitability trends for executive-ready reporting.

## Client Success

Track satisfaction, engagement, renewals, expansion opportunities, support history, and relationship health at `/app/professional-services/client-success`.

## Professional Services Operations

Executive dashboard displays revenue, profitability, utilization, client satisfaction, project portfolio, consultant capacity, and growth opportunities at `/app/professional-services/intelligence`.
