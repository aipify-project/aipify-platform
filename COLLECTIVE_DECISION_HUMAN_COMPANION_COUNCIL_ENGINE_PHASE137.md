# Collective Decision & Human-Companion Council Engine — Phase 137

## Autonomous Organization Era (131–140)

Phase 137 delivers the **Collective Decision Council** — human-companion deliberation for major organizational decisions. Phases 131–136 are marked complete in the product roadmap.

## Vision & philosophy

People First. Wisdom before speed. **Collective wisdom, not consensus at all costs.** Companions expand awareness — they **do not vote**. Humans remain decision-makers. Transparency builds trust. Growth Partner terminology — never Affiliate.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261227000000_collective_decision_human_companion_council_engine_phase137.sql` |
| Lib | `lib/aipify/collective-decision-council-engine/` |
| API | `/api/aipify/collective-decision-council-engine/dashboard`, `/api/aipify/collective-decision-council-engine/card` |
| UI | `/app/collective-decision-council-engine` |
| Nav id | `collectiveDecisionCouncilEngine` |
| Module key | `collective_decision_council_engine` |
| RPC prefix | `_cdcc_*` · Blueprint `_cdccbp137_*` |
| KC FAQ | `content/knowledge/aipify/collective-decision-council-engine/faq/collective-decision-council-engine-faq.md` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE137_COLLECTIVE_DECISION_HUMAN_COMPANION_COUNCIL.md` |

## Collective Decision Center (8 capabilities)

Decision workspaces · perspective collection · companion contributions · executive reviews · governance integration · stakeholder mapping · reflection sessions · decision histories

## Distinction

| Surface | Route | Relationship |
|---------|-------|--------------|
| **Collective Decision Council (Phase 137)** | `/app/collective-decision-council-engine` | Collective council with human-companion perspectives |
| Decision Intelligence Phase 125 | `/app/decision-intelligence-engine` | Executive advisory workspaces — cross-link only |
| Organizational Decision Support A.54 | `/app/organizational-decision-support-engine` | Org decision register — cross-link only |
| Executive Intelligence Phase 121 | `/app/executive-intelligence` | Leadership companion cross-link |
| Companion Workforce Phase 132 | `/app/companion-workforce-engine` | Companion roles and coordination |
| Governance Policy A.14 | `/app/governance-policy-engine` | Governance integration |
| Organizational Memory A.34 | `/app/organizational-memory-engine` | Decision register and lessons |
| Human Oversight A.40 | `/app/human-oversight-engine` | Oversight gates |
| Self Love A.76 | `/app/self-love-engine` | Reflection and psychological safety |
| Trust & Action Phase 30 | `/app/approvals` | Sensitive action approvals |

## Rules

- Companions advise — **never vote**
- Collective wisdom — disagreement welcomed, not suppressed
- NOT duplicating Decision Intelligence `_dein_*` or ODSE `_odse_*` RPCs
- Metadata only — no raw sensitive decision content
- Growth Partner terminology — never Affiliate
- Thin clients; RPC business logic
- Permissions: `collective_decision.view`, `collective_decision.manage`

## Success metrics

Perspective diversity · respectful disagreement · stakeholder awareness · decision transparency · council memory · human confidence · companion advisory value · institutional collective wisdom
