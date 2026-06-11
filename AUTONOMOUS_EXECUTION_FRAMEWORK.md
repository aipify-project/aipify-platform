# Autonomous Execution Framework (AEF)

**Phase 44 · Controlled digital business operator**

Aipify observes freely, suggests intelligently, prepares safely, and executes only inside approved limits.

**Prerequisites:** [TRUST_ACTION_ENGINE.md](./TRUST_ACTION_ENGINE.md) · [LICENSE_CENTER.md](./LICENSE_CENTER.md) · [BUSINESS_DNA_ENGINE.md](./BUSINESS_DNA_ENGINE.md)

**Code:** `lib/aipify/execution/` · migration `20260613300000_autonomous_execution_phase44.sql`

---

## Package gate

| Plan | Access |
|------|--------|
| Starter / Growth | No access — upgrade notice |
| Business | Action Center, assistant & operator levels, low/medium risk, manual approval |
| Enterprise | Full access including autonomous rules, multi-admin approval, advanced audit |

Maps spec **Business Pro** → `business`, **Enterprise** → `enterprise`.

---

## Route mapping

| Spec | Aipify route |
|------|----------------|
| `/admin/action-center` | `/app/action-center` |
| `/dashboard/action-center` | `/app/action-center` |

---

## Execution levels

| Level | Behavior |
|-------|----------|
| Observer | Analyze and suggest only |
| Assistant | Prepare actions — human approval required |
| Operator | Execute after explicit approval |
| Autonomous | Predefined low-risk rules (Enterprise) |

---

## Database tables

| Table | Purpose |
|-------|---------|
| `aef_settings` | Autonomous toggle, multi-admin, critical review policy |
| `aipify_actions` | Proposed and executed actions |
| `aipify_action_approvals` | Multi-admin approval records |
| `aipify_action_logs` | Immutable audit trail |
| `aipify_execution_rules` | Automation rules (Enterprise) |
| `aipify_execution_permissions` | Role-based execution limits |

---

## APIs

| Route | Methods |
|-------|---------|
| `/api/aipify/action-center` | GET |
| `/api/aipify/actions` | GET, POST |
| `/api/aipify/actions/[id]` | GET |
| `/api/aipify/actions/[id]/approve` | POST |
| `/api/aipify/actions/[id]/reject` | POST |
| `/api/aipify/actions/[id]/execute` | POST |
| `/api/aipify/actions/[id]/schedule` | POST |
| `/api/aipify/actions/[id]/cancel` | POST |
| `/api/aipify/action-logs` | GET |
| `/api/aipify/execution-rules` | POST |
| `/api/aipify/execution-rules/[id]` | PATCH |
| `/api/aipify/execution-rules/[id]/disable` | POST |

---

## Key RPCs

- `get_customer_action_center()` — dashboard bundle
- `create_aipify_action()` / `list_aipify_actions()` / `get_aipify_action()`
- `approve_aipify_action()` / `reject_aipify_action()` / `execute_aipify_action()`
- `validate_aipify_action_safety()` — package, role, risk, forbidden types
- `create_aipify_execution_rule()` — Enterprise only
- `get_platform_aef_overview()` — aggregates only

---

## Adapters

Mockable adapters in `lib/aipify/execution/adapters/`:

- `emailAdapter` · `supportAdapter` · `taskAdapter` · `faqAdapter` · `notificationAdapter`

Each supports `preview()`, `validate()`, `execute()`, optional `rollback()`.

---

## Integrations

| System | Role |
|--------|------|
| Trust & Action Engine | Skill-level governed actions at `/app/approvals` |
| Business DNA | Context for prepared support actions |
| License Center | Plan gating via `get_customer_license_limits` |
