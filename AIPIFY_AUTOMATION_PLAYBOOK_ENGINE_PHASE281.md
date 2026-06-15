# Automation & Playbook Engine — Phase 281

**Feature owner:** Platform Admin  
**Route:** `/platform/operations/playbooks`  
**Module:** `lib/platform-playbook-center/`  
**Migration:** `supabase/migrations/20261468000000_automation_playbook_engine_phase281.sql`

## Purpose

Enable organizations to create reusable operational playbooks and automations that standardize recurring business processes.

## Capabilities

| Area | Description |
|------|-------------|
| Overview cards | Active playbooks, automations running, failed executions, manual interventions, scheduled workflows, most used |
| Categories | Customer onboarding, success, billing, support, security, employee onboarding, incident response, executive workflows |
| Playbook record | Name, category, description, owner, trigger type, status, last executed, steps |
| Trigger types | Manual, scheduled, event-based, conditional |
| Statuses | Draft, active, paused, archived |
| Playbook steps | Send notification, create task, assign user, request approval, update status, generate document, escalate, trigger workflow |
| Automation conditions | Health score, trial expiration, renewal, failed payment, critical tickets, security alerts |
| Execution history | Playbook name, trigger, date, outcome, duration, owner |
| Outcomes | Successful, partially successful, failed, cancelled |
| Failure management | Retry, escalate, disable automation |
| Approval support | Enterprise, billing, and security-sensitive operations |
| Templates | Customer onboarding, renewal, incident escalation, enterprise procurement, customer recovery |
| Audit logging | Created, updated, executed, approval granted/rejected, automation disabled |
| Filters | Category, status, trigger type, owner, outcome |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/platform-playbook-center/overview` | `get_platform_playbook_center(p_filters)` |
| POST | `/api/platform-playbook-center/actions` | `record_platform_playbook_action(p_payload)` |

## Founding principle

The best organizations do not rely solely on memory. They build repeatable systems that help people perform consistently and confidently.

Aipify Group AS — Bergen, Norway. For the world.
