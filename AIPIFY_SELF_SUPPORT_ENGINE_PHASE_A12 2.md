# Aipify Self-Support Engine — Phase A.12

## Vision

**Help Aipify customers resolve questions quickly through knowledge-driven self-service — with human escalation when necessary.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260717000000_aipify_self_support_engine_phase_a12.sql` |
| Prefix | `_sse_` · decision type: `aipify_self_support_engine` |
| Lib | `lib/aipify/self-support-engine/`, `lib/core/self-support.ts` |
| API | `/api/aipify/self-support-engine/*`, `/api/self-support/*`, `/api/embed/self-support` |
| UI | `/app/self-support-engine` |
| KC FAQ | `content/knowledge/aipify/self-support-engine/faq/self-support-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `self_support_settings` | Auto-response, escalation threshold, channels |
| `self_support_conversations` | Tenant-scoped self-service conversations |
| `self_support_messages` | Metadata summaries only (max 500 chars) — no raw chat |
| `self_support_escalations` | Escalation queue with reason and status |
| `self_support_feedback` | Helpful/unhelpful ratings and improvement suggestions |
| `self_support_knowledge_gaps` | Gap detection for KC improvement |

## Self-support principles

- Knowledge-driven responses
- Tenant-aware support
- Human escalation when necessary
- Continuous learning through feedback
- Audit logging for important activities

## Confidence levels

| Level | Threshold | Behavior |
|-------|-----------|----------|
| `high` | ≥ 80% | Automatic response allowed |
| `medium` | 50–79% | Draft recommendation shown |
| `low` | < 50% | Escalate to support team |

## RPCs

- `get_self_support_engine_dashboard()` — full self-support health dashboard
- `get_self_support_engine_card()` — summary card
- `create_self_support_conversation(...)` — start new conversation
- `ask_self_support(uuid, text, boolean)` — KC search + AI response + confidence evaluation
- `search_self_support_knowledge(text)` — Knowledge Center search wrapper
- `escalate_self_support_conversation(uuid, text)` / `close_self_support_conversation(uuid)`
- `submit_self_support_feedback(...)` — helpful/unhelpful feedback
- `detect_self_support_knowledge_gaps()` / `get_self_support_conversations()`

## Permissions

- `self_support.view`, `self_support.manage`, `self_support.review_feedback`, `self_support.manage_knowledge`

## TypeScript helpers (`lib/core/self-support.ts`)

- `createSelfSupportConversation()`, `askSelfSupport()`, `searchSelfSupportKnowledge()`
- `escalateSelfSupportConversation()`, `closeSelfSupportConversation()`, `submitSelfSupportFeedback()`
- `detectSelfSupportKnowledgeGaps()`, `shouldEscalateSelfSupport()`, `isSensitiveSelfSupportTopic()`

## API endpoints

- `GET /api/aipify/self-support-engine/dashboard`
- `GET /api/aipify/self-support-engine/card`
- `GET|POST /api/self-support/conversations`
- `POST /api/self-support/ask`
- `POST /api/self-support/feedback`
- `POST /api/self-support/[id]/escalate|close|search`
- `POST /api/embed/self-support` (scaffold)

## Audit events

Automated responses, drafts, escalations, conversation closures, feedback submissions, KC recommendations.

## Integration notes

- **Knowledge Center (A.5):** Uses `retrieve_knowledge_for_ai()` for search before response generation.
- **Support AI (A.7):** Distinct scope — Self-Support helps customers with Aipify platform questions; Support AI handles organization customer support cases via `organization_support_cases`.

## Future channels (scaffold only)

Email, messaging, and voice hooks documented in settings `future_channels` and embed scaffold.

## Principle

Self-Support accelerates routine platform questions while keeping humans in control of sensitive topics and low-confidence answers.
