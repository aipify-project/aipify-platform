# Support AI Engine — Phase A.7

## Vision

**Enable organizations to provide faster, more accurate, and scalable customer support through AI-assisted workflows.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260712000000_support_ai_engine_phase_a7.sql` |
| Prefix | `_sai_` · decision type: `support_ai_engine` |
| Lib | `lib/aipify/support-ai-engine/`, `lib/core/support-ai.ts` |
| API | `/api/aipify/support-ai-engine/*`, `/api/support/*` |
| UI | `/app/support-ai-engine` |
| KC FAQ | `content/knowledge/aipify/support-ai-engine/faq/support-ai-engine-faq.md` |

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

- `get_support_ai_engine_dashboard()` — full support health dashboard
- `get_support_ai_engine_card()` — summary card
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
