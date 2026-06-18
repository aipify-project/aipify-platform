# Digital Workforce Value Engine — FAQ

## How is Digital Employee ROI calculated?

ROI is calculated at `/app/digital-workforce/value` using workforce economics (platform, licensing, operational, training, and infrastructure costs) compared against operational savings, productivity gains, automation value, and revenue impact. Generate an analysis via `generate_roi_analysis` — results are stored in `digital_workforce_value_roi_analyses` with full audit logging.

**Formula (simplified):** Return on Investment = ((Operational Savings + Automation Value − Workforce Cost) ÷ Workforce Cost) × 100

Digital Employees do not receive salaries. ROI measures business value against platform and operational investment.

## How are savings measured?

Savings are derived from hours saved (tasks completed × estimated time per task), multiplied by your configured hourly value rate in `digital_workforce_value_settings`. Metrics are tracked in `digital_workforce_value_metrics`. Update the savings model via `update_savings_model` action.

## How are productivity gains calculated?

Productivity gains combine task completion rates from Digital Employee Lifecycle (`digital_employee_lifecycle_employees`), operational efficiency metrics, workflow automation counts from Agent Orchestration, and department-level productivity gain percentages in `digital_workforce_department_value`.

## How is business impact measured?

Business impact aggregates estimated savings, automation value, and department value analysis into an executive index. Scorecards in `digital_workforce_value_scorecards` track per-employee performance, reliability, productivity, savings generated, and overall value score.

## How are department comparisons created?

Department value is stored in `digital_workforce_department_value` for Support, Sales, Finance, Operations, Compliance, and Industry Pack coverage. Generate benchmarks via `generate_benchmark` to compare departments by ROI, automation value, and productivity gain percent — scoped per organization.

## How does value forecasting work?

Value forecasts in `digital_workforce_value_forecasts` project future savings, productivity gains, workforce expansion ROI, department ROI, and growth opportunities. Generate via `generate_forecast` action. Forecasts use current overview metrics as baseline with conservative growth multipliers.

## ROI Measurement

Executive ROI analysis with workforce cost, savings, productivity, revenue impact, and automation value.

## Automation Value

Manual work eliminated, workflow automation, process improvements, error reduction, compliance improvements, and speed improvements tracked per department.

## Productivity Measurement

Hours saved, tasks completed, workflows automated, approvals accelerated, and operational improvements.

## Workforce Economics

Platform costs, licensing, department allocation, operational costs, training, infrastructure, and workforce allocation percentages.

## Business Impact

Business outcomes, customer requests resolved, projects accelerated, and operational efficiency metrics.

## Digital Workforce Reporting

Executive dashboard with ROI, savings, productivity gains, department comparisons, automation coverage, and growth opportunities — tenant-isolated with full audit trail.
