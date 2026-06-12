# ABOS Resilience Engine — FAQ

## What is the ABOS Resilience Engine?

The ABOS Resilience Engine extends Phase A.50 Organizational Resilience Engine at `/app/organizational-resilience-engine`. It helps organizations remain stable, adaptive, and effective during disruption, uncertainty, and crisis — through scenario-based continuity plans, simulations, vulnerability tracking, and structured reviews. See [RESILIENCE_ENGINE.md](../../../../RESILIENCE_ENGINE.md).

## Is this a new route or duplicate engine?

**No.** ABOS Resilience Engine maps to Organizational Resilience Engine A.50 at `/app/organizational-resilience-engine`. It is user-facing ABOS spec alignment — not a separate product surface.

## How is this different from Phase 80 Continuity?

**Phase 80 Continuity** (`/app/continuity`) handles backup ownership, incident mode, readiness score, and crisis briefings. **ABOS Resilience Engine (A.50)** focuses on scenario-based plans, simulations, vulnerability tracking, and structured reviews with human approval. They complement each other.

## How is this different from Organizational Health (A.56)?

**Organizational Health A.56** (`/app/organizational-health-engine`) measures aggregate health indicators across operational domains. **Resilience Engine A.50** focuses on preparedness, continuity planning, and structured recovery — not general health scoring.

## How does Growth & Evolution (A.81) connect?

**Growth & Evolution A.81** (`/app/growth-evolution-engine`) orchestrates sustainable growth and post-adversity learning — lessons learned, improvements, capabilities strengthened, wisdom from difficulty. Resilience Engine prepares and responds; Growth & Evolution integrates learning after events.

## What is the ABOS principle on resilience?

> Strength is revealed in difficult moments — navigate with confidence, compassion, and clarity.

Resilience means recovering, adapting, and growing through difficulty — not the absence of difficulty.

## What are the five resilience dimensions?

**Operational** — process continuity, fallback procedures, recovery priorities. **Knowledge** — documented procedures, role clarity, institutional memory. **Human** — team capacity, backup roles, recovery periods. **Customer** — communication during disruption, transparent updates. **Strategic** — priority decisions, adaptation, long-term recovery.

## How does Aipify support during crisis?

Aipify surfaces relevant information, approved procedures, and clear next steps — coordinating response while **humans lead decisions**. Example: "Human leadership retains decision authority — Aipify coordinates and informs."

## What does Self Love monitor for resilience?

Self Love (A.76) supports recovery periods, overload detection, post-event reflection, celebrating progress, and sustainable adjustments — never pressure or guilt during crisis recovery.

## How does the Trust Engine connect?

The Trust Engine (Phase 76) at `/app/trust` provides calm, transparent, honest communication during uncertainty — explainability and confidence communication supplement resilience coordination.

## Who can manage and approve resilience plans?

Viewing requires `resilience.view`. Creating plans and recording simulations requires `resilience.manage`. Reviews and vulnerability tracking require `resilience.review`. Activating plans requires `resilience.approve`. Owners and administrators typically hold full permissions.

## Where can I learn more?

- Resilience Dashboard: `/app/organizational-resilience-engine`
- Continuity (Phase 80): `/app/continuity`
- ABOS article: [Resilience and Recovery](../../abos/articles/resilience-and-recovery.md)
- Phase doc: [ORGANIZATIONAL_RESILIENCE_ENGINE_PHASE_A50.md](../../../../ORGANIZATIONAL_RESILIENCE_ENGINE_PHASE_A50.md)
