# Organizational Intelligence Layer (OIL) — Phase 51

Operational intelligence — understand structure, workflows, bottlenecks, follow-ups, and business health.

**Spec:** `aipify-core/modules/organizational-intelligence-engine/phase-51-organizational-intelligence-layer.txt`  
**Code:** `lib/aipify/organizational-intelligence/`, `lib/aipify/workflows/record-event.ts`  
**Insights:** `/app/insights`  
**Settings:** `/app/settings/intelligence`  
**Organization:** `/app/organization`  
**Workflows:** `/app/workflows`  
**API:** `/api/aipify/intelligence/*`, `/api/aipify/organization/*`, `/api/aipify/workflows/*`

---

## Principle

> Organizational intelligence understands workflows and operational patterns — not hidden employee surveillance.

Safe-by-default: `enabled = false`, sensitive data sources off until admin enables them, all actions audited.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade prompt |
| Business Pro | Full OIL — settings, insights, org map, workflows, rule-based detection |
| Enterprise | Same + cross-department insights when enabled in settings |

Module gate: `organizational_intelligence` in `lib/core/plans.ts` (business + enterprise).

---

## Database

- `aipify_organizations` — tenant company profile
- `aipify_organization_units` — departments / teams
- `aipify_responsibility_map` — who owns what
- `aipify_workflow_definitions` — reusable workflow catalog
- `aipify_workflow_events` — operational event stream
- `aipify_business_entities` — customers, partners, leads
- `aipify_relationship_memory` — summarized relationship context
- `aipify_insight_items` — generated insights
- `aipify_insight_actions` — actions taken on insights
- `aipify_intelligence_health_snapshots` — daily health scores
- `aipify_intelligence_settings` — tenant consent and feature flags
- `aipify_intelligence_audit_log` — audit trail

**RPCs:** `get_customer_intelligence_center()`, `get_intelligence_settings()`, `update_intelligence_settings()`, `record_workflow_event()`, `run_oil_detection_jobs()`, `update_insight_status()`, `get_organization_units()`, `upsert_organization_unit()`, `get_workflow_definitions()`, `upsert_workflow_definition()`, `get_responsibility_map()`, `upsert_responsibility()`, `get_intelligence_health_history()`

Migration: `supabase/migrations/20260613900000_organizational_intelligence_phase51.sql`

---

## Detection jobs (rule-based)

1. **Bottlenecks** — escalation concentration, support queue delays
2. **Forgotten follow-ups** — promised follow-ups without completion events
3. **Daily health snapshot** — composite score from open insights and workflow signals

Triggered on insights dashboard load (if no snapshot today) or via `POST /api/aipify/intelligence/generate`.

---

## Integrations

- **Support cases** — bottleneck signals when `allow_support_analysis` is enabled
- **Workflow events** — primary signal source via `recordWorkflowEvent()` / `record_workflow_event` RPC
- **Business Pulse / FIE / OME / SGE** — future signal feeds (workflow events recommended)

---

## Role access

| Role | Access |
|------|--------|
| owner / admin | Full insights, settings, org, workflows |
| support | Support-related insight types |
| staff | Assigned insights only; no workload insights unless enabled |
