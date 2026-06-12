# Implementation Blueprint Phase 11 — Support Engine Foundation FAQ

## What is Phase 11 of the Implementation Blueprint?

Phase 11 aligns the Support AI Engine (Phase A.7) with ABOS Support Engine Foundation requirements — support tiers, Knowledge Center connection, responsible escalation, transparency, and live success criteria.

## How is this different from Autonomous Support Operations (ASO)?

**Support AI Engine A.7** at `/app/support-ai-engine` handles customer-facing cases, AI drafts, KC retrieval, and escalation. **ASO** at `/app/settings/support-operations` governs autonomy levels, triage policies, and Business DNA integration — cross-link only, do not merge.

## What are the three support tiers?

- **Tier 1 Self-Service** — FAQs, articles, guided troubleshooting (automatic mode when confidence is high)
- **Tier 2 Assisted** — AI drafts, recommendations, context enrichment (draft mode)
- **Tier 3 Human Escalation** — sensitive, high-risk, complex, or low-confidence cases (manual or escalated)

## How does Support AI connect to the Knowledge Center?

Repeated questions create `support_ai_knowledge_gaps` entries. Resolutions can suggest new articles for KC A.5 approval. `suggest_support_ai_response()` calls `retrieve_knowledge_for_ai()` — metadata sources only.

## What case management capabilities exist?

Priority, status, ownership (`assign_support_case`), AI summary, escalation (`escalate_support_case`), resolution (`close_organization_support_case`), and satisfaction feedback — all on existing `organization_support_cases` tables.

## What is the Self Love connection?

Self Love reduces repetitive FAQ work, balances agent workload, surfaces bottlenecks, and celebrates resolutions — a principle cross-linked to `/app/self-love-engine`, not a feature toggle. No ™ in product copy.

## How is trust maintained?

Customers know when AI assisted. Organizations see response modes, confidence scores, escalation reasons, and audit events via `_sai_log()` — metadata only, no raw email or chat content.

## What are the Phase 11 success criteria?

Cases tracked, open queue visible, KC gaps detected, escalation paths exercised, metrics available, human oversight on drafts, and satisfaction feedback — computed live on the dashboard.

## Where does Unonight fit?

Unonight is the first external pilot for commerce support workflows — response times, consistency, knowledge gaps, and escalation to human agents. Aipify Group validates internally first.

## Does Phase 11 add new database tables?

No. Phase 11 extends `get_support_ai_engine_dashboard()` and `get_support_ai_engine_card()` with blueprint metadata and live success criteria only.
