# Implementation Blueprint — Phase 31: Training & Certification Engine

**Feature owner:** Customer App  
**Implementation:** [Learning & Training Engine — Phase A.36](./LEARNING_TRAINING_ENGINE_PHASE_A36.md) · [Certification & Achievement Engine — Phase A.37](./CERTIFICATION_ACHIEVEMENT_ENGINE_PHASE_A37.md)

This document defines **Phase 31 — Training & Certification Engine** of the Aipify Business Operating System (ABOS). It aligns the existing Learning & Training Engine with ABOS guided learning and certification standards — competence, confidence, and practical adoption.

> **Mapping:** ABOS Implementation Blueprint Phase 31 maps to **Learning & Training Engine Phase A.36** at `/app/learning-training-engine`. Certification pathways cross-link **Certification & Achievement Engine Phase A.37** at `/app/certification-achievement-engine`. Do not duplicate a separate engine — extend A.36 RPCs, dashboard, and ILM vocabulary only. All existing A.36 dashboard fields are **preserved**.

## Mission

Help organizations accelerate adoption, strengthen competence, and create long-term success through guided learning and certification experiences.

## Core philosophy

**Knowledge creates confidence. Confidence accelerates adoption.** Learning should feel achievable — not intimidating.

## Training objectives

| Objective | Description |
|-----------|-------------|
| Self-paced learning | Users progress at their own pace with clear modules |
| Guided onboarding journeys | Integrated with Customer Onboarding A.10 |
| Role-based training paths | Owner, administrator, support, manager, and viewer paths |
| Interactive learning experiences | Walkthroughs, checklists, and assessments |
| Companion-assisted education | Calm guidance — encourage growth, not perfection |
| Certification opportunities | Cross-link A.37 for meaningful competence validation |

## Blueprint learning paths

| Path | Audience | Topics |
|------|----------|--------|
| **Aipify Foundations** | All users | What Aipify is, companion principles, core navigation, daily workflows |
| **Support Specialist Certification** | Support teams | Support Engine, Knowledge Center, escalation, customer communication |
| **Executive Companion Certification** | Leaders | Executive Insights, Strategic Intelligence, Operations Center, decision support |
| **Administrator Certification** | Administrators | Workspaces, permissions, governance, integrations, Quality Guardian |

## Learning experiences

Interactive walkthroughs · Scenario-based learning · Knowledge checks · Companion guidance · Simulation exercises — practical, not theoretical.

## Certification principles

Completion requirements · Knowledge assessments · Practical demonstrations · Recertification opportunities — certifications represent meaningful competence.

## Companion learning support

- 🌹 *"You are making excellent progress."*
- 🔔 *"A learning milestone has been achieved."*
- 🦉 *"This concept becomes easier with practice."*
- ❤️ *"Remember that mastery develops over time."*

## Self Love connection

Learning should remain sustainable — encourage patience, normalize mistakes, celebrate progress, reduce fear of failure. Route: `/app/self-love-engine` (principle, not a product toggle).

## Trust connection

Organizations should understand what certifications represent, how learning progress is measured, which competencies have been validated, and what remains optional. Transparency strengthens credibility — metadata only.

## Knowledge Center connection

Training content integrates with FAQs, procedures, organizational knowledge, best practices, and industry guidance at `/app/knowledge-center-engine`.

## Distinctions (cross-link, do not duplicate)

| Surface | Route | Purpose |
|---------|-------|---------|
| **Learning Engine Phase 65/29** | `/app/learning` | Operational learning memory — not user education |
| **Certification A.37** | `/app/certification-achievement-engine` | Certificates, badges, team readiness |
| **Customer Onboarding A.10** | `/app/customer-onboarding-engine` | Ten-step onboarding journey |
| **Learning & Training Academy** | `/app/academy-engine` | Platform academy scaffold — distinct from tenant paths |

## Dogfooding

| Organization | Role |
|--------------|------|
| **Aipify Group** | Internal — employee onboarding, product understanding, support readiness, executive enablement |
| **Unonight** | First external pilot — commerce support training and administrator certification |

## Success criteria (live)

Computed by `_tcbp_blueprint_success_criteria()`:

1. Organizations onboard more successfully (paths assigned and in progress)
2. Learning confidence increases (completions and assessments)
3. Certification pathways feel valuable (definitions and active certs)
4. Adoption accelerates (completion rate improving)
5. Long-term customer success improves (team readiness visible to reviewers)

## RPCs and migration

| RPC | Purpose |
|-----|---------|
| `_tcbp_blueprint_*()` | Phase 31 metadata helpers |
| `_tcbp_engagement_summary(org_id, user_id)` | Live training and certification counts |
| `_tcbp_blueprint_success_criteria(org_id, user_id)` | Live Phase 31 success criteria |
| `get_learning_training_engine_dashboard()` | Extended with Phase 31 fields — **all A.36 fields preserved** |
| `get_learning_training_engine_card()` | Compact blueprint reference |

Migration: `supabase/migrations/20260978000000_implementation_blueprint_phase31_training_certification.sql`

## ABOS principle

The most powerful tools create the greatest value when people understand how to use them confidently. Learning transforms capability into impact.

## Vision

People should feel empowered rather than overwhelmed. Teams should grow together. Organizations should build confidence through competence — *"We know how to succeed with this."*
