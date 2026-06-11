# Trust, Approval & Control Center (TACC) — Phase 54

Governance foundation ensuring Aipify remains transparent, controllable, explainable, and enterprise-ready.

**Spec:** `aipify-core/modules/trust-approval-control-center/phase-54-trust-approval-control-center.txt`  
**Code:** `lib/aipify/governance/`  
**Center:** `/app/governance`  
**Audit:** `/app/governance/audit`  
**Trust:** `/app/governance/trust`  
**Settings:** `/app/settings/governance`  
**API:** `/api/aipify/governance/*`

---

## Principle

> Observe → Suggest → Request Approval → Execute → Explain → Audit → Learn. Aipify must never become a black box.

---

## Package placement

| Plan | Capabilities |
|------|----------------|
| Starter / Growth | Upgrade prompt |
| Business Pro | Full TACC — approvals, permissions, emergency stop, audit, trust, explainability |
| Enterprise | Same + enterprise control mode |

Module gate: `trust_approval_control` in `lib/core/plans.ts` (business + enterprise).

---

## Database

- `aipify_governance_settings` — governance mode and feature flags
- `aipify_approval_requests` — unified approval queue
- `aipify_action_permissions` — permission matrix per action key
- `aipify_emergency_stop_state` — tenant emergency stop (syncs with Phase 30 `tenant_action_emergency`)
- `aipify_action_audit_timeline` — unified audit log
- `aipify_trust_scores` — per-automation/action trust scores
- `aipify_explainability_records` — human-readable explanations with evidence

**Governance modes:** `safe` · `balanced` · `autonomous_low_risk` · `enterprise_control`

**Permission levels:** `allowed` · `approval_required` · `blocked`

**RPCs:** `get_customer_governance_center()`, `get_governance_settings()`, `update_governance_settings()`, `resolve_governance_approval()`, `activate_governance_emergency_stop()`, `resume_governance_emergency_stop()`, `list_governance_audit_timeline()`, `list_governance_trust_scores()`, `get_governance_explainability()`, `list_governance_permissions()`, `update_governance_permission()`, `calculate_tacc_trust_scores()`, `cleanup_expired_governance_approvals()`, `generate_tacc_explainability_records()`

Migration: `supabase/migrations/20260614200000_trust_approval_control_center_phase54.sql`

---

## Approval Center

Aggregates pending approvals from:
- `aipify_approval_requests` (unified queue)
- `action_requests` (Phase 30 trust actions)
- `aipify_automation_approvals` (Phase 53 automations)

Admin actions: approve, reject, approve always (trust action type), pause category.

---

## Permission matrix (seeded defaults)

| Action | Level |
|--------|-------|
| create_draft, create_internal_task, generate_suggestion, notify_admin | allowed |
| send_external_email, change_status, activate_automation, publish_content | approval_required |
| delete_user, modify_billing, legal_decision, hr_action, approve_sensitive_content | blocked |

---

## Emergency stop

`activate_governance_emergency_stop` pauses automations, external communications, scheduled actions, and AI-triggered actions via Phase 30 `set_tenant_emergency_state('emergency_shutdown')`.

Does not stop: login, dashboards, read-only insights, audit logs.

---

## Integrations

- **Phase 30** — `action_requests`, `tenant_action_emergency`
- **Phase 53** — `aipify_automation_approvals`, execution trust signals
- **Phase 51/52** — explainability from suggestions and insights

---

## Role access

| Role | Access |
|------|--------|
| owner / admin | Full center, settings, approve, emergency stop |
| manager | View, approve low/medium when assigned |
| support / staff / viewer | Read-only where allowed |
