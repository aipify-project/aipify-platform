# Implementation Blueprint — Phase 11: Support Engine Foundation

**Feature owner:** Customer App  
**Implementation:** [Support AI Engine — Phase A.7](./SUPPORT_AI_ENGINE_PHASE_A7.md)

This document defines **Phase 11 — Support Engine Foundation** of the Aipify Business Operating System (ABOS). It aligns the existing Support AI Engine with ABOS support standards — faster resolution, Knowledge Center utilization, responsible escalation, and transparent AI assistance.

> **Mapping:** ABOS Implementation Blueprint Phase 11 maps to **Support AI Engine Phase A.7** at `/app/support-ai-engine`. Do not duplicate a separate Support engine — extend A.7 RPCs, dashboard, and ILM vocabulary only.

## Mission

Faster support and higher quality through intelligent assistance, Knowledge Center utilization, and responsible escalation.

## Core philosophy

**People want help solved** — focus on quick, accurate, respectful resolution. AI assists; humans decide on sensitive, complex, or high-risk topics.

## Support objectives

| Objective | Description |
|-----------|-------------|
| **FAQs** | Answer common questions quickly from approved KC content |
| **KC utilization** | Retrieve articles and FAQs via `retrieve_knowledge_for_ai()` |
| **Assist agents** | Provide context, summaries, and draft replies |
| **Drafts** | Generate respectful drafts for human approval |
| **Escalate** | Route sensitive, low-confidence, or complex cases to humans |
| **Consistency** | Maintain tone and accuracy across channels |

## Support tiers

| Tier | Focus | Examples |
|------|-------|----------|
| **Tier 1 — Self-Service** | FAQs, articles, guided troubleshooting | Password reset FAQ; widget self-help; auto-FAQ when confidence is high |
| **Tier 2 — Assisted** | Recommendations, drafts, enrichment, context | AI draft with KC sources; case summary; knowledge gap flagged |
| **Tier 3 — Human Escalation** | Sensitive, high-risk, complex, exceptional | Billing/legal topics; low confidence; urgent priority; customer requests a person |

Existing `support_ai_responses.response_mode` values (`automatic`, `draft`, `manual`) map to these tiers — no new tables required.

## Case management

Maps to existing `organization_support_cases` fields:

| Capability | Field / RPC |
|------------|-------------|
| Priority | `priority` — low · medium · high · urgent |
| Status | `status` — new · open · waiting · resolved · closed |
| Ownership | `assigned_to` via `assign_support_case()` |
| AI summary | `ai_summary` — metadata only |
| Escalation | `escalated_at`, `escalation_reason` via `escalate_support_case()` |
| Resolution | `resolved_at`, `first_response_at` via `close_organization_support_case()` |
| Feedback | `support_case_satisfaction` via `submit_support_satisfaction()` |

## Knowledge Center connection

- **Repeated questions** → `support_ai_knowledge_gaps` (missing_faq, unanswered_question)
- **Resolutions** → suggested article titles for KC A.5 approval workflow
- **Outdated docs** → `gap_type = outdated_article` with review recommendations
- **Retrieval** → `detect_support_knowledge_gaps()` and `suggest_support_ai_response()` KC integration

Route: `/app/knowledge-center-engine`

## Self Love connection

Self Love influences support through:

- Reducing repetitive FAQ drafting via KC and auto-FAQ
- Balancing agent workload through open case visibility
- Surfacing bottlenecks via escalation queue and metrics
- Celebrating resolutions and positive satisfaction — metadata only

Self Love is a **principle** — not a feature toggle. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md) (no ™).

Route: `/app/self-love-engine`

## Trust connection

Support must stay **transparent**:

- Customers know when AI assisted vs human wrote a reply
- Organizations understand response modes, confidence, and escalation reasons
- Audit via `_sai_log()` — metadata only, no raw email or chat content
- Knowledge sources visible on drafts before approval

## Distinction from ASO

**Autonomous Support Operations (ASO)** at `/app/settings/support-operations` governs autonomy levels, triage policies, and Business DNA integration for support operations. **Support AI Engine A.7** handles customer-facing cases, drafts, KC retrieval, and escalation — cross-link only, do not merge layers.

## Dogfooding

**Aipify Group AS** (`aipify-group`): Internal validation — response times, KC gaps, escalation paths, human oversight on billing topics.

**Unonight** (`unonight`): First external pilot — commerce support workflows, consistency, knowledge gaps, escalation to human agents.

## Success criteria

Phase 11 is successful when (live checks on dashboard):

- Support cases tracked with priority, status, and channel
- Open cases visible for agent triage
- Knowledge Center gaps detected from repeated questions
- Escalation paths configured and exercised when needed
- Support metrics available — response time, escalation rate, satisfaction
- Human oversight for drafts and medium/high-risk topics
- Satisfaction feedback captured for continuous improvement

## ABOS principle

> Support should feel human — technology accelerates routine work while keeping people in control of sensitive decisions.

## Vision

> Organizations deliver support that is fast, consistent, and transparent — with knowledge that improves every day.

Closing phrases (examples):

- *Support that feels fast, accurate, and respectful — AI assists, humans decide.*
- *Every repeated question is a chance to improve the Knowledge Center.*
- *Transparency builds trust — customers know when AI helped.*

## Implementation map

| Layer | Location |
|-------|----------|
| Engine (A.7) | `supabase/migrations/20260712000000_support_ai_engine_phase_a7.sql` |
| Blueprint alignment | `supabase/migrations/20260958000000_implementation_blueprint_phase11_support_engine.sql` |
| Route | `/app/support-ai-engine` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/implementation-blueprint-phase11-support-engine.txt` |
| FAQ | `content/knowledge/aipify/support-ai-engine/faq/implementation-blueprint-phase11-faq.md` |
| Lib | `lib/aipify/support-ai-engine/` |
| Vocabulary | `lib/internal-language-model/implementation-blueprint-phase11-vocabulary.ts` |

## Related surfaces

| Surface | Route | Note |
|---------|-------|------|
| Knowledge Center (A.5) | `/app/knowledge-center-engine` | Articles, FAQs, retrieval for support drafts |
| Approvals | `/app/approvals` | Draft approval before send |
| Human Oversight (A.40) | `/app/human-oversight-engine` | Oversight policies for AI-assisted support |
| Quality Guardian (A.13) | `/app/quality-guardian-engine` | Response quality and consistency |
| Self Love (A.76) | `/app/self-love-engine` | Workload balance principle — cross-link only |
| ASO | `/app/settings/support-operations` | Autonomy and triage — distinct layer |
| Business DNA | `/app/settings/business-dna` | Tone, templates, escalation rules |
| Unonight Pilot | `/app/unonight-pilot-operations-engine` | External pilot metrics |
