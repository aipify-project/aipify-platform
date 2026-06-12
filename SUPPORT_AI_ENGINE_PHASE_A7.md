# Support AI Engine — Phase A.7

## Vision

**Enable organizations to provide faster, more accurate, and scalable customer support through AI-assisted workflows.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260712000000_support_ai_engine_phase_a7.sql` |
| Blueprint alignment | `supabase/migrations/20260958000000_implementation_blueprint_phase11_support_engine.sql` |
| Prefix | `_sai_` · decision type: `support_ai_engine` |
| Lib | `lib/aipify/support-ai-engine/`, `lib/core/support-ai.ts` |
| API | `/api/aipify/support-ai-engine/*`, `/api/support/*` |
| UI | `/app/support-ai-engine` |
| KC FAQ | `content/knowledge/aipify/support-ai-engine/faq/support-ai-engine-faq.md` |
| Blueprint doc | [IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_ENGINE_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE11_SUPPORT_ENGINE_FOUNDATION.md) |
| Blueprint FAQ | `content/knowledge/aipify/support-ai-engine/faq/implementation-blueprint-phase11-faq.md` |
| ILM | `implementation-blueprint-phase11-support-engine.txt`, `implementation-blueprint-phase11-vocabulary.ts` |

## ABOS Implementation Blueprint Phase 11

Phase 11 — **Support Engine Foundation** maps to this engine. Extends dashboard and card RPCs with:

- Mission, support objectives, support tiers (Tier 1 Self-Service · Tier 2 Assisted · Tier 3 Human Escalation)
- Case management capabilities, KC connection, Self Love connection, trust connection
- Live success criteria via `_sai_blueprint_success_criteria()`
- Integration links (KC A.5, Approvals, Human Oversight A.40, Quality Guardian A.13, Self Love A.76, Unonight Pilot)
- Dogfooding (Aipify Group internal · Unonight pilot)

> **Distinct from ASO:** Autonomous Support Operations at `/app/settings/support-operations` — cross-link only.

## Core tables

| Table | Purpose |
|-------|---------|
| `organization_support_cases` | Tenant-scoped support cases with priority, channel, AI summary |
| `support_ai_responses` | AI drafts and automatic replies with knowledge sources |
| `support_ai_settings` | Response modes, auto-FAQ, escalation threshold, channels |
| `support_case_satisfaction` | Positive/neutral/negative feedback with comments |
| `support_ai_knowledge_gaps` | Gap detection for missing FAQs and outdated articles |

## Support AI principles

- Tenant-aware operation
- Knowledge-driven responses
- Human oversight for medium/high-risk actions
- Audit logging for important activities
- Continuous improvement through feedback

## Response modes

| Mode | Behavior |
|------|----------|
| `automatic` | Low-risk FAQ answers sent when confidence is high |
| `draft` | AI generates response for human approval |
| `manual` | Human handles without AI execution |

## RPCs

- `get_support_ai_engine_dashboard()` — full support health dashboard with Phase 11 blueprint metadata
- `get_support_ai_engine_card()` — summary card with blueprint note
- `_sai_blueprint_success_criteria(uuid)` — live Phase 11 success checks
- `create_organization_support_case(...)` — create new case
- `suggest_support_ai_response(uuid)` — AI response with KC integration
- `approve_support_ai_response(uuid)` / `send_support_reply(uuid)`
- `escalate_support_case(uuid, text)` / `close_organization_support_case(uuid)`
- `submit_support_satisfaction(uuid, text, text)`
- `get_support_ai_metrics()` — FRT, resolution time, escalation rate, satisfaction
- `detect_support_knowledge_gaps()`

## Permissions

- `support.view`, `support.reply`, `support.assign`, `support.escalate`, `support.close`, `support.view_metrics`

## TypeScript helpers (`lib/core/support-ai.ts`)

- `createSupportCase()`, `suggestSupportResponse()`, `approveSupportDraft()`, `sendSupportReply()`
- `escalateSupportCase()`, `closeSupportCase()`, `submitSupportSatisfaction()`
- `getSupportMetrics()`, `detectKnowledgeGaps()`, `shouldEscalate()`, `isHighRiskTopic()`

## API endpoints

- `GET /api/aipify/support-ai-engine/dashboard`
- `GET /api/aipify/support-ai-engine/card`
- `POST /api/support/cases`
- `POST /api/support/cases/[id]/suggest`
- `POST /api/support/responses/[id]/approve|send|escalate|close`

## Audit events

Support replies, AI drafts, escalations, approvals, case creation/closure, satisfaction feedback.

## Principle

Support AI never replaces human judgment on sensitive topics — it accelerates routine work while keeping humans in control.
