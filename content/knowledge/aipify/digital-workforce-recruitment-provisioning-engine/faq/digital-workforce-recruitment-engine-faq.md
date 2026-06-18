# Digital Workforce Recruitment Engine — FAQ

## How do I hire a Digital Employee?

Start at `/app/digital-workforce/recruitment`. Identify workforce need, select a position from the Position Library, submit a hiring request with business justification, obtain approval, then provision through the Provisioning Engine. Aipify configures role, knowledge, permissions, workflows, and tools automatically.

## How does provisioning work?

After a hiring request is approved, the `provision_employee` action creates a record in Digital Employee Lifecycle (`digital_employee_lifecycle_employees`), assigns role and permissions from the position profile, assigns onboarding training, and sets status to provisioning. Full activation follows training and governance approval at `/app/digital-employees`.

## How is workforce capacity measured?

Capacity is derived from workforce plans in `digital_workforce_plans` — department headcount, utilization, and gap analysis. Overview metrics display workload, available capacity, automation coverage, and workforce health score.

## How are workforce gaps identified?

Gap analysis tracks skill gaps, department gaps, capacity gaps, knowledge gaps, coverage gaps, and compliance gaps via `gap_type` on workforce plans and Companion workforce planner signals.

## How are hiring requests approved?

Hiring requests in `digital_workforce_hiring_requests` support department, manager, executive, capacity, project, and expansion request types. Workflow: need identified → position selected → business justification → approval → provisioning → training → activation. Approve via `approve_hiring_request` action with full audit logging.

## How is workforce growth planned?

Workforce forecasting in `digital_workforce_forecasts` projects future hiring needs, department growth, capacity expansion, and automation growth. Generate forecasts via `generate_forecast` action for executive workforce planning.

## Digital Recruitment

Hire digital employees by role — Support, Sales, Marketing, HR, Finance, Compliance, Warehouse, Industry, and Executive Assistant positions.

## Workforce Planning

Track current workforce, future needs, department demand, growth plans, capacity risks, and coverage gaps.

## Provisioning

Automatic configuration of role, knowledge, permissions, workflows, tools, Business Packs, and Industry Packs.

## Capacity Management

Department capacity, task volume, automation capacity, coverage levels, utilization, and growth demand.

## Workforce Forecasting

Project future hiring, department growth, capacity expansion, and business expansion.

## Digital Workforce Governance

Hiring approvals, provisioning audit trail, and links to Employee Lifecycle and Agent Orchestration.
