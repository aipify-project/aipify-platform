# Human Oversight Engine (Phase A.40)

Route: `/app/human-oversight-engine`

Migration: `supabase/migrations/20260816000000_human_oversight_engine_phase_a40.sql` · spec alignment: `20260921000000_action_approval_engine_spec_alignment.sql`

**Action & Approval Engine:** See [ACTION_APPROVAL_ENGINE.md](./ACTION_APPROVAL_ENGINE.md) — five-tier governance model surfaced on the Human Oversight dashboard.

Extends Secure AI Actions (A.3), Governance & Policy Engine (A.14), and Trust & Action Engine — human accountability layer for AI recommendations and operational actions.

## Oversight levels

- `advisory_only` — recommendations only, no automated execution
- `approval_required` — default; medium+ risk requires approval
- `limited_automation` — low-risk automation allowed
- `organization_defined` — custom rules via `require_approvals_for`

## Risk alignment

Uses `lib/core/risk.ts` levels: `low`, `medium`, `high`, `critical`. Critical actions prohibited for AI.

## Tables

- `organization_oversight_settings` — default level, `require_approvals_for`
- `organization_oversight_approvals` — approval queue with explanation and confidence
- `organization_oversight_overrides` — audited overrides with business justification

## Permissions

`oversight.view` · `oversight.approve` · `oversight.reject` · `oversight.override`

## APIs

- `GET /api/aipify/human-oversight-engine/dashboard`
- `GET /api/aipify/human-oversight-engine/card`
- `GET|POST /api/oversight/approvals`
- `POST /api/oversight/approvals/[id]/[action]` — approve, reject, override, update_rationale
