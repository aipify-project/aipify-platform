# Digital Twin & Organizational Model Engine — Phase 77

Build Aipify's Organizational Digital Twin so the platform understands how work flows through an organization — teams, roles, responsibilities, approval flows, communication paths, and business processes.

## Core principle

**The Twin models responsibilities — NOT people.**

The Twin exists to improve coordination, efficiency, escalation, communication, governance, and operational clarity.

It must **never** be used for employee surveillance, micromanagement, performance scoring, hidden monitoring, behavioral ranking, or secret profiling.

## Twin components

| Component | Represents |
|-----------|------------|
| Structure Twin | Departments, teams, business units, locations |
| Responsibility Twin | Process owners, approvers, reviewers, SMEs |
| Communication Twin | Escalation routes, notification paths, cross-functional collaboration |
| Process Twin | Approval chains, onboarding flows, incident processes |

## Routes

| Route | Purpose |
|-------|---------|
| `/app/digital-twin` | Twin Health, roles, processes, knowledge routing, insights |
| `/app/digital-twin/processes/[key]` | Process steps and escalation path detail |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/digital-twin/card` | `get_digital_twin_card` |
| `GET /api/aipify/digital-twin/dashboard` | `get_digital_twin_dashboard` |
| `GET /api/aipify/digital-twin/processes/[key]` | `get_digital_twin_process` |
| `GET /api/aipify/digital-twin/route-knowledge?topic=` | `route_digital_twin_knowledge` |
| `GET /api/aipify/digital-twin/escalation/[processKey]?step=` | `resolve_digital_twin_escalation` |
| `GET /api/aipify/digital-twin/bottlenecks` | `detect_digital_twin_bottlenecks` |
| `POST /api/aipify/digital-twin/jobs/run` | `calculate_digital_twin_health_score`, `detect_digital_twin_bottlenecks` |

## Migration

`supabase/migrations/20260616800000_digital_twin_organizational_model_phase77.sql`

Tables (prefixed to avoid conflict with Phase 51 OIL):

- `digital_twin_roles`
- `digital_twin_role_assignments`
- `digital_twin_process_models`
- `digital_twin_process_steps`
- `digital_twin_knowledge_owners`
- `digital_twin_escalation_paths`
- `digital_twin_insights`
- `digital_twin_metrics`
- `digital_twin_audit_log`

Links to existing `aipify_organizations` and `aipify_organization_units` where applicable.

## Twin Health Score (0–100)

Measures: process coverage, ownership completeness, escalation clarity, confidence levels, knowledge ownership.

## Confidence levels

- **High** — 90–100%
- **Medium** — 70–89%
- **Low** — below 70% (requires human validation)

## Integrations

| Module | Use |
|--------|-----|
| Action Center | Task assignment, escalation, ownership validation |
| Desktop Companion | Notification routing, reminder prioritization |
| Executive Briefing | Department summaries, bottleneck reporting |
| Governance | Approver identification, separation of duties |
| Multi-Agent | Support/Knowledge/Governance agent routing |
| Learning Engine | Improved routing suggestions (explainable) |
| Orchestration | `digital_twin.escalation` events |
| TACC Audit | Twin routing and edit audit trail |

## Library

`lib/aipify/digital-twin/` — types, parse, jobs

## Knowledge Center

Category: `digital-twin`  
FAQ: `content/knowledge/aipify/digital-twin/faq/digital-twin-faq.md`

## Out of scope (V1)

- Employee scoring or ranking systems
- Hidden productivity monitoring
- Automatic disciplinary recommendations
- Behavioral surveillance

## Relationship to Phase 51 (OIL)

Phase 51 (`/app/insights`, `/app/organization`) provides organizational intelligence and workflow definitions. Phase 77 adds a responsibility-centric Digital Twin with process models, escalation paths, knowledge routing, bottleneck detection, and Twin Health — complementary, not duplicate.
