# Implementation Blueprint — Phase 62: Change Management Engine

**Feature owner:** Customer App  
**Implementation:** [Change Management Engine — Phase A.47](./CHANGE_MANAGEMENT_ENGINE_PHASE_A47.md)

This document defines **Phase 62 — Change Management Engine** of the Aipify Business Operating System (ABOS). It extends Phase A.47 with people-centered organizational change — communication, adoption support, resistance awareness, and leadership insights.

> **Mapping:** ABOS Implementation Blueprint Phase 62 maps to **Change Management Engine Phase A.47** at `/app/change-management-engine`. Blueprint helpers use `_cmbp_*` — engine helpers use `_cme_*` (no collision).

## Mission

Help organizations introduce new systems, processes, structures, and ways of working while supporting people affected.

## Core philosophy

**People resist uncertainty, confusion, and lack of involvement — not change itself. Successful change requires communication, support, and empathy.**

## ABOS principle

**Change is not just implementation — help people move confidently from one reality to another.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Change planning** | Structured initiatives with impact assessment, milestones, and ownership |
| **Communication guidance** | Announcements, FAQs, leadership talking points, progress updates |
| **Stakeholder awareness** | Who is affected, anticipated concerns, where to raise questions |
| **Adoption support** | Training, companion onboarding, reinforcement — nurtured not assumed |
| **Progress visibility** | Milestones, adoption metrics, completion updates |
| **Reinforcement strategies** | Celebration messages and sustained adoption review |

## Change types (blueprint framing)

| Type | Description | Examples |
|------|-------------|----------|
| **Operational** | Workflows, process redesign, policy updates | Workflow redesign, policy updates |
| **Technology** | Software, migrations, AI adoption | Module activation, system migration |
| **Organizational** | Restructuring, leadership, growth | Role changes, team restructuring |

> A.47 `change_initiatives.change_type` enum remains operational (`new_module_activation`, `workflow_changes`, etc.). Phase 62 adds human-centered category framing.

## Change readiness assessment

From `_cmbp_readiness_assessment()`:

- **Why necessary** — clear rationale without pressure
- **Who affected** — teams and workflows — metadata only
- **Concerns** — workload, uncertainty, expectations
- **Support structures** — training, communication, escalation
- **Success definition** — measurable adoption and confidence indicators

## Companion change guidance

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🦉 | Additional communication may help | Briefing before go-live may reduce uncertainty |
| 🌹 | Stakeholders may need more preparation | Training completion below target |
| 🔔 | Milestone completed successfully | Progress update to reinforce momentum |

## Communication support

Announcement templates · FAQs · Leadership talking points · Progress updates · Celebration messages

Cross-link **Stakeholder Communication A.53** at `/app/stakeholder-communication-engine` — do not duplicate multi-channel delivery.

## Adoption support

Training recommendations · Companion onboarding · Reinforcement reminders · Knowledge Center resources

Cross-link **Learning & Training A.36** via `assign_change_training()` — metadata only.

## Resistance awareness

Workload concerns · Fear of unknown · Lack of understanding · Unclear expectations — **empathy not blame**.

## Self Love connection

Patience, compassion, recovery periods, progress recognition — route `/app/self-love-engine` (principle only). *Adjustment often requires time.*

## Leadership insights

Adoption progress · Stakeholder engagement observations · Positive momentum indicators — metadata only; humans decide action.

## Trust connection

Why changes occur · Expected outcomes · Support provided · Where concerns can be raised — audit via `_cme_log()`.

## Critical distinctions

| Surface | Route | Note |
|---------|-------|------|
| **Evolution Governance Phase 84** | `/app/evolution` | Aipify software evolution — not org initiatives |
| **Enterprise Deployment Phase 92** | `/app/enterprise/framework` | Enterprise deployment change section |
| **Stakeholder Communication A.53** | `/app/stakeholder-communication-engine` | Communication delivery cross-link |
| **Organizational Health Phase 61** | `/app/organizational-health-engine` | A.56 health readiness — distinct |
| **Learning A.36** | `/app/learning-training-engine` | Training paths — integration only |
| **Customer Success A.26** | `/app/customer-success-engine` | Adoption health cross-link |
| **Deployment A.20** | `/app/deployment-environment-management-engine` | `_cme_deployment_summary()` |
| **Human Oversight A.40** | `/app/human-oversight-engine` | High-impact approval patterns |

## Dogfooding

**Aipify Group:** product evolution, Sales Expert program, organizational scaling, companion enhancements.  
**Unonight:** first external pilot for commerce module adoption and workflow change.

## Success criteria

Live via `_cmbp_success_criteria(org_id)`: structured initiatives, improved adoption, stakeholder confidence, constructive resistance, organizational resilience, companion guidance, readiness assessment, change types, Self Love, trust, integration links, dogfooding.

## Engagement summary

`_cmbp_engagement_summary(org_id)` — counts from `change_initiatives`, `change_milestones`, `change_communication_plans`, `change_adoption_metrics` — metadata only.

## Vision

Transformation without losing people; leaders supported, employees included; *"This change was handled thoughtfully."*

## Implementation

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261012000000_implementation_blueprint_phase62_change_management.sql` |
| Prefix | `_cmbp_*` (blueprint) · `_cme_*` (engine) |
| Lib | `lib/aipify/change-management-engine/` |
| ILM | `lib/internal-language-model/implementation-blueprint-phase62-vocabulary.ts` |
| Corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase62-change-management.txt` |
| UI | `/app/change-management-engine` |
| KC FAQ | `content/knowledge/aipify/change-management-engine/faq/implementation-blueprint-phase62-faq.md` |

## Dashboard RPC

`get_change_management_engine_dashboard()` preserves **all** Phase A.47 fields and appends `implementation_blueprint_phase62` plus blueprint metadata fields.
