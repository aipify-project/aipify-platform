# Enterprise AI Agent Orchestration Engine — FAQ

## How do digital employees work?

Digital employees are specialized Aipify capabilities registered in the Agent Directory at `/app/orchestration/agents`. Each agent has a role, capabilities, permissions, knowledge sources, tools, and linked Business or Industry Packs. Aipify Companion coordinates the hierarchy — department agents and specialized agents operate under human supervision, never as uncontrolled automation.

## How are tasks assigned?

The Task Routing Engine assigns work in `agent_orchestration_tasks` based on skill, department, priority, permissions, availability, workload, and confidence. Tasks follow a governed lifecycle: created → assigned → analysis → action recommendation → approval (if required) → execution → verification → audit logged.

## How do agent teams collaborate?

Agent teams in `agent_orchestration_teams` group digital employees for Support, Sales, Operations, Finance, Compliance, Industry, and Executive workflows. Teams support shared context, delegation, escalation, and collaboration chains — with metadata only and full audit trail.

## How do approvals work?

The Approval Chain Engine in `agent_orchestration_approval_requests` supports employee, manager, executive, finance, compliance, and custom approval chains. High-risk and critical actions require explicit human approval before execution. Approval status: pending, granted, denied, or expired.

## How are actions governed?

Actions are classified by risk level: low, medium, high, critical, and governance required. Aipify never executes sensitive actions without explicit approval. Orchestration integrates with Trust & Action Engine, Policy Engine, and Emergency Stop — orchestration never bypasses governance.

## How does orchestration improve productivity?

Orchestration analytics track tasks completed, agent utilization, workflow success, approval delays, department activity, automation coverage, and productivity gains. Companion orchestration advisor signals highlight automation opportunities, workload trends, approval bottlenecks, and department capacity needs.

## Digital Employees

Manage Companion, Support, Sales, HR, Finance, Warehouse, Compliance, Industry, and custom agents with profiles, status, and capability declarations.

## Agent Teams

Organize digital employees into Support, Sales, Operations, Finance, Compliance, Industry, Executive, and custom teams.

## Workflow Orchestration

Execute single-agent, multi-agent, cross-department, industry, human-in-the-loop, and enterprise workflows at `/app/orchestration/workflows`.

## Approvals

Route approval chains before safe action execution — humans always retain final decision authority.

## Task Routing

Route work automatically based on skill, department, priority, industry, permissions, availability, and workload at `/app/orchestration/routing`.

## Agent Governance

Governance controls, audit logs, and executive orchestration dashboard at `/app/orchestration/governance` and `/app/orchestration/intelligence`.

## Coordination layer

Phase 68 Orchestration Engine event coordination remains at `/app/orchestration/events`, `/app/orchestration/flows`, and `/app/orchestration/rules` — distinct from digital workforce management but integrated under the Agent Orchestration Center.
