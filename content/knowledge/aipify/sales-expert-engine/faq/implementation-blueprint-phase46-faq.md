# Sales Coach Certification & Field Enablement — FAQ (Phase 46)

## What is the Certification & Field Enablement tab?

**Blueprint Phase 46** adds a **Certification & Field Enablement** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It provides the sales training pathway, certification requirements, simulation scaffolds, field enablement nudges, and email template metadata — tenant-scoped, metadata only.

## How is this different from Coach & Enablement (Phase 45)?

**Phase 45** focuses on daily coaching, activity recommendations, and demonstration guidance. **Phase 46** focuses on certification pathways, assessment principles, simulation practice scaffolds, and field sales enablement. They complement each other on the same dashboard.

## What are the certification tiers?

| Tier | Minimum score |
|------|---------------|
| Certified Sales Representative | 75% |
| Sales Expert | 85% |
| Elite Sales Expert | 95% + practical excellence |

Official partner terminology — never **Affiliate** publicly.

## Can I retake assessments?

**Yes.** Retakes are allowed. After 3 attempts below threshold, review training materials before the next attempt — mastery not exclusion.

## Is the simulation engine live?

**Not yet.** The sales simulation engine is a **metadata scaffold** — Aipify will act as customer in a future practice mode. Cross-link Simulation Lab at `/app/simulations` for decision practice.

## Does Phase 46 support mass email campaigns?

**No.** Email enablement extends one-to-one templates with expert details and certification status. Mass unsolicited outreach is explicitly **not supported**.

## Where is training content stored?

Phase 46 links **Learning & Training A.36** and **Certification A.37** — it does not duplicate Learning Engine content. The six-module pathway is metadata scaffolding the certification journey.

## How is certification summary generated?

From partner program metadata (`partners.certification_level`) and `organization_sales_expert_settings.metadata` via `_sccfebp_certification_summary()` — no customer PII.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md) and migration `20260991000000_implementation_blueprint_phase46_sales_coach_certification_field_enablement.sql`.
