# Organizational Decision Support Engine — Phase A.54

## Vision

**Organizational Decision Support Engine (ODSE)** — Customer App engine with Core RPCs in Supabase. Structured organizational decision recommendations with human review, approval workflows, outcome tracking, and executive visibility.

## Distinction from Assistant DSE

| Surface | Route | Purpose |
|---------|-------|---------|
| **Assistant DSE (Phase 29)** | `/app/assistant/decisions` · `lib/decision-support-engine/` | Personal assistant guidance — user decides on individual work decisions |
| **Organizational ODSE (A.54)** | `/app/organizational-decision-support-engine` · `lib/aipify/organizational-decision-support-engine/` | Tenant-wide operational and strategic decision register — teams review, approve, and track outcomes |

These are intentionally separate. Assistant DSE supports daily guidance; ODSE supports organizational accountability for AI-prepared recommendations.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260830000000_organizational_decision_support_engine_phase_a54.sql` |
| Prefix | `_odse_` |
| decision_type | `organizational_decision_support_engine` |
| Lib | `lib/aipify/organizational-decision-support-engine/` |
| Core helpers | `lib/core/organizational-decision-support.ts` |
| API | `/api/aipify/organizational-decision-support-engine/*` |
| UI | `/app/organizational-decision-support-engine` |
| Nav id | `organizationalDecisionSupportEngine` |
| KC FAQ | `content/knowledge/aipify/organizational-decision-support-engine/faq/organizational-decision-support-engine-faq.md` |

## Core tables

- `organizational_decision_support_items` — decision title, category, recommendation, confidence, status, rationale, benefits, risks, dependencies, alternatives, scenarios
- `organizational_decision_outcomes` — post-decision outcome summary and lessons learned metadata

## Decision categories

`operational` · `staffing` · `support_prioritization` · `workflow_optimization` · `strategic_planning` · `resource_allocation`

## Status lifecycle

`proposed` → `under_review` → `approved` / `rejected` → `implemented`

## RPCs

- `get_organizational_decision_support_engine_dashboard()` — decisions, outcomes, integration summaries
- `get_organizational_decision_support_engine_card()` — summary card for home/shell
- `propose_decision_recommendation(...)` — create proposed decision with recommendation metadata
- `review_decision(...)` — move to under_review with review notes
- `approve_decision(...)` — human approval with rationale
- `reject_decision(...)` — reject with rationale
- `mark_decision_implemented(...)` — implementation confirmation
- `record_decision_outcome(...)` — outcome summary and lessons learned with optional org memory hook
- `export_decision_report(...)` — structured decision report export
- `get_executive_decision_summary()` — executive visibility scaffold

## Permissions

- `decisions.view`
- `decisions.manage`
- `decisions.review`
- `decisions.export`

## Integration notes

- **A.31 Strategic Intelligence Foundation:** `_odse_strategic_intelligence_summary()` aligns recommendations with strategic insight context
- **A.35 Executive Insights:** `get_executive_decision_summary()` feeds executive reporting scaffolds
- **A.40 Human Oversight:** `_odse_human_oversight_summary()` links pending approvals to oversight accountability
- **A.48 Value Realization:** `_odse_value_realization_summary()` connects decisions to value metrics context
- **A.34 Organizational Memory:** `_odse_capture_memory_hook()` — metadata-only outcome lessons

## Audit

Decision proposals, reviews, approvals, rejections, implementation, outcomes, and exports via `_odse_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans decide; Aipify prepares and explains recommendations.
