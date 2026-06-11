# Quality Guardian Engine — Phase A.13

## Vision

**Continuous operational quality monitoring — proactive detection, explainable recommendations, and audit-supported accountability.**

Distinct from Phases 58–59 (software/frontend health at `/app/quality`), Phase A.13 monitors **operational quality** across support, knowledge, AI, approvals, integrations, and onboarding.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260718000000_quality_guardian_engine_phase_a13.sql` |
| Prefix | `_qge_` · decision type: `quality_guardian_engine` |
| Lib | `lib/aipify/quality-guardian-engine/`, `lib/core/quality-guardian.ts` |
| API | `/api/aipify/quality-guardian-engine/*`, `/api/quality/*` |
| UI | `/app/quality-guardian-engine` |
| KC FAQ | `content/knowledge/aipify/quality-guardian-engine/faq/quality-guardian-engine-faq.md` |

## Core tables

| Table | Purpose |
|-------|---------|
| `quality_guardian_settings` | Per-organization thresholds and scan preferences |
| `organization_quality_checks` | Detected quality alerts with category, severity, and status |
| `quality_recommendations` | Explainable improvement suggestions with urgency and confidence |

## Monitoring areas

- Support quality
- Knowledge Center quality
- AI recommendation quality
- Approval workflow efficiency
- Integration reliability
- Onboarding effectiveness
- Operational responsiveness

## Alert types

`outdated_knowledge` · `repeated_support_failures` · `approval_bottleneck` · `integration_instability` · `low_customer_satisfaction` · `excessive_escalations` · plus derived types for unanswered conversations, unpublished drafts, missing documentation, AI rejection spikes, failed executions, slow response times, and stalled onboarding.

## RPCs

- `get_quality_guardian_engine_dashboard()` — dashboard with optional auto-scan
- `get_quality_guardian_engine_card()` — summary card
- `run_quality_scan()` — explicit quality scan across integrated modules
- `resolve_quality_check(uuid)` — mark finding resolved
- `ignore_quality_finding(uuid)` — dismiss finding
- `accept_quality_recommendation(uuid)` — accept suggested improvement
- `reject_quality_recommendation(uuid)` — reject recommendation

## Permissions

- `quality.view`, `quality.manage`, `quality.resolve`, `quality.ignore`

## TypeScript helpers (`lib/core/quality-guardian.ts`)

- `runQualityScan()`, `resolveQualityCheck()`, `ignoreQualityFinding()`
- `acceptQualityRecommendation()`, `rejectQualityRecommendation()`
- `isCriticalQualitySeverity()`, `canManageQuality()`, `canResolveQuality()`

## API endpoints

- `GET /api/aipify/quality-guardian-engine/dashboard`
- `GET /api/aipify/quality-guardian-engine/card`
- `POST /api/quality/scan`
- `POST /api/quality/checks/[id]/resolve`
- `POST /api/quality/checks/[id]/ignore`
- `POST /api/quality/recommendations/[id]/accept`
- `POST /api/quality/recommendations/[id]/reject`

## Integration with prior phases

| Phase | Integration |
|-------|-------------|
| A.5 Knowledge Center | Stale articles, draft backlog, knowledge gaps |
| A.7 Support AI | Open cases, escalations, satisfaction, slow response |
| A.3 Secure AI Actions | Approval backlog, rejection rate, failed executions |
| A.8 Integration Engine | Failed integration status |
| A.10 Customer Onboarding | Stalled onboarding progress |
| A.12 Self-Support | Unanswered low-confidence conversations, knowledge gaps |
| A.9 Operations Dashboard | Complementary — ODE shows live widgets; QGE detects quality patterns |

## Audit events

`quality_alert_created`, `quality_check_resolved`, `quality_finding_ignored`, `quality_recommendation_accepted`, `quality_recommendation_rejected`, `quality_scan_executed` — via `_qge_log` → `_mta_create_audit_log` and `_ala_should_audit`.

## Principle

Metadata-first quality monitoring. Aipify informs and recommends — humans decide and resolve.
