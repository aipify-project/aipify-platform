# Implementation Blueprint Phase 70 — Cross-Functional Intelligence Engine FAQ

## What is Phase 70 of the Implementation Blueprint?

Phase 70 extends the Operations Center Foundation Engine (Phase A.32, layered with Phase 18) with Cross-Functional Intelligence — making relationships between teams, modules, and processes visible for stronger collaboration and systems thinking.

## Where does it live?

`/app/operations-center-foundation-engine` — no new route. Blueprint helpers use `_cfibp_*`; engine helpers remain `_ocf_*`.

## How is this different from Personal Productivity A.70?

Personal Productivity Engine at `/app/personal-productivity-engine` focuses on individual productivity. ABOS Blueprint Phase 70 shares the number 70 but is organizational cross-functional intelligence — a repo phase number collision, not the same feature.

## How is this different from Cross-Tenant Intelligence A.71?

Cross-Tenant Intelligence at `/app/cross-tenant-intelligence-engine` provides anonymized cross-tenant patterns. Phase 70 is **intra-organization** cross-functional visibility — never cross-tenant customer data.

## How is this different from Strategic Alignment Phase 68?

Strategic Alignment Phase 68 at `/app/strategic-alignment-engine` focuses on objective alignment and cascading priorities. Phase 70 focuses on operational connection visibility — cross-link only, do not duplicate alignment storage.

## What are organizational connections?

An illustrative chain: Sales → Customer Success → Support → Knowledge Center → Product Development. Live counts come from module overviews and operations_events — metadata only.

## What are cross-functional observations?

- 🦉 Support patterns may inform product priorities
- 🌹 Marketing/sales alignment strengthens customer experience
- 🔔 Recurring team dependencies deserve coordination review

Awareness not surveillance — never punitive interpretation.

## What is information flow visibility?

How insights travel across functions, where delays occur (overdue tasks, escalations, knowledge gaps), shared knowledge dependencies, and communication opportunities. Aggregate counts only — no PII.

## What is bottleneck identification?

Systemic friction signals: individual reliance (delegation opportunity), inter-department delays, handoff friction, knowledge concentration. **Improvement not blame** — no individual performance scoring.

## What are collaboration opportunities?

Similar challenges solved independently, shared learning via Knowledge Center, and broader initiative representation across modules — 🦉🌹🔔 companion examples.

## What are the privacy principles?

- NO hidden monitoring
- NO individual performance scoring
- NO punitive interpretations
- Metadata only — strengthen systems, not judge people

## What is the Self Love connection?

Empathy across departments, appreciation of diverse contributions, constructive communication, shared ownership. *"Every team contributes to organizational success in different ways."* Cross-linked to `/app/self-love-engine` as a principle only.

## What are the Phase 70 success criteria?

Cross-functional awareness, visible bottlenecks, stronger collaboration, information flow, organizational resilience, privacy/trust principles, and integration distinctions — computed live via `_cfibp_success_criteria()`.

## Does Phase 70 add new database tables?

No. Phase 70 extends dashboard and card RPCs with `_cfibp_*` blueprint helpers. All Phase 18 fields are preserved.
