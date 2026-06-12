# Aipify Trust & Action Engine

**Phase 30 · Critical priority**

**Action & Approval tiers:** See [ACTION_APPROVAL_ENGINE.md](./ACTION_APPROVAL_ENGINE.md) — five-tier model (Informational → Restricted) mapped to action levels 0–4 below.

Safety layer for performing real actions on behalf of customers — explainable, auditable, reversible when possible, and always governed by policies and approvals.

**Prerequisites:** [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) · Phase 13 Action Engine

**Code:** `lib/trust-action/` · migration `20260611800000_trust_action_engine_phase30.sql`

---

## Core principle

Aipify must never perform sensitive actions without explicit permission. The goal is **trusted AI**, not autonomous AI.

---

## Action levels

| Level | Name | Approval | AI execution |
|-------|------|----------|--------------|
| 0 | Information | No | Read-only |
| 1 | Draft actions | Yes | Low risk |
| 2 | Reversible actions | Yes (manager) | Medium, undo available |
| 3 | Sensitive actions | Yes (admin) | High |
| 4 | Critical actions | **Prohibited** | Never for AI |

---

## Action request flow

Skill identifies task → `create_action_request` → policy check → approval workflow → human approve/reject → execute → audit log + `record_trust_audit_event`

---

## Customer routes

| Route | Purpose |
|-------|---------|
| `/app/approvals` | Approval Center — review, approve, reject AI actions |
| `/api/actions` | List action requests |
| `/api/actions/:id/approve` | Approve and execute |
| `/api/actions/:id/reject` | Reject |
| `/api/actions/audit` | Audit timeline |
| `/api/actions/emergency-stop` | Pause all AI actions |

---

## Platform routes

| Route | Purpose |
|-------|---------|
| `/platform/trust` | Trust & Actions dashboard (governance overview) |

---

## Key tables

- `action_requests` — tenant-scoped action queue
- `action_policies` — per-skill allowed actions
- `action_explanations` — why Aipify wants to act
- `action_audit_logs` — full transparency trail
- `tenant_action_emergency` — emergency stop states
- `skill_trust_scores` — per-skill trust bands

---

## Key RPCs

| RPC | Purpose |
|-----|---------|
| `create_action_request` | Skill creates a governed action |
| `approve_action_request` | Human approval |
| `reject_action_request` | Human rejection |
| `execute_action_request` | Execute approved action |
| `get_customer_approvals_center` | Unified approval inbox |
| `get_customer_trust_actions_center` | Trust dashboard bundle |
| `set_tenant_emergency_state` | Emergency stop |
| `get_platform_trust_actions_overview` | Platform governance |
