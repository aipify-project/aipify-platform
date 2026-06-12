# Implementation Blueprint — Phase 137 Collective Decision & Human-Companion Council Engine

## Feature owner

**CUSTOMER APP** — `/app/collective-decision-council-engine`

## Era

Autonomous Organization Era (131–140)

## Mission

Bring human and companion perspectives together in collective council deliberation — expanding awareness, surfacing disagreement respectfully, and documenting transparent rationale while humans retain full decision authority.

## Philosophy

- Collective wisdom, not consensus at all costs
- Disagreement strengthens wisdom
- Companions expand awareness — they do not vote
- People First. Wisdom before speed. Transparency builds trust
- Growth Partner terminology — never Affiliate

## Database

Migration: `supabase/migrations/20261227000000_collective_decision_human_companion_council_engine_phase137.sql`

| Prefix | Purpose |
|--------|---------|
| `_cdcc_*` | Engine helpers |
| `_cdccbp137_*` | Blueprint helpers (never collide with `_dein_*`, `_deibp125_*`, `_odse_*`) |

### Tables

- `collective_decision_council_settings`
- `collective_decision_workspaces`
- `collective_decision_perspectives`
- `collective_decision_stakeholder_impacts`
- `collective_decision_transparency_records`
- `collective_decision_council_memory`
- `collective_decision_audit_logs`

### RPCs

- `get_collective_decision_council_engine_dashboard()`
- `get_collective_decision_council_engine_card()`
- `create_collective_decision_workspace(...)`
- `record_council_perspective(...)`
- `record_council_transparency(...)`

### Permissions

- `collective_decision.view`
- `collective_decision.manage`

## Application layer

- `lib/aipify/collective-decision-council-engine/`
- `app/api/aipify/collective-decision-council-engine/`
- `components/app/collective-decision-council-engine/`
- Nav: `collectiveDecisionCouncilEngine` in `lib/app/nav-config.ts`
- i18n: `customerApp.collectiveDecisionCouncilEngine.*` (en/no/sv/da)

## Cross-links (do not duplicate)

| Phase | Route |
|-------|-------|
| Decision Intelligence 125 | `/app/decision-intelligence-engine` |
| ODSE A.54 | `/app/organizational-decision-support-engine` |
| Executive Intelligence 121 | `/app/executive-intelligence` |
| Companion Workforce 132 | `/app/companion-workforce-engine` |
| Governance A.14 | `/app/governance-policy-engine` |
| Org Memory A.34 | `/app/organizational-memory-engine` |
| Human Oversight A.40 | `/app/human-oversight-engine` |
| Self Love A.76 | `/app/self-love-engine` |
| Trust Actions 30 | `/app/approvals` |

## ILM

- Corpus: `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase137-collective-decision-human-companion-council.txt`
- Vocabulary: `lib/internal-language-model/implementation-blueprint-phase137-vocabulary.ts`
