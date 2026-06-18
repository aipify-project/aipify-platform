# Autonomous Enterprise Operations Engine — FAQ

## What is the Autonomous Operations Center?

The Autonomous Operations Center is Aipify's proactive operating layer at `/app/autonomous`. It observes opportunities and risks, generates plans and recommendations, coordinates workflows, creates proactive tasks, and routes sensitive actions through the approval queue — all within governed autonomy boundaries.

## How do autonomy levels work?

Autonomy levels range from 0 (Observation Only) through 6 (Human Reserved Boundary). Higher levels unlock capabilities such as proactive task creation (level 2), workflow coordination (level 3), and approval-based execution (level 4+). Settings are tenant-scoped and never bypass human oversight.

## What actions can Aipify take autonomously?

Governed actions include generating plans, creating proactive tasks, coordinating workflows, requesting approvals, and recording improvements. Sensitive execution requires explicit approval through the Approval Center. Aipify never executes beyond approved policy.

## How are opportunities and risks detected?

Operations intelligence signals identify workflow bottlenecks, automation opportunities, compliance reviews, growth opportunities, workforce gaps, and process improvements. Open risks include operational, compliance, workforce, financial, customer, technology, and strategic categories with severity and mitigation recommendations.

## How does the approval queue work?

Items enter the approval queue when autonomous operations require human authorization. Each item specifies approval type, required autonomy level, and risk level. Pending items appear in the center and link to `/app/approvals` for final decisions.

## How is this different from the Action Center?

The **Action Center** (`/app/action-center`) handles the Autonomous Execution Framework with execution levels and safety checking. The **Autonomous Operations Center** (`/app/autonomous`) is the proactive planning and coordination layer — it prepares work and routes approvals; it does not replace Trust & Action governance.

## Knowledge Center topics

- **Autonomy Levels** — observation through policy-governed execution
- **Proactive Operations** — opportunities, risks, plans, and proactive tasks
- **Workflow Coordination** — cross-team and Business Pack coordination
- **Approval Governance** — queue, boundaries, and human override
- **Operations Intelligence** — signals, advisor guidance, and improvements
- **Executive Dashboard** — autonomous activity, coverage, and business impact

## Related routes

- `/app/autonomous` — Autonomous Operations Center (this phase)
- `/app/approvals` — Approval Center
- `/app/action-center` — Action Center
- `/app/command-center` — Command Center
- `/app/proactive-organization-engine` — Proactive Organization Engine
