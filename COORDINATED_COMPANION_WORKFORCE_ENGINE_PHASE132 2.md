# Coordinated Companion Workforce Engine — Phase 132

## Autonomous Organization Era (131–140)

Phase 132 opens workforce coordination in the **Autonomous Organization Era**. Phase 131 (Autonomy Governance & Human Oversight) has **no dedicated migration in this repo yet** — cross-link **Human Oversight A.40** at `/app/human-oversight-engine` for oversight gates until Phase 131 ships.

## Vision & philosophy

People First. Companionship before replacement. Specialized Companions as teams — **NOT** one super-assistant. Humans lead; companions support within governance frameworks. Harmony not hierarchy. Metadata only — no surveillance of individuals.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261222000000_coordinated_companion_workforce_engine_phase132.sql` |
| Lib | `lib/aipify/companion-workforce-engine/` |
| API | `/api/aipify/companion-workforce-engine/dashboard`, `/api/aipify/companion-workforce-engine/card` |
| UI | `/app/companion-workforce-engine` |
| Nav id | `companionWorkforceEngine` |
| Module key | `companion_workforce_engine` |
| RPC prefix | `_ccwf_*` · Blueprint `_ccwfbp132_*` |
| KC FAQ | `content/knowledge/aipify/companion-workforce-engine/faq/companion-workforce-engine-faq.md` |
| Blueprint | `IMPLEMENTATION_BLUEPRINT_PHASE132_COORDINATED_COMPANION_WORKFORCE.md` |

## Companion Workforce Center (8 capabilities)

Directory · responsibility assignment · collaboration rules · visualization · escalation · performance insights (aggregate) · governance · human oversight dashboards

## Distinction

| Surface | Route | Relationship |
|---------|-------|--------------|
| **Companion Workforce (Phase 132)** | `/app/companion-workforce-engine` | Workforce coordination center |
| Multi-Agent Collaboration Phase 74 | `/app/agents` | Agent registry/orchestration — cross-link only |
| Companion Marketplace Phase 113 | `/app/companion-marketplace` | Digital employee catalog — cross-link only |
| Human Oversight A.40 | `/app/human-oversight-engine` | Oversight gates — Phase 131 interim cross-link |
| Proactive Companion | `/app/proactive-companion-engine` | Proactive guidance |
| Workflow Orchestration A.42 | `/app/workflow-orchestration-engine` | Autonomous operations |
| Trust & Action Phase 30 | `/app/approvals` | Sensitive action approvals |
| Self Love A.76 | `/app/self-love-engine` | Wellbeing and psychological safety |

## Rules

- NOT one super-assistant — specialized companion teams
- NOT employee surveillance — aggregate metadata only
- NOT authority expansion without human approval
- Growth Partner terminology — never Affiliate
- Never expose AI provider brands in customer UI
- Thin clients; RPC business logic
- Permissions: `companion_workforce.view`, `companion_workforce.manage`

## Success metrics

Workforce directory clarity · collaboration success · routing effectiveness · conflict resolution · governance alignment · aggregate companion health · human satisfaction signals · psychological safety · long-term adoption
