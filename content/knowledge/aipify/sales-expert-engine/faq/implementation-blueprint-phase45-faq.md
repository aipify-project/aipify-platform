# Sales Coach & Enablement — FAQ (Phase 45)

## What is the Coach & Enablement tab?

**Blueprint Phase 45** adds a **Coach & Enablement** tab to the Sales Expert Operating System at `/app/sales-expert-engine`. It provides supportive daily coaching, activity recommendations, demonstration guidance, and objection handling scaffolds — metadata only, tenant-scoped.

## How is this different from Performance & Recognition (Phase 41)?

**Phase 41** focuses on milestone celebration, leaderboards, and Recognition Roses. **Phase 45** focuses on daily coaching, enablement, demo prep, and supportive activity suggestions. Bell moments overlap — Phase 45 cross-links Phase 41; team celebrations remain on the Performance tab.

## What are Sales Companion roles?

Five coaching personas scaffold guidance tone: Mentor 🌹, Strategist 🦉, Motivator 🔔, Companion ❤️, and Performance advisor 📈. They influence supportive language — never punitive or shaming.

## Are activity recommendations mandatory?

**No.** Recommendations are supportive suggestions derived from pipeline metadata. Sales Experts always decide which actions to take.

## What is the daily sales briefing?

A supportive morning summary from follow-up counts, open opportunities, and new customer metadata — no email or chat content. Encourages consistency without pressure.

## How does Self Love connect?

Sales can be demanding. Phase 45 cross-links **Self Love A.76** at `/app/self-love-engine` for healthy boundaries and recovery after setbacks. Coach stores metadata only.

## Where is training content?

Coach links the existing **Training Center** tab plus **Learning & Training A.36** and **Certification A.37** — it does not duplicate Learning Engine content.

## How are coach insights generated?

From tenant-scoped customer, opportunity, commission, and follow-up metadata via `_scebp_coach_summary()` and related helpers. See the Trust section in the Coach tab.

## Where is the implementation documented?

See [IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md) and migration `20260985000000_implementation_blueprint_phase45_sales_coach_enablement.sql`.
