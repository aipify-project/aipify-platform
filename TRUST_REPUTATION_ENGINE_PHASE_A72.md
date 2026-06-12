# Trust & Reputation Engine — Phase A.72

**Feature owner:** Customer App

Organizational trust profiles and metadata-only reputation signals — earned trust with human-reviewed expansion.

## Extends

- Human Oversight Engine (A.40)
- Secure AI Actions (A.3)
- Workflow Orchestration (A.42)
- Governance & Policy (A.14)
- Enterprise delegated admins (A.30/A.41 scaffold)

## Route

`/app/trust-reputation-engine` — nav id `trustReputationEngine`

Distinct from legacy Trust Engine at `/app/trust` (nav id `trustEngine`). A.72 reputation signals complement ABOS Trust Engine explainability — see [TRUST_ENGINE.md](./TRUST_ENGINE.md).

## Tables

- `organization_trust_profiles` — entity-scoped trust scores and levels
- `organization_trust_signals` — metadata-only reputation signals
- `organization_trust_settings` — review cadence and expansion policy
- `organization_trust_outcomes` — org memory integration (patterns, revocations, lessons)

## Permissions

`trust.view` · `trust.manage` · `trust.review` · `trust.export`

Module key: `trust_reputation`

## Entity types

`workflow` · `automation` · `approval` · `knowledge` · `support` · `governance`

## Trust levels

`emerging` · `established` · `trusted` · `highly_trusted`

## Signal types

`approval_accuracy` · `task_completion` · `support_quality` · `knowledge_contribution` · `policy_adherence` · `positive_audit`

Metadata only — no PII in trust payloads. Humans review trust expansion and may revoke trust.
