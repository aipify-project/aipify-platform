# Adaptive Automation Layer (AAL) — Phase 53

Discover repeated work, suggest safe automations, require approval, execute approved flows, and monitor value.

**Spec:** `aipify-core/modules/adaptive-automation-layer/phase-53-adaptive-automation-layer.txt`  
**Code:** `lib/aipify/adaptive-automation/`  
**Center:** `/app/automations`  
**Library:** `/app/automation-library`  
**Executions:** `/app/automation-executions`  
**Settings:** `/app/settings/automation`  
**API:** `/api/aipify/automation/*`, `/api/aipify/automations/*`

---

## Principle

> Observe → Suggest → Approve → Generate → Execute → Monitor. No hidden automations.

Safe-by-default: `enabled = false`, discovery allowed when enabled, low-risk auto-execution off until explicitly enabled, medium/high risk require approval.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade prompt |
| Business Pro | Full AAL — settings, suggestions, templates, drafts, approvals, safe executor |
| Enterprise | Same |

Module gate: `adaptive_automation` in `lib/core/plans.ts` (business + enterprise).

---

## Database

- `aipify_automation_templates` — global and tenant templates
- `aipify_automation_suggestions` — discovered opportunities
- `aipify_automations` — draft/active automations
- `aipify_automation_approvals` — creation, enable, and execution approvals
- `aipify_automation_executions` — execution log
- `aipify_automation_execution_steps` — step-level detail
- `aipify_automation_metrics` — value and performance
- `aipify_automation_settings` — tenant consent and limits
- `aipify_automation_audit_log` — audit trail

**Risk levels:** `low` · `medium` · `high` · `blocked`

**RPCs:** `get_customer_automation_center()`, `get_automation_settings()`, `update_automation_settings()`, `discover_automation_opportunities_for_tenant()`, `update_automation_suggestion_status()`, `convert_suggestion_to_draft()`, `list_automation_templates()`, `resolve_automation_approval()`, `request_automation_enable()`, `set_automation_status()`, `execute_automation()`, `list_automation_executions()`

Migration: `supabase/migrations/20260614100000_adaptive_automation_phase53.sql`

---

## Lifecycle

1. **Observe** — workflow events, insights (OIL), predictive alerts (PIE), support/admin patterns
2. **Suggest** — `discover_automation_opportunities_for_tenant` creates `automation_suggestions`
3. **Approve** — admin reviews, dismisses, snoozes, or converts to draft
4. **Generate** — `convert_suggestion_to_draft` or template → `automations` row
5. **Execute** — `execute_automation` with risk checks, daily limits, step logging
6. **Monitor** — executions, metrics, audit log; pause on repeated failure (V1 via admin)

---

## Global templates (seeded)

| Key | Category | Risk |
|-----|----------|------|
| `aipify_support_faq_flow` | support | low/medium |
| `aipify_verification_reminder_flow` | support/onboarding | low |
| `aipify_digital_approval_queue_reminder` | moderation | low |
| `aipify_birthday_reminder_flow` | reminders | low |
| `aipify_shopify_order_followup_flow` | ecommerce | medium |
| `aipify_lead_nurturing_flow` | sales | medium |
| `aipify_onboarding_flow` | onboarding | low |

---

## V1 executor actions

Supported: `create_task`, `send_internal_notification`, `draft_email`, `tag_ticket`, `assign_case`, `create_support_note`, `notify_admin`, `request_approval`

Not supported in V1: billing changes, refunds, data deletion, adult content auto-approval, non-template external messages for high risk.

---

## Integrations

- **OIL** — `insight_items` feed suggestion discovery (repeated support, forgotten tasks, bottlenecks)
- **PIE** — `predictive_alerts` (SLA risk, future bottleneck) → automation suggestions
- **Workflow events** — primary repetition signal

---

## Role access

| Role | Access |
|------|--------|
| owner / admin | Full center, settings, approve, enable, disable |
| manager | View, create drafts, approve low/medium when assigned |
| support | View support automations, use approved templates |
| staff / viewer | Read-only where allowed |
