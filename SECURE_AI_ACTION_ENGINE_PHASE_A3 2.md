# Secure AI Action Engine — Phase A.3

## Vision

**Transform Aipify from a conversational assistant into an operational business companion capable of taking secure actions.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260708000000_secure_ai_action_engine_phase_a3.sql` |
| Prefix | `_sae_` · decision type: `secure_ai_action` |
| Lib | `lib/aipify/secure-ai-action/`, `lib/core/ai-actions.ts` |
| API | `/api/aipify/secure-ai-action/*`, `/api/ai-actions/*` |
| UI | `/app/secure-ai-actions` |
| KC FAQ | `content/knowledge/aipify/secure-ai-action/faq/secure-ai-action-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `ai_actions` | Organization-scoped action catalog with category, risk, approval flags |
| `ai_action_requests` | Execution queue with payload, recommendation, status, results |

## Execution flow

1. AI identifies opportunity → 2. Generates recommendation → 3. Risk assigned → 4. Approval evaluated → 5. Human approval if required → 6. Action executed → 7. Audit log → 8. Outcome communicated

## Risk classification

| Level | Examples | Approval |
|-------|----------|----------|
| Low | FAQ responses, summaries, task recommendations, drafts | Auto-execute permitted |
| Medium | Support replies, KC publishing, notifications, workflow updates | Manager or administrator |
| High | Role/billing changes, integration removal, suspension, destructive | Owner or administrator |

## RPCs

- `suggest_ai_action(text, jsonb, jsonb)` — full suggest → approve → execute flow
- `submit_ai_action_approval(uuid)` — approve pending request
- `reject_ai_action_request(uuid, text)` — reject pending request
- `execute_ai_action(uuid)` — execute approved action
- `get_secure_ai_action_dashboard()` — full dashboard
- `get_secure_ai_action_card()` — summary card

## TypeScript helpers (`lib/core/ai-actions.ts`)

- `classifyRisk()`, `requiresApproval()`, `canApproveAiRisk()`
- `suggestActionPayload()`, `recordOutcomeStatus()`

## API endpoints

- `GET /api/aipify/secure-ai-action/dashboard`
- `GET /api/aipify/secure-ai-action/card`
- `POST /api/ai-actions/suggest`
- `POST /api/ai-actions/requests/[id]/approve`
- `POST /api/ai-actions/requests/[id]/reject`

## Action limitations

AI must never bypass permissions, bypass tenant isolation, reveal another tenant's data, execute blocked actions, or ignore approval requirements.

## Principle

Every AI action inherits tenant context, is risk-classified, auditable, and respects human approval boundaries.
