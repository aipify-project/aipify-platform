# Implementation Blueprint — Phase 41: Sales Performance & Recognition Engine

**Feature owner:** Customer App  
**Engine phase:** A.95 extension (Sales Expert Operating System)  
**Route:** `/app/sales-expert-engine` · Tab: **Performance & Recognition**

> **Mapping:** Blueprint Phase 41 extends **Sales Expert OS A.95** — not a duplicate of Gratitude & Recognition A.89 (Blueprint Phase 9). Cross-links A.89 for Recognition Roses infrastructure and Self Love A.76 for sustainable pacing.

## Mission

Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify — so people occasionally pause and think: *"I am making a difference."*

## Core philosophy

**Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.**

People thrive when their efforts are noticed. Recognition should reinforce values, not ego.

## Objectives

| Key | Focus |
|-----|-------|
| **Milestones** | Celebrate progress — first customer through sustained support |
| **Healthy competition** | Encouragement-oriented leaderboards — no public shaming |
| **Personal goals** | Commissions, subscriptions, retention, trends |
| **Team celebrations** | Bell Moments for meaningful achievements |
| **Recognition experiences** | Voluntary Recognition Roses from customers |
| **Long-term motivation** | Sustainable pacing via Self Love connection |

## Performance dashboard fields

Monthly commissions · Active subscriptions · New customers acquired · Customer retention rate · Lifetime subscription value · Personal performance trends (scaffold).

Live summary from `_sprbp_performance_summary()` — tenant-scoped customer and commission metadata only.

## Milestone recognition

| Milestone | Emoji | Threshold |
|-----------|-------|-----------|
| First Customer Acquired | 🔔 | 1 |
| Five Active Customers | 🔔 | 5 |
| Fifty Active Customers | 🔔 | 50 |
| One Hundred Customers Supported | 🔔 | 100 |
| First Customer Renewal | 🌹 | Derived from subscription metadata |
| First Enterprise Customer | 🌹 | business/enterprise plan_key |
| First Year as Sales Expert | 🌹 | 365 days program tenure |

Progress tracked via `_sprbp_milestone_progress(organization_id)`.

## Bell Moments 🔔

Gentle celebrations for:

- Significant customer acquisition or onboarding milestone
- Certification completed or sustained customer outcomes
- Meaningful milestone — celebrate progress, not comparison

Examples: *"You have helped another organization begin their Aipify journey."*

## Recognition Roses 🌹

Customers may **optionally** provide Recognition Roses to Sales Experts — voluntary appreciation, never required.

> **Boundary:** Uses Gratitude & Recognition A.89 at `/app/gratitude-recognition-engine`. Distinct from Presence & Comfort A.90 comfort roses.

## Leaderboards

Encouragement-oriented categories only:

- Most Improved Sales Expert
- Highest Customer Satisfaction
- Knowledge Champion
- Onboarding Excellence
- Community Contributor

**Avoid:** Aggressive competition · Public shaming · Vanity metrics without customer outcomes

## Self Love connection (A.76)

Sales can be emotionally demanding — sustainable pacing, work-life balance, recognition of effort, celebration of progress.

Route: `/app/self-love-engine`. Self Love influences tone — Performance & Recognition stores metadata and milestone state only.

## Trust connection

Performance metrics remain transparent. Sales Experts understand:

- How achievements and milestones are measured from customer and commission metadata
- Which metrics influence recognition — customer outcomes over vanity counts
- How customer satisfaction contributes to encouragement categories
- That leaderboards are encouragement-oriented, not punitive

## Distinctions

| Surface | Route | Purpose |
|---------|-------|---------|
| Gratitude & Recognition A.89 | `/app/gratitude-recognition-engine` | Organization-wide peer recognition (Phase 9) |
| Self Love A.76 | `/app/self-love-engine` | Sustainable pacing and wellbeing |
| Sales Expert OS A.95 | `/app/sales-expert-engine` | Partner portal — **Phase 41 Performance tab** |

Phase 41 is Sales Expert performance visibility, milestone celebration, and encouragement-oriented leaderboards within the Sales Expert portal.

## Database

Migration: `supabase/migrations/20260983000000_implementation_blueprint_phase41_sales_performance_recognition.sql`

**No new tables.** Extends `get_sales_expert_operating_system_dashboard()` and `get_sales_expert_operating_system_card()` with Phase 41 fields via `_sprbp_*` helpers.

## UI

- `components/app/sales-expert-engine/SalesExpertEngineDashboardPanel.tsx` — **Performance & Recognition** tab
- Types: `lib/aipify/sales-expert-operating-system/types.ts`, `parse.ts`
- i18n: `customerApp.salesExpertEngine.tabPerformance` + section labels in en/no/sv/da

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase41-sales-performance-recognition.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase41-vocabulary.ts`

## Related docs

- [IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md](./IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md)
- [IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE9_RECOGNITION_CELEBRATION_FOUNDATION.md)
- [SALES_EXPERT_FAQ_KNOWLEDGE_CENTER.md](./SALES_EXPERT_FAQ_KNOWLEDGE_CENTER.md)
