# AIPIFY – PHASE 559

**TITLE:** Multi-Companion Orchestration, Specialist Collaboration & Coordination Engine

**PURPOSE:** Create the Multi-Companion Engine that allows multiple Companion Specialists to work together under one unified Companion experience — the coordination layer of Companion.

**Feature owner:** CUSTOMER APP

**Route:** `/app/companion/orchestration`

## Objectives

- Companion Orchestration Center with specialists, assignments, coordination, workloads, approvals, reports
- Specialist Registry, Orchestrator routing, Task Delegation, Collaboration Framework
- Unified Companion Principle (one Aipify Companion — never Finance Bot / Risk Bot)
- Context Sharing, Workload Engine, Team Structures, Approval Coordination
- Meeting Council, Decision Support Collaboration
- Phase 556 Skills + Phase 558 Memory integration, Business Pack specialists
- Performance Engine, Executive dashboard, mobile, audit

## Components

| Layer | Path |
|-------|------|
| Migration | `supabase/migrations/20261855900000_multi_companion_orchestration_specialist_collaboration_coordination_engine_phase559.sql` |
| Library | `lib/customer-companion-orchestration-operations/` |
| APIs | `/api/app/companion-orchestration-operations/*`, `/api/assistant/companion-orchestration-advisor-context` |
| UI | `components/app/companion-orchestration-operations/` |
| Page | `app/app/companion/orchestration/page.tsx` |
| i18n | `locales/{en,no,sv,da}/customer-app/settings.json` (`companionOrchestrationOperations.*`) |

## Integration

- Phase 556 Skills: `/app/companion/skills`
- Phase 558 Memory: `/app/companion/memory`
- Approvals: `/app/approvals`
- Legacy Phase 297 orchestration RPC (`get_companion_orchestration_center`) preserved at `/api/companion-orchestration/*`

## RPCs

- `get_organization_companion_orchestration_center(p_section)`
- `perform_organization_companion_orchestration_action(p_payload)`
- `get_organization_companion_orchestration_mobile_summary()`
- `get_assistant_companion_orchestration_advisor_context()`

## Principle

One Companion. Many Specialists. One Experience.

**END OF PHASE.**
