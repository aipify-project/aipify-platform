# Evolution Governance & Change Management Engine — Phase 84

## Core principle

**Aipify proposes evolution. Humans approve evolution.**

Innovation without control creates chaos. Control without innovation creates stagnation. Phase 84 balances innovation, governance, transparency, and human oversight.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260617600000_evolution_governance_change_management_phase84.sql` |
| Lib | `lib/aipify/evolution-governance/` |
| API | `/api/aipify/evolution-governance/*` |
| UI | `/app/evolution` — tenant Evolution Board + Core Evolution (Global Learning) |
| KC FAQ | `content/knowledge/aipify/evolution/faq/evolution-governance-faq.md` |

## Database tables

- `evolution_proposals` — tenant-scoped change proposals
- `evolution_reviews` — reviewer decisions
- `evolution_approvals` — governance/executive approvals
- `evolution_history` — outcomes and implementation status
- `evolution_settings` — org configuration
- `evolution_briefings` — executive briefing summaries
- `evolution_audit_log` — audit trail

## Status flow

Proposed → Under Review → Approved → Scheduled → Implemented → Validated → Archived

Rejected proposals remain visible for audit.

## Change categories

Knowledge, Automation, Workflow, Blueprint, Marketplace, Prompt, Desktop, Policy

## Approval matrix

| Risk | Approver |
|------|----------|
| Low | Reviewer (optional auto-publish if enabled) |
| Medium | Designated reviewer |
| High | Governance |
| Critical | Executive |

## Integrations

- **Trust Engine** — evidence, assumptions, alternatives on every proposal
- **Learning Engine** — repeated opportunities (advisory)
- **Global Learning** — industry patterns (privacy-protected)
- **Simulation Engine** — validation gate for high-risk proposals
- **Strategic Intelligence** — seeds proposals from opportunities and risks
- **Knowledge Center** — knowledge gap proposals route to Knowledge Owners
- **Action Center** — review/approve/revise/reject tasks via `_ach_upsert_item`
- **Executive Briefing** — `generate_evolution_briefing()`

## Safety guarantees

- No autonomous system modification
- No governance bypass
- No invisible organizational changes
- Implementation RPC records status only — humans execute actual changes

## RPCs

- `get_evolution_governance_board()` — main dashboard
- `get_evolution_governance_card()` — home card data
- `get_evolution_proposal_detail(uuid)` — proposal with reviews/approvals/history
- `review_evolution_proposal(uuid, text, text)` — submit review
- `approve_evolution_proposal(uuid)` — record approval
- `reject_evolution_proposal(uuid, text)` — reject with audit
- `schedule_evolution_proposal(uuid)` — schedule implementation
- `implement_evolution_proposal(uuid)` — record implementation (advisory)
- `validate_evolution_proposal(uuid)` — validate outcome
- `rollback_evolution_proposal(uuid, text)` — rollback with history
- `generate_evolution_briefing()` — executive summary
