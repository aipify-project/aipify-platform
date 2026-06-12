# Implementation Blueprint — Phase 46: Sales Coach Certification & Field Enablement Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Certification & Field Enablement**

> **Mapping:** Blueprint Phase 46 extends **Sales Expert OS A.95** — not a separate engine route. Cross-links Certification A.37, Learning & Training A.36, Partner Certification Phase 91, Coach & Enablement Phase 45, Performance & Recognition Phase 41, Gratitude & Recognition A.89, and Self Love A.76.

## Mission

Develop competent professionals — training strengthens confidence; certification reflects genuine competence.

## Core philosophy

**Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.**

Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.

## Sales training pathway (6 modules)

1. **Introduction to Aipify** — philosophy, companion model, business value
2. **Ethical Sales Practices** — honest representation, customer-first conversations
3. **Discovery Conversations** — active listening, workflow understanding
4. **Aipify Demonstrations** — install-first positioning, demo structure
5. **Implementation Fundamentals** — onboarding scope, realistic timelines
6. **Customer Success** — renewals, expansion, long-term partnership

Cross-links Learning & Training A.36 and Certification A.37 — does not duplicate content.

## Sales simulation engine

Metadata scaffold — Aipify acts as customer for safe practice:

- Cold conversations
- Discovery
- Demonstrations
- Objections
- Renewals

Complements Phase 45 roleplay scaffold. Cross-link Simulation Lab Phase 22 at `/app/simulations`.

## Telephone sales coaching

Five-step framework — **structure not scripts**:

1. Introduction
2. Curiosity and discovery
3. Opportunities
4. Demo invitation
5. Next steps

## Assessment principles

Growth not fear — dimensions:

- Product understanding
- Communication
- Ethical judgment
- Customer focus
- Demo readiness

## Certification requirements

| Tier | Minimum score | Notes |
|------|---------------|-------|
| **Certified Sales Representative** | 75% | Modules 1–3, ethical acknowledgment |
| **Sales Expert** | 85% | All modules, discovery simulation, demo readiness |
| **Elite Sales Expert** | 95% | Practical excellence review, customer success metadata |

Official partner terminology — **never Affiliate publicly**.

## Reassessment

- Retakes allowed
- Max 3 attempts before material review
- Mastery not exclusion

## Certification display

Profiles · Partner directories · Dashboards — dates and identifiers (scaffold).

## Email enablement center

Templates with expert details, booking links, certification status.

**NO mass unsolicited outreach** — explicit platform boundary. Extends existing Email Center tab.

## Implementation pricing guidance

Non-binding illustrative examples (NOK) — Sales Experts set own consulting pricing.

## Installation experience journey

Subscribe → Welcome → Onboarding → Install → Companion-led training (5 steps).

## Field sales enablement

Companion nudges: in-person demos, sector opportunities, certified follow-ups.

Distinct from Phase 45 field sales coaching — emphasizes certification-ready field work.

## Performance culture

Customer satisfaction · Sustainable growth · Implementation excellence · Professional development — **not revenue comparison emphasis**.

## Self Love connection (A.76)

Retaking assessments is learning — not failure. Route: `/app/self-love-engine`.

## Trust connection

Transparent assessment criteria · Honest simulation scaffolds · Email boundary · Non-binding pricing.

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| Certification & Field Enablement Phase 46 | `/app/sales-expert-engine` (Certification tab) | Training pathway, certification, field enablement |
| Coach & Enablement Phase 45 | `/app/sales-expert-engine` (Coach tab) | Daily coaching, demo guidance |
| Performance & Recognition Phase 41 | `/app/sales-expert-engine` (Performance tab) | Milestones, leaderboards |
| Certification A.37 | `/app/certification-achievement-engine` | Achievement milestones |
| Learning & Training A.36 | `/app/learning-training-engine` | Foundations content |
| Partner Certification Phase 91 | `/app/partners` | Partner directory workflow |

## Dogfooding

Aipify uses Sales Coach certification pathway internally first — Sales Reps and Experts validate training modules and assessment tone.

## Success criteria

Evaluated via `_sccfebp_blueprint_success_criteria(organization_id)` — training pathway, simulation scaffold, certification tiers, reassessment, email boundary, installation journey, field enablement, Self Love, trust, dogfooding.

## Implementation

- Migration: `20260991000000_implementation_blueprint_phase46_sales_coach_certification_field_enablement.sql`
- Types/parse: `lib/aipify/sales-expert-operating-system/`
- UI: `components/app/sales-expert-engine/SalesExpertEngineDashboardPanel.tsx` — `CertificationFieldEnablementTab`
- ILM: `implementation-blueprint-phase46-sales-coach-certification-field-enablement.txt`, `implementation-blueprint-phase46-vocabulary.ts`
- i18n: `customerApp.salesExpertEngine.*` in en/no/sv/da
- FAQ: `content/knowledge/aipify/sales-expert-engine/faq/implementation-blueprint-phase46-faq.md`
