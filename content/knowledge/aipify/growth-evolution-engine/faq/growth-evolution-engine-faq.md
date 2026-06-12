# Growth & Evolution Engine — FAQ

## What is the Growth & Evolution Engine?

The Growth & Evolution Engine (Phase A.81) is an organizational ABOS **Growth** capability that helps teams continuously improve, adapt, and evolve intentionally. It orchestrates learning cycles, tracks metadata-only growth signals, and delivers transparent evolution recommendations with evidence and trade-offs.

## How is this different from Evolution Governance (Phase 84)?

**Evolution Governance (Phase 84)** manages formal change proposals and an approval matrix at `/app/evolution`. **Growth & Evolution (A.81)** focuses on sustainable growth orchestration, learning cycles, and evolution recommendations — not change-proposal workflows.

## How is this different from Capability Maturity (A.57)?

**Capability Maturity Engine (A.57)** measures domain maturity on levels 1–5 at `/app/capability-maturity-engine`. **Growth & Evolution** complements maturity with cross-dimensional growth signals, learning cycles, and actionable recommendations — not level scoring.

## How is this different from Organizational Health (A.56)?

**Organizational Health Engine (A.56)** aggregates readiness indicators across support, adoption, and alignment. **Growth & Evolution** guides intentional improvement over time via learning cycles and evolution capabilities — not aggregate health scoring alone.

## How is this different from the Learning Engine?

**Learning Engine** stores approved customer learning memory at `/app/learning` to improve Aipify with the customer. **Growth & Evolution** orchestrates organizational growth dimensions and evolution recommendations — it does not store learning memory content.

## What growth dimensions are supported?

Five dimensions: **Operational**, **Knowledge**, **Human**, **Customer**, and **Strategic**. Each includes example improvement areas. Organization settings allow focusing on selected dimensions via `focus_dimensions`.

## What is the learning cycle?

The ABOS learning cycle: **Observe → Understand → Improve → Implement → Measure → Learn → Repeat**. Cadence is configurable (weekly, biweekly, monthly, quarterly).

## What evolution capabilities does Aipify provide?

Detect improvement patterns, stagnation risks, emerging opportunities, capability development needs, and healthy adaptation guidance — always with example phrases that avoid pressure or guilt.

## Can I review growth recommendations?

Yes. Recommendations with `requires_review` support **accept**, **defer**, and **dismiss** via `growth_evolution.recommendations.review`. Every recommendation includes evidence summary and trade-offs for Trust Engine transparency.

## How does Proactive Companion connect?

**Proactive Companion (A.79)** may surface growth opportunities proactively. **Growth & Evolution** governs the underlying growth orchestration, signals, and recommendation lifecycle.

## Who can manage settings and export reports?

`growth_evolution.manage` configures focus dimensions, learning cycle cadence, and celebrate-progress toggles. `growth_evolution.export` exports metadata-only growth reports. Owners and administrators have both by default; managers can review and export.
