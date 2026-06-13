# Governance & Policy Engine — Phase A.14

## Vision

**Tenant-aware governance with human oversight for sensitive actions, transparent decision-making, configurable policies, and full audit support.**

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260719000000_governance_policy_engine_phase_a14.sql` |
| Prefix | `_gpe_` · decision type: `governance_policy_engine` |
| Lib | `lib/aipify/governance-policy-engine/`, `lib/core/governance-policy.ts` |
| API | `/api/aipify/governance-policy-engine/*`, `/api/governance/policies/*`, `/api/governance/violations/*` |
| UI | `/app/governance-policy-engine` |
| KC FAQ | `content/knowledge/aipify/governance-policy-engine/faq/governance-policy-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `governance_settings` | Per-org AI autonomy level, retention defaults, review cadence |
| `organization_policies` | Org-wide policies by category (distinct from `action_policies`) |
| `policy_violations` | Detected governance drift and policy breaches |
| `policy_reviews` | Scheduled policy review cadence |

## Policy categories

`ai_autonomy` · `approval` · `support` · `access` · `knowledge_publishing` · `integration` · `retention`

## AI autonomy levels

`advisory_only` · `approval_required` · `limited_automation` · `organization_defined`

## RPCs

- `get_governance_policy_engine_dashboard()` / `get_governance_policy_engine_card()`
- `get_organization_policies(category?)`
- `create_organization_policy()` / `update_organization_policy()`
- `activate_organization_policy()` / `archive_organization_policy()`
- `detect_policy_violations()` / `acknowledge_policy_violation()`
- `schedule_policy_review()` / `complete_policy_review()`
- Helpers: `_gpe_get_policy`, `_gpe_validate_policy`, `_gpe_check_approval_requirements`

## Permissions

- `governance.view`, `governance.manage`, `governance.review`, `governance.approve`

## TypeScript helpers (`lib/core/governance-policy.ts`)

- `getPolicy()`, `validatePolicy()`, `checkApprovalRequirements()`
- `detectPolicyViolations()`, `schedulePolicyReview()`
- `requiresHumanApproval()`, `canManageGovernance()`, `canReviewGovernance()`

## API endpoints

- `GET /api/aipify/governance-policy-engine/dashboard`
- `GET /api/aipify/governance-policy-engine/card`
- `GET|POST /api/governance/policies`
- `POST /api/governance/policies/[id]/[action]` — activate, archive, update, schedule-review
- `POST /api/governance/violations/[id]/[action]` — acknowledge; `POST .../run/scan` for violation scan

## Audit events

`policy_created`, `policy_updated`, `policy_activated`, `policy_archived`, `policy_violation_scan`, `policy_violation_acknowledged`, `policy_review_scheduled`, `policy_review_completed`, `governance_override`

## Integration notes

- **Trust & Action Engine:** `_gpe_check_approval_requirements` consults `action_policies` and enforces Level 4 AI prohibition
- **Secure AI Actions (A.3):** Dashboard surfaces `ai_action_requests` pending approvals
- **Audit (A.4):** All governance mutations dual-write via `_mta_create_audit_log`; `_ala_should_audit` extended
- **Quality Guardian (A.13):** Complementary — quality scans operational health; governance enforces policy compliance. ABOS Phase 16 adds read-only governance summary on QG dashboard — see [IMPLEMENTATION_BLUEPRINT_PHASE16_GOVERNANCE_QUALITY_GUARDIAN_FOUNDATION.md](./IMPLEMENTATION_BLUEPRINT_PHASE16_GOVERNANCE_QUALITY_GUARDIAN_FOUNDATION.md).
