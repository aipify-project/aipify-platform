# AIPIFY — PHASE 411
## Enterprise AI Agent Orchestration Engine Foundation

**Feature owner:** Customer App  
**Route:** `/app/orchestration`  
**Migration:** `20261691000000_enterprise_ai_agent_orchestration_engine_foundation_phase411.sql`  
**Helpers:** `_geaaoe411_*`

## Purpose

The operational brain of Aipify — coordinates digital employees, specialized agents, workflows, approvals, actions, and business operations across the entire organization under human supervision.

## Core principle

One assistant is useful. An organized workforce of specialized digital employees working together is transformational.

## Relationship to Phase 68

Extends the existing Orchestration Engine (`/app/orchestration/events`, `/flows`, `/rules`, `/settings`) with digital workforce management. Event coordination and agent orchestration operate together — governance always in control.

## Modules

- Orchestration Overview
- Agent Directory
- Agent Teams
- Task Routing
- Workflow Execution
- Approval Chains
- Agent Intelligence
- Governance

## Tables

`agent_orchestration_settings` · `agent_orchestration_agents` · `agent_orchestration_teams` · `agent_orchestration_tasks` · `agent_orchestration_workflows` · `agent_orchestration_approval_requests` · `agent_orchestration_advisor_signals` · `agent_orchestration_audit_logs`

## RPCs

- `get_enterprise_ai_agent_orchestration_center()`
- `enterprise_ai_agent_orchestration_action()`

## Actions

`create_agent` · `create_team` · `assign_task` · `start_workflow` · `request_approval` · `delegate_task`

## Permissions

- `agent_orchestration.view`
- `agent_orchestration.manage`

## Plan gate

Business and Enterprise plans required.

## i18n

`customerApp.enterpriseAiAgentOrchestrationEngine.*` — core locales: en, no, sv, da, pl, uk

## Knowledge Center

FAQ: `content/knowledge/aipify/enterprise-ai-agent-orchestration-engine/faq/`

## END OF PHASE
