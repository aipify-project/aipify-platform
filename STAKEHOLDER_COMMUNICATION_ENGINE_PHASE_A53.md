# Stakeholder Communication Engine — Phase A.53

## Vision

**Stakeholder Communication Engine** — Customer App engine with Core RPCs in Supabase. Coordinated stakeholder communications across employees, managers, executives, customers, partners, and suppliers — with multi-channel delivery, engagement tracking, and org memory outcomes.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260829000000_stakeholder_communication_engine_phase_a53.sql` |
| Prefix | `_sce_` |
| decision_type | `stakeholder_communication_engine` |
| Lib | `lib/aipify/stakeholder-communication-engine/` |
| Core helpers | `lib/core/stakeholder-communication.ts` |
| API | `/api/aipify/stakeholder-communication-engine/*` |
| UI | `/app/stakeholder-communication-engine` |
| KC FAQ | `content/knowledge/aipify/stakeholder-communication-engine/faq/stakeholder-communication-engine-faq.md` |

## Core tables

- `stakeholder_communication_campaigns` — campaign name, stakeholder type, communication type, status, owner, schedule, delivery channels
- `stakeholder_communication_deliveries` — per-channel delivery status and metadata
- `stakeholder_communication_engagement` — engagement metrics metadata per campaign
- `stakeholder_communication_outcomes` — outcome summaries for organizational memory

## Stakeholder types

`employee` · `manager` · `executive` · `customer` · `partner` · `supplier`

## Communication types

`announcement` · `operational_update` · `incident_notification` · `onboarding_message` · `executive_communication` · `policy_update`

## Delivery channels

`email` · `desktop_notification` · `in_platform` · `knowledge_center`

## RPCs

- `get_stakeholder_communication_engine_dashboard()` — campaigns, deliveries, engagement, outcomes, integration summaries
- `get_stakeholder_communication_engine_card()` — summary card for home/shell
- `create_communication_campaign(...)` — draft new campaign with channels
- `update_campaign_status(...)` — lifecycle status transitions
- `schedule_campaign(...)` — set scheduled publish time
- `publish_campaign(...)` — activate campaign and record deliveries
- `cancel_campaign(...)` — cancel draft or scheduled campaigns
- `record_campaign_delivery(...)` — per-channel delivery metadata
- `record_communication_outcome(...)` — outcome summary with optional org memory hook
- `export_communication_campaigns(...)` — metadata-only export with audit
- `get_executive_communication_summary()` — executive visibility scaffold

## Permissions

- `communications.view`
- `communications.manage`
- `communications.publish`
- `communications.export`

Distinct from `notifications.*` — stakeholder communications are campaign-based, not alert distribution.

## Integration notes

- **A.26 Customer Success:** `_sce_customer_success_summary()` links onboarding and success communications
- **A.35 Executive Insights:** `get_executive_communication_summary()` and dashboard executive block
- **A.47 Change Management:** `_sce_change_management_summary()` aligns with change communication plans
- **A.51 Incident Response:** `_sce_incident_response_summary()` links incident notification campaigns
- **A.34 Organizational Memory:** `_sce_capture_memory_hook()` — metadata-only outcomes

## Audit

Campaign creation, status changes, scheduling, publishing, cancellations, deliveries, outcomes, and exports via `_sce_log()`.

## Principle

Business logic in RPCs; panels are thin clients. Metadata only — no PII. Humans approve and publish stakeholder communications.
