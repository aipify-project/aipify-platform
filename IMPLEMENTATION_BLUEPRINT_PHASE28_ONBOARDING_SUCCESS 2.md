# Implementation Blueprint — Phase 28: Onboarding & Success Engine

**Feature owner:** Customer App  
**Implementation:** [Customer Onboarding Engine — Phase A.10](./CUSTOMER_ONBOARDING_ENGINE_PHASE_A10.md)

This document defines **Phase 28 — Onboarding & Success Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Customer Onboarding Engine with ABOS preparation standards — value quickly after adoption, guided setup through long-term success, while preserving human control, trust, and Phase A.10 boundaries.

> **Mapping:** ABOS Implementation Blueprint Phase 28 maps to **Customer Onboarding Engine Phase A.10** at `/app/customer-onboarding-engine`. Do not duplicate Aipify Install Engine A.22 (Install & Adoption ABOS already aligned), Customer Success Engine A.26 (ongoing health and renewal), or Modern Install `/app/install` — extend Phase A.10 RPCs, dashboard, and ILM vocabulary only.

## Mission

Deliver value quickly after adoption — not merely installed, but successfully adopted; guide setup through long-term success.

## Core philosophy

**First experiences matter — supported from the beginning; success without technical expertise.**

## ABOS principle

**Technology succeeds when people succeed — onboarding is the beginning of the relationship.**

## Primary vs related engines

| Surface | Route | Role in Phase 28 |
|---------|-------|------------------|
| **Customer Onboarding A.10** (primary) | `/app/customer-onboarding-engine` | Guided setup journey, checklist, KC recommendations, blueprint metadata |
| **Customer Success A.26** (cross-link) | `/app/customer-success-engine` | Ongoing health scores, adoption tracking, interventions, renewal risk — distinct from setup journey |
| **Aipify Install Engine A.22** (cross-link) | `/app/aipify-install-engine` | Technical installation and environment discovery — Install & Adoption ABOS already aligned |
| **Modern Install Phase 24** (cross-link) | `/app/install` | Token-free install wizard and developer settings — embedded runtime |
| **Launch Readiness A.25** (cross-link) | `/app/launch-readiness-engine` | Pre-launch checklist and go-live review — distinct from org onboarding |

**A.10 vs A.26 distinction:** Customer Onboarding guides new organizations through setup steps, checklist completion, and early activation. Customer Success tracks ongoing adoption health, satisfaction, interventions, and renewal risk after onboarding begins. Phase 28 extends A.10; A.26 is cross-linked for long-term success objectives.

## Onboarding journey (metadata stages)

From `_osbp_blueprint_onboarding_journey()`:

| Stage | Key | Purpose |
|-------|-----|---------|
| 1. Welcome | `welcome` | Introduce Aipify, set expectations, acknowledge getting started |
| 2. Connect | `connect` | Integrations, permissions, validate environments |
| 3. Learn | `learn` | Knowledge Center foundations, workflows, train stakeholders |
| 4. Activate | `activate` | Support, tasks, executive summaries, go-live readiness |
| 5. Grow | `grow` | Advanced capabilities, Business Packs, thoughtful expansion |

Phase A.10 ten-step flow (`welcome` → `go_live`) maps to these five blueprint stages — both preserved.

## Early success moments

From `_osbp_blueprint_early_success_moments()`:

| Emoji | Scenario | Example |
|-------|----------|---------|
| 🔔 | First KC article live | 🔔 Your first Knowledge Center article is live — a foundation others can build on. |
| 🌹 | Team completed onboarding | 🌹 Your team completed onboarding — Aipify is ready to support daily work together. |
| 🔔 | First support workflow | 🔔 Your first support workflow is configured — customers can get help through your channels. |
| ❤️ | Celebrate milestone | ❤️ You reached an early success milestone — small wins build confidence for what's next. |

## Customer success objectives

From `_osbp_blueprint_customer_success_objectives()`:

- Adoption progress — checklist and step completion trends
- Feature utilization — core modules activated and explored
- Knowledge Center growth — articles published and team trained
- Support outcomes — channels configured and workflows ready
- Engagement — team invitations and operations dashboard exploration
- Satisfaction — confidence building through guided wins, not pressure

## Self Love connection

Self Love encourages gradual feature introduction, avoids overwhelm, celebrates small wins, and supports patience — route `/app/self-love-engine`. Principle only, not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md).

## Trust connection

Users should understand what Aipify is doing, why recommendations appear, which capabilities are available, and how success is measured — metadata only, transparent progress tracking.

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — installation simplicity, time-to-value, feature understanding, confidence |
| **Unonight** | First external pilot — commerce onboarding, team activation, early wins |

## Success criteria (live)

Computed by `_osbp_blueprint_success_criteria(org_id)`:

1. Onboarding completion — checklist and steps progressing
2. Decreased time-to-value — early checklist items completed
3. Increased adoption — modules and integrations connected
4. Stronger confidence — milestones and early success moments documented
5. Long-term engagement — team setup and KC foundations
6. Onboarding journey documented (five stages)
7. Early success moments documented (🔔🌹❤️)
8. Customer success objectives documented
9. Self Love connection — gradual, celebratory pacing
10. Trust transparency — explainable recommendations
11. Integration links distinct from Install, Success, Launch Readiness
12. Onboarding engine active for organization

## Engagement summary (live)

Computed by `_osbp_engagement_summary(org_id)` from `organization_onboarding` and `onboarding_checklist_items` — counts only, no PII.

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_osbp_engagement_summary(org_id)` | Live counts from onboarding tables |
| `_osbp_blueprint_success_criteria(org_id)` | Live structural checks |
| `get_customer_onboarding_engine_dashboard()` | Full blueprint dashboard — **all Phase A.10 fields preserved** |
| `get_customer_onboarding_engine_card()` | Extended with compact blueprint metadata |

Migration: `supabase/migrations/20260975000000_implementation_blueprint_phase28_onboarding_success.sql`  
Base engine: `20260715000000_customer_onboarding_engine_phase_a10.sql`

## Integration links

Aipify Install Engine A.22 · Modern Install Phase 24 · Customer Success A.26 · Launch Readiness A.25 · Business Packs A.43 Phase 15 · Knowledge Center A.5 · Integration Engine A.8 · Companion Identity A.84 · Learning & Training A.36 · Value Realization Engine · Self Love A.76

## Vision phrases

- Easy to adopt despite depth — guided, not overwhelmed.
- We understood it, benefited, and were never left alone.
- Technology succeeds when people succeed — onboarding begins the relationship.
- First experiences matter — supported from the beginning.
- Small wins build confidence for thoughtful expansion.
