# Action Center Approval & Delegation Engine — Phase 262

## Purpose

Introduce enterprise-grade approval workflows and intelligent delegation to the Action Center. Not every action should be executed by the person viewing it — Aipify clarifies who approves, who executes, and how accountability flows.

**Feature owner:** Customer App (`/app/action-center` — Approvals & Delegation tab)

## Approvals & Delegation Center

Tab within Action Center alongside Impact Analysis (Phase 261). No portal hierarchy changes.

## Features

1. **Approval workflows** — none, single, multi-step, parallel, executive (derived from AEF settings + action fields)
2. **Delegation engine** — assign, reassign, escalate, return for clarification via immutable audit logs
3. **Approval dashboard** — six widgets (pending, awaiting my review, approved, rejected, escalated, executive)
4. **Approval decisions** — approve, approve with conditions, reject, request info, delegate, executive oversight, escalate, return
5. **Delegation intelligence** — optional role-based recommendations
6. **SLA monitoring** — on track, approaching deadline, overdue, escalated
7. **Executive visibility** — org approval health, critical blocked, high-risk queue, cycle times, delegation metrics
8. **Audit logging** — full trail via `aipify_action_logs` (immutable)
9. **Notifications** — in-app + dashboard via `send_notification` on decisions
10. **Human oversight** — Aipify recommends; humans approve
11. **Knowledge Center FAQ** — `content/knowledge/aipify/action-center-approval/faq/`
12. **i18n** — en, no, sv, da, es, pl, uk

## Architecture

```
supabase/migrations/20261450000000_action_center_approval_delegation_phase262.sql
  get_action_center_approval_delegation_center()
  get_action_center_approval_detail(p_action_id)
  record_action_center_approval_decision(...)

lib/action-center-approval/
app/api/aipify/action-center/approvals/route.ts
app/api/aipify/actions/[id]/approval/route.ts
app/api/aipify/actions/[id]/approval/decision/route.ts
components/shared/action-center-approval/
components/app/action-center/ActionCenterPanel.tsx
```

## Principle

Aipify supports decision processes. Organizations retain authority.
