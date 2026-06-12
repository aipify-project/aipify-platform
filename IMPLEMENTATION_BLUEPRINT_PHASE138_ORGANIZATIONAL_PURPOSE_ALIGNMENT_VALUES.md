# Implementation Blueprint — Phase 138: Organizational Purpose Alignment & Values Engine

**Feature owner:** Customer App  
**Implementation:** [Purpose & Values Engine — Phase A.82](./PURPOSE_VALUES_ENGINE_PHASE_A82.md)

This document defines **Phase 138 — Organizational Purpose Alignment & Values Engine** of the Aipify Business Operating System (ABOS). It extends Phase A.82 and Blueprint Phases 64 & 95 with Autonomous Organization Era purpose alignment depth on the same route.

> **Mapping:** ABOS Implementation Blueprint Phase 138 maps to **Purpose & Values Engine Phase A.82** at `/app/purpose-values-engine`. Layers on Blueprint Phase 64 (`_pvbp_*`) and Phase 95 (`_pvcaebp95_*`) — preserve ALL prior fields.

## Mission

Deepen organizational purpose alignment across leadership, companions, and daily practice — reflection not enforcement.

## Core philosophy

**Purpose guides action — not words on a website. Reflection not ideology enforcement.**

## ABOS principle

**Stewardship through responsibility — humans define purpose and values; companions support reflection only. Growth Partner terminology — never Affiliate. People First.**

## Objectives

| Objective | Description |
|-----------|-------------|
| **Purpose alignment center** | Purpose statements, values reviews, leadership sessions, culture health, companion alignment, decision reflection, dashboards |
| **Values framework engine** | Eight customizable default values guiding everyday choices |
| **Alignment review engine** | Actions vs values, workflows vs purpose, companion consistency — aggregate reflection |
| **Purpose companion** | Reflection prompts and historical context — does not define purpose |
| **Culture health engine** | Organizational culture indicators — NOT employee surveillance |
| **Purpose integration** | Leadership, companions, Growth Partner, KC, learning, transformation, community |
| **Values memory** | Mission updates, refinements, cultural milestones — metadata summaries |
| **Executive purpose reviews** | Leadership accountability through reflection |

## Default values framework

Integrity · Compassion · Curiosity · Responsibility · Transparency · Excellence · Community · Growth

Organizations customize stated values — framework scaffolds defaults only.

## Companion limitations

- Never impose beliefs or ideological framing
- Never claim objective truth about organizational purpose
- Never replace leadership purpose definition
- Never suppress diversity of perspective
- Never override governance or Human Oversight gates

## Culture health indicators (organizational aggregates)

Knowledge sharing · Recognition · Leadership accessibility · Psychological safety signals · Learning participation · Community engagement · Support experiences

## Distinctions

From `_opabp138_distinction_note()`:

| Surface | Route | Distinction |
|---------|-------|-------------|
| Social Impact & Purpose Phase 118 | `/app/social-impact-purpose-engine` | Social impact initiatives — not tenant values alignment |
| Collective Decision Council Phase 137 | `/app/collective-decision-council-engine` | Collective deliberation — cross-link decision reflection |
| Strategic Alignment A.55 | `/app/strategic-alignment-engine` | Strategic objectives — cross-link only |
| Inclusion & Humanity A.83 | `/app/inclusion-humanity-engine` | Human Values Charter vs tenant purpose |

## Security requirements

Purpose review audit via `_pve_log`, RBAC `purpose_values.*`, 2FA cross-link `/app/settings/two-factor`, Trust Actions cross-link `/app/approvals`.

## RPC helpers

| Helper | Purpose |
|--------|---------|
| `_opabp138_blueprint_block(org_id)` | Full Phase 138 blueprint block |
| `_opabp138_engagement_summary(org_id)` | Live engagement counts |
| `_opabp138_success_criteria(org_id)` | Live success criteria |
| `record_purpose_alignment_review(...)` | Schedule alignment review |
| `capture_values_memory_entry(...)` | Capture values memory metadata |

## Dashboard preservation

`get_purpose_values_engine_dashboard()` and `get_purpose_values_engine_card()` preserve **ALL** A.82 + Phase 64 + Phase 95 fields; append `implementation_blueprint_phase138` and `purpose_alignment_*` / `opabp138_*` fields.
