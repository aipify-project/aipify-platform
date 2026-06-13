# AI Ethics & Responsible Use Engine — Phase A.46

## Vision

**AI Ethics & Responsible Use Engine** — Customer App engine with Core RPCs in Supabase. Documented AI use cases, explainability requirements, prohibited examples, and ethics review workflows with human oversight. Extends Security & Trust (A.18), Compliance (A.29), Human Oversight (A.40), and Delegated Trust scaffold (A.41).

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260822000000_ai_ethics_responsible_use_engine_phase_a46.sql` |
| Prefix | `_aerue_` |
| decision_type | `ai_ethics_responsible_use_engine` |
| Lib | `lib/aipify/ai-ethics-responsible-use-engine/` |
| Core helpers | `lib/core/ai-ethics-responsible-use.ts` |
| API | `/api/aipify/ai-ethics-responsible-use-engine/*` |
| UI | `/app/ai-ethics-responsible-use-engine` |
| KC FAQ | `content/knowledge/aipify/ai-ethics-responsible-use-engine/faq/ai-ethics-responsible-use-engine-faq.md` |

## Core tables

- `organization_ethics_policies` — explainability defaults, prohibited examples, review frequency, policy exceptions
- `ai_use_cases` — tenant use cases with risk_level (low/medium/high/critical), oversight_required, status (proposed/approved/restricted/retired)

## RPCs

- `get_ai_ethics_responsible_use_engine_dashboard()` — approved/restricted use cases, review schedules, policy exceptions, oversight trends
- `get_ai_ethics_responsible_use_engine_card()` — summary card
- `propose_ai_use_case()` — propose new use case for review
- `review_ai_use_case()` — record ethics review notes
- `approve_ai_use_case()` — approve use case with scheduled review
- `restrict_ai_use_case()` — restrict use case with reason
- `override_ethics_policy_exception()` — audited policy exception with justification
- `update_organization_ethics_policy()` — update ethics policy settings

## Permissions

- `ethics.view`
- `ethics.manage`
- `ethics.review`
- `ethics.override`

## Principle

Business logic in RPCs; panels are thin clients. Critical risk use cases prohibited for autonomous AI. Policy exceptions require explicit justification and audit.
